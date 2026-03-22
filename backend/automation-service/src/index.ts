import express from 'express';
import dotenv from 'dotenv';
import { TaskScheduler } from './jobs/TaskScheduler';
import { WorkflowExecutor } from './workflows/WorkflowExecutor';
import { ConfigService } from './services/ConfigService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const workflowExecutor = new WorkflowExecutor();
const configService = new ConfigService();
const SEO_ROLODEX_API_KEY = process.env.SEO_ROLODEX_API_KEY || '';

app.use(express.json());

// Unified workflow trigger endpoint - called by project-service runWorkflows
app.post('/workflows/trigger', async (req, res) => {
    const { projectId, domain, workflowType, keyword } = req.body;
    if (!projectId || !domain || !workflowType) {
        return res.status(400).json({ error: 'projectId, domain, and workflowType are required' });
    }
    try {
        await workflowExecutor.execute({
            type: workflowType,
            payload: {
                projectId,
                domain,
                apiKey: SEO_ROLODEX_API_KEY,
                keyword: keyword || domain,
            }
        });
        res.json({ message: `${workflowType} started`, projectId, domain });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Legacy SEO Audit endpoint
app.post('/workflows/seo/audit', async (req, res) => {
    const { projectId, domain, workflowType, keyword } = req.body;
    // Support both old (just SEO_AUDIT) and new (workflowType param) usage
    const type = workflowType || 'SEO_AUDIT';
    if (!projectId || (!domain && type !== 'SEO_CONTENT_STRATEGY')) {
        return res.status(400).json({ error: 'projectId and domain are required' });
    }
    try {
        await workflowExecutor.execute({
            type,
            payload: {
                projectId,
                domain: domain || keyword,
                apiKey: SEO_ROLODEX_API_KEY,
                keyword: keyword || domain,
            }
        });
        res.json({ message: `${type} started`, projectId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/workflows/video/generate', async (req, res) => {
    const { projectId, sourceContent, avatarId, voiceId } = req.body;
    try {
        const config = await configService.getProjectConfig(projectId);
        await workflowExecutor.execute({
            type: 'VIDEO_GENERATION',
            payload: {
                projectId,
                sourceContent,
                avatarId: avatarId || config.video.avatarId,
                voiceId: voiceId || config.video.voiceId,
                config: {
                    elevenLabsKey: config.video.elevenLabsKey,
                    heyGenKey: config.video.heyGenKey,
                    youtubeConfig: config.youtube
                }
            }
        });
        res.json({ message: 'Video generation started', projectId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

const scheduler = new TaskScheduler();
scheduler.init();

app.get('/health', (req, res) => {
    res.json({ status: 'Automation Service is running', version: '2.0.0-modular' });
});

app.listen(PORT, () => {
    console.log(`Automation Service running on http://localhost:${PORT}`);
});
