import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import LoginView from './index.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '../../../stores/user';
import { useRouter, useRoute } from 'vue-router';
import { login as loginApi } from '../../../api/user';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn(),
}));

vi.mock('../../../api/user', () => ({
  login: vi.fn(),
}));

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal<typeof import('element-plus')>();
  return {
    ...actual,
    ElMessage: {
      warning: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
    },
  };
});

// Mock import.meta.env
vi.stubEnv('VITE_APP_API_BASE_URL', 'http://localhost:3000');
vi.stubEnv('VITE_ALLOW_MOCK_AUTH', 'false');

import type { Mock } from 'vitest';

describe('LoginView.vue', () => {
  let wrapper: VueWrapper;
  let mockRouter: { push: Mock };
  let mockRoute: {
    query: {
      redirect?: string;
      registered?: string;
    };
  };
  type LoginFormStubThis = {
    email: string;
    password: string;
    $emit: (
      event: 'login' | 'forgot-password' | 'register' | 'browse-as-guest',
      payload?: { email: string; password: string }
    ) => void;
  };

  const LoginFormStub = {
    props: ['isLoggingIn'],
    emits: ['login', 'forgot-password', 'register', 'browse-as-guest'],
    data(): { email: string; password: string } {
      return { email: '', password: '' };
    },
    methods: {
      onSubmit(this: LoginFormStubThis) {
        if (!this.email || !this.password) return;
        this.$emit('login', {
          email: this.email,
          password: this.password,
        });
      },
    },
    template:
      '<form class="login-form" @submit.prevent="onSubmit"><input v-model="email" type="email" /><input v-model="password" type="password" /><button class="login-btn" type="submit">登录</button><button class="guest-btn" type="button" @click="$emit(\'browse-as-guest\')">游客浏览</button><button class="forgot-btn" type="button" @click="$emit(\'forgot-password\')">忘记密码</button><button class="register-btn" type="button" @click="$emit(\'register\')">立即注册</button></form>',
  };

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
          Loading: true,
          Promotion: true,
          LoginForm: LoginFormStub,
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

  it('does not submit when email or password is empty', async () => {
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(loginApi).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('calls login API and redirects on success', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    (loginApi as Mock).mockResolvedValueOnce({
      user: {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
      },
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
    expect(userStore.login).toHaveBeenCalledWith({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/explore');
  });

  it('logs error on login failure', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('wrongpassword');

    const error = new Error('Invalid credentials');
    (loginApi as Mock).mockRejectedValueOnce(error);

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 0));

    const { ElMessage } = await import('element-plus');
    expect(ElMessage.error).toHaveBeenCalledWith('Invalid credentials');
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('does not redirect when loginApi fails', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('mock@example.com');
    await passwordInput.setValue('password123');

    const error = new Error('Network Error');
    (loginApi as Mock).mockRejectedValueOnce(error);

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loginApi).toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('navigates to forgot password page', async () => {
    await wrapper.find('.forgot-btn').trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/forgot-password');
  });

  it('navigates to register page', async () => {
    await wrapper.find('.register-btn').trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/register');
  });

  it('navigates to explore when browsing as guest', async () => {
    await wrapper.find('.guest-btn').trigger('click');

    expect(mockRouter.push).toHaveBeenCalledWith('/explore');
  });

  it('shows register success message without prefilling email', async () => {
    mockRoute.query = {
      registered: '1',
    };

    wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Loading: true,
          Promotion: true,
          LoginForm: LoginFormStub,
          StarryBackground: {
            template: '<div class="starry-background"></div>',
            methods: {
              triggerBurst: vi.fn(),
            },
          },
        },
      },
    });

    const { ElMessage } = await import('element-plus');
    expect(ElMessage.success).toHaveBeenCalledWith(
      '注册成功，请使用新账号登录'
    );
    expect(
      (wrapper.find('input[type="email"]').element as HTMLInputElement).value
    ).toBe('');
  });
});
