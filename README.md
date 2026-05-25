# Backend

FastAPI API for the portfolio.

## Responsibilities

- `GET /` health check.
- `GET /projects` reads Supabase `public.projects` and normalizes `project_metadata`.
- `POST /message` validates contact messages and optionally syncs to Google Keep.
- Falls back to `backend/data.json` when Supabase project reads fail.

## Setup

From `backend/`:

```powershell
python -m pip install -r ..\requirements.txt
```

Create `backend/.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_KEY=your-anon-or-read-key
FRONTEND_URL=["http://localhost:5173","http://127.0.0.1:5173"]
GKEEP_EMAIL=user@gmail.com
GKEEP_TOKEN=optional-google-keep-token
```

`FRONTEND_URL` can be a JSON array, one URL, or a comma-separated list.

## Run

```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

## Test

```powershell
python -m pytest
```

## Notes

- Keep write operations out of the public backend. Admin writes go through the Supabase Edge Function.
- If `/projects` returns fallback data, check Supabase credentials, RLS read policy, and network access.
