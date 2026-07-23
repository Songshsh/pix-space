import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '../stores/user';
import { sanitizeRedirectPath } from '../utils/auth';

vi.mock('../layouts/AdminLayout.vue', () => ({
  default: { render: () => null },
}));

// Mock components since we only want to test routing logic
vi.mock('../views/auth/login/index.vue', () => ({
  default: { name: 'LoginView', template: '<div>Login</div>' },
}));
vi.mock('../views/auth/forgot-password/index.vue', () => ({
  default: {
    name: 'ForgotPasswordView',
    template: '<div>ForgotPassword</div>',
  },
}));
vi.mock('../views/auth/register/index.vue', () => ({
  default: { name: 'RegisterView', template: '<div>Register</div>' },
}));
vi.mock('../views/admin/dashboard/index.vue', () => ({
  default: { name: 'DashboardView', template: '<div>Dashboard</div>' },
}));
vi.mock('../views/admin/image-management/index.vue', () => ({
  default: { name: 'ImageManagement', template: '<div>Images</div>' },
}));
vi.mock('../views/admin/user-management/index.vue', () => ({
  default: { name: 'UserManagement', template: '<div>Users</div>' },
}));
vi.mock('../views/admin/file-management/index.vue', () => ({
  default: { name: 'FileManagement', template: '<div>Files</div>' },
}));
vi.mock('../views/admin/settings/index.vue', () => ({
  default: { name: 'SettingsView', template: '<div>Settings</div>' },
}));
vi.mock('../views/system/not-found/index.vue', () => ({
  default: { name: 'NotFoundView', template: '<div>404</div>' },
}));
vi.mock('../views/portal/user-boards/index.vue', () => ({
  default: { name: 'UserBoardsView', template: '<div>UserBoards</div>' },
}));

beforeEach(() => {
  setActivePinia(createPinia());
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
});

describe('router guards', () => {
  it('uses explore as default redirect fallback', () => {
    expect(sanitizeRedirectPath(undefined)).toBe('/explore');
  });

  it('redirects to login when route requires auth', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const userStore = useUserStore();
    userStore.setAuthReady(true);
    const { default: router } = await import('./index');

    await router.push('/admin/dashboard');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/login');
    expect(router.currentRoute.value.query.redirect).toBe('/admin/dashboard');
  });

  it('redirects authenticated admin from login to explore by default', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const userStore = useUserStore();
    userStore.login({
      id: 1,
      username: 'Bob',
      email: 'b@c.com',
      role: 'admin',
    });

    const { default: router } = await import('./index');

    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/explore');
  });

  it('redirects viewer to explore when visiting login', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const userStore = useUserStore();
    userStore.login({
      id: 2,
      username: 'Viewer',
      email: 'v@c.com',
      role: 'viewer',
    });

    const { default: router } = await import('./index');

    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/explore');
  });

  it('blocks viewer from admin routes', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const userStore = useUserStore();
    userStore.login({
      id: 2,
      username: 'Viewer',
      email: 'v@c.com',
      role: 'viewer',
    });

    const { default: router } = await import('./index');

    await router.push('/admin/dashboard');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/403');
  });

  it('supports portal user boards route with userId param', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const { default: router } = await import('./index');

    await router.push('/u/101/boards');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('UserBoards');
    expect(router.currentRoute.value.params.userId).toBe('101');
  });

  it('allows anonymous access to forgot password', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const { default: router } = await import('./index');

    await router.push('/forgot-password');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('ForgotPassword');
    expect(router.currentRoute.value.path).toBe('/forgot-password');
  });

  it('allows anonymous access to register', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const { default: router } = await import('./index');

    await router.push('/register');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('Register');
    expect(router.currentRoute.value.path).toBe('/register');
  });

  it('redirects authenticated user from register to explore', async () => {
    vi.resetModules();
    setActivePinia(createPinia());
    const userStore = useUserStore();
    userStore.login({
      id: 2,
      username: 'Viewer',
      email: 'v@c.com',
      role: 'viewer',
    });

    const { default: router } = await import('./index');

    await router.push('/register');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/explore');
  });
});
