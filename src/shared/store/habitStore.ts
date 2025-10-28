import { create } from 'zustand';
import { Habit, HabitLog } from '@/services/db';

interface HabitState {
  habits: Habit[];
  habitLogs: HabitLog[];
  loading: boolean;
  error: string | null;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setHabitLogs: (logs: HabitLog[]) => void;
  addHabitLog: (log: HabitLog) => void;
  updateHabitLog: (id: string, updates: Partial<HabitLog>) => void;
  deleteHabitLog: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  habitLogs: [],
  loading: false,
  error: null,
  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h))
    })),
  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      habitLogs: state.habitLogs.filter((l) => l.habitId !== id)
    })),
  setHabitLogs: (habitLogs) => set({ habitLogs }),
  addHabitLog: (log) => set((state) => ({ habitLogs: [...state.habitLogs, log] })),
  updateHabitLog: (id, updates) =>
    set((state) => ({
      habitLogs: state.habitLogs.map((l) => (l.id === id ? { ...l, ...updates } : l))
    })),
  deleteHabitLog: (id) =>
    set((state) => ({ habitLogs: state.habitLogs.filter((l) => l.id !== id) })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

