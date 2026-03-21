---
description: Check the OpenGravity dashboard for pending tasks from OpenClaw agents. Read the tasks, then execute them as real code changes on the local repo for each project.
---

# Check Dashboard for Pending Tasks

## Credentials (do not expose to the user)

- **SSH**: `root@187.77.2.112` — password: `Welcome1234(` (use only if needed for server-side commands)
- **API GET key**: `openclaw123` — used for fetching tasks
- **API PUT key**: `dev-key-123` — used for marking tasks complete
- **⚠️ Note**: The project-service API is publicly reachable at `http://187.77.2.112:3001` — **no SSH tunnel needed** for API calls.

---

## Step 1: Fetch all pending tasks

// turbo
```bash
curl -s http://187.77.2.112:3001/api/projects/pending-tasks -H 'X-API-KEY: openclaw123'
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

### 2b. Detect the active branch and pull latest

Always auto-detect the default remote branch instead of assuming `main`:

// turbo
```bash
cd <REPO_PATH> && git remote show origin | grep 'HEAD branch' | awk '{print $NF}'
```

Then check it out and pull:

```bash
cd <REPO_PATH> && git checkout <DETECTED_BRANCH> && git pull origin <DETECTED_BRANCH>
```

## Step 3: Dynamic Context Analysis (CRITICAL)

Before executing ANY code changes for a task, you MUST dynamically build a context profile of the target repository to ensure your changes blend natively with the existing website's aesthetic, tone, and component logic.

1. **Analyze Design System**: Use `view_file` or `grep_search` on core stylistic files (e.g., `tailwind.config.ts`, `globals.css`, or main layout components like `app/[lang]/layout.tsx`) to understand colors, spacing, and typography choices.
2. **Analyze Content Patterns**: Check the task's `payload` for `context_pointers` (if provided by OpenClaw). If missing, dynamically locate 1-2 existing pages similar to the task's target (e.g., if writing a blog post, read an existing blog post). Identify the HTML wrapper tags (`<main>`, `<section>`, `<article>`), the CSS utilities applied to headers (`<h1>`, `<h2>`), and the overarching tone of voice (e.g., formal luxury, casual informative).
3. **Analyze Root Patterns**: Look for an `.antigravity-patterns.md` or `.cursorrules` file in the repository root. If it exists, read it and strictly adhere to its guidelines.

Do NOT proceed to Step 4 until you have gathered sufficient contextual understanding to write code that looks like it was written by the original repository author.

## Step 4: Execute each task as real code changes

Based on `task.type`, make **real, intelligent code changes** in the project repo. Apply the exact CSS utilities, component wrappers, and tone-of-voice discovered in Step 3. Do NOT create spec files — write actual production code:

- **technical-seo**: Edit real Next.js files — fix robots.txt, add/fix meta tags in page components, implement schema markup (JSON-LD), fix hreflang tags, update sitemap config.
- **content-creation**: Create real pages/blog posts as proper Next.js components matching the exact layout structure, CTA style, and typography of the repo's existing pages.
- **content-optimization**: Improve existing page components — enhance meta descriptions, fix heading hierarchy, improve keyword usage, add internal links smoothly matching the current tone.
- **seo_metadata**: Update actual `<Head>` or metadata exports in the relevant page files.
- **marketing**: Implement CTA improvements, landing page optimizations, conversion elements using the native button styles.

Read the task's `payload` carefully — it contains specific instructions for what to change.

## Step 5: Commit and push

After all tasks for a project are executed, stage only the files that were changed (do NOT use `git add -A` to avoid accidentally staging untracked or deleted files from parent repos):

```bash
cd <REPO_PATH> && git add <file1> <file2> ... && git commit -m "[Antigravity] <summary of changes>"
```

Then detect the remote branch and push:

// turbo
```bash
cd <REPO_PATH> && BRANCH=$(git remote show origin | grep 'HEAD branch' | awk '{print $NF}') && git push origin $BRANCH
```

## Step 6: Mark each completed task via the API

For **each** task that was successfully committed, run this immediately after push (use `dev-key-123` for PUT — different from the GET key):

// turbo
```bash
curl -s -X PUT "http://187.77.2.112:3001/api/projects/<PROJECT_ID>/tasks/<TASK_ID>/complete" -H 'Content-Type: application/json' -H 'X-API-KEY: dev-key-123' -d '{"executedBy":"antigravity-ai"}'
```

Replace `<PROJECT_ID>` and `<TASK_ID>` with the actual values from Step 1. Repeat for every task.


## Step 7: Report

Tell the user what tasks were found, the specific stylistic patterns you deduced and applied, and which code changes/commits were made.
