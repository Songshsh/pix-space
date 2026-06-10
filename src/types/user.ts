import type { PaginatedData } from './http';
import type { UserRole } from './access';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface UserSearchForm {
  username: string;
  email: string;
  status: '' | 'active' | 'inactive';
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  status?: string;
}

export type UserListResponse = PaginatedData<User>;

export interface UserForm {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

export interface UpdateUserStatusPayload {
  status: User['status'];
}
