const amqp = require('amqplib');

let channel = null;

const connectRabbit = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('validate_deck', { durable: true });
    console.log('Connected to RabbitMQ');
    return channel;
};

const getChannel = () => channel;

module.exports = { connectRabbit, getChannel };