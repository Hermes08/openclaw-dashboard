import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';

export interface VideoMetadata {
    title: string;
    description: string;
    tags?: string[];
    categoryId?: string;
    privacyStatus?: 'public' | 'private' | 'unlisted';
}

export class YouTubePublishingAdapter {
    private youtube;

    constructor(clientId: string, clientSecret: string, refreshToken: string) {
        const oauth2Client = new OAuth2Client(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        this.youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    }

    async uploadVideo(filePath: string, metadata: VideoMetadata): Promise<string> {
        const response = await this.youtube.videos.insert({
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: metadata.title,
                    description: metadata.description,
                    tags: metadata.tags,
                    categoryId: metadata.categoryId || '22', // People & Blogs
                },
                status: {
                    privacyStatus: metadata.privacyStatus || 'private',
                },
            },
            media: {
                body: fs.createReadStream(filePath),
            },
        });

        return response.data.id!;
    }

    async getVideoStatus(videoId: string): Promise<any> {
        const response = await this.youtube.videos.list({
            part: ['snippet', 'status', 'contentDetails'],
            id: [videoId],
        });
        return response.data.items?.[0];
    }
}
