import type { AppearanceSettingsForm } from '../../../components/settings/types';
import { useSettingsStore } from '../../../stores/settings';

export function useSettingsAppearance() {
  const settingsStore = useSettingsStore();

  const appearanceSettings = reactive<AppearanceSettingsForm>({
    theme: settingsStore.theme,
    primaryColor: settingsStore.primaryColor,
    collapsedSidebar: settingsStore.collapsedSidebar,
  });

  watch(
    () => ({
      theme: settingsStore.theme,
      primaryColor: settingsStore.primaryColor,
      collapsedSidebar: settingsStore.collapsedSidebar,
    }),
    (value) => {
      appearanceSettings.theme = value.theme;
      appearanceSettings.primaryColor = value.primaryColor;
      appearanceSettings.collapsedSidebar = value.collapsedSidebar;
    },
    { immediate: true }
  );

  const themeColors = computed(() => {
    if (typeof window === 'undefined') return [];
    const styles = getComputedStyle(document.documentElement);
    const vars = [
      '--el-color-primary',
      '--el-color-success',
      '--el-color-warning',
      '--el-color-danger',
    ];
    const colors = vars
      .map((name) => styles.getPropertyValue(name).trim())
      .filter((value) => value)
      .map((value) => value.toLowerCase());
    const uniq = Array.from(new Set(colors));
    const current = appearanceSettings.primaryColor?.trim?.().toLowerCase?.();
    if (current && !uniq.includes(current)) uniq.unshift(current);
    return uniq;
  });

  watch(
    appearanceSettings,
    (value) => {
      settingsStore.theme = value.theme;
      settingsStore.primaryColor = value.primaryColor;
      settingsStore.collapsedSidebar = value.collapsedSidebar;
    },
    { deep: true }
  );

  return {
    appearanceSettings,
    themeColors,
  };
}
