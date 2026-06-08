import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ImageDetailSidebar from './ImageDetailSidebar.vue';

describe('ImageDetailSidebar', () => {
  it('emits authorClick when author id exists', async () => {
    const wrapper = mount(ImageDetailSidebar, {
      props: {
        imageDetail: {
          id: 'img-1',
          title: 'Image',
          createdAt: '2026-05-29',
          tags: [],
          author: { id: 101, username: 'Pix' },
          isLiked: false,
          source: 'explore',
        },
        imageMetaData: {
          dimensions: '100 x 100 px',
          format: 'PNG',
          size: '1 MB',
        },
        collecting: false,
        downloading: false,
        liking: false,
      },
      global: {
        stubs: {
          ElButton: true,
        },
      },
    });

    await wrapper.find('.author-info').trigger('click');

    expect(wrapper.emitted('authorClick')).toEqual([[]]);
  });
});
