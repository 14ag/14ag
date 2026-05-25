# Supabase

Supabase project assets for portfolio project management.

## Table Shape

The admin and backend expect a `public.projects` table with an `id` and `project_metadata` JSON object.

Example row:

```json
{
  "id": 0,
  "project_metadata": {
    "icon": "pc",
    "title": "title",
    "description": "description",
    "techs": ["techs1", "techs2"],
    "_url": "https://github.com/example/repo",
    "live_url": "https://example.com/release",
    "category": "category"
  }
}
```

## Edge Function

`functions/manage-projects/index.ts` exposes:

- `GET` - returns `{ projects, categories }`.
- `POST` - inserts `{ project_metadata: project }`; requires `x-admin-key`.
- `DELETE` - deletes rows by `{ ids: number[] }`; requires `x-admin-key`.
- `OPTIONS` - handles browser CORS preflight.

## Required Secrets

```env
ADMIN_PROJECTS_KEY=change-me
ADMIN_ALLOWED_ORIGINS=http://127.0.0.1:5174,http://localhost:5174
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
```

The function also supports `SUPABASE_SECRET_KEY` or `SUPABASE_SECRET_KEYS` with a `default` value.

`ADMIN_ALLOWED_ORIGINS` is optional. If unset, the function allows `http://127.0.0.1:5174` and `http://localhost:5174`.

## JWT Verification

Disable Supabase platform JWT verification for `manage-projects`. The function uses its own `x-admin-key` check for write requests, and the local admin panel does not send a Supabase Auth JWT.

The repository includes this config in `supabase/config.toml`:

```toml
[functions.manage-projects]
verify_jwt = false
```

Deploy command option:

```sh
supabase functions deploy manage-projects --project-ref YOUR_PROJECT_REF --no-verify-jwt
```

Local serve option:

```sh
supabase functions serve manage-projects --no-verify-jwt
```

## Smoke Tests

```sh
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/manage-projects
```

```sh
curl --request POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/manage-projects \
  --header "Content-Type: application/json" \
  --header "x-admin-key: YOUR_ADMIN_PROJECTS_KEY" \
  --data '{"project":{"icon":"folder","title":"Temp","description":"Temp project","techs":["test"],"_url":"https://github.com/example/temp","category":"test"}}'
```

Delete the test row through the admin panel after the smoke test.
