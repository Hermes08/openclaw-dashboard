import cron from 'node-cron';
import { QueueService } from '../services/QueueService';

export class TaskScheduler {
    private queueService = new QueueService();

    init() {
        // Example: Run a task every minute
        cron.schedule('* * * * *', async () => {
            console.log('Running scheduled task...');
            await this.queueService.sendToQueue('tasks', {
                type: 'CRON_JOB',
                payload: { action: 'HEARTBEAT', timestamp: new Date() }
            });
        });
    }
}
