import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useLogout } from './useLogout';

const { logoutApi, mockPush, mockReplace, mockUseRoute } = vi.hoisted(() => ({
  logoutApi: vi.fn(),
  mockPush: vi.fn(),
  mockReplace: vi.fn(),
  mockUseRoute: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
  useRoute: mockUseRoute,
}));

vi.mock('../api/user', () => ({
  logout: logoutApi,
}));

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal<typeof import('element-plus')>();
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
    },
  };
});

describe('useLogout', () => {
  const Harness = defineComponent({
    setup() {
      return useLogout();
    },
    template: '<div />',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRoute.mockReturnValue({
      path: '/image/123',
      fullPath: '/image/123?tab=comments',
    });
    logoutApi.mockResolvedValue(undefined);
  });

  it('redirects to login without carrying current page by default', async () => {
    const wrapper = mount(Harness, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    const vm = wrapper.vm as unknown as ReturnType<typeof useLogout>;

    await vm.logout();

    expect(logoutApi).toHaveBeenCalledWith({
      silentError: true,
      skipAuthRedirect: true,
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('keeps explicit redirectPath when provided', async () => {
    const wrapper = mount(Harness, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    const vm = wrapper.vm as unknown as ReturnType<typeof useLogout>;

    await vm.logout({
      redirectPath: '/login',
      replace: true,
    });

    expect(mockReplace).toHaveBeenCalledWith('/login');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
