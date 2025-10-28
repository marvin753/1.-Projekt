import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import { registerServiceWorker } from './registerSW';
import { ErrorBoundary } from './ErrorBoundary';
import './styles.css';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </React.StrictMode>
);

