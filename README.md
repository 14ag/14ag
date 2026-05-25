# Admin Panel

Local-only Svelte/Vite app for managing portfolio projects.

## Responsibilities

- Display project cards using the same design language as the public frontend.
- Add projects through a form with icon, category, URL, and tech-chip inputs.
- Delete selected projects after confirmation.
- Call the Supabase Edge Function instead of writing to Supabase directly from the browser.

## Setup

```powershell
npm install
```

Create `admin/.env`:

```env
PUBLIC_PROJECTS_FUNCTION_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/manage-projects
PUBLIC_ADMIN_PROJECTS_KEY=change-me
```

`PUBLIC_ADMIN_PROJECTS_KEY` must match the Edge Function secret `ADMIN_PROJECTS_KEY`.

## Run

```powershell
npm run dev
```

Default local URL: `http://127.0.0.1:5174`.

## Test

```powershell
npm run check
npm run build
```

## Operating Notes

- This app is local-only by design.
- Do not put Supabase service-role credentials in `admin/.env`.
- Categories are derived from existing project rows. Adding a project with a new category adds it to the list; deleting the last project in a category removes it from the list.
- Tech stack input commits chips on comma or Enter and supports multi-word chips.
