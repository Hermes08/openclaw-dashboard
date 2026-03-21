import { BaseAdapter } from './BaseAdapter';

export interface TTSRequest {
    text: string;
    voice_id: string;
    model_id?: string;
    voice_settings?: {
        stability: number;
        similarity_boost: number;
    };
}

export class ElevenLabsAdapter extends BaseAdapter {
    constructor(apiKey: string) {
        super('https://api.elevenlabs.io/v1', apiKey);
        // ElevenLabs uses xi-api-key header
        this.client.defaults.headers['xi-api-key'] = apiKey;
        delete this.client.defaults.headers['Authorization'];
    }

    async generateAudio(params: TTSRequest): Promise<Buffer> {
        return this.request<Buffer>({
            method: 'POST',
            url: `/text-to-speech/${params.voice_id}`,
            data: {
                text: params.text,
                model_id: params.model_id || 'eleven_monolingual_v1',
                voice_settings: params.voice_settings,
            },
            responseType: 'arraybuffer',
        });
    }

    async getVoices(): Promise<any> {
        return this.request({
            method: 'GET',
            url: '/voices',
        });
    }
}
