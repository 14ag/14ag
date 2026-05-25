from __future__ import annotations

from fastapi.testclient import TestClient
import pytest

import database
import main


class _ProjectsTable:
    def __init__(self, data=None, error: Exception | None = None) -> None:
        self._data = data or []
        self._error = error

    def select(self, _columns: str) -> "_ProjectsTable":
        return self

    def execute(self):
        if self._error:
            raise self._error

        return type("SupabaseResponse", (), {"data": self._data})()


class _SupabaseClient:
    def __init__(self, table: _ProjectsTable) -> None:
        self._table = table

    def table(self, name: str) -> _ProjectsTable:
        assert name == "projects"
        return self._table


@pytest.fixture(autouse=True)
def clear_message_rate_limit() -> None:
    main._message_attempts.clear()
    yield
    main._message_attempts.clear()


def test_frontend_origins_accept_empty_single_comma_and_json_values() -> None:
    assert main._parse_frontend_origins(None) == []
    assert main._parse_frontend_origins("") == []
    assert main._parse_frontend_origins("http://localhost:3000") == [
        "http://localhost:3000"
    ]
    assert main._parse_frontend_origins("http://a.test, http://b.test") == [
        "http://a.test",
        "http://b.test",
    ]
    assert main._parse_frontend_origins('["http://localhost:3000"]') == [
        "http://localhost:3000"
    ]


def test_routes_still_work_with_loaded_app(monkeypatch) -> None:
    monkeypatch.setattr(
        main,
        "get_supabase_client",
        lambda: _SupabaseClient(_ProjectsTable()),
    )
    client = TestClient(main.app)

    assert client.get("/").json() == {"status": "ok"}
    assert client.get("/projects").status_code == 200
    assert client.post(
        "/message",
        json={"name": "", "email": "bad", "message_body": ""},
    ).status_code == 400


def test_database_loads_env_values() -> None:
    assert database.url
    assert database.key


def test_projects_returns_normalized_supabase_rows(monkeypatch) -> None:
    rows = [
        {
            "id": 1,
            "project_metadata": {
                "icon": "PC",
                "title": "Supabase Project",
                "description": "Stored in Supabase.",
                "techs": "Python",
                "_url": "https://github.com/example/project",
                "category": "Data",
            },
        }
    ]
    monkeypatch.setattr(
        main,
        "get_supabase_client",
        lambda: _SupabaseClient(_ProjectsTable(rows)),
    )
    client = TestClient(main.app)

    response = client.get("/projects")

    assert response.status_code == 200
    assert response.json() == {
        "projects": [
            {
                "icon": "pc",
                "title": "Supabase Project",
                "description": "Stored in Supabase.",
                "techs": ["Python"],
                "_url": "https://github.com/example/project",
                "category": "data",
            }
        ]
    }


def test_projects_sanitizes_unsafe_urls(monkeypatch) -> None:
    rows = [
        {
            "id": 1,
            "project_metadata": {
                "title": "Unsafe URL Project",
                "description": "Contains unsafe links.",
                "techs": ["Python"],
                "_url": "javascript:alert(1)",
                "live_url": "data:text/html,<script>alert(1)</script>",
                "category": "Security",
            },
        }
    ]
    monkeypatch.setattr(
        main,
        "get_supabase_client",
        lambda: _SupabaseClient(_ProjectsTable(rows)),
    )
    client = TestClient(main.app)

    response = client.get("/projects")

    assert response.status_code == 200
    project = response.json()["projects"][0]
    assert project["_url"] == "#"
    assert "live_url" not in project


def test_projects_returns_502_when_supabase_fails(monkeypatch) -> None:
    monkeypatch.setattr(
        main,
        "get_supabase_client",
        lambda: _SupabaseClient(_ProjectsTable(error=RuntimeError("network down"))),
    )
    client = TestClient(main.app)

    response = client.get("/projects")

    assert response.status_code == 502
    assert response.json() == {"detail": "Projects could not be loaded from Supabase."}


def test_message_keep_sync_requires_public_contact_email(monkeypatch) -> None:
    monkeypatch.setattr(main, "gkeepapi", object())
    monkeypatch.setenv("GKEEP_TOKEN", "token")
    monkeypatch.delenv("PUBLIC_CONTACT_EMAIL", raising=False)
    client = TestClient(main.app)

    response = client.post(
        "/message",
        json={
            "name": "Sender",
            "email": "sender@example.com",
            "message_body": "Hello",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "accepted_fallback"


def test_message_syncs_to_google_keep_when_configured(monkeypatch) -> None:
    class _Labels:
        def __init__(self) -> None:
            self.added = []

        def add(self, label) -> None:
            self.added.append(label)

    class _Note:
        def __init__(self) -> None:
            self.labels = _Labels()
            self.pinned = False
            self.color = None

    class _Keep:
        instance = None

        def __init__(self) -> None:
            self.authenticated = None
            self.created_note = None
            self.created_label = None
            self.synced = False
            _Keep.instance = self

        def authenticate(self, email: str, token: str) -> None:
            self.authenticated = (email, token)

        def findLabel(self, name: str):
            return None

        def createLabel(self, name: str):
            self.created_label = name
            return {"name": name}

        def createNote(self, title: str, body: str):
            self.created_note = (title, body, _Note())
            return self.created_note[2]

        def sync(self) -> None:
            self.synced = True

    fake_gkeepapi = type(
        "FakeGKeepApi",
        (),
        {
            "Keep": _Keep,
            "node": type(
                "Node",
                (),
                {"ColorValue": type("ColorValue", (), {"Teal": "teal"})},
            ),
        },
    )

    monkeypatch.setattr(main, "gkeepapi", fake_gkeepapi)
    monkeypatch.setenv("GKEEP_TOKEN", "token")
    monkeypatch.setenv("PUBLIC_CONTACT_EMAIL", "owner@example.com")
    client = TestClient(main.app)

    response = client.post(
        "/message",
        json={
            "name": "Sender",
            "email": "sender@example.com",
            "message_body": "Hello",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "Message saved to Google Keep.",
    }
    keep = _Keep.instance
    assert keep.authenticated == ("owner@example.com", "token")
    assert keep.created_note[0] == "Sender"
    assert "Email: sender@example.com" in keep.created_note[1]
    assert keep.created_label == "portfolio messages"
    assert keep.created_note[2].labels.added == [{"name": "portfolio messages"}]
    assert keep.created_note[2].pinned is True
    assert keep.created_note[2].color == "teal"
    assert keep.synced is True


def test_message_rejects_oversized_payload() -> None:
    client = TestClient(main.app)

    response = client.post(
        "/message",
        json={
            "name": "S" * 121,
            "email": "sender@example.com",
            "message_body": "Hello",
        },
    )

    assert response.status_code == 422


def test_message_rate_limit_blocks_repeated_messages(monkeypatch) -> None:
    monkeypatch.delenv("GKEEP_TOKEN", raising=False)
    client = TestClient(main.app)
    payload = {
        "name": "Sender",
        "email": "sender@example.com",
        "message_body": "Hello",
    }

    for _ in range(main.MESSAGE_RATE_LIMIT_COUNT):
        assert client.post("/message", json=payload).status_code == 200

    response = client.post("/message", json=payload)

    assert response.status_code == 429
    assert response.json() == {"detail": "Too many messages. Try again later."}
