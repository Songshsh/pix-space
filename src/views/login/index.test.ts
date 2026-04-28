import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import LoginView from './index.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '../../stores/user';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login as loginApi } from '../../api/user';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn(),
}));

vi.mock('../../api/user', () => ({
  login: vi.fn(),
}));

vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
  ElIcon: { template: '<i class="el-icon"><slot /></i>' },
}));

// Mock import.meta.env
vi.stubEnv('VITE_APP_API_BASE_URL', 'http://localhost:3000');
vi.stubEnv('VITE_ALLOW_MOCK_AUTH', 'false');

import type { Mock } from 'vitest';

describe('LoginView.vue', () => {
  let wrapper: VueWrapper;
  let mockRouter: { push: Mock };
  let mockRoute: { query: { redirect?: string } };

  beforeEach(() => {
    vi.clearAllMocks();

    mockRouter = {
      push: vi.fn(),
    };

    mockRoute = {
      query: {},
    };

    (useRouter as Mock).mockReturnValue(mockRouter);
    (useRoute as Mock).mockReturnValue(mockRoute);

    wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          'el-icon': { template: '<i class="el-icon"><slot /></i>' },
          Loading: true,
          Promotion: true,
          StarryBackground: {
            template: '<div class="starry-background"></div>',
            methods: {
              triggerBurst: vi.fn(),
            },
          },
        },
      },
    });
  });

  it('renders login form correctly', () => {
    expect(wrapper.find('.login-page').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('.login-btn').exists()).toBe(true);
  });

  it('shows warning when email or password is empty', async () => {
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(ElMessage.warning).toHaveBeenCalledWith('请填写邮箱和密码');
    expect(loginApi).not.toHaveBeenCalled();
  });

  it('calls login API and redirects on success', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    (loginApi as Mock).mockResolvedValueOnce({
      token: 'fake-token',
      user: { name: 'Admin', email: 'admin@example.com' },
    });

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(loginApi).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    // We have to wait for the promise to resolve inside handleLogin
    await new Promise((resolve) => setTimeout(resolve, 0));

    const userStore = useUserStore();
    expect(userStore.login).toHaveBeenCalledWith(
      { name: 'Admin', email: 'admin@example.com' },
      'fake-token'
    );
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/dashboard');
  });

  it('logs error on login failure', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('wrongpassword');

    const error = new Error('Invalid credentials');
    (loginApi as Mock).mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalledWith('Login failed', error);
    expect(mockRouter.push).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('uses mock login when loginApi fails and mock auth is enabled', async () => {
    wrapper.unmount();
    vi.stubEnv('VITE_ALLOW_MOCK_AUTH', 'true');

    wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          'el-icon': { template: '<i class="el-icon"><slot /></i>' },
          Loading: true,
          Promotion: true,
          StarryBackground: {
            template: '<div class="starry-background"></div>',
            methods: {
              triggerBurst: vi.fn(),
            },
          },
        },
      },
    });

    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('mock@example.com');
    await passwordInput.setValue('password123');

    const error = new Error('Network Error');
    (loginApi as Mock).mockRejectedValueOnce(error);

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 0));

    const userStore = useUserStore();
    expect(loginApi).toHaveBeenCalled();
    const loginCalls = (userStore.login as unknown as Mock).mock.calls;
    expect(loginCalls.length).toBeGreaterThan(0);
    expect(loginCalls[0][0]).toMatchObject({
      name: 'mock',
      email: 'mock@example.com',
      role: 'user',
    });
    expect(String(loginCalls[0][1])).toMatch(/^mock\./);
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/dashboard');
  });
});
