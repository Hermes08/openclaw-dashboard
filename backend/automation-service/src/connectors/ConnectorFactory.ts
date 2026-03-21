import { SEORolodexAdapter } from './SEORolodexAdapter';
import { ElevenLabsAdapter } from './ElevenLabsAdapter';
import { HeyGenAdapter } from './HeyGenAdapter';
import { CRMAdapter } from './CRMAdapter';
import { YouTubePublishingAdapter } from './YouTubePublishingAdapter';

export class ConnectorFactory {
    static getSEORolodex(apiKey: string) {
        return new SEORolodexAdapter(apiKey);
    }

    static getElevenLabs(apiKey: string) {
        return new ElevenLabsAdapter(apiKey);
    }

    static getHeyGen(apiKey: string) {
        return new HeyGenAdapter(apiKey);
    }

    static getCRM(baseURL: string, apiKey: string) {
        return new CRMAdapter(baseURL, apiKey);
    }

    static getYouTube(clientId: string, clientSecret: string, refreshToken: string) {
        return new YouTubePublishingAdapter(clientId, clientSecret, refreshToken);
    }
}
