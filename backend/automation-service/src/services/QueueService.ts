import * as amqp from 'amqplib';

export class QueueService {
    private connection?: amqp.ChannelModel;
    private channel?: amqp.Channel;

    async connect() {
        try {
            const url = process.env.RABBITMQ_URL || 'amqp://localhost';
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            console.log("Connected to RabbitMQ");
        } catch (error) {
            console.error("RabbitMQ connection error", error);
        }
    }

    async sendToQueue(queue: string, message: any) {
        if (!this.channel) await this.connect();
        await this.channel?.assertQueue(queue, { durable: true });
        this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }
}
