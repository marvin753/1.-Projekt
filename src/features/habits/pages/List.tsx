import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button } from '@/shared/ui';
import { useHabitsStore, makeDateKeyUTC } from '@/features/habits/useHabitsStore';

export function HabitListPage() {
  const habits = useHabitsStore((state) => state.habits);
  const loading = useHabitsStore((state) => state.loading);
  const error = useHabitsStore((state) => state.error);
  const toggleCheck = useHabitsStore((state) => state.toggleCheck);
  const remove = useHabitsStore((state) => state.remove);
  const clearError = useHabitsStore((state) => state.clearError);
  const loadHabits = useHabitsStore((state) => state.loadHabits);

  // Load habits from Supabase on component mount
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const today = makeDateKeyUTC(new Date());

  // Handle async toggle
  const handleToggleCheck = async (habitId: string, dateKey: string) => {
    try {
      await toggleCheck(habitId, dateKey);
    } catch (error) {
      console.error('Failed to toggle check:', error);
    }
  };

  // Handle async remove
  const handleRemove = async (habitId: string) => {
    try {
      await remove(habitId);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Habits
        </h1>
        <Link to="/habit/new">
          <Button>Add New Habit</Button>
        </Link>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-800">
          <div className="flex justify-between items-center">
            <p className="text-red-700 dark:text-red-200">Error: {error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-semibold"
            >
              ✕
            </button>
          </div>
        </Card>
      )}

      {loading && habits.length === 0 ? (
        <Card>
          <p className="text-gray-600 dark:text-gray-400">Loading habits...</p>
        </Card>
      ) : habits.length === 0 ? (
        <Card>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            No habits yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first habit to get started!
          </p>
          <Link to="/habit/new">
            <Button>Create First Habit</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const isCompletedToday = habit.checks[today] ?? false;

            return (
              <Card key={habit.id} className="flex flex-col">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {habit.title}
                  </h2>
                  {habit.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {habit.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Target: {habit.weeklyTarget} days/week
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => handleToggleCheck(habit.id, today)}
                    className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      isCompletedToday
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isCompletedToday ? '✓ Done Today' : 'Mark Today'}
                  </button>

                  <div className="flex gap-2">
                    <Link to={`/habit/${habit.id}/edit`} className="flex-1">
                      <button className="w-full py-2 px-3 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemove(habit.id)}
                      className="flex-1 py-2 px-3 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
