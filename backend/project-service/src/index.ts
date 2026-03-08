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
