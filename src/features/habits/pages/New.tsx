import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Input } from '@/shared/ui';

export function NewHabitPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement habit creation
    navigate('/');
  };

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Create New Habit
        </h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="habit-name"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Habit Name
              </label>
              <Input
                id="habit-name"
                type="text"
                placeholder="e.g., Morning Exercise"
                required
              />
            </div>

            <div>
              <label
                htmlFor="habit-description"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Description (optional)
              </label>
              <textarea
                id="habit-description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                placeholder="Why is this habit important to you?"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit">Create Habit</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
}
