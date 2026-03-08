import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_KEY = 'dev-key-123';
const axiosInstance = axios.create({ headers: { 'X-API-KEY': API_KEY } });

interface Task {
    id: string;
    type: string;
    status: string;
    title?: string;
    priority?: number;
    createdAt?: string;
    completedAt?: string;
    executedBy?: string;
    payload?: any;
}

interface Workflow {
    skillId: string;
    source?: string;
    steps: Task[];
}

const TasksView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/api/projects/${id}`);
            setProject(res.data);
        } catch (e) {
            console.error('Failed to fetch project', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
        const interval = setInterval(fetchProject, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, [id]);

    const getAllTasks = (): Task[] => {
        if (!project?.workflows) return [];
        return project.workflows.flatMap((wf: Workflow) => wf.steps || []);
    };

    const tasks = getAllTasks();
    const pending = tasks.filter(t => t.status === 'pending');
    const completed = tasks.filter(t => t.status === 'completed');

    if (loading && !project) return <LinearProgress sx={{ borderRadius: 1 }} />;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <IconButton onClick={() => navigate('/projects')} size="small">
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {project?.name || 'Project Tasks'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {project?.repositoryUrl}
                    </Typography>
                </Box>
                <Tooltip title="Refresh">
                    <IconButton onClick={fetchProject} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Paper sx={{ p: 3, flex: 1, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                        {pending.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Pending Tasks</Typography>
                </Paper>
                <Paper sx={{ p: 3, flex: 1, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                        {completed.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Completed</Typography>
                </Paper>
                <Paper sx={{ p: 3, flex: 1, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {tasks.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
                </Paper>
            </Box>

            {/* Pending Tasks */}
            {pending.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PendingIcon color="warning" /> Pending Tasks
                    </Typography>
                    {pending.map((task, i) => (
                        <Paper key={task.id || i} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid', borderColor: 'warning.main' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {task.title || task.id}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip label={task.type} size="small" sx={{ fontSize: '0.7rem' }} />
                                    <Chip label={`P${task.priority || '?'}`} size="small" color="warning" sx={{ fontSize: '0.7rem' }} />
                                </Box>
                            </Box>
                            {task.payload && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                                    {typeof task.payload === 'string' ? task.payload : JSON.stringify(task.payload, null, 2).slice(0, 300)}
                                </Typography>
                            )}
                        </Paper>
                    ))}
                </Box>
            )}

            {/* Completed Tasks */}
            {completed.length > 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon color="success" /> Completed Tasks
                    </Typography>
                    {completed.map((task, i) => (
                        <Paper key={task.id || i} sx={{ p: 3, mb: 2, borderRadius: 2, borderLeft: '4px solid', borderColor: 'success.main', opacity: 0.8 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {task.title || task.id}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Chip label={task.type} size="small" sx={{ fontSize: '0.7rem' }} />
                                    {task.completedAt && (
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(task.completedAt).toLocaleString()}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            {tasks.length === 0 && (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h6" color="text.secondary">No tasks yet</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        OpenClaw agents will push tasks here automatically.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default TasksView;
