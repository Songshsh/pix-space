export interface User {
  id: number | null;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  password?: string;
}

export interface UserSearchForm {
  username: string;
  email: string;
  status: string;
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

export interface UserListResponse {
  list: User[];
  total: number;
}

export interface UserForm {
  id: number | null;
  username: string;
  email: string;
  password?: string;
  role: string;
  status: 'active' | 'inactive';
}
