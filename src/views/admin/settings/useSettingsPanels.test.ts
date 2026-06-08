import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSettingsPanels } from './useSettingsPanels';

const submitPasswordChange = vi.fn();
const mockRouter = {
  push: vi.fn(),
};
const mockSettingsStore = {
  theme: 'light' as const,
  primaryColor: '#409eff',
  collapsedSidebar: false,
  notificationSettings: {
    system: true,
    email: true,
    upload: false,
    comment: true,
  },
  systemSettings: {
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    autoBackup: true,
  },
};
const mockUserStore = {
  name: 'Pix',
  email: 'pix@example.com',
  phone: '',
  bio: '',
  avatar: '',
  logout: vi.fn(),
};

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => mockRouter),
}));

vi.mock('../../../composables/usePasswordChange', () => ({
  usePasswordChange: vi.fn(() => ({
    submitPasswordChange,
  })),
}));

vi.mock('../../../stores/settings', () => ({
  SETTINGS_STORE_KEY: 'pix-space-settings-store',
  useSettingsStore: vi.fn(() => mockSettingsStore),
}));

vi.mock('../../../stores/user', () => ({
  useUserStore: vi.fn(() => mockUserStore),
}));

vi.mock('../../../api/user', () => ({
  deleteUserAccount: vi.fn(),
  getUserPreferences: vi.fn(async () => ({
    twoFactorEnabled: false,
    notifications: {
      system: true,
      email: true,
      upload: false,
      comment: true,
    },
  })),
  updateUserPreferences: vi.fn(),
  updateUserProfile: vi.fn(),
}));

describe('useSettingsPanels', () => {
  const Harness = defineComponent({
    setup() {
      return useSettingsPanels();
    },
    template: '<div />',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    submitPasswordChange.mockResolvedValue(undefined);
  });

  it('forces relogin after changing password from security settings', async () => {
    const wrapper = mount(Harness);
    const vm = wrapper.vm as unknown as ReturnType<typeof useSettingsPanels>;

    await Promise.resolve();

    vm.securityForm.oldPassword = 'old-password';
    vm.securityForm.newPassword = 'new-password';
    vm.securityForm.confirmPassword = 'new-password';

    vm.securityFormRef = {
      validate: vi.fn().mockResolvedValue(true),
      clearValidate: vi.fn(),
    } as unknown as typeof vm.securityFormRef;

    await vm.handleSecuritySubmit();

    expect(submitPasswordChange).toHaveBeenCalledWith(
      {
        oldPassword: 'old-password',
        newPassword: 'new-password',
        confirmPassword: 'new-password',
      },
      {
        forceRelogin: true,
        reloginMessage: '密码已更新，请重新登录',
      },
      expect.any(Function)
    );
  });
});
