import { useHabits } from '../hooks/useHabits';
import { useHabitStore } from '@/shared/store/habitStore';

export const HomePage = () => {
  const habits = useHabits();
  const { loading } = useHabitStore();

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HabitTrackr</h1>
        <p className="text-gray-600 mt-2">Track your habits and build consistency</p>
      </div>

      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{habit.title}</h3>
              {habit.description && (
                <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className={`inline-block w-4 h-4 rounded`} style={{ backgroundColor: habit.color }} />
                <span className="text-gray-500">{habit.frequency}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

