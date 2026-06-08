import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UserBoardsPage from './index.vue';

vi.mock('./useUserBoardsView', () => ({
  useUserBoardsView: () => ({
    activeTab: 'boards',
    userId: 101,
    profile: { id: 101, username: 'user', bio: '' },
    stats: [
      { value: 1, label: '公开画板' },
      { value: 2, label: '公开图片' },
      { value: 3, label: '赞过' },
    ],
    uploadsSearch: '',
    likesSearch: '',
    uploadsSort: '最新',
    summaryLoading: false,
    summaryError: null,
    boardsState: {
      items: [],
      loading: false,
      loadingMore: false,
      hasMore: false,
      error: null,
    },
    uploadsState: {
      items: [],
      loading: false,
      loadingMore: false,
      hasMore: false,
      error: null,
    },
    likesState: {
      items: [],
      loading: false,
      loadingMore: false,
      hasMore: false,
      error: null,
    },
    viewState: 'empty',
    activeCountText: '',
    stateTitle: '暂无画板',
    stateDesc: '创建你的第一个画板',
    stateIcon: '🗂️',
    showStatePrimaryAction: true,
    statePrimaryActionText: '新建画板',
    loadOverview: vi.fn(),
    handleRetry: vi.fn(),
    handleUploadsSortCommand: vi.fn(),
    handleStatePrimaryAction: vi.fn(),
    goBoard: vi.fn(),
    goImageDetail: vi.fn(),
    loadMoreBoards: vi.fn(),
    loadMoreUploads: vi.fn(),
    loadMoreLikes: vi.fn(),
    reloadUploads: vi.fn(),
    reloadLikes: vi.fn(),
    getUploadStatusText: vi.fn(),
    getBoardVisibilityText: vi.fn(() => '公开'),
  }),
}));

vi.mock('./useUserBoardsActions', () => ({
  useUserBoardsActions: () => ({
    boardPickerVisible: false,
    boardPickerLoading: false,
    boardPickerBoards: [],
    selectedBoardId: '',
    handleBoardPickerConfirm: vi.fn(),
    handleBoardPickerCancel: vi.fn(),
    dialogVisible: false,
    dialogMode: 'create',
    dialogSubmitting: false,
    dialogForm: { name: '', description: '', visibility: 'public' },
    handleCreateBoard: vi.fn(),
    handleDialogConfirm: vi.fn(),
    handleBoardCommand: vi.fn(),
    handleUploadCommand: vi.fn(),
    handleLikeCommand: vi.fn(),
  }),
}));

describe('UserBoardsPage', () => {
  it('renders profile and boards tab with summary state', () => {
    const wrapper = mount(UserBoardsPage, {
      global: {
        stubs: {
          ElButton: true,
          ElDropdown: true,
          ElDropdownMenu: true,
          ElDropdownItem: true,
          ElInput: true,
          ElAvatar: true,
        },
      },
    });
    expect(wrapper.text()).toContain('user');
  });
});
