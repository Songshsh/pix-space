import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '../stores/user';

vi.mock('../router', () => ({
  default: {
    currentRoute: { value: { path: '/dashboard', fullPath: '/dashboard' } },
    push: vi.fn(() => Promise.resolve()),
  },
}));

import type { Mock } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';
import router from '../router';
import request from './request';

beforeEach(() => {
  (router.push as Mock).mockClear?.();
  setActivePinia(createPinia());
});

describe('request', () => {
  it('attaches Authorization header from user store token', async () => {
    const userStore = useUserStore();
    userStore.login({ name: 'Bob', email: 'b@c.com' }, 't2');
    let authorization: unknown;

    const result = await request.get('/ping', {
      adapter: async (config: unknown) => {
        authorization = (config as InternalAxiosRequestConfig).headers
          ?.Authorization;
        return {
          data: { code: 0, data: { ok: true } },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config as InternalAxiosRequestConfig,
        };
      },
    });

    expect(authorization).toBe('Bearer t2');
    expect(result).toEqual({ ok: true });
  });

  it('logs out and redirects on 401', async () => {
    const userStore = useUserStore();
    userStore.login({ name: 'Bob', email: 'b@c.com' }, 't3');

    await expect(
      request.get('/ping', {
        adapter: async (config: unknown) => {
          const error = new Error('Unauthorized') as Error & {
            response?: { status: number; data: { message: string } };
            config?: InternalAxiosRequestConfig;
            request?: unknown;
          };
          error.response = { status: 401, data: { message: 'Unauthorized' } };
          error.config = config as InternalAxiosRequestConfig;
          error.request = {};
          throw error;
        },
      })
    ).rejects.toMatchObject({ status: 401 });

    expect(userStore.isLoggedIn).toBe(false);
    expect(router.push).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/dashboard' },
    });
  });
});
