import { config } from "dotenv";
import amqp from "amqplib"

config();
async function consumer() {
  const conn = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  });

  const channel = await conn.createChannel();

  await channel.assertQueue('minha_fila', {
    durable: true
  })

  channel.prefetch(5)

  channel.consume("minha_fila", (data) => {
    setTimeout(() => {
      channel.ack(data)
    }, 5000)

  });
}

export default consumer;