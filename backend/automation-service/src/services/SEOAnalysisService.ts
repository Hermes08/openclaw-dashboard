import { ConnectorFactory } from '../connectors/ConnectorFactory';
import axios from 'axios';

export class SEOAnalysisService {
    private projectServiceUrl = process.env.PROJECT_SERVICE_URL || 'http://localhost:3001';

    async runDomainAudit(projectId: string, domain: string, apiKey: string) {
        console.log(`Starting SEO Audit for Project ${projectId} (${domain})...`);
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);

        try {
            // 1. Get Audit Result
            const audit = await seoAdapter.getAudit({ url: domain });
            console.log(`Audit Score for ${domain}: ${audit.score}`);

            // 2. Generate Tasks based on issues
            for (const issue of audit.issues) {
                await this.createProjectTask(projectId, {
                    title: `SEO Fix: ${issue.title}`,
                    description: issue.description,
                    priority: issue.severity === 'high' ? 'P0' : 'P1',
                    skillId: 'seo',
                    source: 'seorolodex',
                    metadata: { issue }
                });
            }

            // 3. Check for Keyword Gaps (Simplified)
            const keywords = await seoAdapter.getKeywords(domain);
            if (keywords && keywords.gaps) {
                await this.createProjectTask(projectId, {
                    title: `SEO Content Gap: New Keywords identified`,
                    description: `Identified ${keywords.gaps.length} new keyword opportunities.`,
                    priority: 'P2',
                    skillId: 'seo',
                    source: 'seorolodex',
                    metadata: { keywords: keywords.gaps }
                });
            }

            console.log(`SEO Audit completed for ${domain}`);
        } catch (error: any) {
            console.error(`SEO Audit failed for ${domain}:`, error.message);
            throw error;
        }
    }

    private async createProjectTask(projectId: string, task: any) {
        try {
            await axios.post(`${this.projectServiceUrl}/projects/${projectId}/tasks`, task);
        } catch (error: any) {
            console.error(`Failed to sync task to Project Service:`, error.message);
        }
    }
}
