import express from 'express';
import dotenv from 'dotenv';
import { TaskScheduler } from './jobs/TaskScheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

const scheduler = new TaskScheduler();
scheduler.init();

app.get('/health', (req, res) => {
    res.json({ status: 'Automation Service is running' });
});

app.listen(PORT, () => {
    console.log(`Automation Service running on http://localhost:${PORT}`);
});
