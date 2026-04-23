import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';
import { useUserStore } from '../stores/user';

import { NormalizedRequestError } from '../types/http';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const apiBaseURL = useMockData
  ? '/api'
  : (import.meta.env.VITE_APP_API_BASE_URL as string | undefined) || undefined;

const baseConfig = {
  baseURL: apiBaseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const request = axios.create(baseConfig);
export const requestRaw = axios.create(baseConfig);

let isHandlingUnauthorized = false;

function normalizeError(error: unknown): NormalizedRequestError {
  const err = error as {
    response?: { status?: number; data?: { message?: string } };
    code?: string;
    request?: unknown;
    message?: string;
    config?: InternalAxiosRequestConfig;
  };
  const status = err.response?.status || 0;
  const code = err.code;
  const data = err.response?.data;
  const isTimeout = code === 'ECONNABORTED' || err.message?.includes('timeout');
  const isCanceled =
    (typeof axios.isCancel === 'function' && axios.isCancel(err)) ||
    code === 'ERR_CANCELED';
  const isNetworkError = !err.response && Boolean(err.request);
  const message =
    data?.message ||
    (status === 401
      ? '未登录或登录已过期'
      : status >= 500
        ? '服务异常，请稍后重试'
        : isCanceled
          ? '请求已取消'
          : isTimeout
            ? '请求超时，请检查网络'
            : isNetworkError
              ? '网络异常，请检查网络'
              : err.message || '请求失败');

  return {
    status,
    code,
    message,
    data,
    isTimeout: Boolean(isTimeout),
    isNetworkError: Boolean(isNetworkError),
    isCanceled: Boolean(isCanceled),
    originalError: error,
  };
}

function isBusinessEnvelope(data: unknown): boolean {
  return (
    data !== null &&
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data, 'code') &&
    Object.prototype.hasOwnProperty.call(data, 'data')
  );
}

export function shouldNotifyError(
  config:
    | (InternalAxiosRequestConfig & {
        silentError?: boolean;
        notifyError?: boolean;
      })
    | undefined,
  normalized: NormalizedRequestError
): boolean {
  return (
    normalized.isCanceled !== true &&
    config?.silentError !== true &&
    (config?.notifyError === true || config?.method?.toLowerCase() !== 'get')
  );
}

function handleError(error: unknown): Promise<never> {
  const normalized = normalizeError(error);
  const status = normalized.status;

  if (status === 401) {
    const userStore = useUserStore();
    userStore.logout();

    if (!isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      const currentRoute = router.currentRoute.value;
      if (currentRoute.path !== '/login') {
        const redirect = currentRoute.fullPath;
        Promise.resolve(
          router.push({ path: '/login', query: { redirect } })
        ).finally(() => {
          isHandlingUnauthorized = false;
        });
      } else {
        isHandlingUnauthorized = false;
      }
    }
  } else if (status === 403) {
    // 权限不足
    ElMessage.error('没有访问该资源的权限');
    return Promise.reject(normalized);
  }

  const config = (error as { config?: InternalAxiosRequestConfig }).config;
  if (shouldNotifyError(config, normalized)) {
    ElMessage.error(normalized.message);
  }

  return Promise.reject(normalized);
}

function applyRequestInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const userStore = useUserStore();
      const token = userStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const isFormData =
        typeof FormData !== 'undefined' && config.data instanceof FormData;
      if (isFormData) {
        const headers = config.headers;
        if (headers?.delete && typeof headers.delete === 'function') {
          headers.delete('Content-Type');
        } else if (headers) {
          delete headers['Content-Type'];
          delete headers['content-type'];
        }
      }

      return config;
    },
    (error: unknown) => Promise.reject(error)
  );
}

function applyResponseInterceptors(
  instance: AxiosInstance,
  { unwrapData }: { unwrapData: boolean }
) {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (!unwrapData) return response;

      const data = response.data;
      if (isBusinessEnvelope(data)) {
        if (data.code === 0) return data.data;

        const businessError = new Error(data.message || '请求失败') as Error & {
          response?: { status: number; data: unknown };
          code?: string;
          config?: InternalAxiosRequestConfig;
        };
        businessError.response = { status: response.status, data };
        businessError.code = String(data.code);
        businessError.config = response.config;
        return handleError(businessError);
      }

      return data;
    },
    (error: unknown) => handleError(error)
  );
}

applyRequestInterceptors(request);
applyRequestInterceptors(requestRaw);
applyResponseInterceptors(request, { unwrapData: true });
applyResponseInterceptors(requestRaw, { unwrapData: false });

export default request;
