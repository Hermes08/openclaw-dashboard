import { BaseAdapter } from './BaseAdapter';

export interface CRMEntity {
    id: string;
    type: 'property' | 'lead' | 'campaign' | 'asset';
    data: any;
}

export class CRMAdapter extends BaseAdapter {
    constructor(baseURL: string, apiKey: string) {
        super(baseURL, apiKey);
    }

    async getEntity(type: string, id: string): Promise<CRMEntity> {
        return this.request<CRMEntity>({
            method: 'GET',
            url: `/entities/${type}/${id}`,
        });
    }

    async updateEntity(type: string, id: string, data: any): Promise<void> {
        await this.request({
            method: 'PATCH',
            url: `/entities/${type}/${id}`,
            data,
        });
    }

    async createAsset(projectId: string, assetData: any): Promise<string> {
        const response = await this.request<any>({
            method: 'POST',
            url: `/projects/${projectId}/assets`,
            data: assetData,
        });
        return response.id;
    }
}
