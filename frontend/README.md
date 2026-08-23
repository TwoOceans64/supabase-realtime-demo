# Supabase Realtime Demo – Frontend (React + Vite)

## Overview
This folder contains the **React + Vite frontend** for the Supabase Realtime Demo project. It connects to the Supabase backend and displays attendee check‑in status live. The frontend subscribes to realtime changes in the `attendees` table and updates the UI instantly when check‑ins occur.

## Features
- **Realtime Listener:** Subscribes to Supabase changes and updates attendee status in the UI.
- **Attendee Dashboard:** Displays name, email, and check‑in status (⏳ Pending → ✅ Checked In).
- **Environment Variables:** Uses `.env.local` for Supabase URL and anon key.
- **Hot Module Reloading (HMR):** Powered by Vite for fast development.

## Setup
1. Navigate into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your Supabase credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   - Default: `http://localhost:5173`

## Demo Flow
1. Backend scripts (`publisher.js`, `consumer.js`, `server.js`) update the Supabase database.  
2. The frontend subscribes to realtime changes in the `attendees` table.  
3. When an attendee is checked in, the UI updates instantly.  

## Lessons Learned
- Keeping frontend and backend separated in folders makes the project cleaner.  
- Supabase environment variables must be correctly set for the frontend to connect.  
- Realtime subscriptions are lightweight and integrate smoothly with React state.  

## Status
✅ Frontend fully working and aligned with the pivot spec.  
📌 Displays realtime attendee check‑ins end‑to‑end.  
```

---
