---
description: Check the OpenGravity dashboard for pending tasks from OpenClaw agents. Read the tasks, then execute them as real code changes on the local repo for each project.
---

# Check Dashboard for Pending Tasks

## Step 1: Fetch all pending tasks

// turbo
```bash
ssh -o StrictHostKeyChecking=no root@187.77.2.112 "curl -s http://localhost:3001/api/projects/pending-tasks -H 'X-API-KEY: dev-key-123'" 2>/dev/null
```

Parse the JSON response. Each item contains: `projectId`, `projectName`, `repositoryUrl`, `branch`, and `task` (with `id`, `type`, `title`, `priority`, `payload`).

If there are no pending tasks, tell the user and stop.

## Step 2: For each project with pending tasks

### 2a. Find or clone the repo locally

Check if the project's repo already exists on the user's Mac. Common locations:
- `/Users/davidaguirre/` (top level)
- `/Users/davidaguirre/Desktop/`

The repo folder name is usually the last segment of `repositoryUrl` without `.git`. Search for it:

// turbo
```bash
find /Users/davidaguirre -maxdepth 3 -name "<REPO_NAME>" -type d 2>/dev/null | head -1
```

If not found, clone it into `/Users/davidaguirre/Desktop/`:

```bash
cd /Users/davidaguirre/Desktop && git clone <repositoryUrl>
```

### 2b. Ensure correct branch

```bash
cd <REPO_PATH> && git checkout <branch> && git pull origin <branch>
```

## Step 3: Execute each task as real code changes

Based on `task.type`, make **real, intelligent code changes** in the project repo. Do NOT create spec files — write actual production code:

- **technical-seo**: Edit real Next.js files — fix robots.txt, add/fix meta tags in page components, implement schema markup (JSON-LD), fix hreflang tags, update sitemap config.
- **content-creation**: Create real pages/blog posts as proper Next.js components with SEO best practices, proper head tags, structured content.
- **content-optimization**: Improve existing page components — enhance meta descriptions, fix heading hierarchy, improve keyword usage, add internal links.
- **seo_metadata**: Update actual `<Head>` or metadata exports in the relevant page files.
- **marketing**: Implement CTA improvements, landing page optimizations, conversion elements.

Read the task's `payload` or `details` carefully — it contains specific instructions for what to change.

## Step 4: Commit and push

After all tasks for a project are executed:

```bash
cd <REPO_PATH> && git add -A && git commit -m "[Antigravity] <summary of changes>" && git push origin <branch>
```

## Step 5: Mark each task as completed

For each completed task:

// turbo
```bash
ssh -o StrictHostKeyChecking=no root@187.77.2.112 "curl -s -X PUT http://localhost:3001/api/projects/<PROJECT_ID>/tasks/<TASK_ID>/complete -H 'Content-Type: application/json' -H 'X-API-KEY: dev-key-123' -d '{\"executedBy\":\"antigravity-ai\"}'" 2>/dev/null
```

## Step 6: Report

Tell the user what tasks were found, what code changes were made, and which repos were updated.
