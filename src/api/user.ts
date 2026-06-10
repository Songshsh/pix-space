import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type {
  LoginPayload,
  ForgotPasswordPayload,
  RegisterPayload,
  AuthSessionResult,
  ChangePasswordForm,
  UserPreferences,
} from '../types/auth';

export function login(data: LoginPayload) {
  return request.post('/auth/login', data, {
    skipAuthRedirect: true,
  }) as Promise<AuthSessionResult>;
}

export function forgotPassword(data: ForgotPasswordPayload) {
  return request.post('/auth/forgot-password', data, {
    skipAuthRedirect: true,
  }) as Promise<boolean>;
}

export function register(data: RegisterPayload) {
  return request.post('/auth/register', data, {
    skipAuthRedirect: true,
  }) as Promise<boolean>;
}

export function logout(config?: AxiosRequestConfig): Promise<boolean> {
  return request.post('/auth/logout', null, config);
}

export function getSession(config?: AxiosRequestConfig) {
  return request.get('/auth/session', {
    silentError: true,
    skipAuthRedirect: true,
    ...config,
  }) as Promise<AuthSessionResult>;
}

export function updateUserProfile(
  data: Partial<AuthSessionResult['user']>,
  config?: AxiosRequestConfig
): Promise<AuthSessionResult['user']> {
  return request.put('/user/profile', data, config) as Promise<
    AuthSessionResult['user']
  >;
}

export function getUserPreferences(config?: AxiosRequestConfig) {
  return request.get('/user/preferences', config) as Promise<UserPreferences>;
}

export function updateUserPreferences(
  data: Partial<UserPreferences>,
  config?: AxiosRequestConfig
) {
  return request.put(
    '/user/preferences',
    data,
    config
  ) as Promise<UserPreferences>;
}

export function deleteUserAccount(
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.delete('/user/account', config);
}

export function changePassword(
  data: ChangePasswordForm,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.put('/user/password', data, config);
}
