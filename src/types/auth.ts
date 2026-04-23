export interface AuthUser {
  name: string;
  email: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface UserInfoResult {
  user: AuthUser;
}

export interface ChangePasswordForm {
  oldPassword?: string;
  newPassword?: string;
  [key: string]: unknown;
}
