# GraphQL + Supabase Solo Recon Journal

## Day 1
- **Setup:** Created project folder, initialized npm, installed Supabase client.
- **Blocker:** Confused about Realtime toggle in dashboard.
- **Fix:** Learned realtime is enabled by default in public schema.
- **Time Log:** 2 hours setup, 30 min debugging.

## Day 2
- **Setup:** Wrote subscription script, tested inserts.
- **Blocker:** Insert failed with anon key.
- **Fix:** Switched to service role key for backend inserts.
- **Time Log:** 1 hour coding, 45 min testing.

## Day 3
- **Setup:** Ran publisher.js with `<attendee-uuid>` syntax.
- **Blocker:** PowerShell threw parser error (“The '<' operator is reserved for future use”).
- **Fix:** Realized `< >` were placeholders, reran with raw UUID.
- **Time Log:** ~1 day lost before resolving syntax issue.

## Day 4
- **Setup:** Published UUID directly to server.js.
- **Blocker:** Invalid input syntax for type uuid.
- **Fix:** Learned Supabase generates IDs with `gen_random_uuid()`, so random UUIDs won’t match.
- **Time Log:** ~1.5 days troubleshooting before identifying mismatch.

## Day 5
- **Setup:** Consumer forwarded payload to webhook.
- **Blocker:** Webhook returned HTTP 500 due to missing `status` field in payload.
- **Fix:** Corrected payload shape to include `status`.
- **Time Log:** ~1 day lost before correcting payload.

## Day 6
- **Setup:** Subscribed realtime.js listener for attendee updates.
- **Blocker:** No “Attendee checked in” event fired.
- **Fix:** Fixed database update logic so realtime broadcasted changes correctly.
- **Time Log:** ~1 day lost debugging realtime listener.

---

## Total Time Lost
- **Overall:** 4 days and 8 hours across all blockers.
- Each issue compounded the next until fixes were applied, but documenting the process helped track progress and avoid repeating mistakes.

---

## Lessons Learned
- **Syntax awareness matters:** Misusing placeholders like `<attendee-uuid>` cost significant time. Always confirm command syntax before running.  
- **Database integrity is critical:** Publishing random UUIDs highlighted the importance of aligning with actual database‑generated IDs.  
- **Payload validation saves time:** Missing fields in webhook payloads can silently break flows; validating payload shape upfront prevents wasted debugging.  
- **Realtime depends on backend correctness:** Listener failures were not frontend issues but consequences of broken database updates.  
- **Documentation accelerates recovery:** Keeping a journal of blockers and fixes made it easier to track progress and avoid repeating mistakes.  
- **Adaptability is key:** The pivot forced me to drop obsolete polling logic and embrace the webhook model, showing the value of letting go of outdated approaches quickly.  

---
