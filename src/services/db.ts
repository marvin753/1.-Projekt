import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  color: string;
  frequency: 'daily' | 'weekly';
  createdAt: Date;
  updatedAt: Date;
}

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
    value: Habit;
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

// Habits CRUD
export const habitService = {
  async getAll(): Promise<Habit[]> {
    const db = await getDB();
    return db.getAll('habits');
  },

  async getById(id: string): Promise<Habit | undefined> {
    const db = await getDB();
    return db.get('habits', id);
  },

  async create(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    const db = await getDB();
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.add('habits', newHabit);
    return newHabit;
  },

  async update(id: string, updates: Partial<Habit>): Promise<Habit> {
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

