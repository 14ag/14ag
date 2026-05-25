# Admin Panel

Local-only Svelte/Vite app for managing portfolio projects.

## Responsibilities

- Display project cards using the same design language as the public frontend.
- Add projects through a form with icon, category, URL, and tech-chip inputs.
- Delete selected projects after confirmation.
- Call a local Node admin service. The service calls the Supabase Edge Function with the admin key, so the browser never stores Supabase admin credentials.

## Setup

```powershell
npm install
```

Create `admin/.env`:

```env
PUBLIC_ADMIN_API_BASE_URL=
ADMIN_SERVER_HOST=127.0.0.1
ADMIN_SERVER_PORT=8787
ADMIN_PROJECTS_FUNCTION_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/manage-projects
ADMIN_PROJECTS_KEY=change-me
```

`ADMIN_PROJECTS_KEY` must match the Edge Function secret `ADMIN_PROJECTS_KEY`.
Leave `PUBLIC_ADMIN_API_BASE_URL` empty for the Vite `/api` proxy, or set it to a local service URL such as `http://127.0.0.1:8787`.

## Run

```powershell
npm run admin:server
```

In another terminal:

```powershell
npm run admin:ui
```

Default local URL: `http://127.0.0.1:5174`.

From the repo root, the same commands are available:

```powershell
npm run admin:server
npm run admin:ui
```

## CLI

Run project admin actions without opening the UI:

```powershell
npm run admin -- list
```

```powershell
npm run admin -- add --json '{"icon":"folder","title":"Temp","description":"Temp project","techs":["test"],"_url":"https://github.com/example/temp","category":"test"}'
```

```powershell
npm run admin -- delete 1 2
```

You can also use `--file project.json` for add.

## Test

```powershell
npm run check
npm run build
npm test
```

## Operating Notes

- This app is local-only by design.
- Do not put Supabase service-role credentials in browser-exposed variables.
- Browser code calls `/api/projects`; Vite proxies that path to the local Node admin service.
- Categories are derived from existing project rows. Adding a project with a new category adds it to the list; deleting the last project in a category removes it from the list.
- Tech stack input commits chips on comma or Enter and supports multi-word chips.
