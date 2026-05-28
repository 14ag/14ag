import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ThemeMode } from '$lib/types';

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: ThemeMode = 'dark';

function applyTheme(theme: ThemeMode) {
  if (!browser) {
    return;
  }

  document.documentElement.setAttribute('data-theme', theme);
}

function createThemeStore() {
  const { subscribe, set } = writable<ThemeMode>(DEFAULT_THEME);

  return {
    subscribe,
    init() {
      const next =
        browser && localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : DEFAULT_THEME;

      set(next);
      applyTheme(next);
    },
    set(theme: ThemeMode) {
      set(theme);
      applyTheme(theme);

      if (browser) {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    },
    toggle(current: ThemeMode) {
      this.set(current === 'light' ? 'dark' : 'light');
    }
  };
}

export const theme = createThemeStore();
