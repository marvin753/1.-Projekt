import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '@/shared/lib/theme';
import { Container, SkipLink, Footer } from '@/shared/ui';

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <Container>
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <NavLink
                  to="/"
                  className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  HabitTrackr
                </NavLink>
              </div>

              {/* Navigation */}
              <nav aria-label="Main navigation" className="flex items-center gap-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  Habits
                </NavLink>

                <NavLink
                  to="/stats"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  Stats
                </NavLink>

                {/* Dark mode toggle */}
                <button
                  onClick={toggleTheme}
                  className="ml-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  )}
                </button>
              </nav>
            </div>
          </Container>
        </header>

        {/* Main Content */}
        <main id="main-content" role="main" className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
