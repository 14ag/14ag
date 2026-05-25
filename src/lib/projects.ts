import type { ProjectForm, ProjectIcon, ProjectRecord, ProjectsResponse } from './types';

type UnknownRecord = Record<string, unknown>;

export const projectIcons: ProjectIcon[] = ['file', 'pc', 'folder', 'net', 'camera'];

const functionUrl = (import.meta.env.PUBLIC_PROJECTS_FUNCTION_URL || '').replace(/\/$/, '');
const adminKey = import.meta.env.PUBLIC_ADMIN_PROJECTS_KEY || '';

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function normalizeProject(item: unknown): ProjectRecord | null {
  if (!isRecord(item)) {
    return null;
  }

  const metadata = isRecord(item.project_metadata) ? item.project_metadata : item;
  const id = Number(item.id);

  if (!Number.isFinite(id)) {
    return null;
  }

  const iconValue = String(metadata.icon || 'folder').toLowerCase();
  const icon = projectIcons.includes(iconValue as ProjectIcon)
    ? (iconValue as ProjectIcon)
    : 'folder';
  const techs = Array.isArray(metadata.techs)
    ? metadata.techs.map((tech) => String(tech)).filter(Boolean)
    : typeof metadata.techs === 'string'
      ? [metadata.techs]
      : [];
  const liveUrl = metadata.live_url || metadata.demo_url;

  return {
    id,
    icon,
    title: String(metadata.title || 'Untitled project'),
    description: String(metadata.description || 'No description available.'),
    techs,
    _url: String(metadata._url || metadata.url || '#'),
    category: String(metadata.category || 'other').toLowerCase(),
    ...(liveUrl ? { live_url: String(liveUrl) } : {})
  };
}

function deriveCategories(projects: ProjectRecord[]): string[] {
  return Array.from(new Set(projects.map((project) => project.category))).sort((a, b) =>
    a.localeCompare(b)
  );
}

async function request<T>(method: 'GET' | 'POST' | 'DELETE', body?: unknown): Promise<T> {
  if (!functionUrl) {
    throw new Error('PUBLIC_PROJECTS_FUNCTION_URL is not configured.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (method !== 'GET') {
    headers['x-admin-key'] = adminKey;
  }

  const response = await fetch(functionUrl, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = isRecord(payload) && payload.error ? String(payload.error) : 'Request failed.';
    throw new Error(message);
  }

  return payload as T;
}

export async function fetchProjects(): Promise<ProjectsResponse> {
  const payload = await request<unknown>('GET');
  const rawProjects =
    isRecord(payload) && Array.isArray(payload.projects)
      ? payload.projects
      : Array.isArray(payload)
        ? payload
        : [];
  const projects = rawProjects
    .map(normalizeProject)
    .filter((project): project is ProjectRecord => project !== null);
  const categories =
    isRecord(payload) && Array.isArray(payload.categories)
      ? payload.categories.map((category) => String(category)).filter(Boolean)
      : deriveCategories(projects);

  return {
    projects,
    categories
  };
}

export async function createProject(project: ProjectForm): Promise<void> {
  await request('POST', { project });
}

export async function deleteProjects(ids: number[]): Promise<void> {
  await request('DELETE', { ids });
}
