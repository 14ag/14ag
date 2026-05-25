import { env } from '$env/dynamic/public';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

export const API_BASE_URL = (import.meta.env.API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
export const CONTACT_EMAIL = env.PUBLIC_CONTACT_EMAIL ?? '';
