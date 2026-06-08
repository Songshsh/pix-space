import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserBoardsView } from './useUserBoardsView';

const api = vi.hoisted(() => ({
  getUserBoardsSummary: vi.fn(),
  getUserBoardsPage: vi.fn(),
  getUserUploadsPage: vi.fn(),
  getUserLikesPage: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ params: { userId: '101' } })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock('../../../api/user-boards', () => api);

describe('useUserBoardsView', () => {
  const Harness = defineComponent({
    setup() {
      return useUserBoardsView();
    },
    template: '<div />',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    api.getUserBoardsSummary.mockResolvedValue({
      profile: { id: 101, username: 'user', bio: '' },
      stats: { publicBoards: 2, publicUploads: 3, likes: 4 },
    });
    api.getUserBoardsPage.mockResolvedValue({
      list: [
        {
          id: '1',
          title: 'Board',
          description: '',
          imageCount: 1,
          visibility: 'public',
          covers: [],
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
      hasMore: false,
    });
    api.getUserUploadsPage.mockResolvedValue({
      list: [],
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    });
    api.getUserLikesPage.mockResolvedValue({
      list: [],
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: false,
    });
  });

  it('loads summary and current tab first page only', async () => {
    const wrapper = mount(Harness);
    const vm = wrapper.vm as unknown as ReturnType<typeof useUserBoardsView>;

    await Promise.resolve();
    await Promise.resolve();
    await nextTick();

    expect(api.getUserBoardsSummary).toHaveBeenCalledWith(101, {
      silentError: true,
    });
    expect(api.getUserBoardsPage).toHaveBeenCalledWith(
      101,
      { page: 1, pageSize: 20 },
      { silentError: true }
    );
    expect(api.getUserUploadsPage).not.toHaveBeenCalled();
    expect(vm.boardsState.items).toHaveLength(1);
  });
});
