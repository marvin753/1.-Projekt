# HabitTrackr - Quick Start Guide

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd habittrackr

# Install dependencies
npm install

# Or use the setup script
npm run setup
```

## Environment Setup

1. Copy the environment template:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your configuration (for M1 phase):
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_ENV=development
```

## Running the Project

### Development
```bash
npm run dev
```
Opens at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## Testing

### Unit Tests
```bash
npm run test:unit
```

### E2E Tests
```bash
npm run test:e2e
```

### With UI
```bash
npm run test:e2e:ui
```

## Code Quality

### Linting
```bash
npm run lint
npm run lint:fix
```

### Type Checking
```bash
npm run type-check
```

## Deployment

### Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The project is configured with `vercel.json` for automatic deployments.

## Architecture

- **Local-First**: All data stored in IndexedDB
- **Offline-Ready**: Service Worker caching with Workbox
- **PWA**: Installable on mobile and desktop
- **Type-Safe**: TypeScript with strict type checking
- **Tested**: Unit tests with Vitest, E2E with Playwright

## Performance

Target scores:
- Lighthouse: ≥90
- Core Web Vitals: All green
- FCP < 1.8s
- LCP < 2.5s
- TBT < 200ms

## Privacy Compliance

- No external trackers
- All data stored locally
- DS/DSGVO compliant
- No user behavior tracking



