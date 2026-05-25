import { createClient } from 'npm:@supabase/supabase-js@2';

type ProjectIcon = 'file' | 'pc' | 'folder' | 'net' | 'camera';

type ProjectPayload = {
  icon: ProjectIcon;
  title: string;
  description: string;
  techs: string[];
  _url: string;
  live_url?: string;
  category: string;
};

const allowedIcons = new Set<ProjectIcon>(['file', 'pc', 'folder', 'net', 'camera']);
const defaultAllowedOrigins = ['http://localhost:5174', 'http://127.0.0.1:5174'];

function getAllowedOrigins() {
  const configuredOrigins = Deno.env.get('ADMIN_ALLOWED_ORIGINS');

  if (!configuredOrigins) {
    return new Set(defaultAllowedOrigins);
  }

  return new Set(
    configuredOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  );
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = getAllowedOrigins();
  const fallbackOrigin = [...allowedOrigins][0] || 'http://localhost:5174';
  const allowOrigin = allowedOrigins.has(origin) ? origin : fallbackOrigin;

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Vary': 'Origin'
  };
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json'
    }
  });
}

function getSecretKey() {
  return Deno.env.get('DB_SUPABASE_SECRET_KEY');
}

function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('DB_URL');
  const supabaseKey = getSecretKey();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase service credentials are not configured.');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function requireAdmin(req: Request) {
  const expectedKey = Deno.env.get('ADMIN_PROJECTS_KEY');

  if (!expectedKey) {
    return 'ADMIN_PROJECTS_KEY is not configured.';
  }

  if (req.headers.get('x-admin-key') !== expectedKey) {
    return 'Invalid admin key.';
  }

  return '';
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateProject(input: unknown): { project?: ProjectPayload; error?: string } {
  if (!input || typeof input !== 'object') {
    return { error: 'Project payload is required.' };
  }

  const record = input as Record<string, unknown>;
  const icon = cleanString(record.icon).toLowerCase();
  const title = cleanString(record.title);
  const description = cleanString(record.description);
  const category = cleanString(record.category).toLowerCase();
  const githubUrl = cleanString(record._url);
  const releasePage = cleanString(record.live_url);
  const techs = Array.isArray(record.techs)
    ? record.techs.map((tech) => cleanString(tech)).filter(Boolean)
    : [];

  if (!allowedIcons.has(icon as ProjectIcon)) {
    return { error: 'Icon is not allowed.' };
  }

  if (!title || !description || !category) {
    return { error: 'Project name, description, and category are required.' };
  }

  if (techs.length === 0) {
    return { error: 'At least one tech item is required.' };
  }

  if (!isHttpUrl(githubUrl)) {
    return { error: 'GitHub URL must start with http:// or https://.' };
  }

  if (releasePage && !isHttpUrl(releasePage)) {
    return { error: 'Release page must start with http:// or https://.' };
  }

  return {
    project: {
      icon: icon as ProjectIcon,
      title,
      description,
      techs,
      _url: githubUrl,
      ...(releasePage ? { live_url: releasePage } : {}),
      category
    }
  };
}

function normalizeRow(row: Record<string, unknown>) {
  const metadata =
    row.project_metadata && typeof row.project_metadata === 'object'
      ? (row.project_metadata as Record<string, unknown>)
      : row;

  return {
    id: Number(row.id),
    icon: cleanString(metadata.icon).toLowerCase() || 'folder',
    title: cleanString(metadata.title) || 'Untitled project',
    description: cleanString(metadata.description) || 'No description available.',
    techs: Array.isArray(metadata.techs)
      ? metadata.techs.map((tech) => cleanString(tech)).filter(Boolean)
      : [],
    _url: cleanString(metadata._url || metadata.url) || '#',
    ...(cleanString(metadata.live_url || metadata.demo_url)
      ? { live_url: cleanString(metadata.live_url || metadata.demo_url) }
      : {}),
    category: cleanString(metadata.category).toLowerCase() || 'other'
  };
}

function deriveCategories(projects: Array<{ category: string }>) {
  return Array.from(new Set(projects.map((project) => project.category))).sort((a, b) =>
    a.localeCompare(b)
  );
}

async function getProjects(req: Request) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, project_metadata')
    .order('id', { ascending: true });

  if (error) {
    return json(req, { error: error.message }, 500);
  }

  const projects = (data || []).map(normalizeRow);

  return json(req, {
    projects,
    categories: deriveCategories(projects)
  });
}

async function createProject(req: Request) {
  const authError = requireAdmin(req);

  if (authError) {
    return json(req, { error: authError }, 401);
  }

  const body = await req.json().catch(() => null);
  const input =
    body && typeof body === 'object' && 'project' in body
      ? (body as Record<string, unknown>).project
      : body;
  const { project, error } = validateProject(input);

  if (!project) {
    return json(req, { error }, 400);
  }

  const supabase = getSupabaseClient();
  const result = await supabase
    .from('projects')
    .insert({ project_metadata: project })
    .select('id, project_metadata')
    .single();

  if (result.error) {
    return json(req, { error: result.error.message }, 500);
  }

  return json(req, { project: normalizeRow(result.data) }, 201);
}

async function deleteProjects(req: Request) {
  const authError = requireAdmin(req);

  if (authError) {
    return json(req, { error: authError }, 401);
  }

  const body = await req.json().catch(() => null);
  const ids =
    body && typeof body === 'object' && Array.isArray((body as Record<string, unknown>).ids)
      ? ((body as Record<string, unknown>).ids as unknown[])
      : [];
  const validIds = ids.map(Number).filter((id) => Number.isInteger(id) && id >= 0);

  if (validIds.length === 0 || validIds.length !== ids.length) {
    return json(req, { error: 'ids must be a non-empty array of row IDs.' }, 400);
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('projects').delete().in('id', validIds);

  if (error) {
    return json(req, { error: error.message }, 500);
  }

  return json(req, {
    deletedIds: validIds
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: getCorsHeaders(req)
    });
  }

  try {
    if (req.method === 'GET') {
      return await getProjects(req);
    }

    if (req.method === 'POST') {
      return await createProject(req);
    }

    if (req.method === 'DELETE') {
      return await deleteProjects(req);
    }

    return json(req, { error: 'Method not allowed.' }, 405);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    return json(req, { error: message }, 500);
  }
});
