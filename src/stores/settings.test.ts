import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { SETTINGS_STORE_KEY, useSettingsStore } from './settings';

beforeEach(() => {
  localStorage.clear();

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

  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  setActivePinia(pinia);
});

describe('useSettingsStore', () => {
  it('persists writable settings fields without readonly isDark', () => {
    const store = useSettingsStore();

    store.theme = 'dark';
    store.primaryColor = '#123456';
    store.collapsedSidebar = true;

    const persisted = localStorage.getItem(SETTINGS_STORE_KEY);

    expect(persisted).not.toBeNull();

    const parsed = JSON.parse(persisted as string) as Record<string, unknown>;

    expect(parsed).toMatchObject({
      theme: 'dark',
      primaryColor: '#123456',
      collapsedSidebar: true,
    });
    expect(parsed).not.toHaveProperty('isDark');
  });
});
