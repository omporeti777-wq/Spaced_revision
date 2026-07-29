# Supabase cloud setup

Phase 3 adds the database and sync layer. Keep the app in local mode until these steps are complete; no existing browser data is deleted.

1. Create a Supabase project.
2. In its SQL Editor, run `supabase/migrations/20260728_initial_cloud_schema.sql`.
3. Copy `.env.example` to `.env.local` in the project root.
4. In the Supabase dashboard, copy the project URL and the browser-safe publishable (or legacy anon) key into `.env.local`.
5. Restart the local development server.

Do not place a service-role key in `.env.local`. The browser can only use the publishable/anon key, while the SQL migration's Row Level Security policies ensure every authenticated user can read and write only records where `user_id = auth.uid()`.

## What happens next

Phase 4 will add Sign Up, Login, Logout, email verification, and password reset. Once users authenticate, it will pass their access token to the existing sync service. That enables secure cross-device backup and sync without exposing data between users.

For long-term retention, enable the backup/PITR option appropriate to your Supabase plan and keep the project active. The migration uses indexed, normalized tables that are designed for large lecture, revision, and habit-log histories.
