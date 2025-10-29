# Quick Start Guide - Habit Tracker

## Get Started in 3 Steps

### Step 1: Start the Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:5173`

### Step 2: Drop the Supabase Table (if needed)
If you get errors about existing table, run this in Supabase SQL Editor:
```sql
DROP TABLE IF EXISTS public.habits CASCADE;

CREATE TABLE public.habits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  weekly_target INTEGER NOT NULL CHECK (weekly_target >= 1 AND weekly_target <= 7),
  checks JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read" ON public.habits FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.habits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.habits FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON public.habits FOR DELETE USING (true);

CREATE INDEX habits_created_at_idx ON public.habits(created_at);
```

### Step 3: Try It Out!

#### Create a Habit
1. Click **"Add New Habit"** button
2. Fill in:
   - Habit Name: "Morning Exercise"
   - Description: "30 minute workout"
   - Weekly Target: Click day "5" or type 5
3. Click **"Create Habit"**
4. ✅ Habit appears on home page!

#### Edit a Habit
1. On home page, click **"Edit"** button (blue) on any habit
2. Change the description or target
3. Click **"Save Changes"**
4. ✅ Habit updated!

#### Mark Daily Progress
1. Click **"Mark Today"** button
2. Button turns green: ✓ Done Today
3. ✅ Check saved!

#### Delete a Habit
1. Click **"Delete"** button (red)
2. ✅ Habit removed!

---

## Form Validation Examples

### Valid Input ✅
```
Title: "Morning Exercise"
Description: "Stay healthy"
Weekly Target: 5
Result: Submits successfully
```

### Invalid Input ❌
```
Title: "" (empty)
Result: Error - "Title is required"
```

---

## What Happens Behind the Scenes

### Creating a Habit
1. You fill the form
2. Click "Create Habit"
3. **Optimistic update**: Habit appears immediately
4. **Background sync**: Sends to Supabase
5. **Redirect**: Takes you back to home page
6. **Persistence**: Habit saved in Supabase (survives page refresh)

### If Something Goes Wrong
- Error message appears
- Habit is removed from list (rollback)
- Form stays filled so you can fix and retry

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Blur (leave field) | Validate that field |
| Enter (on form) | Submit form |

---

## File Locations

### Pages You Can Visit
- `/` - Home page with habit list
- `/habit/new` - Create new habit
- `/habit/:id/edit` - Edit specific habit

### Key Files
- `src/features/habits/components/HabitForm.tsx` - The form component
- `src/features/habits/pages/New.tsx` - Create page
- `src/features/habits/pages/Edit.tsx` - Edit page
- `src/features/habits/pages/List.tsx` - Home/list page
- `src/tests/HabitForm.spec.ts` - Form validation tests (31 tests)

---

## Running Tests

```bash
# Run all tests
npm test

# Run only form validation tests
npm test -- src/tests/HabitForm.spec.ts --run

# Watch mode (rerun on file change)
npm test -- src/tests/HabitForm.spec.ts
```

**Expected**: 31 tests passing ✅

---

Enjoy! 🚀
