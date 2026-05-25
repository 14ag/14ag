const DEFAULT_ERROR = 'Request failed.';

function getFunctionUrl(env) {
  const supabaseUrl = (env.DB_URL || '').replace(/\/$/, '');

  return supabaseUrl ? `${supabaseUrl}/functions/v1/manage-projects` : '';
}

function getAdminKey(env) {
  return env.ADMIN_PROJECTS_KEY || '';
}

async function readPayload(response) {
  return response.json().catch(() => ({}));
}

export function createProjectsApi({ env = process.env, fetchImpl = fetch } = {}) {
  async function request(method, body) {
    const functionUrl = getFunctionUrl(env);

    if (!functionUrl) {
      throw new Error('DB_URL is not configured.');
    }

    const headers = {
      'Content-Type': 'application/json'
    };

    if (method !== 'GET') {
      const adminKey = getAdminKey(env);

      if (!adminKey) {
        throw new Error('ADMIN_PROJECTS_KEY is not configured.');
      }

      headers['x-admin-key'] = adminKey;
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

  return {
    listProjects() {
      return request('GET');
    },
    createProject(project) {
      return request('POST', { project });
    },
    deleteProjects(ids) {
      return request('DELETE', { ids });
    }
  };
}
