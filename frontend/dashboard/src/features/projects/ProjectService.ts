import axios from 'axios';

const API_URL = '/api/projects';
const API_KEY = 'dev-key-123'; // Replace with env var in production

const axiosInstance = axios.create({
    headers: {
        'X-API-KEY': API_KEY
    }
});

export const getProjects = () => axiosInstance.get(API_URL);
export const getProject = (id: string) => axiosInstance.get(`${API_URL}/${id}`);
export const createProject = (project: any) => axiosInstance.post(API_URL, project);
export const updateProject = (id: string, project: any) => axiosInstance.put(`${API_URL}/${id}`, project);
export const deleteProject = (id: string) => axiosInstance.delete(`${API_URL}/${id}`);
