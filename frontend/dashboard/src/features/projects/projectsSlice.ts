import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as projectService from './ProjectService';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const response = await projectService.getProjects();
    return response.data;
});

export const addProject = createAsyncThunk('projects/addProject', async (project: { name: string; description?: string; skills: any[]; workflows: any[] }) => {
    const response = await projectService.createProject(project);
    return response.data;
});

interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    tags?: string[];
    skills?: any[];
    workflows?: any[];
    createdAt: string;
    updatedAt: string;
}

interface ProjectsState {
    items: Project[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProjectsState = {
    items: [
        {
            id: '1',
            name: 'OpenClaw Website',
            description: 'Main project for the OpenClaw platform, involving SEO and content automation.',
            status: 'active',
            skills: [
                { id: 'website', subSkills: ['content', 'seo'], automated: true }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            name: 'YouTube Channel Growth',
            description: 'Automating video publishing and metadata optimization for our main tech channel.',
            status: 'active',
            skills: [
                { id: 'youtube', subSkills: ['video', 'publishing'], automated: false }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    status: 'idle',
    error: null,
};

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                }
                // If not an array (e.g. got HTML fallback), keep the initial/existing items
            })
            .addCase(fetchProjects.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addProject.fulfilled, (state, action) => {
                if (action.payload && action.payload.id) {
                    state.items.push(action.payload);
                }
            });
    },
});

export default projectsSlice.reducer;
