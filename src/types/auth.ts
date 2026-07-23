import type { UserRole } from './access';

export interface AuthUser {
  id?: number;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthSessionResult {
  user: AuthUser;
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
}

export interface UserPreferences {
  twoFactorEnabled: boolean;
  notifications: {
    system: boolean;
    email: boolean;
    upload: boolean;
    comment: boolean;
  };
}
