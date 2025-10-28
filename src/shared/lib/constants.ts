export const APP_NAME = 'HabitTrackr';
export const APP_VERSION = '0.1.0';

export const HABIT_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6366f1'  // indigo
] as const;

export const API_ENDPOINTS = {
  HABITS: '/habits',
  LOGS: '/logs',
  AUTH: {
    LOGIN: '/auth/login',
    SYNC: '/auth/sync'
  }
} as const;

export const DB_NAME = 'habittrackr';
export const DB_VERSION = 1;



