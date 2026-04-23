export type UserRole = 'admin' | 'user' | 'viewer';

export function normalizeRole(input?: string): UserRole {
  const role = (input || '').trim();
  if (role === '管理员' || role === 'admin') return 'admin';
  if (role === '访客' || role === 'viewer') return 'viewer';
  return 'user';
}

export function canAccess(allowedRoles: unknown, userRole?: string): boolean {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return true;
  const normalized = normalizeRole(userRole);
  return allowedRoles.includes(normalized);
}
