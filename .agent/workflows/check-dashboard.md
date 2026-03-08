---
description: Check the OpenGravity dashboard for pending tasks from OpenClaw agents. Read the tasks, then execute them as real code changes on the local VIP-Expats-NextJS repo.
---

# Check Dashboard for Pending Tasks

## Step 1: Read pending tasks from the Dashboard API

// turbo
Run this command to fetch all pending tasks from the Dashboard API via SSH to the VPS:

```bash
ssh -o StrictHostKeyChecking=no root@187.77.2.112 "curl -s http://localhost:3001/api/projects/pending-tasks -H 'X-API-KEY: dev-key-123'" 2>/dev/null
```

If there are no pending tasks, report to the user that there are no tasks to execute.

If there are pending tasks, proceed to execute each one.

## Step 2: For each pending task, make real code changes

The local repo is at: `/Users/davidaguirre/VIP-Expats-NextJS`

Based on the task type, make **real, intelligent code changes**:

- **technical-seo**: Fix actual SEO issues — robots.txt, meta tags, schema markup, hreflang, sitemaps. Edit the real Next.js files.
- **content-creation**: Create real blog posts, guides, or pages as Next.js components/pages with proper SEO.
- **content-optimization**: Improve existing page content, meta tags, descriptions, headings, keyword density.
- **seo_metadata**: Update real meta tags in the actual page components.

Do NOT just create spec files. Make the actual code changes that implement what the task describes.

## Step 3: Commit and push

After making changes, commit to git and push:

```bash
cd /Users/davidaguirre/VIP-Expats-NextJS && git add -A && git commit -m "[Antigravity] <description of changes>" && git push origin VIP-next
```

## Step 4: Mark tasks as completed

For each completed task, mark it done via the API:

```bash
ssh -o StrictHostKeyChecking=no root@187.77.2.112 "curl -s -X PUT http://localhost:3001/api/projects/<PROJECT_ID>/tasks/<TASK_ID>/complete -H 'Content-Type: application/json' -H 'X-API-KEY: dev-key-123' -d '{\"executedBy\":\"antigravity-ai\"}'"
```

The project ID for Panama Real Estate Sale is: `af2cfb48-d1e6-4fcf-8ae5-d49008d0ca72`

## Step 5: Report to user

Tell the user what changes were made and that the tasks are completed.
