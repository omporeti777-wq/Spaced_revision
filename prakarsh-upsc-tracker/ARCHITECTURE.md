# Study Tracker architecture

## Dynamic subjects

Subjects are no longer imported from a fixed application list. They are persisted records and are exposed to every screen through `DataContext`.

```text
Subjects page / lecture form
        ↓
DataContext subject actions
        ↓
local subject repository → localStorage
        ↓
lectures, revision tasks, calendar, statistics, task badges
```

### Subject record

```js
{
  id: "uuid",
  userId: null,       // reserved for Supabase Auth user id
  name: "Modern History",
  color: "#4FA89B",
  sortOrder: 0,
  createdAt: "ISO timestamp",
  updatedAt: "ISO timestamp"
}
```

`id` is the relationship key. A lecture and each generated revision task store `subjectId`. They also retain `subject` as a denormalised display-name snapshot, so data saved by earlier app versions remains readable and list rendering stays simple.

### Local migration

On startup `hydrateSubjectData` checks the persisted `upsc-tracker:subjects` collection. For older installs that only have subject names inside lectures/tasks, it derives subject records, assigns IDs, and rewrites the in-memory lecture/task records with `subjectId`. The normal persistence effects then save the upgraded shape automatically. No existing lecture or revision is discarded by this migration.

### Cascading operations

- Create: appends a persisted subject with the next `sortOrder`.
- Rename/color change: updates the subject and all matching lecture/task display snapshots.
- Reorder: saves sequential `sortOrder` values. The Subjects page provides move-up and move-down controls that work on mouse and keyboard, including mobile.
- Delete: requires a confirmation that states the number of linked lectures and revision tasks. Confirming removes the subject and all records with its `subjectId`.

## Persistence boundary and Supabase path

`src/services/subjectRepository.js` defines the local subject persistence adapter (`list` and `save`) separately from React UI. Replace this adapter with a Supabase-backed implementation when authentication is introduced; consumers should continue to use `DataContext` rather than querying storage directly.

Suggested Supabase table:

```sql
create table subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subjects_user_sort_idx on subjects (user_id, sort_order);
create unique index subjects_user_name_idx on subjects (user_id, lower(name));
```

In the same migration, add `subject_id` columns to `lectures` and `revision_tasks`, index them with `user_id`, and use foreign keys with the desired delete policy. The current product behavior is a confirmed cascade delete, so `on delete cascade` is appropriate once the confirmation remains in the client UI. Enable Row Level Security and scope every policy to `auth.uid() = user_id`.

## Habit Tracker

Habits follow the same normalized pattern as subjects. `habits` holds the editable definition and `habit_logs` holds one completion record per habit/day. An unchecked day has no log; this keeps the data small even over many years.

```js
// habits
{ id, userId: null, name, color, icon: null, active: true, sortOrder, createdAt, updatedAt }

// habit_logs
{ id, habitId, date: "YYYY-MM-DD", completed: true, createdAt, updatedAt }
```

`DataContext` owns CRUD, ordering, and completion toggles. It blocks future or pre-creation check-ins, and deleting a habit removes only that habit's completion logs after confirmation. `src/utils/habitAnalytics.js` derives all percentages, per-habit streaks, perfect-day streaks, history series, and heatmap data from the logs instead of storing calculated values.

The Habit Tracker provides a weekly check-in grid with historic navigation, daily/weekly/monthly completion rates, 30-day habit score, streaks, weekly and monthly charts, and a 18-week heatmap. The dashboard also surfaces today's habit completion once at least one habit exists.

For Supabase, add `habits` and `habit_logs` tables with `user_id` on both tables, a unique index on `(habit_id, date)`, indexes on `(user_id, sort_order)` and `(user_id, date)`, row-level security based on `auth.uid()`, and cascade deletion from habits to logs.

## Cloud database (Phase 3)

The project includes a complete Supabase migration at `supabase/migrations/20260728_initial_cloud_schema.sql`. It creates normalized `subjects`, `lectures`, `revision_tasks`, `habits`, `habit_logs`, and `user_settings` tables; adds indexes for user/date and user/order lookups; cascades dependent records on deletion; and enables Row Level Security on every table.

`src/services/cloud/studySync.js` is an offline-first snapshot sync boundary. It maps local records to database rows, uploads them in foreign-key order, removes remote rows deleted locally, and pulls a user-scoped snapshot back into the app. It requires an authenticated access token and user id by design. Phase 4 will provide those through Supabase Auth, which is necessary for private cross-device syncing without exposing one user's data to another.

To configure the client, copy `.env.example` to `.env.local` and add the project URL plus publishable key. The `.env.local` file is ignored by Git. Never use a Supabase service-role key in the browser.

## Main files changed

- `src/context/DataContext.jsx` — subject state, migration, CRUD, reorder, and cross-record cascading.
- `src/services/subjectRepository.js` — subject model, migration helper, and local repository boundary.
- `src/pages/Subjects.jsx` — responsive management UI.
- `src/components/lecture/LectureForm.jsx` — dynamic subject selector.
- `src/pages/SubjectDetail.jsx`, `src/pages/Statistics.jsx`, `src/pages/CalendarPage.jsx`, and `src/components/tasks/TaskItem.jsx` — resolve colors and relationships by `subjectId`.
- `src/pages/HabitTracker.jsx`, `src/services/habitRepository.js`, and `src/utils/habitAnalytics.js` — dynamic Habit Tracker, local persistence, and derived analytics.
