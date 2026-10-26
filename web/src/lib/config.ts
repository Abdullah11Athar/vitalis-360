export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/kaggle/project';

/**
 * Prepends the application base path to asset and image URLs.
 */
export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!BASE_PATH || BASE_PATH === '') return cleanPath;
  const base = BASE_PATH.replace(/\/$/, '');
  return `${base}${cleanPath}`;
}

/**
 * Prepends the application base path to browser API fetch URLs.
 */
export function getApiPath(path: string): string {
  return getAssetPath(path);
}
