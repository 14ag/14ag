import type { Project } from '$lib/types';

type UnknownRecord = Record<string, unknown>;

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

function toProject(item: unknown): Project | null {
  if (!isRecord(item)) {
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
    _url: safeProjectUrl(item._url || item.url),
    category: String(item.category || 'other').toLowerCase(),
    ...(liveUrl && isHttpUrl(String(liveUrl).trim())
      ? { live_url: String(liveUrl).trim() }
      : {})
  };
}

export function normalizeProjects(raw: unknown): Project[] {
  const candidates = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.projects)
      ? raw.projects
      : isRecord(raw)
        ? Object.values(raw)
        : [];

  return candidates
    .map(toProject)
    .filter((project): project is Project => project !== null);
}
