import { config } from "dotenv";
import amqp from "amqplib"

config();

async function priorityMax() {
  const connection = await amqp.connect({
    hostname: 'localhost',
    port: 5672,
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  })


  // Criando canal de comunicação
  const channel = await connection.createChannel()

  // Definindo a fila - criando se não existe
  await channel.assertQueue('minha_fila_prioridade', {
    durable: true,
    maxPriority: 5
  })

  // Enviando mensagem via publish
  channel.publish('', 'minha_fila_prioridade', Buffer.from('Minha mensagem'), { priority: 1 })
  // Outra forma de enviar para a fila
  // channel.sendToQueue('minha_fila', Buffer.from('Mensagem vinda do sendToQueue'))

  await channel.close()
  await connection.close()
}

export default priorityMax