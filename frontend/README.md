# Supabase Realtime Demo – Meridian Pivot Project

## Overview
This project is a solo recon build demonstrating **Supabase Realtime** with a **React + Vite frontend**. It was developed as part of the Meridian Pivot assignments, where the spec shifted from a polling model to a webhook‑driven architecture. The final deliverable shows attendees being checked in live, with database updates broadcast to the UI in real time.

## Features
- **Webhook Integration:** Attendee updates are pushed via webhooks instead of polled API calls.
- **Supabase Database:** Attendees table uses `gen_random_uuid()` for unique IDs.
- **Realtime Listener:** React frontend subscribes to Supabase changes and confirms check‑ins live.
- **Publisher/Consumer Scripts:** Simulate attendee check‑in events and forward payloads to the server.
- **Error Handling:** Logs invalid UUIDs, webhook failures, and database mismatches for debugging.

## Pivot Changes
- **Original Spec:** Polling API every 5 minutes to refresh attendee status.
- **Pivot Spec:** Event‑driven webhook model for immediate updates.
- **Why:** Polling was inefficient and redundant; pivot required real‑time responsiveness.

## Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/TwoOceans64/supabase-realtime-demo.git
   cd supabase-realtime-demo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. Run publisher/consumer scripts to simulate check‑ins:
   ```bash
   node publisher.js <attendee-uuid>
   node consumer.js
   ```

## Demo Flow
1. **Publisher** sends an attendee UUID event.  
2. **Consumer** forwards the payload to the webhook.  
3. **Server** validates and updates the Supabase attendees table.  
4. **Realtime listener** in React receives the change event.  
5. UI updates with “Attendee checked in” confirmation.  

## Lessons Learned
- Placeholders like `<attendee-uuid>` must be replaced with actual values.
- UUID mismatches highlight the importance of aligning with database‑generated IDs.
- Payload validation is critical to prevent silent webhook failures.
- Realtime listeners depend on successful backend updates.
- Documenting blockers and fixes accelerates recovery and avoids repeated mistakes.

## Status
✅ Fully working end‑to‑end demo after pivot.  
📌 Meets the new spec requirements.  
```

---
