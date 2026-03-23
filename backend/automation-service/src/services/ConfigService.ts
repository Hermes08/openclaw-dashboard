import axios from 'axios';

export class ConfigService {
    private projectServiceUrl = process.env.PROJECT_SERVICE_URL || 'http://localhost:3001';

    async getProjectConfig(projectId: string): Promise<any> {
        try {
            const response = await axios.get(`${this.projectServiceUrl}/api/projects/${projectId}`);
            const project = response.data;

            // Return combined global and project-specific config
            return {
                domain: project.domain || project.repositoryUrl, // Support both fields
                seo: {
                    apiKey: project.skills?.seo?.apiKey || process.env.SEO_ROLODEX_API_KEY
                },
                video: {
                    elevenLabsKey: project.skills?.video?.elevenLabsKey || process.env.ELEVENLABS_API_KEY,
                    heyGenKey: project.skills?.video?.heyGenKey || process.env.HEYGEN_API_KEY,
                    voiceId: project.skills?.video?.voiceId,
                    avatarId: project.skills?.video?.avatarId
                },
                youtube: {
                    clientId: project.skills?.youtube?.clientId || process.env.YOUTUBE_CLIENT_ID,
                    clientSecret: project.skills?.youtube?.clientSecret || process.env.YOUTUBE_CLIENT_SECRET,
                    refreshToken: project.skills?.youtube?.refreshToken || process.env.YOUTUBE_REFRESH_TOKEN
                },
                crm: {
                    baseUrl: project.skills?.crm?.baseUrl || process.env.CRM_API_BASE,
                    apiKey: project.skills?.crm?.apiKey || process.env.CRM_API_KEY
                }
            };
        } catch (error: any) {
            console.error(`Failed to fetch config for Project ${projectId}:`, error.message);
            throw error;
        }
    }
}
