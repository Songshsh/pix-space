import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type {
  LoginPayload,
  LoginResult,
  UserInfoResult,
  ChangePasswordForm,
} from '../types/auth';

export function login(data: LoginPayload) {
  return request.post('/auth/login', data) as Promise<LoginResult>;
}

export function logout(config?: AxiosRequestConfig) {
  return request.post('/auth/logout', null, config);
}

export function getUserInfo(config?: AxiosRequestConfig) {
  return request.get('/user/info', config) as Promise<UserInfoResult>;
}

export function updateUserProfile(data: Partial<UserInfoResult['user']>) {
  return request.put('/user/profile', data) as Promise<UserInfoResult['user']>;
}

export function changePassword(data: ChangePasswordForm) {
  return request.put('/user/password', data);
}
