import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '../stores/user';

vi.mock('../layouts/MainLayout.vue', () => ({
  default: { render: () => null },
}));

// Mock components since we only want to test routing logic
vi.mock('../views/login/index.vue', () => ({
  default: { name: 'LoginView', template: '<div>Login</div>' },
}));
vi.mock('../views/dashboard/index.vue', () => ({
  default: { name: 'DashboardView', template: '<div>Dashboard</div>' },
}));
vi.mock('../views/image-management/index.vue', () => ({
  default: { name: 'ImageManagement', template: '<div>Images</div>' },
}));
vi.mock('../views/user-management/index.vue', () => ({
  default: { name: 'UserManagement', template: '<div>Users</div>' },
}));
vi.mock('../views/file-management/index.vue', () => ({
  default: { name: 'FileManagement', template: '<div>Files</div>' },
}));
vi.mock('../views/settings/index.vue', () => ({
  default: { name: 'SettingsView', template: '<div>Settings</div>' },
}));
vi.mock('../views/not-found/index.vue', () => ({
  default: { name: 'NotFoundView', template: '<div>404</div>' },
}));

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('router guards', () => {
  it('redirects to login when route requires auth', async () => {
    vi.resetModules();
    const { default: router } = await import('./index');

    await router.push('/admin/dashboard');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/login');
    expect(router.currentRoute.value.query.redirect).toBe('/admin/dashboard');
  });

  it('redirects from login when logged in', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const userStore = useUserStore();
    userStore.login({ name: 'Bob', email: 'b@c.com' }, 't1');

    const { default: router } = await import('./index');

    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/admin/dashboard');
  });
});
