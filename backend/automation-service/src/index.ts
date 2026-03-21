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

app.use(express.json());

// Workflow Control Endpoints
app.post('/workflows/seo/audit', async (req, res) => {
    const { projectId } = req.body;
    try {
        const config = await configService.getProjectConfig(projectId);
        await workflowExecutor.execute({
            type: 'SEO_AUDIT',
            payload: { 
                projectId, 
                domain: config.domain, 
                apiKey: config.seo.apiKey 
            }
        });
        res.json({ message: 'SEO Audit started', projectId });
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
