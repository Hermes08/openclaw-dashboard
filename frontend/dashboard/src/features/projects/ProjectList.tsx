import React, { useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProjects } from './projectsSlice';

const ProjectList: React.FC = () => {
    const dispatch = useAppDispatch();
    const projects = useAppSelector((state: any) => state.projects.items);
    const status = useAppSelector((state: any) => state.projects.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProjects());
        }
    }, [status, dispatch]);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="projects table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((project: any) => (
                        <TableRow key={project.id}>
                            <TableCell component="th" scope="row">
                                {project.name}
                                {project.description && (
                                    <Typography variant="body2" color="textSecondary">{project.description}</Typography>
                                )}
                                {project.skills && project.skills.length > 0 && (
                                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {project.skills.map((s: any) => (
                                            <Typography
                                                key={s.id}
                                                variant="caption"
                                                sx={{
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.contrastText',
                                                    px: 1,
                                                    borderRadius: 1
                                                }}
                                            >
                                                {s.id} {s.automated ? '(Auto)' : ''}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                            </TableCell>
                            <TableCell>
                                <Chip label={project.status} color={project.status === 'active' ? 'primary' : 'default'} />
                            </TableCell>
                            <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectList;
