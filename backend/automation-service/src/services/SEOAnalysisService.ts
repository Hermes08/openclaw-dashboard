import { ConnectorFactory } from '../connectors/ConnectorFactory';
import axios from 'axios';

export class SEOAnalysisService {
    private projectServiceUrl = process.env.PROJECT_SERVICE_URL || 'http://localhost:3001';

    async runDomainAudit(projectId: string, domain: string, apiKey: string) {
        console.log(`Starting SEO Audit for Project ${projectId} (${domain})...`);
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);

        try {
            const audit: any = await seoAdapter.siteAudit({ target: domain });
            for (const issue of (audit.issues || [])) {
                await this.createProjectTask(projectId, {
                    title: `SEO Fix: ${issue.title}`,
                    description: issue.description,
                    priority: issue.severity === 'high' ? 'P0' : 'P1',
                    skillId: 'seo',
                    source: 'seorolodex'
                });
            }
        } catch (error: any) {
            console.error(`SEO Audit failed:`, error.message);
        }
    }

    async runCompetitorAnalysis(projectId: string, domain: string, apiKey: string) {
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);
        try {
            const competitors: any = await seoAdapter.analyzeCompetitors({ target: domain, limit: 5 });
            const compDomains = competitors.map((c: any) => c.domain);
            
            const gap: any = await seoAdapter.keywordGapAnalysis({ 
                yourDomain: domain, 
                competitorDomains: compDomains 
            });

            await this.createProjectTask(projectId, {
                title: 'Competitor Keyword Gap Report',
                description: `Identified gaps against ${compDomains.join(', ')}.`,
                priority: 'P1',
                skillId: 'seo',
                metadata: { gap }
            });
        } catch (error: any) {
            console.error(`Competitor Analysis failed:`, error.message);
        }
    }

    async runBacklinkMonitor(projectId: string, domain: string, apiKey: string) {
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);
        try {
            const summary: any = await seoAdapter.fetchBacklinkSummary({ target: domain });
            if (summary.spam_score > 50) {
                await this.createProjectTask(projectId, {
                    title: 'High Spam Score Detected',
                    description: `Domain has a spam score of ${summary.spam_score}. Review backlinks immediately.`,
                    priority: 'P0',
                    skillId: 'seo'
                });
            }
        } catch (error: any) {
            console.error(`Backlink Monitoring failed:`, error.message);
        }
    }

    async runContentStrategy(projectId: string, keyword: string, apiKey: string) {
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);
        try {
            const strategy: any = await seoAdapter.contentStrategist({ keyword });
            await this.createProjectTask(projectId, {
                title: `Content Strategy: ${keyword}`,
                description: `AI-generated strategy for "${keyword}".`,
                priority: 'P2',
                skillId: 'content',
                metadata: { strategy }
            });
        } catch (error: any) {
            console.error(`Content Strategy failed:`, error.message);
        }
    }

    private async createProjectTask(projectId: string, task: any) {
        try {
            await axios.post(`${this.projectServiceUrl}/projects/${projectId}/tasks`, task);
        } catch (error: any) {
            console.error(`Failed to sync task:`, error.message);
        }
    }
}
