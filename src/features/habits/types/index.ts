import { Habit, HabitLog } from '@/services/db';

export type { Habit, HabitLog };

export interface CreateHabitFormData {
  title: string;
  description?: string;
  color: string;
  frequency: 'daily' | 'weekly';
}

export const habitSchema = {
  title: '',
  color: '#3b82f6',
  frequency: 'daily' as const
};

