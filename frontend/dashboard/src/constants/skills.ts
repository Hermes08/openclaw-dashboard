export interface SubSkill {
    id: string;
    label: string;
}

export interface Skill {
    id: string;
    label: string;
    subSkills: SubSkill[];
}

export const SKILLS: Skill[] = [
    {
        id: 'website',
        label: 'Websites',
        subSkills: [
            { id: 'content', label: 'Content Creation' },
            { id: 'articles', label: 'Articles' },
            { id: 'seo', label: 'SEO Analysis' },
        ],
    },
    {
        id: 'youtube',
        label: 'YouTube',
        subSkills: [
            { id: 'video', label: 'Video Creation' },
            { id: 'publishing', label: 'Publishing' },
        ],
    },
];
