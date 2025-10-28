import { useEffect } from 'react';
import { useHabitStore } from '@/shared/store/habitStore';
import { habitService } from '@/services/db';

export const useHabits = () => {
  const { habits, setHabits, setLoading, setError } = useHabitStore();

  useEffect(() => {
    const loadHabits = async () => {
      setLoading(true);
      try {
        const allHabits = await habitService.getAll();
        setHabits(allHabits);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load habits');
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [setHabits, setLoading, setError]);

  return habits;
};

