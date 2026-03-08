import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ProjectList from './features/projects/ProjectList';
import ProjectForm from './features/projects/ProjectForm';
import TasksView from './features/projects/TasksView';

const drawerWidth = 240;

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                O
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                                OpenClaw
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            pt: 8,
                            px: 1.5
                        },
                    }}
                >
                    <List sx={{ mt: 2 }}>
                        {[
                            { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
                            { text: 'Projects', icon: <AssignmentIcon />, path: '/projects' },
                            { text: 'Automation', icon: <AutorenewIcon />, path: '/automation' },
                        ].map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                                            color: 'primary.main',
                                            '& .MuiListItemIcon-root': { color: 'primary.main' }
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.03)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: 'background.default' }}>
                    <Toolbar />
                    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                        <Routes>
                            <Route path="/" element={
                                <Box>
                                    <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
                                    <Typography color="text.secondary">Welcome back to your OpenClaw command center.</Typography>
                                </Box>
                            } />
                            <Route path="/projects" element={
                                <Box>
                                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>Projects</Typography>
                                    </Box>
                                    <ProjectForm />
                                    <Box sx={{ mt: 6 }}>
                                        <ProjectList />
                                    </Box>
                                </Box>
                            } />
                            <Route path="/projects/:id/tasks" element={<TasksView />} />
                            <Route path="/automation" element={
                                <Box>
                                    <Typography variant="h4" gutterBottom>Automation Hub</Typography>
                                    <Typography color="text.secondary">Manage your autonomous agents and workflows.</Typography>
                                </Box>
                            } />
                        </Routes>
                    </Box>
                </Box>
            </Box>
        </BrowserRouter>
    );
};

export default App;
