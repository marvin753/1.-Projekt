import { describe, it, expect } from 'vitest';
import { useHabitStore } from '@/shared/store/habitStore';

describe('Habit Store', () => {
  it('should initialize with empty state', () => {
    const state = useHabitStore.getState();
    expect(state.habits).toEqual([]);
    expect(state.habitLogs).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should add a habit', () => {
    const { addHabit, habits } = useHabitStore.getState();
    const newHabit = {
      id: '1',
      title: 'Test Habit',
      color: '#3b82f6',
      frequency: 'daily' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addHabit(newHabit);
    const updatedHabits = useHabitStore.getState().habits;
    
    expect(updatedHabits).toHaveLength(1);
    expect(updatedHabits[0]).toEqual(newHabit);
  });

  it('should delete a habit', () => {
    const { deleteHabit, habits } = useHabitStore.getState();
    const habitId = habits[0]?.id;
    
    if (habitId) {
      deleteHabit(habitId);
      const updatedHabits = useHabitStore.getState().habits;
      expect(updatedHabits.find(h => h.id === habitId)).toBeUndefined();
    }
  });
});



