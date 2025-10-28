# HabitTrackr

A Progressive Web App (PWA) for tracking habits and building consistency. Built with React, TypeScript, Vite, and featuring offline-first architecture with IndexedDB.

## 🚀 Tech Stack

- **Framework**: React 18.3 + TypeScript 5.6
- **Build Tool**: Vite 5.2
- **Routing**: React Router 6.26
- **State Management**: Zustand 4.5
- **Forms & Validation**: React Hook Form 7.52 + Zod 3.23
- **API Client**: Axios 1.7
- **Storage**: IndexedDB (via idb)
- **Styling**: TailwindCSS 3.4
- **PWA**: Workbox 7
- **Testing**: Vitest 1.6 + Playwright 1.48

## 📋 Prerequisites

- Node.js 20.11 or higher
- npm or yarn

## 🛠️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd habittrackr
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_ENV=development
```

## 🎯 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🧪 Testing

Run unit tests:
```bash
npm run test:unit
```

Run end-to-end tests:
```bash
npm run test:e2e
```

Run E2E tests with UI:
```bash
npm run test:e2e:ui
```

## 🏗️ Project Structure

```
/src
  /app              # Routes and router configuration
  /features/habits   # Habit tracking features
    /components     # Habit-related components
    /hooks          # Custom hooks
    /types          # TypeScript types
  /shared           # Shared resources
    /ui             # Reusable UI components
    /lib            # Utility functions
    /store          # Zustand stores
  /services         # API and database services
  /tests
    /e2e            # End-to-end tests
    /unit           # Unit tests
```

## 🔒 Privacy & Compliance

HabitTrackr is designed with DS/DSGVO compliance in mind:

- **No external trackers**: All analytics are disabled by default
- **Local-first storage**: Data is stored in IndexedDB, entirely on the user's device
- **No data collection**: No user behavior tracking or data sharing
- **Consent notice**: Footer includes privacy compliance information

## 🚀 Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The project is configured for automatic Vercel deployments.

### Environment Variables for Production

Ensure these are set in your deployment platform:
- `VITE_API_URL` - Your backend API URL
- `VITE_SUPABASE_URL` - Supabase project URL (for M1 phase)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (for M1 phase)

## 📊 Phase Plan

### M0 (Current): Local Mock Data
- IndexedDB for local storage
- Mock API responses
- Offline-first architecture
- No external dependencies

### M1 (Next): Backend Sync
- Supabase integration
- Real-time synchronization
- User authentication
- Cloud backup

## 🎯 Performance Goals

- Lighthouse score ≥ 90
- Core Web Vitals: Green
- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Largest Contentful Paint < 2.5s

## 📄 License

MIT

