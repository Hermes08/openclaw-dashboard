import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Paper, Chip,
  LinearProgress, Badge, IconButton, Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProjectList from './features/projects/ProjectList';
import ProjectForm from './features/projects/ProjectForm';
import TasksView from './features/projects/TasksView';
import axios from 'axios';

const drawerWidth = 240;
const API_KEY = 'dev-key-123';
const axiosInstance = axios.create({ headers: { 'X-API-KEY': API_KEY } });

const DashboardOverview: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch projects', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAllTasks = (project: any) => {
    if (!project?.workflows) return [];
    return project.workflows.flatMap((wf: any) => wf.steps || []);
  };

  const totalPending = projects.reduce((acc, p) => {
    return acc + getAllTasks(p).filter((t: any) => t.status === 'pending').length;
  }, 0);

  const totalCompleted = projects.reduce((acc, p) => {
    return acc + getAllTasks(p).filter((t: any) => t.status === 'completed').length;
  }, 0);

  if (loading && projects.length === 0) return <LinearProgress sx={{ borderRadius: 1 }} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard Overview</Typography>
          <Typography variant="body2" color="text.secondary">OpenClaw automation command center</Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchProjects} color="primary"><RefreshIcon /></IconButton>
        </Tooltip>
      </Box>

      {/* Global stats */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>{totalPending}</Typography>
          <Typography variant="body2" color="text.secondary">Pending Tasks</Typography>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>{totalCompleted}</Typography>
          <Typography variant="body2" color="text.secondary">Completed Tasks</Typography>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>{projects.length}</Typography>
          <Typography variant="body2" color="text.secondary">Active Projects</Typography>
        </Paper>
      </Box>

      {/* Projects with pending tasks */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Projects</Typography>
      {projects.map((project) => {
        const tasks = getAllTasks(project);
        const pending = tasks.filter((t: any) => t.status === 'pending');
        const completed = tasks.filter((t: any) => t.status === 'completed');
        const pendingTasks = pending.slice(0, 3);
        return (
          <Paper key={project.id} sx={{ p: 3, mb: 2, borderRadius: 3, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => navigate(`/projects/${project.id}/tasks`)}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{project.name}</Typography>
                <Typography variant="caption" color="text.secondary">{project.repositoryUrl}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {pending.length > 0 && (
                  <Chip icon={<PendingIcon />} label={`${pending.length} pending`} color="warning" size="small" />
                )}
                <Chip icon={<CheckCircleIcon />} label={`${completed.length} done`} color="success" size="small" />
                <ArrowForwardIcon fontSize="small" color="action" />
              </Box>
            </Box>
            {pendingTasks.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {pendingTasks.map((task: any, i: number) => (
                  <Typography key={i} variant="caption" color="text.secondary" sx={{ display: 'block', pl: 1, borderLeft: '2px solid', borderColor: 'warning.main', mb: 0.5 }}>
                    {task.title || task.id}
                  </Typography>
                ))}
                {pending.length > 3 && (
                  <Typography variant="caption" color="primary.main">+{pending.length - 3} more tasks...</Typography>
                )}
              </Box>
            )}
            {tasks.length === 0 && (
              <Typography variant="caption" color="text.secondary">No tasks yet — OpenClaw agents will push tasks here automatically.</Typography>
            )}
          </Paper>
        );
      })}
      {projects.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">No projects yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Go to Projects to add your first project.</Typography>
        </Paper>
      )}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Box sx={{
              width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'white'
            }}>O</Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              OpenClaw
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', mt: '64px' }
        }}>
          <List sx={{ pt: 2 }}>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
              { text: 'Projects', icon: <AssignmentIcon />, path: '/projects' },
              { text: 'Automation', icon: <AutorenewIcon />, path: '/automation' },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 4, mt: '64px' }}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id/tasks" element={<TasksView />} />
            <Route path="/automation" element={
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Automation Hub</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Manage your autonomous agents and workflows.</Typography>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Scheduled Jobs</Typography>
                  <Typography variant="body2" color="text.secondary">• SEO Audit — daily at 2:00 AM</Typography>
                  <Typography variant="body2" color="text.secondary">• Competitor Analysis — every Monday at 3:00 AM</Typography>
                  <Typography variant="body2" color="text.secondary">• Backlink Monitor — every Wednesday at 3:00 AM</Typography>
                  <Typography variant="body2" color="text.secondary">• Content Strategy — every Friday at 4:00 AM</Typography>
                </Paper>
              </Box>
            } />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export default App;
