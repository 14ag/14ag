# Backend

FastAPI API for the portfolio.

## Responsibilities

- `GET /` health check.
- `GET /projects` reads Supabase `public.projects` and normalizes `project_metadata`.
- `POST /message` validates contact messages and optionally syncs to Google Keep.
- Returns `502` when Supabase project reads fail.

Supabase is the project source of truth. Public write operations do not belong in this backend; admin writes go through the Supabase Edge Function.

## Runtime Behavior

- Project `_url`, `url`, `live_url`, and `demo_url` values must use `http://` or `https://`.
- Unsafe project code links fall back to `#`.
- Unsafe live/demo links are omitted from the response.
- Contact messages enforce required fields, email format, max lengths, and an in-memory per-client rate limit of 5 accepted attempts per 60 seconds.
- If `GKEEP_TOKEN`, `PUBLIC_CONTACT_EMAIL`, or `gkeepapi` is unavailable, messages are still accepted without Google Keep sync.

## Prerequisites

- Python 3.13 or compatible Python 3 runtime.
- Dependencies installed from the workspace `requirements.txt`.
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
| `PUBLIC_CONTACT_EMAIL` | Yes | Account email used for optional Google Keep sync. |
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
PUBLIC_CONTACT_EMAIL=you@example.com
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

## Deployment

Use the canonical deployment runbook in `../main/DEPLOYMENT.md` or the `main` branch `DEPLOYMENT.md`. The backend section covers environment variables, smoke checks, and rollback.

## Troubleshooting

- If `/projects` returns `502`, check Supabase credentials, RLS read policy, network access, and the `projects` table schema.
- If `/message` returns `429`, wait for the rate-limit window to expire or restart the backend in local development.
- If Google Keep sync does not happen, verify `GKEEP_TOKEN`, `PUBLIC_CONTACT_EMAIL`, and the `gkeepapi` dependency.
