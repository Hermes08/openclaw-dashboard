import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Proxy routes
app.use('/api/projects', createProxyMiddleware({
    target: process.env.PROJECT_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/projects': '',
    },
}));

app.use('/api/automation', createProxyMiddleware({
    target: process.env.AUTOMATION_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/automation': '',
    },
}));

app.get('/health', (req, res) => {
    res.json({ status: 'API Gateway is running' });
});

app.listen(PORT, () => {
    console.log(`Gateway running on http://localhost:${PORT}`);
});
