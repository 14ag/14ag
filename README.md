# Backend

FastAPI API for the portfolio.

## Responsibilities

- `GET /` health check.
- `GET /projects` reads Supabase `public.projects` and normalizes `project_metadata`.
- `POST /message` validates contact messages and optionally syncs to Google Keep.
- Returns `502` when Supabase project reads fail. Supabase is the project source of truth.

## Prerequisites

- Python 3.13 or compatible Python 3 runtime.
- Supabase `public.projects` table already migrated.
- Supabase project URL from Supabase Dashboard, Project Settings, API or Connect dialog.
- Supabase publishable key from Supabase Dashboard, Settings, API Keys.
- Frontend origin for backend CORS.
- Optional `gkeepapi` token. Google Keep uses `PUBLIC_CONTACT_EMAIL` as its account email.

Required `backend/.env` values:

| Variable | Required | Where to get it |
|---|---:|---|
| `DB_URL` | Yes | Supabase Dashboard project API URL, `https://<project-ref>.supabase.co`. |
| `SUPABASE_KEY` | Yes | Supabase publishable key with read access to `public.projects`. |
| `FRONTEND_URL` | Yes | Frontend origin, such as `http://localhost:5173` or deployed site URL. |
| `PUBLIC_CONTACT_EMAIL` | Yes | Contact email shown on the frontend and used as the optional Google Keep account email. |
| `GKEEP_TOKEN` | No | Optional token from your `gkeepapi` auth workflow. |

## Setup

From `backend/`:

```powershell
python -m pip install -r ..\requirements.txt
```

Create `backend/.env`:

```env
DB_URL=https://<project-ref>.supabase.co
SUPABASE_KEY=<publishable-key>
FRONTEND_URL=["http://localhost:5173","http://127.0.0.1:5173"]
PUBLIC_CONTACT_EMAIL=muriukipn@gmail.com
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
- If `/projects` returns `502`, check Supabase credentials, RLS read policy, network access, and the `projects` table schema.
