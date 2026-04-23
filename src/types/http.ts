import { AxiosRequestConfig } from 'axios';

// 扩展 AxiosRequestConfig 类型，支持自定义配置项
declare module 'axios' {
  export interface AxiosRequestConfig {
    silentError?: boolean;
    notifyError?: boolean;
  }
}

export type { AxiosRequestConfig };

export interface User {
  email: string;
  role: string; // e.g. 'admin', 'user'
}

export interface ApiResponse<T = unknown> {
  code: number; // 0 indicates success
  message: string; // Error or success message
  data: T; // The payload
}

export interface PaginatedData<T = unknown> {
  list: T[]; // Items for the current page
  total: number; // Total number of items
}

export interface ApiEnvelope<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface ApiListResult<T = unknown> {
  list: T[];
  total: number;
}

export interface NormalizedRequestError {
  status?: number;
  code?: string | number;
  message: string;
  data?: unknown;
  isTimeout: boolean;
  isNetworkError: boolean;
  isCanceled: boolean;
  originalError: unknown;
}
