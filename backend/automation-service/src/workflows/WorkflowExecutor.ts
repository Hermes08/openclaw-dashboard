import { SEOAnalysisService } from '../services/SEOAnalysisService';
import { MediaGenerationService } from '../services/MediaGenerationService';

export class WorkflowExecutor {
    private seoService = new SEOAnalysisService();
    private mediaService = new MediaGenerationService();

    async execute(task: any) {
        const { type, payload } = task;

        switch (type) {
            case 'SEO_AUDIT':
                await this.seoService.runDomainAudit(
                    payload.projectId, 
                    payload.domain, 
                    payload.apiKey
                );
                break;
            case 'VIDEO_GENERATION':
                await this.mediaService.produceVideo(payload);
                break;
            default:
                console.warn(`Unknown task type: ${type}`);
        }
    }
}
