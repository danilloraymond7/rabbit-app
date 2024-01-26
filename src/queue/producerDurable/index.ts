import { config } from "dotenv";
import amqp from "amqplib"

config();

async function producerDurable() {
  const connection = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  })


  // Criando canal de comunicação
  const channel = await connection.createChannel()

  // Definindo a fila - criando se não existe
  await channel.assertQueue('minha_fila', {
    durable: true
  })

  // Enviando mensagem via publish
  channel.publish('', 'minha_fila', Buffer.from('Minha mensagem'), { persistent: true })
  // Outra forma de enviar para a fila
  // channel.sendToQueue('minha_fila', Buffer.from('Mensagem vinda do sendToQueue'))

  await channel.close()
  await connection.close()
}

export default producerDurable