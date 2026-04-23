import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import FileToolbar from './FileToolbar.vue';

describe('FileToolbar.vue', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(FileToolbar, {
      global: {
        stubs: {
          'el-card': { template: '<div class="el-card"><slot /></div>' },
          'el-button': {
            template:
              '<button class="el-button" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
            props: ['disabled', 'type'],
          },
          'el-button-group': {
            template: '<div class="el-button-group"><slot /></div>',
          },
          'el-icon': { template: '<i class="el-icon"><slot /></i>' },
          'el-input': {
            template:
              '<input class="el-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue'],
          },
          Upload: true,
          FolderAdd: true,
          Delete: true,
          Search: true,
          Grid: true,
          List: true,
        },
      },
      props: {
        searchKeyword: '',
        viewMode: 'grid',
        selectedCount: 0,
        canEdit: true,
      },
    });
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.toolbar').exists()).toBe(true);
  });

  it('emits upload event when upload button is clicked', async () => {
    const uploadBtn = wrapper.findAll('.el-button')[0];
    await uploadBtn.trigger('click');
    expect(wrapper.emitted('upload')).toBeTruthy();
  });

  it('emits create-folder event when create folder button is clicked', async () => {
    const createFolderBtn = wrapper.findAll('.el-button')[1];
    await createFolderBtn.trigger('click');
    expect(wrapper.emitted('create-folder')).toBeTruthy();
  });

  it('disables batch delete button when selectedCount is 0', () => {
    const batchDeleteBtn = wrapper.findAll('.el-button')[2];
    expect(batchDeleteBtn.attributes('disabled')).toBe('');
  });

  it('enables batch delete button when selectedCount > 0 and emits batch-delete on click', async () => {
    await wrapper.setProps({ selectedCount: 2 });
    const batchDeleteBtn = wrapper.findAll('.el-button')[2];
    expect(batchDeleteBtn.attributes('disabled')).toBeUndefined();

    await batchDeleteBtn.trigger('click');
    expect(wrapper.emitted('batch-delete')).toBeTruthy();
  });

  it('emits update:searchKeyword when input value changes', async () => {
    const input = wrapper.find('.el-input');
    await input.setValue('test search');
    expect(wrapper.emitted('update:searchKeyword')).toBeTruthy();
    expect(wrapper.emitted('update:searchKeyword')?.[0]).toEqual([
      'test search',
    ]);
  });

  it('emits update:viewMode with "grid" when grid button is clicked', async () => {
    const gridBtn = wrapper.findAll('.el-button')[3];
    await gridBtn.trigger('click');
    expect(wrapper.emitted('update:viewMode')).toBeTruthy();
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual(['grid']);
  });

  it('emits update:viewMode with "list" when list button is clicked', async () => {
    const listBtn = wrapper.findAll('.el-button')[4];
    await listBtn.trigger('click');
    expect(wrapper.emitted('update:viewMode')).toBeTruthy();
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual(['list']);
  });
});
