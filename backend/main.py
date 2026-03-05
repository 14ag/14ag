from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import gkeepapi  # type: ignore
except Exception:  # pragma: no cover
    gkeepapi = None


DATA_FILE = Path(__file__).resolve().parent / "data.json"
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class MessagePayload(BaseModel):
    name: str
    email: str
    message_body: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "null",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


def _read_json_file() -> Any:
    if not DATA_FILE.exists():
        return []

    raw = DATA_FILE.read_text(encoding="utf-8").strip()
    if not raw:
        return []

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return []


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

        techs = item.get("techs", [])
        if isinstance(techs, str):
            techs = [techs]
        elif not isinstance(techs, list):
            techs = []

        project: dict[str, Any] = {
            "title": str(item.get("title") or "Untitled project"),
            "description": str(item.get("description") or "No description available."),
            "techs": [str(tech) for tech in techs],
            "_url": str(item.get("_url") or item.get("url") or "#"),
            "category": str(item.get("category") or "other").lower(),
        }

        live_url = item.get("live_url") or item.get("demo_url")
        if live_url:
            project["live_url"] = str(live_url)

        normalized.append(project)

    return normalized


@app.get("/projects")
async def get_projects() -> dict[str, list[dict[str, Any]]]:
    return {"projects": _normalize_projects(_read_json_file())}


@app.post("/message")
async def receive_message(payload: MessagePayload) -> dict[str, str]:
    if not payload.name.strip() or not payload.message_body.strip():
        raise HTTPException(status_code=400, detail="name and message_body are required")

    if not EMAIL_RE.match(payload.email.strip()):
        raise HTTPException(status_code=400, detail="email must be valid")

    token = os.getenv("GKEEP_TOKEN", "").strip()
    keep_email = os.getenv("GKEEP_EMAIL", "user@gmail.com").strip()

    if not token or gkeepapi is None:
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
