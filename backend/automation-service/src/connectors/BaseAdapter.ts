import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export abstract class BaseAdapter {
    protected client: AxiosInstance;
    protected apiKey?: string;
    protected anonKey?: string;

    constructor(baseURL: string, apiKey?: string, anonKey?: string) {
        this.apiKey = apiKey;
        this.anonKey = anonKey;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Supabase anon key for gateway authentication
        if (anonKey) {
            headers['Authorization'] = `Bearer ${anonKey}`;
        }

        // API key for application-level authentication
        if (apiKey) {
            headers['X-API-Key'] = apiKey;
        }

        this.client = axios.create({
            baseURL,
            headers,
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
