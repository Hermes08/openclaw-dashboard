import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { addProject } from './projectsSlice';
import SkillSelector from './SkillSelector';

const ProjectForm: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
    const dispatch = useAppDispatch();

    const generateWorkflows = (skills: any[]) => {
        const workflows: any[] = [];
        skills.forEach(skill => {
            if (skill.id === 'website') {
                // Logical sequence for website
                const sequence = ['content', 'articles', 'seo'].filter(ss => skill.subSkills.includes(ss));
                workflows.push({
                    skillId: 'website',
                    steps: sequence.map((step, index) => ({
                        id: step,
                        order: index,
                        automated: step === 'seo' ? skill.automated : false // Example logic
                    }))
                });
            } else if (skill.id === 'youtube') {
                // Logical sequence for youtube
                const sequence = ['video', 'publishing'].filter(ss => skill.subSkills.includes(ss));
                workflows.push({
                    skillId: 'youtube',
                    steps: sequence.map((step, index) => ({
                        id: step,
                        order: index,
                        automated: skill.automated
                    }))
                });
            }
        });
        return workflows;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            const workflows = generateWorkflows(selectedSkills);
            dispatch(addProject({
                name,
                description,
                skills: selectedSkills,
                workflows
            }));
            setName('');
            setDescription('');
            setSelectedSkills([]);
        }
    };

    return (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>New Project</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Project Name"
                            placeholder="e.g. My Awesome Site"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: { bgcolor: 'rgba(255, 255, 255, 0.03)' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Description"
                            placeholder="Briefly describe the goal..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={1}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: { bgcolor: 'rgba(255, 255, 255, 0.03)' }
                            }}
                        />
                    </Grid>
                </Grid>

                <SkillSelector
                    selectedSkills={selectedSkills}
                    onChange={setSelectedSkills}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        Launch Project
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default ProjectForm;
