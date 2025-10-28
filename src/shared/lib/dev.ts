/**
 * Development utilities
 */

export const isDev = import.meta.env.DEV;

export const log = (...args: unknown[]) => {
  if (isDev) {
    console.log('[HabitTrackr]', ...args);
  }
};

export const logError = (...args: unknown[]) => {
  if (isDev) {
    console.error('[HabitTrackr Error]', ...args);
  }
};



