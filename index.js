import { createClient } from '@supabase/supabase-js'

// Replace these with your actual project values from Supabase dashboard
const supabaseUrl = 'https://ccisduevrkdkeapjetkf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaXNkdWV2cmtka2VhcGpldGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTUwNjgsImV4cCI6MjEwMjYzMTA2OH0.usKo15cehyzVdUtkfcOrOYFJ1wF8NX070fHpaYhrBMQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Subscribe to changes in the "stock" table
supabase
  .channel('stock_changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'stock' },
    payload => {
      switch (payload.eventType) {
        case 'INSERT':
          console.log('🟢 Insert event:', payload.new)
          break
        case 'UPDATE':
          console.log('🟡 Update event:', {
            old: payload.old,
            new: payload.new
          })
          break
        case 'DELETE':
          console.log('🔴 Delete event:', payload.old)
          break
        default:
          console.log('Other event:', payload)
      }
    }
  )
  .subscribe(status => {
    if (status === 'SUBSCRIBED') {
      console.log('✅ Connected to stock_changes channel, listening for events...')
    }
  })

// Optional: insert a test row to see realtime in action
async function insertTestRow() {
  const { error } = await supabase
    .from('stock')
    .insert([{ item_name: 'Test Item', quantity: 5 }])

  if (error) console.error('Insert error:', error)
  else console.log('Inserted test row successfully')
}

insertTestRow()
