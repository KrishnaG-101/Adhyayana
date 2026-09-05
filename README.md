# Adhyayana (अध्ययन)

> A rigorous web application dedicated to language acquisition through gamified linguistic puzzles, active cognitive recall, semantic proximity, and morphological exploration.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend: React + Vite + TS](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_TS-61DAFB.svg)](frontend/)
[![Backend: FastAPI + Python](https://img.shields.io/badge/Backend-FastAPI_%7C_Python_3.11+-009688.svg)](backend/)
[![Persistence: Firebase](https://img.shields.io/badge/Persistence-Firestore_%7C_Auth-FFCA28.svg)](docs/architecture/data-model.md)

---

## 1. Project Vision & Pedagogy

Unlike conventional word games that reward brute-force combinatorial guessing, **Adhyayana** implements the **Vicharanashala** framework:
- **Semantic Proximity**: Navigating vector neighborhoods using semantic distance to target concepts.
- **Morphological Agility**: Recognizing roots, affixes, and structural word formation.
- **Syntactic Reasoning**: Cloze inferences and context-driven lexical selection.
- **Analytical Feedback**: Instant multidimensional telemetry instead of binary win/lose screens.

For comprehensive architectural and pedagogical specifications, refer to [`context.md`](context.md) and [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md).

---

## 2. Monorepo Directory Map

```text
adhyayana/
├── .agent/                             # Antigravity agent configuration
│   ├── rules/                          # Team and linting coding standards
│   │   ├── git-workflow.md             # Git branch, PR, and commit policies
│   │   ├── frontend-standards.md       # React, Tailwind, and TypeScript standards
│   │   └── backend-standards.md        # FastAPI, Pydantic v2, and async standards
│   └── skills/                         # Antigravity automated workflow skills
│       ├── contract-sync/              # Sync Pydantic models with TS & JSON contracts
│       ├── puzzle-scaffold/            # Scaffold frontend/backend engine pairs
│       └── commit-formatter/           # Generate Conventional Commits from git diffs
├── docs/                               # Engineering documentation & specifications
│   ├── architecture/                   # High-level architecture and data schemas
│   │   ├── system-overview.md          # Topology, auth flow, and network boundaries
│   │   └── data-model.md               # Firestore schemas, indexes, and entity models
│   ├── specs/                          # Technical specifications and contracts
│   │   ├── puzzle-framework.md         # Pluggable puzzle engine specification
│   │   └── api-contracts.json          # Master JSON Schema API contracts
│   └── tracker/                        # Collaboration and iteration management
│       ├── state.md                    # Living sprint tracker (tasks, blockers, next up)
│       └── changelog.md                # Dependency rationale & architectural decisions
├── frontend/                           # Client-side web application
│   └── src/
│       ├── components/                 # Global, reusable UI design system
│       ├── engines/                    # Pluggable puzzle game engines (e.g. Contexto)
│       ├── services/                   # Firebase and backend API service clients
│       └── types/                      # TypeScript definitions (mirrored from backend)
├── backend/                            # Server-side algorithmic & scoring API
│   └── app/
│       ├── api/routes/                 # FastAPI REST route controllers
│       ├── core/                       # App configuration, security, and auth middleware
│       ├── engines/                    # Pluggable backend algorithmic handlers
│       └── schemas/                    # Pydantic v2 DTOs (mirrored to frontend)
├── context.md                          # Foundational pedagogical & architecture context
├── AGENTS.md                           # Antigravity agent operational rules
├── README.md                           # Developer onboarding guide (this file)
└── LICENSE                             # MIT License
```

---

## 3. Local Development Prerequisites

Ensure the following runtimes and toolchains are installed on your workstation:

1. **Node.js**: `v20.x` or higher (LTS recommended)
   - Verify with: `node -v`
   - Package manager: `npm` (`v10.x+`)
2. **Python**: `3.11` or higher
   - Verify with: `python --version` or `py -3.11 --version`
   - Environment manager: `venv`
3. **Firebase CLI**: `v13.x` or higher
   - Verify with: `firebase --version`
   - Install via: `npm install -g firebase-tools`
4. **Git**: `2.40+`
   - Verify with: `git --version`

---

## 4. Backend Setup & Local Execution

To start the FastAPI backend service and execute the automated test suite:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start development server with hot-reload
uvicorn app.main:app --reload --port 8000

# 4. Verify system health probe
curl http://localhost:8000/health

# 5. Run test suite
pytest tests/ -v
```

---

## 5. Dual-Developer Git Workflow

To ensure harmonious, zero-conflict collaboration between teammates:

### 4.1 Branching Strategy
- Main branch (`main`) is protected. Never commit directly to `main`.
- Feature branches branch from `main` using standard prefixes:
  - `feat/<short-description>`: New features or puzzle engines.
  - `fix/<short-description>`: Bug fixes or corrections.
  - `docs/<short-description>`: Spec or documentation updates.
  - `chore/<short-description>`: Dependency changes or tooling setup.

### 4.2 Development Routine
1. **Pull Latest Main**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create Feature Branch**:
   ```bash
   git checkout -b feat/puzzle-engine-interface
   ```
3. **Check Contract Guardrails**:
   - Before introducing API endpoints, update [`docs/specs/api-contracts.json`](docs/specs/api-contracts.json).
   - Maintain strict type parity across `backend/app/schemas/` and `frontend/src/types/`.
4. **Record Changes in Tracker**:
   - Update [`docs/tracker/state.md`](docs/tracker/state.md) with active tasks.
   - If adding dependencies, log rationale in [`docs/tracker/changelog.md`](docs/tracker/changelog.md).
5. **Format & Commit**:
   - Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
   - Use the Antigravity `commit-formatter` skill or follow the formatting in [`.agent/rules/git-workflow.md`](.agent/rules/git-workflow.md).
6. **Submit PR**:
   - Require code review from the co-developer before merging to `main`.

---

## 5. Antigravity Agent Directives

AI agents working in this repository must strictly adhere to [`AGENTS.md`](AGENTS.md):
- **Rule 1 (Contract-First)**: Lock schemas in `docs/specs/api-contracts.json` before coding endpoints.
- **Rule 2 (Type Parity)**: Maintain identical Pydantic and TypeScript types.
- **Rule 3 (Modular Engines)**: Keep puzzle logic isolated inside engine folders.
- **Rule 4 (State Tracker Sync)**: Keep `docs/tracker/state.md` updated at every milestone.
- **Rule 5 (Dependency Guardrail)**: Record any dependency installation in `docs/tracker/changelog.md`.
- **Rule 6 (Context & Doc Sync)**: Refresh `context.md` on every single commit, and update `README.md` when setup, structure, or workflows change.

