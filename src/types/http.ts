declare module 'axios' {
  export interface AxiosRequestConfig {
    silentError?: boolean;
    notifyError?: boolean;
    skipAuthRedirect?: boolean;
  }
}

export interface ApiEnvelope<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedData<T = unknown> {
  list: T[];
  total: number;
}

export interface NormalizedRequestError {
  status?: number;
  code?: string;
  message: string;
  data?: unknown;
  isTimeout: boolean;
  isNetworkError: boolean;
  isCanceled: boolean;
  originalError: unknown;
}
