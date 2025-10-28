import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/features/habits/components/HomePage';
import { Layout } from '@/shared/ui/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;

