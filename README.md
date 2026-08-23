# Supabase Realtime Demo

## Overview
This repository demonstrates a **full‑stack realtime check‑in system** using Supabase as the backend and a React + Vite frontend. It was built as part of the Meridian Pivot project, where the spec shifted from a polling model to a webhook‑driven architecture.

The repo contains:
- **frontend/** → React + Vite app with realtime listener and UI.
- **publisher.js / consumer.js / server.js** → Node scripts simulating attendee events and handling webhook updates.
- **journal.md** → Development log with blockers, fixes, and lessons learned.

## Key Features
- Webhook integration for attendee updates (no polling).
- Supabase database with UUID‑based attendee IDs.
- Realtime listener that updates the UI when attendees check in.
- Error handling for invalid UUIDs and webhook payload mismatches.
- Documentation of blockers, fixes, and lessons learned.

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
   cd frontend
   npm run dev
   ```
4. Run publisher/consumer scripts to simulate check‑ins:
   ```bash
   node publisher.js <attendee-uuid>
   node consumer.js
   ```

## Demo Flow
1. Publisher sends an attendee UUID event.  
2. Consumer forwards the payload to the webhook.  
3. Server validates and updates the Supabase attendees table.  
4. Realtime listener in React receives the change event.  
5. UI updates with “Attendee checked in” confirmation.  

## Lessons Learned
- Syntax placeholders (`<attendee-uuid>`) must be replaced with actual values.
- UUID mismatches highlight the importance of aligning with database‑generated IDs.
- Payload validation prevents silent webhook failures.
- Realtime listeners depend on successful backend updates.
- Documenting blockers and fixes accelerates recovery and avoids repeated mistakes.

## Status
✅ Fully working end‑to‑end demo after pivot.  
📌 Meets the new spec requirements.  
```

---


```