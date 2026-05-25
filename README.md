# Frontend

Public SvelteKit portfolio site.

## Responsibilities

- Loads project cards from the backend `GET /projects`.
- Renders project filters, skills, about, and contact sections.
- Sends contact messages to the backend.

## Prerequisites

- Node.js 18 or newer.
- npm.
- Backend API running locally or deployed.
- Contact email to display on the site.

Required `frontend/.env` values:

| Variable | Required | Where to get it |
|---|---:|---|
| `API_BASE_URL` | Yes | Backend URL, such as `http://127.0.0.1:8000` or deployed backend origin. |
| `PUBLIC_CONTACT_EMAIL` | Yes | Contact email shown in the portfolio contact section. |

## Setup

```powershell
npm install
```

Create `frontend/.env`:

```env
API_BASE_URL=http://127.0.0.1:8000
PUBLIC_CONTACT_EMAIL=muriukipn@gmail.com
```

If `API_BASE_URL` is missing, the app uses `http://127.0.0.1:8000`.
`API_BASE_URL` is browser-exposed through the Vite `API_` env prefix, so store only the public backend origin in it.

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
