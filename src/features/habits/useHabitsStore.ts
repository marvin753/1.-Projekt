import { create } from 'zustand';
import { Habit, HabitFormData, HabitSchema } from '@/shared/lib/schemas';
import { supabaseHabitService } from '@/services/db';

/**
 * Helper function to convert a Date to UTC YYYY-MM-DD format
 * @param date - The date to convert
 * @returns ISO date string in YYYY-MM-DD format (UTC)
 */
export function makeDateKeyUTC(date: Date): string {
  const d = new Date(date);
  const utcDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  return utcDate.toISOString().split('T')[0];
}

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  // Actions
  create: (input: HabitFormData) => Promise<Habit>;
  update: (id: string, patch: Partial<HabitFormData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleCheck: (id: string, dateKey: string) => Promise<void>;
  loadHabits: () => Promise<void>;
  setHabits: (habits: Habit[]) => void;
  clearError: () => void;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  loading: false,
  error: null,

  /**
   * Load all habits from Supabase
   */
  loadHabits: async () => {
    set({ loading: true, error: null });
    try {
      const habits = await supabaseHabitService.listHabits();
      set({ habits, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load habits';
      set({ error: message, loading: false });
      console.error('Error loading habits:', error);
    }
  },

  /**
   * Set habits directly (used for testing)
   */
  setHabits: (habits: Habit[]) => {
    set({ habits });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Create a new habit with Supabase sync
   */
  create: async (input: HabitFormData) => {
    const now = new Date().toISOString();
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      weeklyTarget: input.weeklyTarget,
      createdAt: now,
      updatedAt: now,
      checks: {}
    };

    // Validate before adding
    HabitSchema.parse(newHabit);

    // Optimistic update
    set((state) => ({
      habits: [...state.habits, newHabit],
      error: null
    }));

    try {
      // Sync with Supabase
      const savedHabit = await supabaseHabitService.addHabit(newHabit);
      // Update with server response
      set((state) => ({
        habits: state.habits.map((h) => (h.id === newHabit.id ? savedHabit : h))
      }));
      return savedHabit;
    } catch (error) {
      // Rollback on error
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== newHabit.id),
        error: error instanceof Error ? error.message : 'Failed to create habit'
      }));
      throw error;
    }
  },

  /**
   * Update a habit with Supabase sync
   */
  update: async (id: string, patch: Partial<HabitFormData>) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === id);
    if (!habit) {
      set({ error: 'Habit not found' });
      throw new Error('Habit not found');
    }

    const updated: Habit = {
      ...habit,
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.description !== undefined && { description: patch.description }),
      ...(patch.weeklyTarget !== undefined && { weeklyTarget: patch.weeklyTarget }),
      updatedAt: new Date().toISOString()
    };

    // Validate
    HabitSchema.parse(updated);

    // Optimistic update
    set((s) => ({
      habits: s.habits.map((h) => (h.id === id ? updated : h)),
      error: null
    }));

    try {
      // Sync with Supabase
      await supabaseHabitService.updateHabit(updated);
    } catch (error) {
      // Rollback
      set((s) => ({
        habits: s.habits.map((h) => (h.id === id ? habit : h)),
        error: error instanceof Error ? error.message : 'Failed to update habit'
      }));
      throw error;
    }
  },

  /**
   * Remove a habit with Supabase sync
   */
  remove: async (id: string) => {
    const state = get();
    const habitToRemove = state.habits.find((h) => h.id === id);

    // Optimistic removal
    set((s) => ({
      habits: s.habits.filter((h) => h.id !== id),
      error: null
    }));

    try {
      // Sync with Supabase
      await supabaseHabitService.deleteHabit(id);
    } catch (error) {
      // Rollback
      if (habitToRemove) {
        set((s) => ({
          habits: [...s.habits, habitToRemove],
          error: error instanceof Error ? error.message : 'Failed to delete habit'
        }));
      }
      throw error;
    }
  },

  /**
   * Toggle a check with Supabase sync
   */
  toggleCheck: async (id: string, dateKey: string) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === id);
    if (!habit) {
      set({ error: 'Habit not found' });
      throw new Error('Habit not found');
    }

    // Validate date key format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      set({ error: `Invalid date format: ${dateKey}` });
      throw new Error(`Invalid date format: ${dateKey}`);
    }

    const updated: Habit = {
      ...habit,
      checks: {
        ...habit.checks,
        [dateKey]: !habit.checks[dateKey]
      },
      updatedAt: new Date().toISOString()
    };

    // Validate
    HabitSchema.parse(updated);

    // Optimistic update
    set((s) => ({
      habits: s.habits.map((h) => (h.id === id ? updated : h)),
      error: null
    }));

    try {
      // Sync with Supabase
      await supabaseHabitService.updateHabit(updated);
    } catch (error) {
      // Rollback
      set((s) => ({
        habits: s.habits.map((h) => (h.id === id ? habit : h)),
        error: error instanceof Error ? error.message : 'Failed to toggle check'
      }));
      throw error;
    }
  }
}));
