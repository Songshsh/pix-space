import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';
import ForgotPasswordView from './index.vue';
import { forgotPassword } from '../../../api/user';
import { useRouter } from 'vue-router';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../../../api/user', () => ({
  forgotPassword: vi.fn(),
}));

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal<typeof import('element-plus')>();
  return {
    ...actual,
    ElMessage: {
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
  };
});

describe('ForgotPasswordView.vue', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  it('submits email and shows success state', async () => {
    (forgotPassword as Mock).mockResolvedValueOnce(undefined);

    const wrapper = mount(ForgotPasswordView, {
      global: {
        stubs: {
          StarryBackground: {
            template: '<div class="starry-background"></div>',
          },
        },
      },
    });

    await wrapper
      .find('[data-testid="email-input"] input')
      .setValue('user@pixspace.test');
    await wrapper.find('[data-testid="submit-btn"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(forgotPassword).toHaveBeenCalledWith({
      email: 'user@pixspace.test',
    });
    expect(wrapper.text()).toContain('如果该邮箱已注册');
  });

  it('does not submit invalid email', async () => {
    const wrapper = mount(ForgotPasswordView, {
      global: {
        stubs: {
          StarryBackground: {
            template: '<div class="starry-background"></div>',
          },
        },
      },
    });

    await wrapper.find('[data-testid="email-input"] input').setValue('invalid');
    await wrapper.find('[data-testid="submit-btn"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(forgotPassword).not.toHaveBeenCalled();
    expect(wrapper.text()).not.toContain('如果该邮箱已注册');
  });

  it('shows request error and keeps form visible', async () => {
    (forgotPassword as Mock).mockRejectedValueOnce(
      new Error('网络异常，请检查网络')
    );

    const wrapper = mount(ForgotPasswordView, {
      global: {
        stubs: {
          StarryBackground: {
            template: '<div class="starry-background"></div>',
          },
        },
      },
    });

    await wrapper
      .find('[data-testid="email-input"] input')
      .setValue('user@pixspace.test');
    await wrapper.find('[data-testid="submit-btn"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const { ElMessage } = await import('element-plus');
    expect(ElMessage.error).toHaveBeenCalledWith('网络异常，请检查网络');
    expect(wrapper.text()).not.toContain('如果该邮箱已注册');
    expect(wrapper.find('[data-testid="submit-btn"]').exists()).toBe(true);
  });
});
