import { describe, it, expect } from 'vitest';
import { habitSchema, habitLogSchema } from '@/shared/lib/schemas';

describe('Habit Schema', () => {
  it('should validate a valid habit', () => {
    const validHabit = {
      title: 'Morning Exercise',
      description: '30 minutes of exercise',
      color: '#3b82f6',
      frequency: 'daily'
    };
    
    const result = habitSchema.safeParse(validHabit);
    expect(result.success).toBe(true);
  });

  it('should reject a habit with invalid color', () => {
    const invalidHabit = {
      title: 'Test',
      color: 'invalid',
      frequency: 'daily'
    };
    
    const result = habitSchema.safeParse(invalidHabit);
    expect(result.success).toBe(false);
  });

  it('should reject a habit with empty title', () => {
    const invalidHabit = {
      title: '',
      color: '#3b82f6',
      frequency: 'daily'
    };
    
    const result = habitSchema.safeParse(invalidHabit);
    expect(result.success).toBe(false);
  });
});

describe('Habit Log Schema', () => {
  it('should validate a valid habit log', () => {
    const validLog = {
      habitId: '123',
      date: '2024-01-01',
      completed: true,
      notes: 'Completed successfully'
    };
    
    const result = habitLogSchema.safeParse(validLog);
    expect(result.success).toBe(true);
  });

  it('should reject a habit log with invalid date format', () => {
    const invalidLog = {
      habitId: '123',
      date: 'invalid-date',
      completed: true
    };
    
    const result = habitLogSchema.safeParse(invalidLog);
    expect(result.success).toBe(false);
  });
});



