# Admin Panel

Local-only Svelte/Vite app for managing portfolio projects.

## Responsibilities

- Display project cards using the same design language as the public frontend.
- Add and edit projects through a form with icon, category, URL, and tech-chip inputs.
- Delete selected projects after confirmation.
- Call a local Node admin service. The service keeps Supabase credentials server-side, so the browser never stores Supabase admin credentials.

## Security Model

- This app is intended to run locally.
- Browser code calls `/api/projects` on the local admin server. In split-terminal dev mode, Vite proxies that path to the same service.
- The local service sends `ADMIN_PROJECTS_KEY` to the Edge Function for create/delete and uses `DB_SUPABASE_SECRET_KEY` for direct updates.
- Do not put `DB_SUPABASE_SECRET_KEY` or any Supabase secret key in browser-exposed variables.
- Project links must use `http://` or `https://`. The UI validates new rows and normalizes rows read from Supabase.

## Prerequisites

- Node.js 18 or newer.
- npm.
- `DB_URL` for the Supabase project that hosts `manage-projects`.
- Generated admin shared secret. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- Same `ADMIN_PROJECTS_KEY` set in Supabase Edge Function secrets.
- Supabase secret key for local project updates.

Required `admin/.env` values:

| Variable | Required | Where to get it |
|---|---:|---|
| `PUBLIC_ADMIN_API_BASE_URL` | No | Leave empty for Vite `/api` proxy, or set local admin service URL. |
| `ADMIN_SERVER_HOST` | Yes | Local host for admin service, usually `127.0.0.1`. |
| `ADMIN_PANEL_PORT` | No | One-port admin panel URL. Default: `5174`. |
| `ADMIN_SERVER_PORT` | No | Split-terminal API service port. Default: `8787`. |
| `DB_URL` | Yes | Supabase Dashboard project API URL, `https://<project-ref>.supabase.co`. |
| `ADMIN_PROJECTS_KEY` | Yes | Same generated secret stored in Supabase Edge Function secrets. |
| `DB_SUPABASE_SECRET_KEY` | Yes | Supabase Dashboard project secret key. Keep server-side only. |

## Setup

```powershell
npm install
```

Create `admin/.env`:

```env
PUBLIC_ADMIN_API_BASE_URL=
ADMIN_SERVER_HOST=127.0.0.1
ADMIN_PANEL_PORT=5174
DB_URL=https://<project-ref>.supabase.co
ADMIN_PROJECTS_KEY=<generated-admin-secret>
DB_SUPABASE_SECRET_KEY=<secret-key>
```

`ADMIN_PROJECTS_KEY` must match the Edge Function secret `ADMIN_PROJECTS_KEY`.
Leave `PUBLIC_ADMIN_API_BASE_URL` empty for the Vite `/api` proxy, or set it to a local service URL such as `http://127.0.0.1:8787`.

## Run

Start the admin panel:

```powershell
npm run admin
```

Default local URL: `http://127.0.0.1:5174`.

The batch launcher runs the same command:

```powershell
.\launch-admin.bat
```

From the workspace root:

```powershell
npm run admin
```

For split-terminal debugging, `npm run admin:server` starts only the local API service and `npm run admin:ui` starts only Vite.

## Test

```powershell
npm run check
npm run build
npm test
```

## Deployment

Use the canonical deployment runbook in `../main/DEPLOYMENT.md` or the `main` branch `DEPLOYMENT.md`. The admin panel is not part of the public production surface; run it locally when project management is needed.

The repo includes static-host config for preview builds:

| Host | Config file | Output |
|---|---|---|
| Netlify | `netlify.toml` | `dist` |
| Vercel | `vercel.json` | `dist` |

Hosted previews still need `PUBLIC_ADMIN_API_BASE_URL` pointed at an admin service that can safely hold `ADMIN_PROJECTS_KEY` and `DB_SUPABASE_SECRET_KEY`; do not expose either key in browser variables.

## Operating Notes

- Click a project card body to edit it. The drawer reuses the add form and saves changes to the same Supabase row.
- Checkbox clicks only select rows for bulk delete; Code and Release links still open externally.
- Categories are derived from existing project rows. Adding a project with a new category adds it to the list; deleting the last project in a category removes it from the list.
- Tech stack input commits chips on comma or Enter and supports multi-word chips.
- If create/delete returns `401`, confirm the local `ADMIN_PROJECTS_KEY` matches the Edge Function secret.
- If update fails with `DB_SUPABASE_SECRET_KEY is not configured.`, set `DB_SUPABASE_SECRET_KEY` in `admin/.env` and restart the admin panel.
