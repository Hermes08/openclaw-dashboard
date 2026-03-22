import cron from 'node-cron';
import axios from 'axios';
import { WorkflowExecutor } from '../workflows/WorkflowExecutor';

const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL || 'http://localhost:3001';
const SEO_ROLODEX_API_KEY = process.env.SEO_ROLODEX_API_KEY || '';

export class TaskScheduler {
    private workflowExecutor = new WorkflowExecutor();
    private taskQueue: any[] = [];
    private isWorkerRunning = false;

    init() {
        console.log('[TaskScheduler] Initializing cron jobs...');

        // SEO Audit - daily at 2am
        cron.schedule('0 2 * * *', async () => {
            console.log('[TaskScheduler] Triggering daily SEO Audit...');
            await this.enqueueWorkflowsForAllProjects('SEO_AUDIT');
        });

        // Competitor Analysis - every Monday at 3am
        cron.schedule('0 3 * * 1', async () => {
            console.log('[TaskScheduler] Triggering weekly Competitor Analysis...');
            await this.enqueueWorkflowsForAllProjects('SEO_COMPETITOR_ANALYSIS');
        });

        // Backlink Monitor - every Wednesday at 3am
        cron.schedule('0 3 * * 3', async () => {
            console.log('[TaskScheduler] Triggering weekly Backlink Monitor...');
            await this.enqueueWorkflowsForAllProjects('SEO_BACKLINK_MONITOR');
        });

        // Content Strategy - every Friday at 4am
        cron.schedule('0 4 * * 5', async () => {
            console.log('[TaskScheduler] Triggering weekly Content Strategy...');
            await this.enqueueWorkflowsForAllProjects('SEO_CONTENT_STRATEGY');
        });

        // Start the worker that processes the queue
        this.startWorker();

        console.log('[TaskScheduler] All cron jobs scheduled. Worker running.');
    }

    /**
     * Fetches all active projects from project-service and enqueues
     * a workflow task for each one that has SEO skills enabled.
     */
    private async enqueueWorkflowsForAllProjects(workflowType: string) {
        try {
            const response = await axios.get(`${PROJECT_SERVICE_URL}/api/projects`);
            const projects: any[] = response.data || [];

            for (const project of projects) {
                if (project.status !== 'active') continue;

                // Only process projects that have a domain/URL configured
                const domain = project.domain ||
                    project.repositoryUrl?.replace(/.*github\.com\/[^/]+\//, '').replace(/\.git$/, '') ||
                    null;

                if (!domain) {
                    console.warn(`[TaskScheduler] Project ${project.id} has no domain, skipping ${workflowType}`);
                    continue;
                }

                const task: any = {
                    type: workflowType,
                    payload: {
                        projectId: project.id,
                        domain,
                        apiKey: SEO_ROLODEX_API_KEY,
                    },
                };

                // For content strategy use the project name as keyword if no keyword is set
                if (workflowType === 'SEO_CONTENT_STRATEGY') {
                    task.payload.keyword = project.contentKeyword || project.name || domain;
                }

                this.taskQueue.push(task);
                console.log(`[TaskScheduler] Queued ${workflowType} for project ${project.id} (${domain})`);
            }
        } catch (error: any) {
            console.error(`[TaskScheduler] Failed to fetch projects from project-service:`, error.message);
        }
    }

    /**
     * Public method to manually trigger a workflow for a specific project.
     * Called by the project-service endpoint when the user clicks "Run" in the dashboard.
     */
    async triggerWorkflow(projectId: string, workflowType: string, domain: string, keyword?: string) {
        console.log(`[TaskScheduler] Manual trigger: ${workflowType} for project ${projectId} (${domain})`);
        const task: any = {
            type: workflowType,
            payload: {
                projectId,
                domain,
                apiKey: SEO_ROLODEX_API_KEY,
                keyword: keyword || domain,
            },
        };
        this.taskQueue.push(task);
        // If worker is idle, nudge it to start processing immediately
        if (!this.isWorkerRunning) {
            await this.processQueue();
        }
    }

    /**
     * Real worker that processes tasks from the queue sequentially.
     */
    private startWorker() {
        console.log('[TaskScheduler] Worker started, polling queue every 10 seconds...');
        setInterval(async () => {
            if (this.taskQueue.length > 0 && !this.isWorkerRunning) {
                await this.processQueue();
            }
        }, 10000);
    }

    private async processQueue() {
        if (this.isWorkerRunning || this.taskQueue.length === 0) return;

        this.isWorkerRunning = true;
        console.log(`[TaskScheduler] Processing queue. Tasks pending: ${this.taskQueue.length}`);

        while (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            try {
                console.log(`[TaskScheduler] Executing task: ${task.type} for project ${task.payload?.projectId}`);
                await this.workflowExecutor.execute(task);
                console.log(`[TaskScheduler] Task complete: ${task.type}`);
            } catch (error: any) {
                console.error(`[TaskScheduler] Task failed: ${task.type}`, error.message);
            }
        }

        this.isWorkerRunning = false;
        console.log('[TaskScheduler] Queue empty, worker idle.');
    }
}
