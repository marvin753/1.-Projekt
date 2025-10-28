import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from '@/shared/ui';

export function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
        >
          ← Back to Habits
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Habit Details
        </h1>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Habit ID: {id}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is a placeholder for habit details. The habit tracking functionality will be implemented here.
          </p>

          <div className="flex gap-3">
            <Button variant="outline">Edit Habit</Button>
            <Button variant="secondary">Mark Complete Today</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Progress History
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your habit completion history will appear here.
          </p>
        </Card>
      </div>
    </Container>
  );
}
