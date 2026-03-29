import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Grid
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorageIcon from '@mui/icons-material/Storage';

const ApiDocs: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        OpenClaw <span style={{ color: '#6366f1' }}>Interaction</span> Protocol
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 800 }}>
        Technical specifications for AI Agents and automated tools to interface with the OpenClaw Dashboard and integrated SEO services.
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <LayersIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>System Architecture</Typography>
            </Box>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Project Service" 
                  secondary="Central truth for projects and tasks. Hosts the Dashboard UI." 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Automation Service" 
                  secondary="Handles scheduled workflows (SEO, Media) and task queuing." 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="AI Agents" 
                  secondary="Autonomous actors (like Antigravity) that execute tasks." 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <ShieldIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Authentication</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Include the following header for all API requests:
            </Typography>
            <Box sx={{ 
              bgcolor: 'grey.900', 
              color: 'primary.light', 
              p: 2, 
              borderRadius: 2, 
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              X-API-KEY: dev-key-123
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Task Schema Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>OpenClaw Task Schema</Typography>
        </Box>
        <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tasks are stored within project workflows and follow this standard structure.
          </Typography>
          <Box sx={{ 
            bgcolor: 'grey.900', 
            color: 'grey.300', 
            p: 3, 
            borderRadius: 2, 
            fontFamily: 'monospace',
            fontSize: '0.85rem'
          }}>
            <pre>{JSON.stringify({
  "id": "uuid-string",
  "title": "Optimize Meta Tags for Home Page",
  "status": "pending | completed | failed",
  "skillId": "seo | website | media | design",
  "source": "openclaw | external",
  "createdAt": "2026-03-22T21:00:00Z",
  "completedAt": "2026-03-22T21:30:00Z (optional)",
  "executedBy": "agent-id (optional)",
  "result": "Details of the work performed (optional)"
}, null, 2)}</pre>
          </Box>
        </Paper>
      </Box>

      {/* Dashboard API Reference */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
        Dashboard API Reference
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label="GET" color="info" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>/api/projects</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Returns all active projects, including their skills, repository details, and workflows.
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label="POST" color="success" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>/api/projects/:id/tasks</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Inject a new task into a project's workflow.
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label="PUT" color="warning" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>/api/projects/:id/tasks/:taskId</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Update a task status (e.g., mark as completed) and log the result.
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip label="DELETE" color="error" size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>/api/projects/:id/tasks</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Clear all tasks from a project's workflows. Returns the number of tasks removed and the updated project.
        </Typography>
        <Box sx={{
          bgcolor: 'grey.900',
          color: 'grey.300',
          p: 2,
          borderRadius: 2,
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}>
          <pre>{JSON.stringify({
  "message": "All tasks cleared",
  "clearedCount": 35,
  "project": { "id": "...", "workflows": [] }
}, null, 2)}</pre>
        </Box>
      </Paper>

      {/* SEO Rolodex Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <StorageIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>SEO Rolodex Intelligence</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Direct endpoints for the SEO intelligence layer used by OpenClaw agents.
        </Typography>

        <Grid container spacing={3}>
          {[
            { tag: 'SERP', path: '/rank-tracking', desc: 'Track keyword rankings and SERP positions.' },
            { tag: 'RESEARCH', path: '/keyword-research', desc: 'Generate keyword ideas and search volume data.' },
            { tag: 'COMPETITION', path: '/analyze-competitors', desc: 'Identify top competitors for a target domain.' },
            { tag: 'BACKLINKS', path: '/fetch-backlink-summary', desc: 'Get backlink profiles and anchor distributions.' },
            { tag: 'AUDIT', path: '/site-audit', desc: 'Run a technical SEO crawl on the target project.' },
            { tag: 'CONTENT', path: '/llm-optimization', desc: 'AI-driven content optimization strategies.' }
          ].map((item, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Chip label={item.tag} size="small" sx={{ fontSize: '0.6rem', fontWeight: 900, height: 16 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{item.path}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.6 }}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="caption" sx={{ fontWeight: 800, tracking: '0.2em', textTransform: 'uppercase' }}>
          OpenClaw Intelligence Layer Protocol v2.0
        </Typography>
      </Box>
    </Box>
  );
};

export default ApiDocs;
