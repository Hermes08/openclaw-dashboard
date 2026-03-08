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

// Auth Middleware
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.header('X-API-KEY');
    const validKey = process.env.API_KEY || 'dev-key-123';

    // Only protect write operations or specific paths if needed
    // For now, let's protect everything to be safe, or just POST/PUT/DELETE
    if (req.method !== 'GET' && apiKey !== validKey) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing API Key' });
    }
    next();
};

app.use(authMiddleware);

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
