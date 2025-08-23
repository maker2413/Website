import type { Command } from './types';

const THEME_KEY = 'themePreference';

type Mode = 'light'|'dark'|'auto';

export function setTheme(mode: Mode) {
  const root = document.documentElement;
  if (mode === 'auto') {
    root.setAttribute('data-theme','auto');
  } else {
    root.setAttribute('data-theme', mode);
  }
  localStorage.setItem(THEME_KEY, mode);
}

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) as Mode | null;
  if (saved) setTheme(saved); else setTheme('auto');
}

export const themeCommand: Command = {
  name: 'theme',
  description: 'Set theme (light|dark|auto)',
  run: (args) => {
    const mode = (args[0]||'').toLowerCase();
    if (!mode) return { lines: [{ text: 'Usage: theme <light|dark|auto>' }] };
    if (!['light','dark','auto'].includes(mode)) return { lines: [{ text: 'Invalid mode.' }] };
    setTheme(mode as Mode);
    return { lines: [{ text: `Theme set to ${mode}.` }] };
  }
};
