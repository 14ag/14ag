from __future__ import annotations
from dotenv import load_dotenv
import json
import logging
import os
import re
import time
from typing import Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from database import get_supabase_client

try:
    import gkeepapi  # type: ignore
except Exception:  # pragma: no cover
    gkeepapi = None

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MESSAGE_RATE_LIMIT_COUNT = 5
MESSAGE_RATE_LIMIT_WINDOW_SECONDS = 60
logger = logging.getLogger(__name__)
_message_attempts: dict[str, list[float]] = {}

class MessagePayload(BaseModel):
    name: str = Field(max_length=120)
    email: str = Field(max_length=254)
    message_body: str = Field(max_length=5000)


def _parse_frontend_origins(raw_origins: str | None) -> list[str]:
    if not raw_origins or not raw_origins.strip():
        return []

    raw_origins = raw_origins.strip()
    try:
        parsed = json.loads(raw_origins)
    except json.JSONDecodeError:
        return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    if isinstance(parsed, str):
        return [parsed.strip()] if parsed.strip() else []

    if isinstance(parsed, list):
        return [str(origin).strip() for origin in parsed if str(origin).strip()]

    return []


load_dotenv()

app = FastAPI()
_origins = _parse_frontend_origins(os.getenv("FRONTEND_URL"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


def _is_http_url(value: str) -> bool:
    try:
        from urllib.parse import urlparse

        parsed = urlparse(value)
    except Exception:
        return False

    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def _safe_project_url(value: Any, fallback: str = "#") -> str:
    url = str(value or "").strip()
    return url if _is_http_url(url) else fallback


def _check_message_rate_limit(key: str, now: float | None = None) -> bool:
    current_time = time.monotonic() if now is None else now
    window_start = current_time - MESSAGE_RATE_LIMIT_WINDOW_SECONDS
    recent_attempts = [
        timestamp
        for timestamp in _message_attempts.get(key, [])
        if timestamp > window_start
    ]

    if len(recent_attempts) >= MESSAGE_RATE_LIMIT_COUNT:
        _message_attempts[key] = recent_attempts
        return False

    recent_attempts.append(current_time)
    _message_attempts[key] = recent_attempts
    return True


def _normalize_projects(raw: Any) -> list[dict[str, Any]]:
    if isinstance(raw, list):
        candidates = raw
    elif isinstance(raw, dict) and isinstance(raw.get("projects"), list):
        candidates = raw["projects"]
    elif isinstance(raw, dict):
        candidates = list(raw.values())
    else:
        candidates = []

    normalized: list[dict[str, Any]] = []
    for item in candidates:
        if not isinstance(item, dict):
            continue

        if isinstance(item.get("project_metadata"), dict):
            item = item["project_metadata"]

        techs = item.get("techs", [])
        if isinstance(techs, str):
            techs = [techs]
        elif not isinstance(techs, list):
            techs = []

        project: dict[str, Any] = {
            "icon": str(item.get("icon") or "folder").lower(),
            "title": str(item.get("title") or "Untitled project"),
            "description": str(item.get("description") or "No description available."),
            "techs": [str(tech) for tech in techs],
            "_url": _safe_project_url(item.get("_url") or item.get("url")),
            "category": str(item.get("category") or "other").lower(),
        }

        live_url = item.get("live_url") or item.get("demo_url")
        if live_url and _is_http_url(str(live_url).strip()):
            project["live_url"] = str(live_url).strip()

        normalized.append(project)

    return normalized


@app.get("/projects")
async def get_projects() -> dict[str, list[dict[str, Any]]]:
    try:
        response = get_supabase_client().table("projects").select("*").execute()
        return {"projects": _normalize_projects(response.data)}
    except Exception as exc:
        logger.error("Supabase projects query failed: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Projects could not be loaded from Supabase.",
        ) from exc


@app.post("/message")
async def receive_message(request: Request, payload: MessagePayload) -> dict[str, str]:
    client_host = request.client.host if request.client else "unknown"
    if not _check_message_rate_limit(client_host):
        raise HTTPException(status_code=429, detail="Too many messages. Try again later.")

    if not payload.name.strip() or not payload.message_body.strip():
        raise HTTPException(status_code=400, detail="name and message_body are required")

    if not EMAIL_RE.match(payload.email.strip()):
        raise HTTPException(status_code=400, detail="email must be valid")

    token = os.getenv("GKEEP_TOKEN", "").strip()
    keep_email = os.getenv("PUBLIC_CONTACT_EMAIL", "").strip()

    if not token or not keep_email or gkeepapi is None:
        return {
            "status": "accepted_fallback",
            "message": "Message accepted without Google Keep sync.",
        }

    try:
        keep = gkeepapi.Keep()
        keep.authenticate(keep_email, token)

        note_body = (
            f"Email: {payload.email.strip()}\n\n"
            f"\n{payload.message_body.strip()}"
        )
        note = keep.createNote(payload.name.strip(), note_body)
        note.pinned = False
        note.color = gkeepapi.node.ColorValue.Teal
        note.labels.add()
        keep.sync()

        return {"status": "success", "message": "Message saved to Google Keep."}
    except Exception:
        return {
            "status": "accepted_fallback",
            "message": "Message accepted but Google Keep sync failed.",
        }
