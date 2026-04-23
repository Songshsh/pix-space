import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useDark, useCssVar } from '@vueuse/core';

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const theme = ref<'light' | 'dark' | 'auto'>('light');
    const primaryColor = ref<string>('#667eea');
    const collapsedSidebar = ref<boolean>(false);

    const isDark = useDark();

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

    function applyPrimaryColor() {
      const el = document.documentElement;
      useCssVar('--el-color-primary', el).value = primaryColor.value;

      // Calculate lighter/darker variants for hover/active states
      // Element Plus uses primary-light-x for hover states (mix with white)
      // and primary-dark-2 for active states (mix with black)
      const color = primaryColor.value;
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Generate light variants (for hover)
      for (let i = 1; i <= 9; i++) {
        const mixRatio = i * 0.1;
        const mixR = Math.round(255 * mixRatio + r * (1 - mixRatio));
        const mixG = Math.round(255 * mixRatio + g * (1 - mixRatio));
        const mixB = Math.round(255 * mixRatio + b * (1 - mixRatio));
        useCssVar(`--el-color-primary-light-${i}`, el).value =
          `rgb(${mixR}, ${mixG}, ${mixB})`;
      }

      // Generate dark variants (for active/pressed)
      const darkRatio = 0.2;
      const darkR = Math.round(r * (1 - darkRatio));
      const darkG = Math.round(g * (1 - darkRatio));
      const darkB = Math.round(b * (1 - darkRatio));
      useCssVar('--el-color-primary-dark-2', el).value =
        `rgb(${darkR}, ${darkG}, ${darkB})`;
    }

    watch(theme, applyTheme);
    watch(primaryColor, applyPrimaryColor);

    // Apply on system theme change if auto
    if (typeof window !== 'undefined') {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          if (theme.value === 'auto') {
            applyTheme();
          }
        });
    }

    return {
      theme,
      primaryColor,
      collapsedSidebar,
      applyTheme,
      applyPrimaryColor,
    };
  },
  {
    persist: {
      key: 'pix-space-settings-store',
      storage: localStorage,
    },
  }
);
