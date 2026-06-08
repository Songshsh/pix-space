import { deleteUserAccount } from '../../../api/user';
import type {
  NotificationSettingsForm,
  SystemSettingsForm,
} from '../../../components/settings/types';
import { SETTINGS_STORE_KEY, useSettingsStore } from '../../../stores/settings';
import { useUserStore } from '../../../stores/user';
import { sanitizeFilenamePart, triggerDownload } from '../../../utils/download';

const DEFAULT_SYSTEM_SETTINGS: SystemSettingsForm = {
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD',
  autoBackup: true,
};
const SYSTEM_SETTINGS_STORAGE_KEY = 'pix-space-system-settings';

function readStoredSystemSettings(): SystemSettingsForm {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_SYSTEM_SETTINGS };
  }
  try {
    const raw = window.localStorage.getItem(SYSTEM_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SYSTEM_SETTINGS };
    }
    const parsed = JSON.parse(raw) as Partial<SystemSettingsForm>;
    return {
      language: parsed.language || DEFAULT_SYSTEM_SETTINGS.language,
      timezone: parsed.timezone || DEFAULT_SYSTEM_SETTINGS.timezone,
      dateFormat: parsed.dateFormat || DEFAULT_SYSTEM_SETTINGS.dateFormat,
      autoBackup:
        typeof parsed.autoBackup === 'boolean'
          ? parsed.autoBackup
          : DEFAULT_SYSTEM_SETTINGS.autoBackup,
    };
  } catch {
    return { ...DEFAULT_SYSTEM_SETTINGS };
  }
}

function persistSystemSettings(settings: SystemSettingsForm) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    SYSTEM_SETTINGS_STORAGE_KEY,
    JSON.stringify(settings)
  );
}

function isDialogCanceled(action: unknown) {
  return action === 'cancel' || action === 'close';
}

export function useSettingsSystem(
  notificationSettings: NotificationSettingsForm,
  resetNotificationSettings: () => void
) {
  const router = useRouter();
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();

  const systemSettings = reactive<SystemSettingsForm>({
    ...readStoredSystemSettings(),
  });

  watch(
    systemSettings,
    (value) => {
      persistSystemSettings(value);
    },
    { deep: true }
  );

  const resetSettingsState = () => {
    resetNotificationSettings();

    settingsStore.theme = 'light';
    settingsStore.primaryColor = '';
    settingsStore.collapsedSidebar = false;

    Object.assign(systemSettings, DEFAULT_SYSTEM_SETTINGS);
  };

  const handleClearCache = async () => {
    try {
      await ElMessageBox.confirm('确定要清除缓存吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      if (typeof window !== 'undefined') {
        if ('caches' in window) {
          const keys = await window.caches.keys();
          await Promise.all(keys.map((key) => window.caches.delete(key)));
        }
        window.localStorage.removeItem(SETTINGS_STORE_KEY);
      }
      resetSettingsState();
      window.localStorage.removeItem(SYSTEM_SETTINGS_STORAGE_KEY);
      ElMessage.success('缓存已清除');
    } catch (error) {
      if (!isDialogCanceled(error)) ElMessage.error('操作失败');
    }
  };

  const handleExportData = () => {
    const payload = {
      user: {
        name: userStore.name,
        email: userStore.email,
        role: userStore.role,
        avatar: userStore.avatar,
        phone: userStore.phone,
        bio: userStore.bio,
      },
      settings: {
        notificationSettings: { ...notificationSettings },
        appearanceSettings: {
          theme: settingsStore.theme,
          primaryColor: settingsStore.primaryColor,
          collapsedSidebar: settingsStore.collapsedSidebar,
        },
        systemSettings: { ...systemSettings },
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const filename = `pix-space-settings-${sanitizeFilenamePart(
      userStore.name || userStore.email || 'user'
    )}.json`;
    triggerDownload(blob, filename);
    ElMessage.success('数据导出成功');
  };

  const handleDeleteAccount = async () => {
    try {
      await ElMessageBox.confirm(
        '此操作将永久删除您的账户和所有数据，是否继续？',
        '危险操作',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'error',
        }
      );
      await deleteUserAccount();
      userStore.logout();
      ElMessage.success('账户已删除');
      router.push('/login');
    } catch (error) {
      if (isDialogCanceled(error)) return;
      ElMessage.error('删除账户失败，请稍后重试');
    }
  };

  return {
    systemSettings,
    handleClearCache,
    handleExportData,
    handleDeleteAccount,
  };
}
