import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";

export class ProjectController {
    private projectRepository = AppDataSource.getRepository(Project);

    async getAll(req: Request, res: Response) {
        const projects = await this.projectRepository.find();
        res.json(projects);
    }

    async getOne(req: Request, res: Response) {
        const project = await this.projectRepository.findOneBy({ id: req.params.id });
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    }

    async create(req: Request, res: Response) {
        const project = this.projectRepository.create(req.body);
        const result = await this.projectRepository.save(project);
        res.status(201).json(result);
    }

    async update(req: Request, res: Response) {
        const project = await this.projectRepository.findOneBy({ id: req.params.id });
        if (!project) return res.status(404).json({ message: "Project not found" });
        this.projectRepository.merge(project, req.body);
        const result = await this.projectRepository.save(project);
        res.json(result);
    }

    async delete(req: Request, res: Response) {
        const result = await this.projectRepository.delete(req.params.id);
        res.json(result);
    }

    async addTask(req: Request, res: Response) {
        try {
            const project = await this.projectRepository.findOneBy({ id: req.params.id });
            if (!project) return res.status(404).json({ message: "Project not found" });

            const task = req.body;
            task.status = task.status || 'pending';
            task.createdAt = task.createdAt || new Date().toISOString();

            const workflows: any[] = project.workflows || [];
            // Find or create the default workflow for this skill
            const skillId = task.skillId || 'website';
            let workflow = workflows.find((w: any) => w.skillId === skillId);
            if (!workflow) {
                workflow = { skillId, source: task.source || 'openclaw', steps: [] };
                workflows.push(workflow);
            }
            if (!workflow.steps) workflow.steps = [];
            workflow.steps.push(task);
            project.workflows = workflows;

            const result = await this.projectRepository.save(project);
            res.status(201).json({ message: "Task added", taskId: task.id, project: result });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to add task", error: error.message });
        }
    }

    async completeTask(req: Request, res: Response) {
        try {
            const project = await this.projectRepository.findOneBy({ id: req.params.id });
            if (!project) return res.status(404).json({ message: "Project not found" });

            const { taskId } = req.params;
            const workflows: any[] = project.workflows || [];
            let found = false;

            for (const wf of workflows) {
                if (wf.steps) {
                    const step = wf.steps.find((s: any) => s.id === taskId);
                    if (step) {
                        step.status = 'completed';
                        step.completedAt = new Date().toISOString();
                        step.executedBy = req.body.executedBy || 'antigravity';
                        step.result = req.body.result;
                        found = true;
                        break;
                    }
                }
            }

            if (!found) return res.status(404).json({ message: "Task not found" });

            project.workflows = workflows;
            const result = await this.projectRepository.save(project);
            res.json({ message: "Task completed", taskId, project: result });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to complete task", error: error.message });
        }
    }

    async getPendingTasks(req: Request, res: Response) {
        const projects = await this.projectRepository.find();
        const pendingTasks: any[] = [];

        projects.forEach(project => {
            if (project.workflows && Array.isArray(project.workflows)) {
                project.workflows.forEach((workflow: any) => {
                    if (workflow.steps && Array.isArray(workflow.steps)) {
                        workflow.steps.forEach((step: any) => {
                            if (step.status === 'pending') {
                                pendingTasks.push({
                                    projectId: project.id,
                                    projectName: project.name,
                                    repositoryUrl: project.repositoryUrl,
                                    branch: project.branch,
                                    task: step
                                });
                            }
                        });
                    }
                });
            }
        });

        res.json(pendingTasks);
    }
}
