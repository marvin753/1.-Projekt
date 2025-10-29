import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { HabitListPage } from '@/features/habits/pages/List';
import { NewHabitPage } from '@/features/habits/pages/New';
import { EditHabitPage } from '@/features/habits/pages/Edit';
import { HabitDetailPage } from '@/features/habits/pages/Detail';
import { StatsPage } from '@/features/habits/pages/Stats';
import { NotFoundPage } from '@/features/habits/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HabitListPage />,
      },
      {
        path: 'habit/new',
        element: <NewHabitPage />,
      },
      {
        path: 'habit/:id/edit',
        element: <EditHabitPage />,
      },
      {
        path: 'habit/:id',
        element: <HabitDetailPage />,
      },
      {
        path: 'stats',
        element: <StatsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

