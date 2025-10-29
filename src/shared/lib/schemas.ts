import { z } from 'zod';

/**
 * Habit domain model schema
 * Represents a single habit with tracking data
 */
export const HabitSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  weeklyTarget: z.number().int().min(1, 'Weekly target must be at least 1').max(7, 'Weekly target cannot exceed 7'),
  createdAt: z.string().datetime({ offset: true }).describe('ISO 8601 datetime'),
  updatedAt: z.string().datetime({ offset: true }).describe('ISO 8601 datetime'),
  checks: z.record(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    z.boolean()
  ).describe('Checks per date (YYYY-MM-DD format, UTC)')
});

export type Habit = z.infer<typeof HabitSchema>;

/**
 * Form data for creating/updating habits (without system fields)
 */
export const habitFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  weeklyTarget: z.number().int().min(1, 'Weekly target must be at least 1').max(7, 'Weekly target cannot exceed 7')
});

export type HabitFormData = z.infer<typeof habitFormSchema>;

/**
 * Legacy form schema - kept for backwards compatibility
 */
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

export type HabitLogFormData = z.infer<typeof habitLogSchema>;

