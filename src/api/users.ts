import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type {
  User,
  UserForm,
  UserListParams,
  UserListResponse,
} from '../types/user';

export function getUserList(
  params?: UserListParams,
  config?: AxiosRequestConfig
): Promise<UserListResponse> {
  return request.get('/users', { params, ...config });
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

export function deleteUser(id: string | number, config?: AxiosRequestConfig) {
  return request.delete(`/users/${id}`, config);
}
