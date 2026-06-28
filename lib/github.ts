/**
 * GitHub Contents API helpers for the admin CMS.
 *
 * All functions run client-side only (they rely on `btoa`/`atob` and `fetch`).
 * The personal access token is stored exclusively in `localStorage` and is
 * never sent to the Next.js server.
 */

// ---------------------------------------------------------------------------
// Content types (mirror the shape of `content/config.json` & `content/work.json`)
// ---------------------------------------------------------------------------

export type ThemeName = 'dark-teal' | 'dark-amber' | 'light-slate' | 'light-rose';

export interface SiteConfig {
  name: string;
  description: string;
  /** Canonical site URL, e.g. https://example.com (used for SEO metadataBase). */
  url: string;
  /** Logo image URL. Leave empty to fall back to the site name as text. */
  logo: string;
  /** Open Graph image URL (recommended 1200×630). */
  ogImage: string;
  /** SEO keywords for search engines. */
  keywords: string[];
  /** Open Graph locale, e.g. en_US. */
  locale: string;
  /** Twitter @handle for Twitter card metadata. */
  twitter: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  /** Background image URL for the hero section. Leave empty for a plain background. */
  backgroundImage: string;
}

export interface AboutConfig {
  title: string;
  text: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface ContactConfig {
  title: string;
  subtitle: string;
  email: string;
  buttonText: string;
}

export interface Config {
  theme: ThemeName;
  site: SiteConfig;
  hero: HeroConfig;
  about: AboutConfig;
  services: ServiceItem[];
  contact: ContactConfig;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

export type Work = Project[];

// ---------------------------------------------------------------------------
// GitHub settings (persisted in localStorage)
// ---------------------------------------------------------------------------

export interface GitHubSettings {
  /** Personal access token (fine-grained or classic with `repo`/`contents`). */
  pat: string;
  /** Repository in `owner/name` form. */
  repo: string;
  /** Target branch, e.g. `main`. */
  branch: string;
}

export const GITHUB_SETTINGS_KEY = 'github_settings';

export const THEME_OPTIONS: { value: ThemeName; label: string }[] = [
  { value: 'dark-teal', label: 'Dark Teal' },
  { value: 'dark-amber', label: 'Dark Amber' },
  { value: 'light-slate', label: 'Light Slate' },
  { value: 'light-rose', label: 'Light Rose' },
];

/** Icon names supported by the public site (see components/sections/Services.tsx). */
export const SERVICE_ICON_OPTIONS = ['Code', 'Palette', 'Lightbulb'] as const;

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

export function loadGitHubSettings(): GitHubSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(GITHUB_SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GitHubSettings>;
    if (!parsed.pat || !parsed.repo) return null;
    return {
      pat: parsed.pat,
      repo: parsed.repo,
      branch: parsed.branch?.trim() || 'main',
    };
  } catch {
    return null;
  }
}

export function saveGitHubSettings(settings: GitHubSettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(settings));
}

export function clearGitHubSettings(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(GITHUB_SETTINGS_KEY);
}

// ---------------------------------------------------------------------------
// Base64 (UTF-8 safe) helpers
// ---------------------------------------------------------------------------

/** Encode a UTF-8 string to base64 (browser-safe, no deprecated `escape`). */
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Decode a base64 string (as returned by the GitHub API) to a UTF-8 string. */
export function decodeBase64(input: string): string {
  // GitHub inserts newlines every 60 chars in the `content` field — strip them.
  const clean = input.replace(/\n/g, '');
  const binary = atob(clean);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// ---------------------------------------------------------------------------
// GitHub Contents API
// ---------------------------------------------------------------------------

const API_BASE = 'https://api.github.com';

interface GitHubContentResponse {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  sha: string;
  content: string;
  message?: string;
}

interface GitHubErrorResponse {
  message: string;
  documentation_url?: string;
}

export interface RemoteFile<T> {
  data: T;
  sha: string;
}

function authHeaders(pat: string): HeadersInit {
  return {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function parseRepo(repo: string): { owner: string; name: string } {
  const trimmed = repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
  const [owner, name] = trimmed.split('/');
  if (!owner || !name) {
    throw new Error('Repository must be in the format "owner/name".');
  }
  return { owner, name };
}

/** Read a JSON file from the repo and return its parsed contents plus the blob SHA. */
export async function fetchJsonFile<T>(
  settings: GitHubSettings,
  path: string,
): Promise<RemoteFile<T>> {
  const { owner, name } = parseRepo(settings.repo);
  const url = `${API_BASE}/repos/${owner}/${name}/contents/${path}?ref=${encodeURIComponent(settings.branch)}`;

  const res = await fetch(url, { headers: authHeaders(settings.pat) });

  if (!res.ok) {
    const err = (await safeJson<GitHubErrorResponse>(res)) as GitHubErrorResponse;
    throw new Error(humanizeError(res.status, err));
  }

  const body = (await safeJson<GitHubContentResponse>(res)) as GitHubContentResponse;
  if (body.type !== 'file' || body.encoding !== 'base64') {
    throw new Error(`"${path}" is not a base64-encoded file.`);
  }

  const text = decodeBase64(body.content);
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(`"${path}" does not contain valid JSON.`);
  }

  return { data, sha: body.sha };
}

export interface UpdateResult {
  path: string;
  sha: string;
  commitUrl?: string;
}

/** Create or update a file via a PUT to the Contents API. Requires the current SHA. */
export async function updateJsonFile(
  settings: GitHubSettings,
  path: string,
  content: unknown,
  sha: string,
  message: string,
): Promise<UpdateResult> {
  const { owner, name } = parseRepo(settings.repo);
  const url = `${API_BASE}/repos/${owner}/${name}/contents/${path}`;

  const encoded = encodeBase64(JSON.stringify(content, null, 2) + '\n');

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...authHeaders(settings.pat),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: encoded,
      sha,
      branch: settings.branch,
    }),
  });

  if (!res.ok) {
    const err = (await safeJson<GitHubErrorResponse>(res)) as GitHubErrorResponse;
    throw new Error(humanizeError(res.status, err, path));
  }

  const body = (await safeJson<{ content?: { sha: string }; commit?: { html_url?: string } }>(res)) as {
    content?: { sha: string };
    commit?: { html_url?: string };
  };

  return {
    path,
    sha: body.content?.sha ?? sha,
    commitUrl: body.commit?.html_url,
  };
}

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

async function safeJson<T>(res: Response): Promise<T | unknown> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

/** Translate GitHub API status codes / messages into user-friendly text. */
export function humanizeError(status: number, err?: GitHubErrorResponse, path?: string): string {
  const where = path ? ` "${path}"` : '';
  const base = err?.message?.trim();

  switch (status) {
    case 401:
      return 'Invalid or expired token. Please re-enter your GitHub PAT.';
    case 403:
      if (base?.toLowerCase().includes('rate limit')) {
        return 'GitHub API rate limit reached. Wait a moment and try again.';
      }
      return 'Token lacks permission for this repository. Ensure it has "Contents" read & write access.';
    case 404:
      return `File or repository not found${where}. Check the repo path and branch.`;
    case 409:
      return `Conflict saving${where}. The file changed on GitHub — reload and try again.`;
    case 422:
      return base || `Validation error saving${where}.`;
    default:
      return base || `GitHub API error (${status})${where}.`;
  }
}
