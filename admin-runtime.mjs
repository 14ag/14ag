import { loadAdminEnv } from './env.mjs';
import { createProjectsApi } from './project-api.mjs';

loadAdminEnv();

export const api = createProjectsApi();
export const host = process.env.ADMIN_SERVER_HOST || '127.0.0.1';

export function createRequestUrl(req, port) {
  return new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`);
}
