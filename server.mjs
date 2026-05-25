#!/usr/bin/env node
import { createServer } from 'node:http';
import { loadAdminEnv } from './env.mjs';
import { createProjectsApi } from './project-api.mjs';

loadAdminEnv();

const api = createProjectsApi();
const host = process.env.ADMIN_SERVER_HOST || '127.0.0.1';
const port = Number(process.env.ADMIN_SERVER_PORT || 8787);
const localOrigins = new Set(['http://127.0.0.1:5174', 'http://localhost:5174']);

function sendJson(req, res, status, body) {
  const origin = req.headers.origin || '';
  const allowOrigin = localOrigins.has(origin) ? origin : 'http://localhost:5174';

  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    Vary: 'Origin'
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

async function handleProjects(req, res) {
  if (req.method === 'GET') {
    sendJson(req, res, 200, await api.listProjects());
    return;
  }

  if (req.method === 'POST') {
    const body = await readJson(req);
    const project =
      body && typeof body === 'object' && 'project' in body ? body.project : body;
    sendJson(req, res, 201, await api.createProject(project));
    return;
  }

  if (req.method === 'PATCH') {
    const body = await readJson(req);
    const id =
      body && typeof body === 'object' && 'id' in body ? Number(body.id) : NaN;
    const project =
      body && typeof body === 'object' && 'project' in body ? body.project : null;

    if (!Number.isInteger(id) || id < 0) {
      sendJson(req, res, 400, { error: 'id must be a valid row ID.' });
      return;
    }

    sendJson(req, res, 200, await api.updateProject(id, project));
    return;
  }

  if (req.method === 'DELETE') {
    const body = await readJson(req);
    const ids =
      body && typeof body === 'object' && Array.isArray(body.ids) ? body.ids : [];
    sendJson(req, res, 200, await api.deleteProjects(ids));
    return;
  }

  sendJson(req, res, 405, { error: 'Method not allowed.' });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || `${host}:${port}`}`);

    if (req.method === 'OPTIONS') {
      sendJson(req, res, 200, { ok: true });
      return;
    }

    if (url.pathname === '/health') {
      sendJson(req, res, 200, { status: 'ok' });
      return;
    }

    if (url.pathname === '/api/projects') {
      await handleProjects(req, res);
      return;
    }

    sendJson(req, res, 404, { error: 'Not found.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected admin server error.';
    sendJson(req, res, 500, { error: message });
  }
});

server.listen(port, host, () => {
  console.log(`Admin service listening on http://${host}:${port}`);
});
