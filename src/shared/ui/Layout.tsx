import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

