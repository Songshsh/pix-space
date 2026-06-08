import { defineStore } from 'pinia';
import { useDark } from '@vueuse/core';

export const SETTINGS_STORE_KEY = 'pix-space-settings-store';

export function getPersistedPrimaryColor(fallback = ''): string {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(SETTINGS_STORE_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as { primaryColor?: unknown };
    return typeof parsed.primaryColor === 'string' && parsed.primaryColor
      ? parsed.primaryColor
      : fallback;
  } catch {
    return fallback;
  }
}

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const theme = ref<'light' | 'dark' | 'auto'>('light');
    const collapsedSidebar = ref<boolean>(false);

    const isDark = useDark();

    const primaryColor = ref<string>(getPersistedPrimaryColor());

    function applyTheme() {
      if (theme.value === 'auto') {
        // If auto, useDark's default behavior handles it by matching media query
        isDark.value = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
      } else {
        isDark.value = theme.value === 'dark';
      }
    }

    watch(theme, applyTheme);

    applyTheme();

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
        if (theme.value === 'auto') {
          applyTheme();
        }
      };
      mediaQuery.addEventListener('change', handleSystemThemeChange);

      onScopeDispose(() => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      });
    }

    return {
      theme,
      primaryColor,
      collapsedSidebar,
      isDark: readonly(isDark),
      applyTheme,
    };
  },
  {
    persist: {
      key: SETTINGS_STORE_KEY,
      storage: localStorage,
      pick: ['theme', 'primaryColor', 'collapsedSidebar'],
    },
  }
);
