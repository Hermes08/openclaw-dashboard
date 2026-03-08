import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Paper,
    Chip,
    IconButton,
    Grid
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { SKILLS } from '../../constants/skills';

interface SkillSelectorProps {
    selectedSkills: any[];
    onChange: (skills: any[]) => void;
}

const SkillSelector: React.FC<SkillSelectorProps> = ({ selectedSkills, onChange }) => {
    const handleMainSkillChange = (skillId: string) => {
        const exists = selectedSkills.find(s => s.id === skillId);
        if (exists) {
            onChange(selectedSkills.filter(s => s.id !== skillId));
        } else {
            onChange([...selectedSkills, { id: skillId, subSkills: [], automated: false }]);
        }
    };

    const handleSubSkillChange = (mainSkillId: string, subSkillId: string) => {
        const newSkills = selectedSkills.map(s => {
            if (s.id === mainSkillId) {
                const hasSub = s.subSkills.includes(subSkillId);
                return {
                    ...s,
                    subSkills: hasSub
                        ? s.subSkills.filter((ss: string) => ss !== subSkillId)
                        : [...s.subSkills, subSkillId]
                };
            }
            return s;
        });
        onChange(newSkills);
    };

    const handleAutomateChange = (mainSkillId: string) => {
        const newSkills = selectedSkills.map(s => {
            if (s.id === mainSkillId) {
                return { ...s, automated: !s.automated };
            }
            return s;
        });
        onChange(newSkills);
    };

    const getIcon = (id: string) => {
        switch (id) {
            case 'website': return <LanguageIcon sx={{ fontSize: 32 }} />;
            case 'youtube': return <YouTubeIcon sx={{ fontSize: 32 }} />;
            default: return <LanguageIcon />;
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Select Project Skills</Typography>
            <Grid container spacing={2}>
                {SKILLS.map((skill) => {
                    const isSelected = !!selectedSkills.find(s => s.id === skill.id);
                    const currentSkill = selectedSkills.find(s => s.id === skill.id);

                    return (
                        <Grid size={{ xs: 12, md: 6 }} key={skill.id}>
                            <Paper
                                onClick={() => handleMainSkillChange(skill.id)}
                                sx={{
                                    p: 3,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: isSelected ? '2px solid' : '1px solid',
                                    borderColor: isSelected ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                                    bgcolor: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'rgba(30, 41, 59, 0.4)',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.5)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{
                                        color: isSelected ? 'primary.main' : 'text.secondary',
                                        transition: 'color 0.3s'
                                    }}>
                                        {getIcon(skill.id)}
                                    </Box>
                                    {isSelected ?
                                        <CheckCircleIcon color="primary" /> :
                                        <RadioButtonUncheckedIcon sx={{ color: 'rgba(255, 255, 255, 0.2)' }} />
                                    }
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {skill.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Automate {skill.label.toLowerCase()} content and SEO.
                                </Typography>

                                {isSelected && (
                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <Divider sx={{ my: 2, opacity: 0.3 }} />

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Automation</Typography>
                                            <IconButton
                                                onClick={() => handleAutomateChange(skill.id)}
                                                color={currentSkill?.automated ? "primary" : "default"}
                                                sx={{
                                                    bgcolor: currentSkill?.automated ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' }
                                                }}
                                            >
                                                <AutoFixHighIcon />
                                            </IconButton>
                                        </Box>

                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600, textTransform: 'uppercase' }}>
                                            Sub-Skills
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {skill.subSkills.map(sub => (
                                                <Chip
                                                    key={sub.id}
                                                    label={sub.label}
                                                    onClick={() => handleSubSkillChange(skill.id, sub.id)}
                                                    variant={currentSkill?.subSkills.includes(sub.id) ? "filled" : "outlined"}
                                                    color={currentSkill?.subSkills.includes(sub.id) ? "primary" : "default"}
                                                    size="small"
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        fontWeight: 500,
                                                        px: 0.5,
                                                        transition: 'all 0.2s'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default SkillSelector;
