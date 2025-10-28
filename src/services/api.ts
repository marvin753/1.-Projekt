import axios from 'axios';
import { Habit, HabitLog, User } from './db';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock API for M0 phase
const MOCK_DELAY = 500;

const mockApi = {
  habits: {
    list: async (): Promise<Habit[]> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return [];
    },
    create: async (data: Partial<Habit>): Promise<Habit> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() } as Habit;
    },
    update: async (id: string, data: Partial<Habit>): Promise<Habit> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { id, ...data, updatedAt: new Date() } as Habit;
    },
    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    }
  },
  logs: {
    list: async (): Promise<HabitLog[]> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return [];
    },
    create: async (data: Partial<HabitLog>): Promise<HabitLog> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return { ...data, id: crypto.randomUUID(), createdAt: new Date() } as HabitLog;
    }
  },
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date()
      };
    },
    sync: async (): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    }
  }
};

export const apiService = {
  habits: {
    getAll: () => api.get<Habit[]>('/habits'),
    getById: (id: string) => api.get<Habit>(`/habits/${id}`),
    create: (data: Partial<Habit>) => api.post<Habit>('/habits', data),
    update: (id: string, data: Partial<Habit>) => api.put<Habit>(`/habits/${id}`, data),
    delete: (id: string) => api.delete(`/habits/${id}`)
  },
  logs: {
    getAll: () => api.get<HabitLog[]>('/logs'),
    getByHabitId: (habitId: string) => api.get<HabitLog[]>(`/logs?habitId=${habitId}`),
    create: (data: Partial<HabitLog>) => api.post<HabitLog>('/logs', data),
    update: (id: string, data: Partial<HabitLog>) => api.put<HabitLog>(`/logs/${id}`, data),
    delete: (id: string) => api.delete(`/logs/${id}`)
  },
  auth: {
    login: (email: string, password: string) => api.post<User>('/auth/login', { email, password }),
    sync: () => api.post('/auth/sync')
  }
};

export { mockApi };

