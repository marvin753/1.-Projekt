import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '@/shared/ui';
import { HabitForm } from '@/features/habits/components/HabitForm';
import { useHabitsStore } from '@/features/habits/useHabitsStore';
import type { HabitFormData } from '@/shared/lib/schemas';

export function EditHabitPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const habits = useHabitsStore((state) => state.habits);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the habit to edit
  const habit = id ? habits.find((h) => h.id === id) : null;

  useEffect(() => {
    if (id && !habit) {
      setError('Habit not found');
    }
  }, [id, habit]);

  const handleSubmit = async (data: HabitFormData) => {
    if (!id) {
      setError('Habit ID is missing');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await useHabitsStore.getState().update(id, data);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update habit';
      setError(message);
      console.error('Error updating habit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/', { replace: true });
  };

  if (!habit) {
    return (
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Edit Habit
          </h1>
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
              <p className="text-red-700 dark:text-red-200 font-medium">{error}</p>
            </div>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Habit
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update the details of "{habit.title}"
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
            <p className="text-red-700 dark:text-red-200 font-medium">Error</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        <HabitForm
          initialHabit={habit}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
        />
      </div>
    </Container>
  );
}
