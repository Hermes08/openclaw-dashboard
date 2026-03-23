import { BaseAdapter } from './BaseAdapter';

export class SEORolodexAdapter extends BaseAdapter {
    constructor(apiKey: string, anonKey?: string) {
        // Base URL from SEORolodex documentation (Supabase project: oahhkprnyshnlmozkzsx)
        super('https://oahhkprnyshnlmozkzsx.supabase.co/functions/v1', apiKey, anonKey);
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

    async keywordGapAnalysis(data: { targets: string[], location_code?: number, language_code?: string }) {
        return this.request({ method: 'POST', url: '/keyword-gap-analysis', data });
    }

    async analyzeKeywordIntersection(data: { targets: string[], keywords: string[], location_code?: number }) {
        return this.request({ method: 'POST', url: '/analyze-keyword-intersection', data });
    }

    // Backlink Analysis
    async fetchBacklinkSummary(data: { target: string }) {
        return this.request({ method: 'POST', url: '/fetch-backlink-summary', data });
    }

    async fetchBacklinks(data: { target: string, limit?: number, offset?: number }) {
        return this.request({ method: 'POST', url: '/fetch-backlinks', data });
    }

    async fetchBacklinkAnchors(data: { target: string, limit?: number }) {
        return this.request({ method: 'POST', url: '/fetch-backlink-anchors', data });
    }

    async fetchBacklinkHistory(data: { target: string }) {
        return this.request({ method: 'POST', url: '/fetch-backlink-history', data });
    }

    async monitorBacklinks(data: { target: string, keywords?: string[] }) {
        return this.request({ method: 'POST', url: '/monitor-backlinks', data });
    }

    async analyzeBacklinkIntersection(data: { targets: string[] }) {
        return this.request({ method: 'POST', url: '/analyze-backlink-intersection', data });
    }

    // Technical SEO
    async siteAudit(data: { target: string, max_crawl_pages?: number }) {
        return this.request({ method: 'POST', url: '/site-audit', data });
    }

    async checkDomains(data: { domains: string[] }) {
        return this.request({ method: 'POST', url: '/check-domains', data });
    }

    // Content & AI
    async llmOptimization(data: { target: string, keywords?: string[] }) {
        return this.request({ method: 'POST', url: '/llm-optimization', data });
    }

    async contentStrategist(data: { target: string, keywords?: string[], competitors?: string[] }) {
        return this.request({ method: 'POST', url: '/content-strategist', data });
    }

    async localSeoLookup(data: { target: string, location_code?: number }) {
        return this.request({ method: 'POST', url: '/local-seo-lookup', data });
    }

    // YouTube & Amazon
    async youtubeTracking(data: { channel_url?: string, video_url?: string, keywords?: string[] }) {
        return this.request({ method: 'POST', url: '/youtube-tracking', data });
    }

    async youtubeIntel(data: { channel_url?: string, topic?: string }) {
        return this.request({ method: 'POST', url: '/youtube-intel', data });
    }

    async amazonTracking(data: { asin?: string, keywords?: string[] }) {
        return this.request({ method: 'POST', url: '/amazon-tracking', data });
    }
}
