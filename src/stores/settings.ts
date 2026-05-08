import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useDark, useCssVar } from '@vueuse/core';

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const theme = ref<'light' | 'dark' | 'auto'>('light');
    const primaryColor = ref<string>(
      (() => {
        if (typeof window === 'undefined') return '';
        const el = document.documentElement;
        const styles = getComputedStyle(el);
        return styles.getPropertyValue('--el-color-primary').trim();
      })()
    );
    const collapsedSidebar = ref<boolean>(false);

    const isDark = useDark();

    function parseRgbToHex(value: string): string | null {
      const match = value
        .replace(/\s+/g, '')
        .match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/i);
      if (!match) return null;
      const r = Math.max(0, Math.min(255, Number(match[1])));
      const g = Math.max(0, Math.min(255, Number(match[2])));
      const b = Math.max(0, Math.min(255, Number(match[3])));
      return (
        '#' +
        [r, g, b]
          .map((n) => n.toString(16).padStart(2, '0'))
          .join('')
          .toLowerCase()
      );
    }

    function resolveCssVar(value: string, el: HTMLElement): string {
      const trimmed = value.trim();
      const match = trimmed.match(/^var\((--[^)]+)\)$/);
      if (!match) return trimmed;
      const styles = getComputedStyle(el);
      return styles.getPropertyValue(match[1]).trim();
    }

    function normalizeToHex(value: string, el: HTMLElement): string | null {
      let v = resolveCssVar(value, el);
      v = resolveCssVar(v, el);
      if (v.startsWith('#')) return v;
      return parseRgbToHex(v);
    }

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
      const hexColor = normalizeToHex(primaryColor.value, el);
      if (!hexColor) return;

      useCssVar('--el-color-primary', el).value = hexColor;

      const hasColorMix =
        typeof window !== 'undefined' &&
        typeof CSS !== 'undefined' &&
        CSS.supports('color', 'color-mix(in srgb, black 50%, white)');

      if (hasColorMix) {
        for (let i = 1; i <= 9; i++) {
          const ratio = 100 - i * 10;
          el.style.setProperty(
            `--el-color-primary-light-${i}`,
            `color-mix(in srgb, var(--el-color-primary) ${ratio}%, white)`
          );
        }
        el.style.setProperty(
          '--el-color-primary-dark-2',
          'color-mix(in srgb, var(--el-color-primary) 80%, black)'
        );
        return;
      }

      // Calculate lighter/darker variants for hover/active states
      // Element Plus uses primary-light-x for hover states (mix with white)
      // and primary-dark-2 for active states (mix with black)
      const color = hexColor;
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
