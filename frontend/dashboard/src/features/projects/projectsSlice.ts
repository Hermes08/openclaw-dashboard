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
    items: [],
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
                state.items = action.payload;
            })
            .addCase(addProject.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default projectsSlice.reducer;
