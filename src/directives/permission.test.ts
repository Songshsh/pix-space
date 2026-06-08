import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPermissionDirective } from './permission';
import { useUserStore } from '../stores/user';

describe('createPermissionDirective', () => {
  let pinia: ReturnType<typeof createPinia>;
  let userStore: ReturnType<typeof useUserStore>;
  let wrapper: VueWrapper;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore(pinia);

    wrapper = mount(
      {
        props: {
          requiredRole: {
            type: String,
            default: 'admin',
          },
        },
        template:
          '<div><button class="permission-target" v-permission="requiredRole">管理操作</button></div>',
      },
      {
        global: {
          plugins: [pinia],
          directives: {
            permission: createPermissionDirective(pinia),
          },
        },
      }
    );
  });

  it('syncs visibility immediately when auth role changes', async () => {
    expect(wrapper.find('.permission-target').exists()).toBe(false);

    userStore.login({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    });
    expect(wrapper.find('.permission-target').exists()).toBe(true);

    userStore.updateProfile({ role: 'viewer' });
    expect(wrapper.find('.permission-target').exists()).toBe(false);

    userStore.login({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    });
    expect(wrapper.find('.permission-target').exists()).toBe(true);

    userStore.logout();
    expect(wrapper.find('.permission-target').exists()).toBe(false);

    await wrapper.setProps({ requiredRole: 'viewer' });
    userStore.login({
      id: 2,
      name: 'Viewer',
      email: 'viewer@example.com',
      role: 'viewer',
    });
    expect(wrapper.find('.permission-target').exists()).toBe(true);
  });
});
