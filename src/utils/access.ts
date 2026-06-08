export type UserRole = 'admin' | 'user' | 'viewer';
export type PermissionRole = UserRole | UserRole[] | undefined;

const VALID_ROLES: Set<string> = new Set<UserRole>(['admin', 'user', 'viewer']);
export const ADMIN_ACCESS_ROLES: UserRole[] = ['admin'];

export function normalizeRole(input?: string): UserRole | undefined {
  const role = (input || '').trim().toLowerCase();
  if (!role) return undefined;
  if (VALID_ROLES.has(role)) return role as UserRole;
  return undefined;
}

export function canAccess(
  allowedRoles: UserRole[] | undefined,
  userRole?: string
): boolean {
  if (!Array.isArray(allowedRoles)) return true;
  if (allowedRoles.length === 0) return false;
  const normalized = normalizeRole(userRole);
  if (!normalized) return false;
  return allowedRoles.includes(normalized);
}

export function canAccessAdmin(userRole?: string): boolean {
  return canAccess(ADMIN_ACCESS_ROLES, userRole);
}

export function hasPermission(
  requiredRoles: PermissionRole,
  userRole?: string
): boolean {
  if (!requiredRoles) return true;
  return canAccess(
    Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles],
    userRole
  );
}
