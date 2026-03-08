import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
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
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Create New Project</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                />

                <SkillSelector
                    selectedSkills={selectedSkills}
                    onChange={setSelectedSkills}
                />

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Create Project
                </Button>
            </Box>
        </Paper>
    );
};

export default ProjectForm;
