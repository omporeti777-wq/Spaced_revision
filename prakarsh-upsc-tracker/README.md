# Prakarsh UPSC Tracker

An offline-first study and habit tracker with dynamic subjects, spaced-revision scheduling, and a Supabase-ready cloud data layer.

## Run locally

1. Extract the downloaded ZIP first. Do not run commands inside the ZIP file or its `outputs` folder.
2. Open a terminal in the extracted `prakarsh-upsc-tracker` folder — the folder containing `package.json`.
3. Run `npm install` once.
4. Run `npm run dev` and open the displayed local address.

## Cloud setup

Phase 3 adds the database schema and secure sync service. Follow [CLOUD_SETUP.md](./CLOUD_SETUP.md) to create a Supabase project and configure `.env.local`.

Cloud upload/download is activated after Phase 4 adds user authentication. This ensures cloud data is protected by Row Level Security from the first synced record.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — data model and module architecture.
- [CLOUD_SETUP.md](./CLOUD_SETUP.md) — Supabase project setup and key safety.
