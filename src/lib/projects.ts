import type { ProjectForm, ProjectIcon, ProjectRecord, ProjectsResponse } from './types';

type UnknownRecord = Record<string, unknown>;

export const projectIcons: ProjectIcon[] = ['file', 'pc', 'folder', 'net', 'camera'];

const adminApiBaseUrl = (import.meta.env.PUBLIC_ADMIN_API_BASE_URL || '').replace(/\/$/, '');
const projectsUrl = `${adminApiBaseUrl}/api/projects`;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function safeProjectUrl(value: unknown, fallback = '#'): string {
  const url = String(value || '').trim();
  return isHttpUrl(url) ? url : fallback;
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
    _url: safeProjectUrl(metadata._url || metadata.url),
    category: String(metadata.category || 'other').toLowerCase(),
    ...(liveUrl && isHttpUrl(String(liveUrl).trim())
      ? { live_url: String(liveUrl).trim() }
      : {})
  };
}

function deriveCategories(projects: ProjectRecord[]): string[] {
  return Array.from(new Set(projects.map((project) => project.category))).sort((a, b) =>
    a.localeCompare(b)
  );
}

async function request<T>(method: 'GET' | 'POST' | 'DELETE', body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(projectsUrl, {
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
