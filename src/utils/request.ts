import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useUserStore } from '../stores/user';
import { dispatchAuthExpired } from './auth';

import { NormalizedRequestError, type ApiEnvelope } from '../types/http';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const configuredApiBaseURL =
  (import.meta.env.VITE_APP_API_BASE_URL as string | undefined)?.trim() ||
  undefined;

if (!useMockData && !configuredApiBaseURL) {
  throw new Error('缺少 VITE_APP_API_BASE_URL，无法在真实后端模式下启动');
}

const apiBaseURL = useMockData ? '/api' : configuredApiBaseURL;

const baseConfig = {
  baseURL: apiBaseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

const request = axios.create(baseConfig);
export const requestRaw = axios.create(baseConfig);

let lastAuthExpiredAt = 0;

function normalizeError(error: unknown): NormalizedRequestError {
  const isAxiosErr = axios.isAxiosError(error);
  const err = isAxiosErr
    ? error
    : (error as {
        response?: { status?: number; data?: { message?: string } };
        code?: string;
        request?: unknown;
        message?: string;
        config?: InternalAxiosRequestConfig;
      });
  const status = err.response?.status;
  const data = isAxiosErr ? err.response?.data : err.response?.data;
  const businessCode =
    data !== null &&
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data, 'code') &&
    (typeof (data as { code?: unknown }).code === 'number' ||
      typeof (data as { code?: unknown }).code === 'string')
      ? String((data as { code?: number | string }).code)
      : undefined;
  const code = businessCode || err.code;
  const isTimeout = code === 'ECONNABORTED' || err.message?.includes('timeout');
  const isCanceled =
    (typeof axios.isCancel === 'function' && axios.isCancel(error)) ||
    code === 'ERR_CANCELED';
  const isNetworkError = !err.response && Boolean(err.request);
  const serverMessage =
    data !== null &&
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data, 'message') &&
    typeof (data as { message?: unknown }).message === 'string'
      ? String((data as { message?: unknown }).message || '')
      : '';
  const fallbackMessage = isCanceled
    ? '请求已取消'
    : isTimeout
      ? '请求超时，请检查网络'
      : isNetworkError
        ? '网络异常，请检查网络'
        : status === 401
          ? '未登录或登录已过期'
          : status === 403
            ? '没有访问该资源的权限'
            : status === 404
              ? '资源不存在'
              : status === 400
                ? '请求参数错误'
                : status !== undefined && status >= 500
                  ? '服务异常，请稍后重试'
                  : err.message || '请求失败';
  const message = serverMessage || fallbackMessage;

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

function isBusinessEnvelope(data: unknown): data is ApiEnvelope {
  return (
    data !== null &&
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data, 'code') &&
    typeof (data as ApiEnvelope).code === 'number' &&
    Object.prototype.hasOwnProperty.call(data, 'data')
  );
}

export function shouldNotifyError(
  config: InternalAxiosRequestConfig | undefined,
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
  const config = (error as { config?: InternalAxiosRequestConfig }).config;

  if (status === 401 && config?.skipAuthRedirect !== true) {
    if (shouldNotifyError(config, normalized)) {
      ElMessage.error(normalized.message);
    }
    const userStore = useUserStore();

    if (userStore.isLoggedIn) {
      const now = Date.now();
      if (now - lastAuthExpiredAt > 1000) {
        lastAuthExpiredAt = now;
        userStore.logout();
        dispatchAuthExpired();
      } else {
        userStore.logout();
      }
    }
    return Promise.reject(normalized);
  }

  if (status === 403) {
    if (shouldNotifyError(config, normalized)) {
      ElMessage.error(normalized.message);
    }
    return Promise.reject(normalized);
  }

  if (shouldNotifyError(config, normalized)) {
    ElMessage.error(normalized.message);
  }

  return Promise.reject(normalized);
}

function applyRequestInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
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
