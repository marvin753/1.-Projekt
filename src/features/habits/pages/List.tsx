import { Link } from 'react-router-dom';
import { Container, Card, Button } from '@/shared/ui';

export function HabitListPage() {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Example Habit
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is a placeholder for your habits. Create your first habit to get started!
          </p>
        </Card>
      </div>
    </Container>
  );
}
