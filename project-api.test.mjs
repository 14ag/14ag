import assert from 'node:assert/strict';
import test from 'node:test';
import { createProjectsApi } from './project-api.mjs';

function jsonResponse(body, ok = true, status = ok ? 200 : 500) {
  return {
    ok,
    status,
    json: async () => body
  };
}

test('listProjects calls Edge Function without admin key', async () => {
  const calls = [];
  const api = createProjectsApi({
    env: {
      DB_URL: 'https://example.supabase.co',
      ADMIN_PROJECTS_KEY: 'secret'
    },
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return jsonResponse({ projects: [], categories: [] });
    }
  });

  const result = await api.listProjects();

  assert.deepEqual(result, { projects: [], categories: [] });
  assert.equal(calls[0].url, 'https://example.supabase.co/functions/v1/manage-projects');
  assert.equal(calls[0].options.method, 'GET');
  assert.equal('x-admin-key' in calls[0].options.headers, false);
});

test('createProject sends admin key and project payload', async () => {
  const calls = [];
  const api = createProjectsApi({
    env: {
      DB_URL: 'https://example.supabase.co/',
      ADMIN_PROJECTS_KEY: 'secret'
    },
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return jsonResponse({ project: { id: 1 } }, true, 201);
    }
  });

  await api.createProject({ title: 'One' });

  assert.equal(calls[0].url, 'https://example.supabase.co/functions/v1/manage-projects');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers['x-admin-key'], 'secret');
  assert.equal(calls[0].options.body, JSON.stringify({ project: { title: 'One' } }));
});

test('deleteProjects sends ids payload', async () => {
  const calls = [];
  const api = createProjectsApi({
    env: {
      DB_URL: 'https://example.supabase.co',
      ADMIN_PROJECTS_KEY: 'secret'
    },
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return jsonResponse({ deletedIds: [1, 2] });
    }
  });

  await api.deleteProjects([1, 2]);

  assert.equal(calls[0].options.method, 'DELETE');
  assert.equal(calls[0].options.body, JSON.stringify({ ids: [1, 2] }));
});

test('writes fail before network when admin key missing', async () => {
  const api = createProjectsApi({
    env: {
      DB_URL: 'https://example.supabase.co'
    },
    fetchImpl: async () => {
      throw new Error('should not fetch');
    }
  });

  await assert.rejects(() => api.createProject({ title: 'One' }), {
    message: 'ADMIN_PROJECTS_KEY is not configured.'
  });
});
