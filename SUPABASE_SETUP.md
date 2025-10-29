# Supabase Integration Guide

This guide explains how to set up Supabase persistence for the Habit Tracker app.

## Overview

The Habit Tracker now persists all habits to Supabase instead of just storing them in memory. This means:

✅ Habits persist after page refresh
✅ Habits sync across browser tabs
✅ Data is backed up in the cloud
✅ Easy to add authentication later

## Setup Steps

### 1. Create a Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project" and create a new project
4. Copy your **Project URL** and **Anon Key** (found in Settings → API)

### 2. Set Environment Variables

Create a `.env.local` file in the root of your project:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never commit `.env.local` to git! Add it to `.gitignore`

### 3. Create the Habits Table in Supabase

Go to **Supabase Dashboard** → **SQL Editor** → **New Query**, paste this SQL and run it:

```sql
CREATE TABLE habits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  weeklyTarget INTEGER NOT NULL CHECK (weeklyTarget >= 1 AND weeklyTarget <= 7),
  checks JSONB NOT NULL DEFAULT '{}',
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_habits_created_at ON habits(createdAt DESC);
```

### 4. (Optional) Enable Row Level Security (RLS)

For production apps, you should enable RLS policies. For now, disable RLS on the habits table:

1. Go to **Authentication** → **Policies**
2. Click on the `habits` table
3. For testing, you can "Enable RLS" with a simple "Allow all" policy

For production, create more restrictive policies:

```sql
-- Allow authenticated users to access their own habits
-- (You'd need to add a user_id column and auth logic)
```

## Architecture

### How It Works

```
User Action (Create/Update/Delete)
        ↓
Store Action Called (Async)
        ↓
Optimistic UI Update (Immediate)
        ↓
Supabase Request (Background)
        ↓
Success? Yes → Keep UI as-is
Success? No  → Rollback UI + Show Error
```

### Optimistic Updates

All operations use optimistic updates for snappy UX:

1. **Create**: Habit appears immediately, syncs to Supabase in background
2. **Update**: Changes appear immediately, synced to Supabase
3. **Delete**: Habit disappears immediately, removed from Supabase
4. **Toggle Check**: Check state changes immediately, persisted to Supabase

If the Supabase call fails, the UI automatically rolls back.

## Files & Code

### New Files Created

```
src/
├── services/
│   └── supabaseClient.ts          # Supabase client initialization
└── features/habits/
    └── hooks/
        └── useInitializeHabits.ts  # Load habits on app startup

tests/
└── Supabase.spec.ts               # Integration tests & documentation

.env.example                        # Template for environment variables
```

### Modified Files

**src/services/db.ts**
- Added `supabaseHabitService` with methods:
  - `listHabits()` - Fetch all habits
  - `getHabit(id)` - Fetch single habit
  - `addHabit(habit)` - Create new habit
  - `updateHabit(habit)` - Update existing habit
  - `deleteHabit(id)` - Delete habit

**src/features/habits/useHabitsStore.ts**
- Updated all actions to async (return Promises)
- Added Supabase syncing to all operations
- Added optimistic updates with rollback
- Added `loadHabits()` action to fetch from Supabase
- Added `error` state for error messages

**src/features/habits/pages/List.tsx**
- Added `useEffect` to load habits on mount
- Display loading state while fetching
- Display error messages if sync fails
- Updated handlers to await async actions

**src/features/habits/pages/New.tsx**
- Updated form submission to await habit creation

## Usage

### In React Components

```typescript
import { useHabitsStore } from '@/features/habits/useHabitsStore';

function MyComponent() {
  const habits = useHabitsStore((state) => state.habits);
  const create = useHabitsStore((state) => state.create);
  const loading = useHabitsStore((state) => state.loading);
  const error = useHabitsStore((state) => state.error);

  const handleCreate = async () => {
    try {
      const newHabit = await create({
        title: 'Morning Run',
        weeklyTarget: 5
      });
      console.log('Created:', newHabit);
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleCreate}>Create Habit</button>
    </div>
  );
}
```

### Load Habits on App Startup

Option 1: In your root App component

```typescript
import { useInitializeHabits } from '@/features/habits/hooks/useInitializeHabits';

function App() {
  useInitializeHabits(); // Load habits from Supabase on app start

  return <Outlet />;
}
```

Option 2: Directly call in useEffect

```typescript
const loadHabits = useHabitsStore((state) => state.loadHabits);

useEffect(() => {
  loadHabits();
}, [loadHabits]);
```

