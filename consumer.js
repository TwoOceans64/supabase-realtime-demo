// consumer.js
import amqp from 'amqplib';
import axios from 'axios';

async function consumePrintRequests() {
  const connection = await amqp.connect(
    'amqps://qtyrqwrr:CXdh0BTNd-6Gql_WbaJhDyKmqN0S4yV6@kebnekaise.lmq.cloudamqp.com/qtyrqwrr'
  );
  const channel = await connection.createChannel();
  const queue = 'badge_print_requests';

  await channel.assertQueue(queue, { durable: true });

  console.log(`🚀 Consumer ready — waiting for messages in "${queue}"...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const request = JSON.parse(msg.content.toString());
      const attendeeId = request.attendeeId;

      console.log(`📩 Received print request for attendee ${attendeeId}`);
      console.log(`🖨️ Badge printed for ${attendeeId}`);

      try {
        await axios.post('http://localhost:3000/print/callback', {
          attendeeId,
          status: 'success',
        });
        console.log(`✅ Webhook called successfully for attendee ${attendeeId}`);
      } catch (error) {
        console.error(`❌ Failed to call webhook for ${attendeeId}:`, error.message);
      }

      channel.ack(msg);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('👋 Shutting down consumer...');
    await channel.close();
    await connection.close();
    process.exit(0);
  });
}

consumePrintRequests();