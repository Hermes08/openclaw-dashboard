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
}
