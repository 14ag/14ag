# Frontend

Public SvelteKit portfolio site.

## Responsibilities

- Loads project cards from the backend `GET /projects`.
- Renders project filters, skills, about, and contact sections.
- Sends contact messages to the backend.

## Setup

```powershell
npm install
```

Create `frontend/.env`:

```env
PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

If `PUBLIC_API_BASE_URL` is missing, the app uses `http://127.0.0.1:8000`.

## Run

```powershell
npm run dev
```

Default local URL: `http://localhost:5173`.

## Test

```powershell
npm run check
npm run build
npx playwright test full-stack-projects.spec.js --reporter=line
```

The Playwright test expects the backend to be running on `http://127.0.0.1:8000`.

## Deploy

```powershell
npm run check
npm run build
```

The app uses `@sveltejs/adapter-auto`; choose a SvelteKit adapter if the target host needs one.
