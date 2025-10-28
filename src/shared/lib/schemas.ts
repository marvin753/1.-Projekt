import { z } from 'zod';

export const habitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color'),
  frequency: z.enum(['daily', 'weekly'])
});

export const habitLogSchema = z.object({
  habitId: z.string().min(1, 'Habit ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  completed: z.boolean(),
  notes: z.string().max(500).optional()
});

export type HabitFormData = z.infer<typeof habitSchema>;
export type HabitLogFormData = z.infer<typeof habitLogSchema>;

