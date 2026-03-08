import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Chip,
    IconButton,
    LinearProgress,
    Grid
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProjects } from './projectsSlice';

const ProjectList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const projects = useAppSelector((state: any) => state.projects.items);
    const status = useAppSelector((state: any) => state.projects.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProjects());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <LinearProgress sx={{ borderRadius: 1 }} />;
    }

    return (
        <Grid container spacing={3}>
            {projects.map((project: any) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project.id}>
                    <Paper
                        onClick={() => navigate(`/projects/${project.id}/tasks`)}
                        sx={{
                            p: 3,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Chip
                                label={project.status}
                                color={project.status === 'active' ? 'primary' : 'default'}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    height: 24,
                                    bgcolor: project.status === 'active' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                    color: project.status === 'active' ? 'primary.main' : 'text.secondary',
                                    border: '1px solid',
                                    borderColor: project.status === 'active' ? 'rgba(99, 102, 241, 0.2)' : 'transparent'
                                }}
                            />
                            <IconButton size="small"><MoreVertIcon /></IconButton>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                            {project.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{
                            mb: 3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.5rem'
                        }}>
                            {project.description || 'No description provided.'}
                        </Typography>

                        <Box sx={{ mt: 'auto' }}>
                            {project.skills && project.skills.length > 0 && (
                                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {project.skills.map((s: any) => (
                                        <Chip
                                            key={s.id}
                                            label={s.id + (s.automated ? ' (Auto)' : '')}
                                            size="small"
                                            sx={{
                                                fontSize: '0.7rem',
                                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                                borderRadius: 1
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <AccessTimeIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProjectList;
