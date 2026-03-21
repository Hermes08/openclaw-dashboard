import { ConnectorFactory } from '../connectors/ConnectorFactory';
import fs from 'fs';
import path from 'path';

export interface VideoGenerationJob {
    projectId: string;
    sourceContent: string;
    targetLanguage?: string;
    avatarId?: string;
    voiceId?: string;
    config: {
        elevenLabsKey: string;
        heyGenKey: string;
        youtubeConfig?: {
            clientId: string;
            clientSecret: string;
            refreshToken: string;
        };
    };
}

export class MediaGenerationService {
    async produceVideo(job: VideoGenerationJob) {
        const { sourceContent, config, avatarId, voiceId } = job;
        console.log(`Producing video for content: ${sourceContent.substring(0, 50)}...`);

        // 1. Generate Script (Simulated AI call for now)
        const script = await this.generateScript(sourceContent);
        console.log("Script generated:", script.substring(0, 50));

        // 2. Generate Audio (ElevenLabs)
        const elevenLabs = ConnectorFactory.getElevenLabs(config.elevenLabsKey);
        const audioBuffer = await elevenLabs.generateAudio({
            text: script,
            voice_id: voiceId || 'predefined_voice_id',
        });
        
        const tempAudioPath = path.join('/tmp', `audio_${Date.now()}.mp3`);
        fs.writeFileSync(tempAudioPath, audioBuffer);
        console.log("Audio generated at:", tempAudioPath);

        // 3. Generate Video (HeyGen)
        const heyGen = ConnectorFactory.getHeyGen(config.heyGenKey);
        const videoId = await heyGen.createVideo({
            video_inputs: [{
                character: { type: 'avatar', avatar_id: avatarId || 'predefined_avatar_id' },
                voice: { type: 'text', input_text: script, voice_id: voiceId || 'predefined_voice_id' }
            }]
        });
        console.log("HeyGen Video Job ID:", videoId);

        // 4. Wait for Video (Polling status - simplified)
        let status = 'processing';
        while (status === 'processing') {
            await new Promise(r => setTimeout(r, 10000));
            const result = await heyGen.getVideoStatus(videoId);
            status = result.status;
            if (status === 'completed') {
                console.log("Video generation completed:", result.video_url);
                
                // 5. Upload to YouTube if configured
                if (config.youtubeConfig) {
                    await this.uploadToYouTube(result.video_url, script, config.youtubeConfig);
                }
                break;
            }
        }
    }

    private async generateScript(content: string): Promise<string> {
        // Here we would call an LLM (OpenAI/Claude) or a specialized script service.
        return `Video Script based on: ${content}. Proposing an engaging intro, detailed body, and a strong CTA.`;
    }

    private async uploadToYouTube(videoUrl: string, script: string, config: any) {
        const youtube = ConnectorFactory.getYouTube(config.clientId, config.clientSecret, config.refreshToken);
        const videoPath = `/tmp/video_${Date.now()}.mp4`; // In a real scenario, download video from URL first
        
        console.log(`Uploading video from ${videoUrl} to YouTube...`);
        const resultId = await youtube.uploadVideo(videoPath, {
            title: "Automated SEO Insight Video",
            description: script,
            privacyStatus: 'private',
        });
        console.log("YouTube Video ID:", resultId);
    }
}
