import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Chip
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LayersIcon from '@mui/icons-material/Layers';

const ApiDocs: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        OpenClaw <span style={{ color: '#6366f1' }}>Interaction</span> Protocol
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 800 }}>
        Technical specifications for AI Agents and automated tools to interface with the OpenClaw Dashboard and Automation Service.
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <LayersIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>System Architecture</Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.6 }}>
          The ecosystem consists of three primary components working in tandem to deliver autonomous project management:
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="1. Project Service" 
              secondary="The central source of truth for projects, skills, and tasks. Hosts this Dashboard UI." 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="2. Automation Service" 
              secondary="Handles scheduled workflows (SEO, Media) and maintains the internal task queue." 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="3. AI Agents" 
              secondary="Autonomous actors that process tasks via code modification or external APIs." 
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <ShieldIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Authentication</Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 4 }}>
          Integrations must include the following header for all API requests:
        </Typography>
        <Box sx={{ 
          bgcolor: 'grey.900', 
          color: 'primary.light', 
          p: 3, 
          borderRadius: 2, 
          fontFamily: 'monospace',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          X-API-KEY: dev-key-123
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}>
          * Note: Replace with environment-specific keys in production environments.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
        API Reference
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label="GET" color="info" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>/api/projects</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Fetch all active projects and their associated metadata including skills and current status.
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label="GET" color="info" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>/api/projects/:id/tasks</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Retrieve pending tasks for a specific project.
        </Typography>
        <Box sx={{ 
          bgcolor: 'grey.900', 
          color: 'grey.300', 
          p: 2, 
          borderRadius: 2, 
          fontFamily: 'monospace',
          fontSize: '0.8rem'
        }}>
          <pre>{JSON.stringify([
  {
    "id": "task-001",
    "title": "Optimize Meta Tags",
    "status": "pending",
    "skillId": "seo"
  }
], null, 2)}</pre>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label="PUT" color="warning" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>/api/tasks/:id</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Update a task status to completed or failed.
        </Typography>
        <Box sx={{ 
          bgcolor: 'grey.900', 
          color: 'grey.300', 
          p: 2, 
          borderRadius: 2, 
          fontFamily: 'monospace',
          fontSize: '0.8rem'
        }}>
          <pre>{JSON.stringify({
  "status": "completed",
  "result": "Applied metadata to contact/page.tsx"
}, null, 2)}</pre>
        </Box>
      </Paper>

      <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.6 }}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="caption" sx={{ fontWeight: 800, tracking: '0.2em', textTransform: 'uppercase' }}>
          OpenClaw Agent Intelligence 2026
        </Typography>
      </Box>
    </Box>
  );
};

export default ApiDocs;
