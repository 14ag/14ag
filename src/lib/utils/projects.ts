import type { Project } from '$lib/types';

type UnknownRecord = Record<string, unknown>;

function isPublicProjectRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function isPublicProjectHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function safePublicProjectUrl(value: unknown, fallback = '#'): string {
  const url = String(value || '').trim();
  return isPublicProjectHttpUrl(url) ? url : fallback;
}

function toProject(item: unknown): Project | null {
  if (!isPublicProjectRecord(item)) {
    return null;
  }

  const techs = Array.isArray(item.techs)
    ? item.techs.map((tech) => String(tech))
    : typeof item.techs === 'string'
      ? [item.techs]
      : [];

  const liveUrl = item.live_url || item.demo_url;

  return {
    icon: String(item.icon || 'folder').toLowerCase(),
    title: String(item.title || 'Untitled project'),
    description: String(item.description || 'No description available.'),
    techs,
    _url: safePublicProjectUrl(item._url || item.url),
    category: String(item.category || 'other').toLowerCase(),
    ...(liveUrl && isPublicProjectHttpUrl(String(liveUrl).trim())
      ? { live_url: String(liveUrl).trim() }
      : {})
  };
}

export function normalizeProjects(raw: unknown): Project[] {
  const candidates = Array.isArray(raw)
    ? raw
    : isPublicProjectRecord(raw) && Array.isArray(raw.projects)
      ? raw.projects
      : isPublicProjectRecord(raw)
        ? Object.values(raw)
        : [];

  return candidates
    .map(toProject)
    .filter((project): project is Project => project !== null);
}
