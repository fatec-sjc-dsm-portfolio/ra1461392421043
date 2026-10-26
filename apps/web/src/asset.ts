/** Resolves a site path like "/images/x.jpg" against Vite's base URL (so builds with a relative base still work). */
export function asset(path: string): string;
export function asset(path: string | undefined): string | undefined;
export function asset(path?: string) {
  if (!path || /^(https?:|data:)/.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
