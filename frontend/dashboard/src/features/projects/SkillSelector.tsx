import React from 'react';
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    Divider
} from '@mui/material';
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

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Project Skills</Typography>
            <FormGroup>
                {SKILLS.map((skill) => {
                    const isSelected = !!selectedSkills.find(s => s.id === skill.id);
                    const currentSkill = selectedSkills.find(s => s.id === skill.id);

                    return (
                        <Box key={skill.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handleMainSkillChange(skill.id)}
                                    />
                                }
                                label={skill.label}
                            />
                            {isSelected && (
                                <Box sx={{ ml: 4, mt: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={currentSkill?.automated || false}
                                                onChange={() => handleAutomateChange(skill.id)}
                                            />
                                        }
                                        label="Automate this skill"
                                    />
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body2" color="textSecondary">Select Sub-skills:</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {skill.subSkills.map(sub => (
                                            <FormControlLabel
                                                key={sub.id}
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={currentSkill?.subSkills.includes(sub.id)}
                                                        onChange={() => handleSubSkillChange(skill.id, sub.id)}
                                                    />
                                                }
                                                label={sub.label}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </FormGroup>
        </Box>
    );
};

export default SkillSelector;
