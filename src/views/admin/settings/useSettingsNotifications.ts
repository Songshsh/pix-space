import type { UserPreferences } from '../../../types/auth';
import { updateUserPreferences } from '../../../api/user';
import type { NotificationSettingsForm } from '../../../components/settings/types';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsForm = {
  system: true,
  email: true,
  upload: false,
  comment: true,
};

function cloneNotificationSettings(
  notifications: UserPreferences['notifications'] | NotificationSettingsForm
): NotificationSettingsForm {
  return {
    system: notifications.system,
    email: notifications.email,
    upload: notifications.upload,
    comment: notifications.comment,
  };
}

function isNotificationSettingsEqual(
  left: NotificationSettingsForm,
  right: NotificationSettingsForm
) {
  return (
    left.system === right.system &&
    left.email === right.email &&
    left.upload === right.upload &&
    left.comment === right.comment
  );
}

export function useSettingsNotifications() {
  const notificationSettings = reactive<NotificationSettingsForm>({
    ...DEFAULT_NOTIFICATION_SETTINGS,
  });
  const notificationSettingsReady = ref(false);
  const lastSyncedNotificationSettings = ref<NotificationSettingsForm>({
    ...DEFAULT_NOTIFICATION_SETTINGS,
  });
  const applyingNotificationSettings = ref(false);
  const notificationSaving = ref(false);
  const notificationSettingsDirty = ref(false);
  let notificationUpdateSeq = 0;

  const applyNotificationSettings = (
    notifications: UserPreferences['notifications'],
    options?: { force?: boolean }
  ) => {
    if (!options?.force && notificationSettingsDirty.value) {
      return false;
    }
    applyingNotificationSettings.value = true;
    Object.assign(notificationSettings, notifications);
    lastSyncedNotificationSettings.value =
      cloneNotificationSettings(notifications);
    notificationSettingsDirty.value = false;
    applyingNotificationSettings.value = false;
    return true;
  };

  const resetNotificationSettings = () => {
    applyNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS, { force: true });
  };

  const setNotificationSettingsReady = (value: boolean) => {
    notificationSettingsReady.value = value;
  };

  watch(
    notificationSettings,
    (value) => {
      if (applyingNotificationSettings.value) return;
      notificationSettingsDirty.value = !isNotificationSettingsEqual(
        value,
        lastSyncedNotificationSettings.value
      );
    },
    { deep: true }
  );

  const handleNotificationUpdate = async () => {
    if (notificationSaving.value || !notificationSettingsReady.value) return;
    const requestId = ++notificationUpdateSeq;
    const previous = { ...lastSyncedNotificationSettings.value };
    notificationSaving.value = true;
    try {
      const result = await updateUserPreferences(
        {
          notifications: {
            system: notificationSettings.system,
            email: notificationSettings.email,
            upload: notificationSettings.upload,
            comment: notificationSettings.comment,
          },
        },
        { silentError: true }
      );
      if (requestId !== notificationUpdateSeq) {
        return;
      }
      applyNotificationSettings(result.notifications, { force: true });
      ElMessage.success('通知设置已更新');
    } catch {
      if (requestId !== notificationUpdateSeq) {
        return;
      }
      applyNotificationSettings(previous, { force: true });
    } finally {
      if (requestId === notificationUpdateSeq) {
        notificationSaving.value = false;
      }
    }
  };

  return {
    notificationSettings,
    notificationSettingsReady,
    notificationSaving,
    notificationSettingsDirty,
    applyNotificationSettings,
    resetNotificationSettings,
    setNotificationSettingsReady,
    handleNotificationUpdate,
  };
}
