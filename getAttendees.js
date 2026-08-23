// getAttendees.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccisduevrkdkeapjetkf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaXNkdWV2cmtka2VhcGpldGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTUwNjgsImV4cCI6MjEwMjYzMTA2OH0.usKo15cehyzVdUtkfcOrOYFJ1wF8NX070fHpaYhrBMQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAttendees() {
  const { data, error } = await supabase
    .from('attendees')
    .select('id, name, email, checked_in');

  if (error) {
    console.error('❌ Error fetching attendees:', error.message);
  } else {
    console.log('✅ Attendees:', data);
  }
}

listAttendees();