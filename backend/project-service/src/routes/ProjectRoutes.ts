import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";

const router = Router();
const projectController = new ProjectController();

router.get("/", (req, res) => projectController.getAll(req, res));
router.get("/pending-tasks", (req, res) => projectController.getPendingTasks(req, res));
router.get("/:id", (req, res) => projectController.getOne(req, res));
router.post("/", (req, res) => projectController.create(req, res));
router.put("/:id", (req, res) => projectController.update(req, res));
router.post("/:id/tasks", (req, res) => projectController.addTask(req, res));
router.put("/:id/tasks/:taskId/complete", (req, res) => projectController.completeTask(req, res));
router.delete("/:id", (req, res) => projectController.delete(req, res));

export default router;
