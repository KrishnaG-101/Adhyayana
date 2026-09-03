---
name: commit-formatter
description: >-
  Analyzes staged git changes and generates concise, compliant Conventional Commit messages
  following the team standards defined in .agent/rules/git-workflow.md.
  Use when the user asks to format a commit, write a commit message, or commit changes.
---

# Commit Formatter Skill (`commit-formatter`)

This skill inspects staged repository modifications using `git status` and `git diff --staged`, analyzes the architectural intent of the changes, and generates a structured, high-clarity **Conventional Commit v1.0.0** message.

---

## Trigger Conditions
Activate this skill when:
- The user requests: "write a commit message", "commit these changes", "format my commit", "prepare commit".
- A feature, bugfix, or refactor milestone has been implemented and is ready to be committed.

---

## Step-by-Step Execution Workflow

### Step 1: Inspect Staged Git Status
1. Check repository status:
   ```bash
   git status
   ```
2. Inspect the precise staged diff:
   ```bash
   git diff --staged
   ```
   *(If no files are staged, identify the unstaged modified/created files and propose staging them or check with the user).*

### Step 2: Determine Semantic Type and Scope
Select the most accurate type based on `.agent/rules/git-workflow.md`:
- `feat`: A new feature, engine, or API endpoint.
- `fix`: A bug fix, scoring correction, or syntax fix.
- `docs`: Documentation, specifications, architecture, or comment updates.
- `style`: Formatting, missing semi-colons, white-space fixes.
- `refactor`: Code reorganization that neither adds a feature nor fixes a bug.
- `perf`: Optimizations that improve latency, memory, or bundle size.
- `test`: Adding or modifying tests.
- `chore`: Tooling, build config, dependency bumps, or tracker updates.

Determine the scope (in parentheses):
- `engine-<name>` (e.g. `engine-contexto`)
- `api` or `routes`
- `auth`
- `specs` or `docs`
- `frontend` or `backend`

### Step 3: Compose Commit Message
Format strictly as:
```text
<type>(<scope>): <concise description in imperative mood>

<detailed bullet points or paragraph explaining motivation, architectural decisions, and contract changes>
```

#### Formatting Rules:
- Header must not exceed 72 characters.
- Use imperative mood: "add", "fix", "update" (NOT "added", "fixing", "updates").
- Lowercase description; no period at the end of the subject line.
- Provide clear context in the message body explaining *why* the change was made, not merely *what* lines were touched.

### Step 4: Output and User Confirmation
Present the formatted commit message clearly to the user or execute `git commit -m "..."` if instructed.
