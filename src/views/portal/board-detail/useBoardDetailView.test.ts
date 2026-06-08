import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBoardDetailView } from './useBoardDetailView';

const { getBoardDetail, mockPush, mockBack } = vi.hoisted(() => ({
  getBoardDetail: vi.fn(),
  mockPush: vi.fn(),
  mockBack: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ params: { id: '1' } })),
  useRouter: vi.fn(() => ({ push: mockPush, back: mockBack })),
}));

vi.mock('../../../api/boards', () => ({
  getBoardDetail,
}));

describe('useBoardDetailView', () => {
  const Harness = defineComponent({
    setup() {
      return useBoardDetailView();
    },
    template: '<div />',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    getBoardDetail.mockResolvedValue({
      id: '1',
      title: 'Board',
      description: '',
      imageCount: 1,
      visibility: 'public',
      owner: { id: 101, username: 'Username' },
      canEdit: false,
      images: [],
    });
  });

  it('navigates back to user boards with owner id', async () => {
    const wrapper = mount(Harness);
    const vm = wrapper.vm as unknown as ReturnType<typeof useBoardDetailView>;

    await Promise.resolve();
    await Promise.resolve();

    vm.goBack();

    expect(mockPush).toHaveBeenCalledWith({ path: '/u/101/boards' });
  });
});
