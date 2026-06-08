import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ForbiddenView from './index.vue';

const mockPush = vi.fn();
const mockUseRoute = vi.fn();
const mockUseUserStore = vi.fn();
const mockCanAccessAdmin = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockUseRoute(),
}));

vi.mock('../../../stores/user', () => ({
  useUserStore: () => mockUseUserStore(),
}));

vi.mock('../../../utils/access', () => ({
  canAccessAdmin: (...args: unknown[]) => mockCanAccessAdmin(...args),
}));

const StarryStatusPageStub = {
  emits: ['back'],
  template:
    '<button class="back-button" type="button" @click="$emit(\'back\')">返回首页</button>',
};

describe('ForbiddenView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRoute.mockReturnValue({
      query: { from: '/admin/dashboard' },
    });
    mockUseUserStore.mockReturnValue({
      isAuthenticated: true,
      role: 'viewer',
    });
    mockCanAccessAdmin.mockReturnValue(false);
  });

  it('returns to explore for forbidden admin route', async () => {
    const wrapper = mount(ForbiddenView, {
      global: {
        stubs: {
          StarryStatusPage: StarryStatusPageStub,
        },
      },
    });

    await wrapper.find('.back-button').trigger('click');

    expect(mockPush).toHaveBeenCalledWith('/explore');
  });
});
