import { openDB, DBSchema, IDBPDatabase } from 'idb';
import supabase from './supabaseClient';
import type { Habit } from '@/shared/lib/schemas';

// Old Habit type for IDB (kept for backward compatibility)
// Re-export as Habit for code that expects it
export interface LegacyHabit {
  id: string;
  title: string;
  description?: string;
  color: string;
  frequency: 'daily' | 'weekly';
  createdAt: Date;
  updatedAt: Date;
}

// Alias for backward compatibility - export LegacyHabit as Habit for old code
export type { LegacyHabit as Habit };

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastSyncAt?: Date;
}

interface HabitTrackrDB extends DBSchema {
  habits: {
    key: string;
    value: LegacyHabit;
    indexes: { 'by-createdAt': Date };
  };
  habitLogs: {
    key: string;
    value: HabitLog;
    indexes: { 'by-habitId': string; 'by-date': string };
  };
  users: {
    key: string;
    value: User;
  };
}

let dbInstance: IDBPDatabase<HabitTrackrDB> | null = null;

export const getDB = async (): Promise<IDBPDatabase<HabitTrackrDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<HabitTrackrDB>('habittrackr', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('habits')) {
        const habitStore = db.createObjectStore('habits', { keyPath: 'id' });
        habitStore.createIndex('by-createdAt', 'createdAt');
      }

      if (!db.objectStoreNames.contains('habitLogs')) {
        const logStore = db.createObjectStore('habitLogs', { keyPath: 'id' });
        logStore.createIndex('by-habitId', 'habitId');
        logStore.createIndex('by-date', 'date');
      }

      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
    }
  });

  return dbInstance;
};

// Habits CRUD (Legacy - using IndexedDB)
export const habitService = {
  async getAll(): Promise<LegacyHabit[]> {
    const db = await getDB();
    return db.getAll('habits');
  },

  async getById(id: string): Promise<LegacyHabit | undefined> {
    const db = await getDB();
    return db.get('habits', id);
  },

  async create(habit: Omit<LegacyHabit, 'id' | 'createdAt' | 'updatedAt'>): Promise<LegacyHabit> {
    const db = await getDB();
    const newHabit: LegacyHabit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.add('habits', newHabit);
    return newHabit;
  },

  async update(id: string, updates: Partial<LegacyHabit>): Promise<LegacyHabit> {
    const db = await getDB();
    const habit = await db.get('habits', id);
    if (!habit) throw new Error('Habit not found');

    const updatedHabit = { ...habit, ...updates, updatedAt: new Date() };
    await db.put('habits', updatedHabit);
    return updatedHabit;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('habits', id);
  }
};

// Habit Logs CRUD
export const habitLogService = {
  async getAll(): Promise<HabitLog[]> {
    const db = await getDB();
    return db.getAll('habitLogs');
  },

  async getByHabitId(habitId: string): Promise<HabitLog[]> {
    const db = await getDB();
    const index = db.transaction('habitLogs').store.index('by-habitId');
    return index.getAll(habitId);
  },

  async getByDate(date: string): Promise<HabitLog[]> {
    const db = await getDB();
    const index = db.transaction('habitLogs').store.index('by-date');
    return index.getAll(date);
  },

  async create(log: Omit<HabitLog, 'id' | 'createdAt'>): Promise<HabitLog> {
    const db = await getDB();
    const newLog: HabitLog = {
      ...log,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    await db.add('habitLogs', newLog);
    return newLog;
  },

  async update(id: string, updates: Partial<HabitLog>): Promise<HabitLog> {
    const db = await getDB();
    const log = await db.get('habitLogs', id);
    if (!log) throw new Error('Habit log not found');

    const updatedLog = { ...log, ...updates };
    await db.put('habitLogs', updatedLog);
    return updatedLog;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('habitLogs', id);
  },

  async deleteByHabitId(habitId: string): Promise<void> {
    const db = await getDB();
    const logs = await this.getByHabitId(habitId);
    const tx = db.transaction('habitLogs', 'readwrite');
    await Promise.all(logs.map(log => tx.store.delete(log.id)));
  }
};

// User CRUD
export const userService = {
  async getCurrentUser(): Promise<User | undefined> {
    const db = await getDB();
    const users = await db.getAll('users');
    return users[0]; // Single user for now
  },

  async setCurrentUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const db = await getDB();
    const currentUser = await this.getCurrentUser();

    const newUser: User = currentUser ? {
      ...currentUser,
      ...user
    } : {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    await db.put('users', newUser);
    return newUser;
  }
};

// Supabase Habit Service
// Syncs habits with Supabase backend
export const supabaseHabitService = {
  /**
   * Fetch all habits from Supabase
   */
  async listHabits(): Promise<Habit[]> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching habits:', error);
        throw error;
      }

      // Transform snake_case from DB to camelCase for app
      return (data || []).map(habit => ({
        id: habit.id,
        title: habit.title,
        description: habit.description,
        weeklyTarget: habit.weekly_target,
        createdAt: habit.created_at,
        updatedAt: habit.updated_at,
        checks: habit.checks || {}
      }));
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      throw error;
    }
  },

  /**
   * Get a single habit by ID
   */
  async getHabit(id: string): Promise<Habit | null> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data ? {
        id: data.id,
        title: data.title,
        description: data.description,
        weeklyTarget: data.weekly_target,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        checks: data.checks || {}
      } : null;
    } catch (error) {
      console.error('Failed to fetch habit:', error);
      throw error;
    }
  },

  /**
   * Add a new habit to Supabase
   */
  async addHabit(habit: Habit): Promise<Habit> {
    try {
      // Convert camelCase to snake_case for DB
      const dbHabit = {
        id: habit.id,
        title: habit.title,
        description: habit.description,
        weekly_target: habit.weeklyTarget,
        checks: habit.checks
      };

      const { data, error } = await supabase
        .from('habits')
        .insert([dbHabit])
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding habit:', error);
        throw error;
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        weeklyTarget: data.weekly_target,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        checks: data.checks || {}
      };
    } catch (error) {
      console.error('Failed to add habit:', error);
      throw error;
    }
  },

  /**
   * Update a habit in Supabase
   */
  async updateHabit(habit: Habit): Promise<Habit> {
    try {
      const dbHabit = {
        title: habit.title,
        description: habit.description,
        weekly_target: habit.weeklyTarget,
        checks: habit.checks
      };

      const { data, error } = await supabase
        .from('habits')
        .update(dbHabit)
        .eq('id', habit.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating habit:', error);
        throw error;
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        weeklyTarget: data.weekly_target,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        checks: data.checks || {}
      };
    } catch (error) {
      console.error('Failed to update habit:', error);
      throw error;
    }
  },

  /**
   * Delete a habit from Supabase
   */
  async deleteHabit(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting habit:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete habit:', error);
      throw error;
    }
  }
};