## Data Model

### Habit Type

```typescript
interface Habit {
  id: string;                    // UUID
  title: string;                 // Max 100 chars
  description?: string;          // Max 500 chars
  weeklyTarget: number;          // 1-7 days
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  checks: Record<              // Daily check-ins
    'YYYY-MM-DD',              // UTC date key
    boolean                    // true = completed
  >;
}
```

### Example Habit in Supabase

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Morning Run",
  "description": "30 min jog in the park",
  "weeklyTarget": 5,
  "createdAt": "2024-10-25T08:00:00Z",
  "updatedAt": "2024-10-29T15:30:00Z",
  "checks": {
    "2024-10-25": true,
    "2024-10-26": false,
    "2024-10-27": true,
    "2024-10-28": true,
    "2024-10-29": false
  }
}
```

## Testing

### Run Tests

```bash
# All tests
npm test

# Specific test file
npm test -- src/tests/Supabase.spec.ts

# Watch mode
npm test -- --watch
```

### Test Coverage

Tests document:
- ✅ Expected Supabase responses
- ✅ Optimistic update behavior
- ✅ Error handling & rollback
- ✅ Loading states
- ✅ Data persistence after reload
- ✅ Environment setup requirements

## Troubleshooting

### "Supabase environment variables are not set"

**Problem**: You see this warning in the console.

**Solution**:
1. Create `.env.local` in the project root
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart the dev server

### "Failed to create habit"

**Problem**: Creating a habit fails silently or shows an error.

**Possible causes**:
- Supabase credentials are wrong
- The `habits` table doesn't exist
- RLS policy is blocking writes
- Weekly target is invalid (must be 1-7)

**Solution**:
1. Check browser console for error message
2. Verify Supabase credentials in `.env.local`
3. Verify the `habits` table exists in Supabase
4. Check RLS policies in Supabase dashboard

### Habits disappear after refresh

**Problem**: Habits created locally don't persist after page refresh.

**Possible causes**:
- Supabase credentials are invalid
- The `habits` table doesn't exist
- Network error during sync

**Solution**:
1. Check browser DevTools → Network tab for Supabase requests
2. Look for error responses from Supabase
3. Verify your `.env.local` settings

### Performance Issues

**If syncing feels slow**:
- Make sure you're not creating multiple habits at once
- Check Supabase project's database performance
- Consider implementing a sync queue for offline support

## Advanced Features (Future)

These features could be added later:

- 🔐 **Authentication**: Only show user's own habits
- 📱 **Offline Support**: Queue changes while offline, sync when reconnected
- 🔄 **Real-time Sync**: Use Supabase subscriptions for live updates across tabs
- 📊 **Statistics**: Query aggregated data from Supabase
- 🏷️ **Categories**: Add habit categories/tags
- 📅 **History**: View historical check-in data

## API Reference

### Store Actions

All actions are async and automatically sync with Supabase:

```typescript
// Load all habits from Supabase
await useHabitsStore.getState().loadHabits();

// Create a new habit
const habit = await useHabitsStore.getState().create({
  title: 'Exercise',
  weeklyTarget: 5
});

// Update a habit
await useHabitsStore.getState().update(habitId, {
  title: 'Updated title'
});

// Delete a habit
await useHabitsStore.getState().remove(habitId);

// Toggle daily check-in
await useHabitsStore.getState().toggleCheck(habitId, '2024-10-29');
```

### Supabase Service (Low-level)

```typescript
import { supabaseHabitService } from '@/services/db';

// List all habits
const habits = await supabaseHabitService.listHabits();

// Get single habit
const habit = await supabaseHabitService.getHabit('123');

// Add habit
const newHabit = await supabaseHabitService.addHabit(habit);

// Update habit
const updated = await supabaseHabitService.updateHabit(habit);

// Delete habit
await supabaseHabitService.deleteHabit('123');
```

## Production Checklist

Before deploying to production:

- [ ] Set environment variables on hosting platform (Vercel, Netlify, etc.)
- [ ] Enable Row Level Security (RLS) on Supabase
- [ ] Set up authentication (if needed)
- [ ] Add error monitoring (Sentry, etc.)
- [ ] Test on slow network (DevTools → Network → Slow 3G)
- [ ] Test with offline detection
- [ ] Add loading skeletons for better UX
- [ ] Set up automated backups in Supabase
- [ ] Review Supabase pricing and set usage limits

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Open an issue for bugs
