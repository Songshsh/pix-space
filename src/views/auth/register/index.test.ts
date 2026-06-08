import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';
import RegisterView from './index.vue';
import { register } from '../../../api/user';
import { useRouter } from 'vue-router';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../../../api/user', () => ({
  register: vi.fn(),
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

describe('RegisterView.vue', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mountView = () =>
    mount(RegisterView, {
      global: {
        stubs: {
          StarryBackground: {
            template: '<div class="starry-background"></div>',
          },
        },
      },
    });

  const fillValidForm = async (wrapper: ReturnType<typeof mount>) => {
    await wrapper
      .find('[data-testid="name-input"] input')
      .setValue('Pixel User');
    await wrapper
      .find('[data-testid="email-input"] input')
      .setValue('user@example.com');
    await wrapper
      .find('[data-testid="password-input"] input')
      .setValue('User123!');
    await wrapper
      .find('[data-testid="confirm-password-input"] input')
      .setValue('User123!');
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  it('submits register form and redirects to login', async () => {
    (register as Mock).mockResolvedValueOnce(undefined);

    const wrapper = mountView();
    await fillValidForm(wrapper);
    await wrapper.find('[data-testid="submit-btn"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(register).toHaveBeenCalledWith({
      name: 'Pixel User',
      email: 'user@example.com',
      password: 'User123!',
    });
    expect(mockRouter.push).toHaveBeenCalledWith({
      path: '/login',
      query: {
        registered: '1',
      },
    });
  });

  it('does not submit invalid email', async () => {
    const wrapper = mountView();

    await wrapper
      .find('[data-testid="name-input"] input')
      .setValue('Pixel User');
    await wrapper.find('[data-testid="email-input"] input').setValue('invalid');
    await wrapper
      .find('[data-testid="password-input"] input')
      .setValue('User123!');
    await wrapper
      .find('[data-testid="confirm-password-input"] input')
      .setValue('User123!');
    await wrapper.find('[data-testid="submit-btn"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(register).not.toHaveBeenCalled();
  });

  it('does not submit when confirm password mismatches', async () => {
    const wrapper = mountView();

    await wrapper
      .find('[data-testid="name-input"] input')
      .setValue('Pixel User');
    await wrapper
      .find('[data-testid="email-input"] input')
      .setValue('user@example.com');
    await wrapper
      .find('[data-testid="password-input"] input')
      .setValue('User123!');
    await wrapper
      .find('[data-testid="confirm-password-input"] input')
      .setValue('User123!x');
    await wrapper.find('[data-testid="submit-btn"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(register).not.toHaveBeenCalled();
  });

  it('shows request error and keeps form visible', async () => {
    (register as Mock).mockRejectedValueOnce(new Error('该邮箱已被注册'));

    const wrapper = mountView();
    await fillValidForm(wrapper);
    await wrapper.find('[data-testid="submit-btn"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const { ElMessage } = await import('element-plus');
    expect(ElMessage.error).toHaveBeenCalledWith('该邮箱已被注册');
    expect(wrapper.find('[data-testid="submit-btn"]').exists()).toBe(true);
    expect(mockRouter.push).not.toHaveBeenCalledWith({
      path: '/login',
      query: {
        registered: '1',
      },
    });
  });
});
