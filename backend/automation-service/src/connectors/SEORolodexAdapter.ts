import { BaseAdapter } from './BaseAdapter';

export class SEORolodexAdapter extends BaseAdapter {
    constructor(apiKey: string) {
        // Use the correct base URL from documentation
        super('https://pwvdyivpxtzvkymykigx.supabase.co/functions/v1', apiKey);
    }

    protected async request<T>(config: any): Promise<T> {
        return super.request({
            ...config,
            headers: {
                ...config.headers,
                'X-API-Key': this.apiKey,
                'Content-Type': 'application/json'
            }
        });
    }

    // SERP & Rank Tracking
    async rankTracking(data: { domain: string, keywords: string[], location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/rank-tracking', data });
    }

    async monitorRankings(data: { domain: string, keywords: string[], location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/monitor-rankings', data });
    }

    async fetchRankHistory(data: { target: string, location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/fetch-rank-history', data });
    }

    // Keyword Research
    async keywordResearch(data: { keywords: string[], location_code?: number, language_code?: string, include_paa?: boolean }) {
        return this.request({ method: 'POST', url: '/keyword-research', data });
    }

    async fetchKeywordIdeas(data: { keywords: string[], location_code?: number, language_code?: string, limit?: number }) {
        return this.request({ method: 'POST', url: '/fetch-keyword-ideas', data });
    }

    async keywordToDomains(data: { keywords: string[], location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/keyword-to-domains', data });
    }

    // Competitive Analysis
    async analyzeCompetitors(data: { target: string, location_code?: number, language_code?: string, limit?: number }) {
        return this.request({ method: 'POST', url: '/analyze-competitors', data });
    }

    async keywordGapAnalysis(data: { yourDomain: string, competitorDomains: string[], location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/keyword-gap-analysis', data });
    }

    async analyzeKeywordIntersection(data: { target1: string, target2: string, location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/analyze-keyword-intersection', data });
    }

    // Backlink Analysis
    async fetchBacklinkSummary(data: { target: string, include_subdomains?: boolean, exclude_internal_backlinks?: boolean, include_indirect_links?: boolean }) {
        return this.request({ method: 'POST', url: '/fetch-backlink-summary', data });
    }

    async fetchBacklinks(data: { target: string, limit?: number, include_subdomains?: boolean, backlinks_status_type?: 'live' | 'all' }) {
        return this.request({ method: 'POST', url: '/fetch-backlinks', data });
    }

    async fetchBacklinkAnchors(data: { target: string, limit?: number }) {
        return this.request({ method: 'POST', url: '/fetch-backlink-anchors', data });
    }

    async fetchBacklinkHistory(data: { target: string }) {
        return this.request({ method: 'POST', url: '/fetch-backlink-history', data });
    }

    async monitorBacklinks(data: { target: string, date_from?: string, date_to?: string }) {
        return this.request({ method: 'POST', url: '/monitor-backlinks', data });
    }

    async analyzeBacklinkIntersection(data: { targets: string[], exclude_target?: string }) {
        return this.request({ method: 'POST', url: '/analyze-backlink-intersection', data });
    }

    // Site Audit & Domains
    async siteAudit(data: { target: string, max_crawl_pages?: number, enable_javascript?: boolean, enable_browser_rendering?: boolean }) {
        return this.request({ method: 'POST', url: '/site-audit', data });
    }

    async checkDomains(data: { domains: string[] }) {
        return this.request({ method: 'POST', url: '/check-domains', data });
    }

    // Content & LLM Optimization
    async llmOptimization(data: { keywords: string[], location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/llm-optimization', data });
    }

    async contentStrategist(data: { keyword: string, location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/content-strategist', data });
    }

    // Local SEO
    async localSeoLookup(data: { keyword: string, location_name?: string, location_code?: number, limit?: number }) {
        return this.request({ method: 'POST', url: '/local-seo-lookup', data });
    }

    // YouTube/Amazon Tracking
    async youtubeTracking(data: { type: 'keyword' | 'video' | 'channel', query: string, location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/youtube-tracking', data });
    }

    async youtubeIntel(data: { keyword: string, location_code?: number, language_code?: string, limit?: number }) {
        return this.request({ method: 'POST', url: '/youtube-intel', data });
    }

    async amazonTracking(data: { keyword: string, location_code?: number, language_code?: string, limit?: number }) {
        return this.request({ method: 'POST', url: '/amazon-tracking', data });
    }

    // Legacy/Compatibility Wrappers
    async getAudit(params: { url: string }) { return this.siteAudit({ target: params.url }); }
    async getKeywords(domain: string) { return this.keywordResearch({ keywords: [domain] }); }
    async getBacklinks(domain: string) { return this.fetchBacklinkSummary({ target: domain }); }
}
