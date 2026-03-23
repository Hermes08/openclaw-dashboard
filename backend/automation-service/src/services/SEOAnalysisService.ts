import { ConnectorFactory } from '../connectors/ConnectorFactory';
import axios from 'axios';

export class SEOAnalysisService {
    private projectServiceUrl = process.env.PROJECT_SERVICE_URL || 'http://localhost:3001';

    async runDomainAudit(projectId: string, domain: string, apiKey: string) {
        console.log(`[SEOAnalysisService] Starting SEO Audit for Project ${projectId} (${domain})...`);
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);

        try {
            const auditRaw: any = await seoAdapter.siteAudit({ target: domain, max_crawl_pages: 50 });

            // siteAudit returns a crawl result object - extract actionable items from it
            // The response has pages[] with issues inside each page
            const pages: any[] = auditRaw?.pages || auditRaw?.items || [];
            const summary = auditRaw?.summary || auditRaw;

            // Build a unified list of issues from pages
            const issues: any[] = [];
            for (const page of pages) {
                const pageIssues = page?.checks || page?.issues || [];
                for (const issue of pageIssues) {
                    if (issue?.type === 'error' || issue?.type === 'warning') {
                        issues.push({
                            title: issue?.name || issue?.title || 'SEO Issue',
                            description: `[${page?.url || domain}] ${issue?.description || issue?.message || ''}`,
                            severity: issue?.type === 'error' ? 'high' : 'medium',
                        });
                    }
                }
            }

            // Always create at least one task with the audit summary
            if (issues.length === 0) {
                await this.createProjectTask(projectId, {
                    title: `SEO Audit Complete: ${domain}`,
                    description: `Site audit finished. Pages crawled: ${pages.length}. No critical errors detected. Raw summary: ${JSON.stringify(summary).substring(0, 300)}`,
                    priority: 'P2',
                    skillId: 'seo',
                    source: 'seorolodex',
                    metadata: { summary, domain, crawledPages: pages.length },
                });
            } else {
                for (const issue of issues.slice(0, 10)) {
                    await this.createProjectTask(projectId, {
                        title: `SEO Fix: ${issue.title}`,
                        description: issue.description,
                        priority: issue.severity === 'high' ? 'P0' : 'P1',
                        skillId: 'seo',
                        source: 'seorolodex',
                    });
                }
            }

            console.log(`[SEOAnalysisService] Audit complete for ${domain}. Issues found: ${issues.length}`);
        } catch (error: any) {
            console.error(`[SEOAnalysisService] SEO Audit failed for ${domain}:`, error.message);
            // Create a failed-state task so it's visible in the dashboard
            await this.createProjectTask(projectId, {
                title: `SEO Audit Failed: ${domain}`,
                description: `Error: ${error.message}`,
                priority: 'P0',
                skillId: 'seo',
                source: 'seorolodex',
                status: 'failed',
            });
        }
    }

    async runCompetitorAnalysis(projectId: string, domain: string, apiKey: string) {
        console.log(`[SEOAnalysisService] Starting Competitor Analysis for ${domain}...`);
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);

        try {
            const competitorsRaw: any = await seoAdapter.analyzeCompetitors({ target: domain, limit: 5 });

            // analyzeCompetitors returns an array - extract domain from possible field names
            const competitorsList: any[] = Array.isArray(competitorsRaw)
                ? competitorsRaw
                : competitorsRaw?.competitors || competitorsRaw?.items || [];

            const compDomains: string[] = competitorsList
                .map((c: any) => c?.domain || c?.competitor_domain || c?.url || c?.target || null)
                .filter(Boolean)
                .slice(0, 10);

            console.log(`[SEOAnalysisService] Found ${compDomains.length} competitors: ${compDomains.join(', ')}`);

            if (compDomains.length === 0) {
                await this.createProjectTask(projectId, {
                    title: 'Competitor Analysis: No competitors found',
                    description: `No competitor domains found for ${domain}. Raw response: ${JSON.stringify(competitorsRaw).substring(0, 300)}`,
                    priority: 'P2',
                    skillId: 'seo',
                    source: 'seorolodex',
                });
                return;
            }

            const gap: any = await seoAdapter.keywordGapAnalysis({
                yourDomain: domain,
                competitorDomains: compDomains,
            });

            await this.createProjectTask(projectId, {
                title: 'Competitor Keyword Gap Report',
                description: `Identified keyword gaps against: ${compDomains.join(', ')}.`,
                priority: 'P1',
                skillId: 'seo',
                source: 'seorolodex',
                metadata: { competitors: compDomains, gap },
            });

            console.log(`[SEOAnalysisService] Competitor analysis complete for ${domain}.`);
        } catch (error: any) {
            console.error(`[SEOAnalysisService] Competitor Analysis failed:`, error.message);
            await this.createProjectTask(projectId, {
                title: `Competitor Analysis Failed: ${domain}`,
                description: `Error: ${error.message}`,
                priority: 'P1',
                skillId: 'seo',
                source: 'seorolodex',
                status: 'failed',
            });
        }
    }

    async runBacklinkMonitor(projectId: string, domain: string, apiKey: string) {
        console.log(`[SEOAnalysisService] Starting Backlink Monitor for ${domain}...`);
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);

        try {
            const summary: any = await seoAdapter.fetchBacklinkSummary({ target: domain });
            const spamScore = summary?.spam_score ?? summary?.spamScore ?? 0;
            const totalBacklinks = summary?.total_count ?? summary?.backlinks_count ?? 0;

            const taskTitle = spamScore > 50
                ? `High Spam Score Detected: ${domain} (${spamScore})`
                : `Backlink Report: ${domain}`;

            await this.createProjectTask(projectId, {
                title: taskTitle,
                description: `Total backlinks: ${totalBacklinks}. Spam score: ${spamScore}/100. ${spamScore > 50 ? 'ACTION REQUIRED: Review and disavow toxic backlinks immediately.' : 'Profile looks healthy.'}`,
                priority: spamScore > 50 ? 'P0' : 'P2',
                skillId: 'seo',
                source: 'seorolodex',
                metadata: { summary },
            });

            console.log(`[SEOAnalysisService] Backlink monitor complete for ${domain}. Spam score: ${spamScore}`);
        } catch (error: any) {
            console.error(`[SEOAnalysisService] Backlink Monitoring failed:`, error.message);
            await this.createProjectTask(projectId, {
                title: `Backlink Monitor Failed: ${domain}`,
                description: `Error: ${error.message}`,
                priority: 'P1',
                skillId: 'seo',
                source: 'seorolodex',
                status: 'failed',
            });
        }
    }

    async runContentStrategy(projectId: string, keyword: string, apiKey: string) {
        console.log(`[SEOAnalysisService] Starting Content Strategy for keyword: "${keyword}"...`);
        const seoAdapter = ConnectorFactory.getSEORolodex(apiKey);

        try {
            const strategy: any = await seoAdapter.contentStrategist({ target: keyword });

            await this.createProjectTask(projectId, {
                title: `Content Strategy: ${keyword}`,
                description: `AI-generated strategy for "${keyword}". Topics: ${(strategy?.topics || strategy?.outline || []).slice(0, 3).join(', ') || 'See metadata for details.'}`,
                priority: 'P2',
                skillId: 'content',
                source: 'seorolodex',
                metadata: { strategy, keyword },
            });

            console.log(`[SEOAnalysisService] Content strategy complete for "${keyword}".`);
        } catch (error: any) {
            console.error(`[SEOAnalysisService] Content Strategy failed:`, error.message);
            await this.createProjectTask(projectId, {
                title: `Content Strategy Failed: ${keyword}`,
                description: `Error: ${error.message}`,
                priority: 'P2',
                skillId: 'content',
                source: 'seorolodex',
                status: 'failed',
            });
        }
    }

    private async createProjectTask(projectId: string, task: any) {
        try {
            console.log(`[SEOAnalysisService] Creating task for project ${projectId}: ${task.title}`);
            await axios.post(`${this.projectServiceUrl}/api/projects/${projectId}/tasks`, task);
        } catch (error: any) {
            console.error(`[SEOAnalysisService] Failed to sync task to project-service:`, error.message);
        }
    }
}
