import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '../stores/user';

import type { InternalAxiosRequestConfig } from 'axios';
import request from './request';
import { AUTH_EXPIRED_EVENT } from './auth';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('request', () => {
  it('uses credentials for authenticated requests', async () => {
    let withCredentials: unknown;

    const result = await request.get('/ping', {
      adapter: async (config: unknown) => {
        withCredentials = (config as InternalAxiosRequestConfig)
          .withCredentials;
        return {
          data: { code: 0, data: { ok: true } },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config as InternalAxiosRequestConfig,
        };
      },
    });

    expect(withCredentials).toBe(true);
    expect(result).toEqual({ ok: true });
  });

  it('logs out and redirects on 401', async () => {
    const userStore = useUserStore();
    userStore.login({
      id: 1,
      username: 'Bob',
      email: 'b@c.com',
      role: 'admin',
    });
    window.history.pushState({}, '', '/admin/dashboard');
    let eventRedirect = '';
    const listener = (event: Event) => {
      eventRedirect = String((event as CustomEvent).detail?.redirect || '');
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, listener);

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

    window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
    expect(userStore.isLoggedIn).toBe(false);
    expect(eventRedirect).toBe('/admin/dashboard');
  });
});
