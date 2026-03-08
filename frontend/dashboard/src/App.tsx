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

const drawerWidth = 240;

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            OpenClaw Centralized Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItem disablePadding component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
                                <ListItemButton>
                                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                                    <ListItemText primary="Dashboard" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding component={Link} to="/projects" sx={{ color: 'inherit', textDecoration: 'none' }}>
                                <ListItemButton>
                                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                                    <ListItemText primary="Projects" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding component={Link} to="/automation" sx={{ color: 'inherit', textDecoration: 'none' }}>
                                <ListItemButton>
                                    <ListItemIcon><AutorenewIcon /></ListItemIcon>
                                    <ListItemText primary="Automation" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<Typography variant="h4">Welcome to OpenClaw Dashboard</Typography>} />
                        <Route path="/projects" element={
                            <Box>
                                <Typography variant="h4" gutterBottom>Projects Management</Typography>
                                <ProjectForm />
                                <ProjectList />
                            </Box>
                        } />
                        <Route path="/automation" element={<Typography variant="h4">Automation Hub</Typography>} />
                    </Routes>
                </Box>
            </Box>
        </BrowserRouter>
    );
};

export default App;
