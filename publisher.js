// publisher.js
import amqp from 'amqplib';

// Grab attendeeId from command line argument
const attendeeId = process.argv[2];

if (!attendeeId) {
  console.error('❌ Please provide an attendee ID, e.g.:');
  console.error('   node publisher.js 825a0fde-56c2-4a1d-9bcb-7988a5ed1');
  process.exit(1);
}

async function publishPrintRequest(attendeeId) {
  try {
    const connection = await amqp.connect(
      'amqps://qtyrqwrr:CXdh0BTNd-6Gql_WbaJhDyKmqN0S4yV6@kebnekaise.lmq.cloudamqp.com/qtyrqwrr'
    );
    const channel = await connection.createChannel();
    const queue = 'badge_print_requests';

    await channel.assertQueue(queue, { durable: true });

    // Align key name with consumer/server expectations
    const message = JSON.stringify({ attendeeId });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(`🕒 Pending badge print request for attendee ${attendeeId}…`);
    console.log(`📤 Published print request → awaiting consumer processing`);

    await channel.close();
    await connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to publish print request:', err.message);
    process.exit(1);
  }
}

// Run publisher with provided ID
publishPrintRequest(attendeeId);