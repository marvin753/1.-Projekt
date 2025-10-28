import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { registerServiceWorker } from './registerSW';
import { ErrorBoundary } from './ErrorBoundary';
import { applyTheme, getInitialTheme } from '@/shared/lib/theme';
import './styles.css';

// Apply initial theme before rendering
applyTheme(getInitialTheme());

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);

