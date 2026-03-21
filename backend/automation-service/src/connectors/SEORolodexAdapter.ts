import { BaseAdapter } from './BaseAdapter';

export interface SEOAuditRequest {
    url: string;
    options?: any;
}

export interface SEOAuditResponse {
    score: number;
    issues: any[];
    recommendations: string[];
}

export class SEORolodexAdapter extends BaseAdapter {
    constructor(apiKey: string) {
        super('https://api.seorolodex.com/v1', apiKey);
    }

    async getAudit(params: SEOAuditRequest): Promise<SEOAuditResponse> {
        return this.request<SEOAuditResponse>({
            method: 'POST',
            url: '/audit',
            data: params,
        });
    }

    async getKeywords(domain: string): Promise<any> {
        return this.request({
            method: 'GET',
            url: `/keywords/${domain}`,
        });
    }

    async getBacklinks(domain: string): Promise<any> {
        return this.request({
            method: 'GET',
            url: `/backlinks/${domain}`,
        });
    }
}
