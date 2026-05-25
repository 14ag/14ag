from __future__ import annotations

from fastapi.testclient import TestClient

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
