import { useSettingsAppearance } from './useSettingsAppearance';
import { useSettingsNotifications } from './useSettingsNotifications';
import { useSettingsProfile } from './useSettingsProfile';
import { useSettingsSecurity } from './useSettingsSecurity';
import { useSettingsSystem } from './useSettingsSystem';

export function useSettingsPanels() {
  const profile = useSettingsProfile();
  const security = useSettingsSecurity();
  const notifications = useSettingsNotifications();
  const appearance = useSettingsAppearance();
  const system = useSettingsSystem(
    notifications.notificationSettings,
    notifications.resetNotificationSettings
  );

  const loadPreferencesPanels = async () => {
    notifications.setNotificationSettingsReady(false);
    const result = await security.loadSecurityPreferences();
    if (result) {
      notifications.applyNotificationSettings(result.notifications, {
        force: true,
      });
      notifications.setNotificationSettingsReady(true);
      return result;
    }
    notifications.setNotificationSettingsReady(false);
    return null;
  };

  onMounted(() => {
    void loadPreferencesPanels();
  });

  return {
    ...profile,
    ...security,
    ...notifications,
    ...appearance,
    ...system,
    loadPreferencesPanels,
  };
}
