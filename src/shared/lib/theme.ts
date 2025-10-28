import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'habittrackr-theme';

/**
 * Gets the initial theme preference
 * Priority: localStorage > prefers-color-scheme > light
 */
export function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Applies theme to document
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Hook for managing theme state with localStorage persistence
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
}

/**
 * Listen to system theme changes
 */
export function useSystemThemeListener(onThemeChange: (theme: Theme) => void) {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored) {
        onThemeChange(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [onThemeChange]);
}
