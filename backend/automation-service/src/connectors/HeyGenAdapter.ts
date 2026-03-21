import { BaseAdapter } from './BaseAdapter';

export interface HeyGenVideoRequest {
    video_inputs: Array<{
        character: {
            type: 'avatar';
            avatar_id: string;
            avatar_style?: string;
        };
        voice: {
            type: 'text';
            input_text: string;
            voice_id: string;
        };
    }>;
    dimension?: {
        width: number;
        height: number;
    };
}

export class HeyGenAdapter extends BaseAdapter {
    constructor(apiKey: string) {
        super('https://api.heygen.com/v1', apiKey);
        // HeyGen uses x-api-key header
        this.client.defaults.headers['x-api-key'] = apiKey;
        delete this.client.defaults.headers['Authorization'];
    }

    async createVideo(params: HeyGenVideoRequest): Promise<string> {
        const response = await this.request<any>({
            method: 'POST',
            url: '/video.generate',
            data: params,
        });
        return response.data.video_id;
    }

    async getVideoStatus(videoId: string): Promise<any> {
        return this.request({
            method: 'GET',
            url: `/video_status.get?video_id=${videoId}`,
        });
    }

    async getAvatars(): Promise<any> {
        return this.request({
            method: 'GET',
            url: '/avatar.list',
        });
    }
}
