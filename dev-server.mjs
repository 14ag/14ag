#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';
import { api, createRequestUrl, host } from './admin-runtime.mjs';
import { handleCommonRequest, sendJson } from './http-api.mjs';

const port = Number(process.env.ADMIN_PANEL_PORT || 5174);

let vite;

async function sendIndex(url, res) {
  const template = await readFile(new URL('./index.html', import.meta.url), 'utf8');
  const html = await vite.transformIndexHtml(url.pathname, template);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

const server = createServer(async (req, res) => {
  try {
    const url = createRequestUrl(req, port);

    if (await handleCommonRequest(req, res, api, url)) {
      return;
    }

    if (req.method === 'GET' && (req.headers.accept || '').includes('text/html')) {
      await sendIndex(url, res);
      return;
    }

    vite.middlewares(req, res, (error) => {
      if (error) {
        vite.ssrFixStacktrace(error);
        sendJson(res, 500, { error: error.message });
        return;
      }

      sendJson(res, 404, { error: 'Not found.' });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected admin server error.';
    sendJson(res, 500, { error: message });
  }
});

vite = await createViteServer({
  server: {
    middlewareMode: true,
    host,
    hmr: {
      server
    }
  },
  appType: 'spa'
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(`Admin panel port ${host}:${port} is already in use.`);
    console.error('Stop the existing process or set ADMIN_PANEL_PORT to another local port.');
    process.exit(1);
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`Admin panel listening on http://${host}:${port}`);
});
