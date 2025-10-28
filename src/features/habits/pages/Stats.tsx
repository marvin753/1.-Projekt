import { Container, Card } from '@/shared/ui';

export function StatsPage() {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Statistics
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Total Habits
          </h2>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">0</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Current Streak
          </h2>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">0</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">days</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Completion Rate
          </h2>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">0%</p>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Activity Chart
        </h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Chart visualization will appear here
          </p>
        </div>
      </Card>
    </Container>
  );
}
