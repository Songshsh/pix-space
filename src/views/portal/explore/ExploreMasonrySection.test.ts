import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ExploreMasonrySection from './ExploreMasonrySection.vue';

const item = {
  id: 'img-1',
  title: '灵感素材 1',
  imageHeight: 300,
  bgColor: 'var(--el-color-primary-light-9)',
  tags: ['UI设计'],
  author: {
    id: 101,
    username: 'Pix',
  },
};

describe('ExploreMasonrySection', () => {
  it('emits author-click without triggering preview', async () => {
    const wrapper = mount(ExploreMasonrySection, {
      props: {
        items: [item],
        state: 'success',
        relatedSearches: [],
      },
      global: {
        stubs: {
          ElButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    });

    await wrapper.find('.masonry-card-footer-left').trigger('click');

    expect(wrapper.emitted('author-click')).toEqual([[101]]);
    expect(wrapper.emitted('open-preview')).toBeFalsy();
  });
});
