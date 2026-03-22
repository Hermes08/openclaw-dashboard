import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export abstract class BaseAdapter {
    protected client: AxiosInstance;
    protected apiKey?: string;

    constructor(baseURL: string, apiKey?: string) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL,
            headers: {
                'X-API-Key': apiKey || '',
                'Content-Type': 'application/json',
            },
        });
    }

    protected async request<T>(config: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.client.request<T>(config);
            return response.data;
        } catch (error: any) {
            console.error(`[${this.constructor.name}] Request failed:`, error.response?.data || error.message);
            throw error;
        }
    }
}
