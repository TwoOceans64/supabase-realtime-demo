// realtime.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccisduevrkdkeapjetkf.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaXNkdWV2cmtka2VhcGpldGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTUwNjgsImV4cCI6MjEwMjYzMTA2OH0.usKo15cehyzVdUtkfcOrOYFJ1wF8NX070fHpaYhrBMQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Subscribe to UPDATE events on attendees table
const channel = supabase
  .channel('attendees-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'attendees',
    },
    (payload) => {
      console.log('🔔 Change detected:', payload);

      const updatedRow = payload.new;
      if (updatedRow.checked_in) {
        console.log(`🎉 Attendee ${updatedRow.name} is now checked in!`);
      } else {
        console.log(`ℹ️ Attendee ${updatedRow.name} updated but not checked in.`);
      }
    }
  )
  .subscribe((status) => {
    console.log(`📡 Subscription status: ${status}`);
  });