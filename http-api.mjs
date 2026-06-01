export function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    ...headers
  });
  res.end(JSON.stringify(body));
}

export function readJson(req) {
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

export async function handleProjects(req, res, api, options = {}) {
  const jsonHeaders = options.headers || {};

  if (req.method === 'GET') {
    sendJson(res, 200, await api.listProjects(), jsonHeaders);
    return;
  }

  if (req.method === 'POST') {
    const body = await readJson(req);
    const project =
      body && typeof body === 'object' && 'project' in body ? body.project : body;
    sendJson(res, 201, await api.createProject(project), jsonHeaders);
    return;
  }

  if (req.method === 'PATCH') {
    const body = await readJson(req);
    const id =
      body && typeof body === 'object' && 'id' in body ? Number(body.id) : NaN;
    const project =
      body && typeof body === 'object' && 'project' in body ? body.project : null;

    if (!Number.isInteger(id) || id < 0) {
      sendJson(res, 400, { error: 'id must be a valid row ID.' }, jsonHeaders);
      return;
    }

    sendJson(res, 200, await api.updateProject(id, project), jsonHeaders);
    return;
  }

  if (req.method === 'DELETE') {
    const body = await readJson(req);
    const ids =
      body && typeof body === 'object' && Array.isArray(body.ids) ? body.ids : [];
    sendJson(res, 200, await api.deleteProjects(ids), jsonHeaders);
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed.' }, jsonHeaders);
}

export async function handleCommonRequest(req, res, api, url, options = {}) {
  const jsonHeaders = options.headers || {};

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true }, jsonHeaders);
    return true;
  }

  if (url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok' }, jsonHeaders);
    return true;
  }

  if (url.pathname === '/api/projects') {
    await handleProjects(req, res, api, { headers: jsonHeaders });
    return true;
  }

  return false;
}
