import amqp from "amqplib";
import { config } from "dotenv";

config();

async function exchange() {
  const conn = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  });

  const channel = await conn.createChannel();

  await channel.assertExchange('system_exchange', 'topic')
  await channel.assertQueue('system_logs')
  await channel.assertQueue('system_errors')

  await channel.bindQueue('system_logs', 'system_exchange', 'logs.#')
  await channel.bindQueue('system_errors', 'system_exchange', '#.erro')

  channel.publish('system_exchange', 'logs.system.info', Buffer.from('Sistema iniciado'))
  channel.publish('system_exchange', 'logs.system.erro', Buffer.from('Erro no sistema'))

  await channel.close()
  await conn.close()
}

export default exchange;