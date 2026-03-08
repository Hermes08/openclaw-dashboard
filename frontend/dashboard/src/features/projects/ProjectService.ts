import axios from 'axios';

const API_URL = '/api/projects';

export const getProjects = () => axios.get(API_URL);
export const getProject = (id: string) => axios.get(`${API_URL}/${id}`);
export const createProject = (project: any) => axios.post(API_URL, project);
export const updateProject = (id: string, project: any) => axios.put(`${API_URL}/${id}`, project);
export const deleteProject = (id: string) => axios.delete(`${API_URL}/${id}`);
