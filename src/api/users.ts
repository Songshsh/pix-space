import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type {
  User,
  UserForm,
  UserListParams,
  UserListResponse,
  UpdateUserStatusPayload,
} from '../types/user';

export function getUserList(
  params: UserListParams,
  config?: AxiosRequestConfig
): Promise<UserListResponse> {
  return request.get('/users', {
    params,
    silentError: true,
    ...config,
  }) as Promise<UserListResponse>;
}

export function createUser(
  data: UserForm,
  config?: AxiosRequestConfig
): Promise<User> {
  return request.post('/users', data, config);
}

export function updateUser(
  id: string | number,
  data: UserForm,
  config?: AxiosRequestConfig
): Promise<User> {
  return request.put(`/users/${id}`, data, config);
}

export function deleteUser(
  id: string | number,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.delete(`/users/${id}`, config);
}

export function updateUserStatus(
  id: string | number,
  data: UpdateUserStatusPayload,
  config?: AxiosRequestConfig
): Promise<User> {
  return request.patch(`/users/${id}/status`, data, config);
}
