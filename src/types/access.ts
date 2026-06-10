export type UserRole = 'admin' | 'user' | 'viewer';
export type PermissionRole = UserRole | UserRole[] | undefined;
