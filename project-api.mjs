const DEFAULT_ERROR = 'Request failed.';

function getFunctionUrl(env) {
  const supabaseUrl = (env.DB_URL || '').replace(/\/$/, '');

  return supabaseUrl ? `${supabaseUrl}/functions/v1/manage-projects` : '';
}

function getAdminKey(env) {
  return env.ADMIN_PROJECTS_KEY || '';
}

function getAdminDatabaseKey(env) {
  return env.DB_SUPABASE_SECRET_KEY;
}

async function readPayload(response) {
  return response.json().catch(() => ({}));
}

export function createProjectsApi({ env = process.env, fetchImpl = fetch } = {}) {
  function requireWriteConfig() {
    const adminKey = getAdminKey(env);

    if (!adminKey) {
      throw new Error('ADMIN_PROJECTS_KEY is not configured.');
    }

    return adminKey;
  }

  async function requestManageProjectsFunction(method, body) {
    const functionUrl = getFunctionUrl(env);

    if (!functionUrl) {
      throw new Error('DB_URL is not configured.');
    }

    const headers = {
      'Content-Type': 'application/json'
    };

    if (method !== 'GET') {
      headers['x-admin-key'] = requireWriteConfig();
    }

    const response = await fetchImpl(functionUrl, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const payload = await readPayload(response);

    if (!response.ok) {
      const message =
        payload && typeof payload === 'object' && 'error' in payload
          ? String(payload.error)
          : DEFAULT_ERROR;
      throw new Error(message);
    }

    return payload;
  }

  async function updateProjectDirect(id, project) {
    const supabaseUrl = (env.DB_URL || '').replace(/\/$/, '');
    const secretKey = getAdminDatabaseKey(env);

    if (!supabaseUrl) {
      throw new Error('DB_URL is not configured.');
    }

    if (!secretKey) {
      throw new Error('DB_SUPABASE_SECRET_KEY is not configured.');
    }

    const response = await fetchImpl(`${supabaseUrl}/rest/v1/projects?id=eq.${id}&select=id,project_metadata`, {
      method: 'PATCH',
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ project_metadata: project })
    });
    const payload = await readPayload(response);

    if (!response.ok) {
      const message =
        payload && typeof payload === 'object' && 'message' in payload
          ? String(payload.message)
          : DEFAULT_ERROR;
      throw new Error(message);
    }

    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error('Project row was not found.');
    }

    return { project: payload[0] };
  }

  return {
    listProjects() {
      return requestManageProjectsFunction('GET');
    },
    createProject(project) {
      return requestManageProjectsFunction('POST', { project });
    },
    updateProject(id, project) {
      return updateProjectDirect(id, project);
    },
    deleteProjects(ids) {
      return requestManageProjectsFunction('DELETE', { ids });
    }
  };
}
