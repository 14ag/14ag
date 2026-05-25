from __future__ import annotations

from fastapi.testclient import TestClient

import database
import main


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


def test_routes_still_work_with_loaded_app() -> None:
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
