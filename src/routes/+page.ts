import { API_BASE_URL } from '$lib/config';
import { normalizeProjects } from '$lib/utils/projects';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);

    if (!response.ok) {
      throw new Error(`Projects request failed: ${response.status}`);
    }

    const payload = await response.json();

    return {
      projects: normalizeProjects(payload),
      projectsError: ''
    };
  } catch {
    return {
      projects: [],
      projectsError: 'Could not load projects right now.'
    };
  }
};
