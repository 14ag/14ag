#!/usr/bin/env node
import { createServer } from 'node:http';
import { api, createRequestUrl, host } from './admin-runtime.mjs';
import { handleCommonRequest, sendJson } from './http-api.mjs';

const port = Number(process.env.ADMIN_SERVER_PORT || 8787);
const localOrigins = new Set(['http://127.0.0.1:5174', 'http://localhost:5174']);

function getAdminCorsHeaders(req) {
  const origin = req.headers.origin || '';
  const allowOrigin = localOrigins.has(origin) ? origin : 'http://localhost:5174';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    Vary: 'Origin'
  };
}

const server = createServer(async (req, res) => {
  try {
    const url = createRequestUrl(req, port);
    const headers = getAdminCorsHeaders(req);

    if (await handleCommonRequest(req, res, api, url, { headers })) {
      return;
    }

    sendJson(res, 404, { error: 'Not found.' }, headers);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected admin server error.';
    sendJson(res, 500, { error: message }, getAdminCorsHeaders(req));
  }
});

server.listen(port, host, () => {
  console.log(`Admin service listening on http://${host}:${port}`);
});
