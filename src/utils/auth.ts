export const AUTH_EXPIRED_EVENT = 'pix-space:auth-expired';
export const DEFAULT_AUTH_REDIRECT = '/explore';

export function sanitizeRedirectPath(
  redirect: unknown,
  fallback = DEFAULT_AUTH_REDIRECT
): string {
  if (typeof redirect !== 'string') return fallback;
  if (!redirect.startsWith('/')) return fallback;
  if (redirect.startsWith('//')) return fallback;
  return redirect;
}

export function getCurrentRedirectPath(): string {
  if (typeof window === 'undefined') return DEFAULT_AUTH_REDIRECT;
  const { pathname, search, hash } = window.location;
  return sanitizeRedirectPath(`${pathname}${search}${hash}`);
}

export function dispatchAuthExpired(redirect = getCurrentRedirectPath()) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(AUTH_EXPIRED_EVENT, {
      detail: { redirect: sanitizeRedirectPath(redirect) },
    })
  );
}
