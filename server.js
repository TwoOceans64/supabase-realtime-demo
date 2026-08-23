// server.js
import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://ccisduevrkdkeapjetkf.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaXNkdWV2cmtka2VhcGpldGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTUwNjgsImV4cCI6MjEwMjYzMTA2OH0.usKo15cehyzVdUtkfcOrOYFJ1wF8NX070fHpaYhrBMQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
app.use(bodyParser.json());

// Webhook endpoint for vendor callback
app.post('/print/callback', async (req, res) => {
  const { attendeeId, status } = req.body;

  console.log('📩 Webhook payload received:', req.body);

  if (!attendeeId || !status) {
    console.error('❌ Invalid payload: missing attendeeId or status');
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  if (status === 'success') {
    try {
      // Fetch attendee first
      const { data, error: fetchError } = await supabase
        .from('attendees')
        .select('checked_in, name')
        .eq('id', attendeeId)
        .single();

      if (fetchError) {
        console.error('❌ Failed to fetch attendee:', fetchError.message);
        return res.status(500).json({ success: false, message: 'Database fetch failed' });
      }

      if (!data) {
        console.error(`❌ No attendee found with ID ${attendeeId}`);
        return res.status(404).json({ success: false, message: 'Attendee not found' });
      }

      if (data.checked_in) {
        console.log(`⚠️ Duplicate scan: attendee ${data.name || attendeeId} already checked in`);
        return res.status(200).json({ success: true, message: 'Already checked in' });
      }

      // Update attendee check-in status
      const { error: updateError } = await supabase
        .from('attendees')
        .update({ checked_in: true })
        .eq('id', attendeeId);

      if (updateError) {
        console.error('❌ Failed to update attendee:', updateError.message);
        return res.status(500).json({ success: false, message: 'Database update failed' });
      }

      console.log(`✅ Attendee ${data.name || attendeeId} marked as Checked In (Supabase)`);
      return res.status(200).json({ success: true, message: 'Checked in' });
    } catch (err) {
      console.error('❌ Unexpected error:', err.message);
      return res.status(500).json({ success: false, message: 'Unexpected server error' });
    }
  } else {
    console.log(`❌ Print failed for attendee ${attendeeId}`);
    return res.status(200).json({ success: false, message: 'Print failed' });
  }
});

// Reset endpoint to set all attendees back to pending
app.post('/reset', async (req, res) => {
  try {
    const { error } = await supabase
      .from('attendees')
      .update({ checked_in: false });

    if (error) {
      console.error('❌ Failed to reset attendees:', error.message);
      return res.status(500).json({ success: false, message: 'Reset failed' });
    }

    console.log('🔄 All attendees reset to Pending');
    return res.status(200).json({ success: true, message: 'All attendees reset to pending' });
  } catch (err) {
    console.error('❌ Unexpected error during reset:', err.message);
    return res.status(500).json({ success: false, message: 'Unexpected server error' });
  }
});

// Auto-reset when server stops
const resetOnExit = async () => {
  try {
    await supabase.from('attendees').update({ checked_in: false });
    console.log('🛑 Server stopping → attendees reset to Pending');
  } catch (err) {
    console.error('❌ Failed to auto-reset on exit:', err.message);
  }
};

process.on('SIGINT', async () => {
  await resetOnExit();
  process.exit();
});

process.on('SIGTERM', async () => {
  await resetOnExit();
  process.exit();
});

// Start server
const PORT = 3000; // ✅ Match consumer.js
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
});