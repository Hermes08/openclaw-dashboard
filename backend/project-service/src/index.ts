import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from "./data-source";
import projectRoutes from "./routes/ProjectRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/", projectRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        // EMERGENCY RESTORATION: Ensure Panama Real Estate Project exists
        const projectRepo = AppDataSource.getRepository("Project");
        const projectId = '782e4f01-5d9c-4f1a-b0c4-9d1a2b3c4d5e';
        
        projectRepo.findOneBy({ id: projectId }).then(existing => {
            if (!existing) {
                console.log("Injecting Panama Real Estate Project...");
                const p = projectRepo.create({
                    id: projectId,
                    name: 'Panama Real Estate Sale',
                    description: 'Luxury Real Estate and SEO Automation for Panama Market.',
                    status: 'active',
                    branch: 'main',
                    repositoryUrl: 'panamarealestatesale.com',
                    workflows: [
                        {
                            skillId: 'website',
                            source: 'openclaw',
                            steps: [
                                {
                                    id: 'sync-verified-' + Date.now(),
                                    title: 'SEORolodex Sync Verification',
                                    description: 'Confirmed connection between local backend and Netlify dashboard.',
                                    status: 'pending',
                                    createdAt: new Date().toISOString()
                                }
                            ]
                        }
                    ]
                });
                projectRepo.save(p).then(() => console.log("Panama Project Injected."));
            } else {
                console.log("Panama Project already exists in DB.");
            }
        });

        app.get('/health', (req, res) => {
            res.json({ status: 'Project Service is running' });
        });

        app.listen(PORT, () => {
            console.log(`Project Service running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
