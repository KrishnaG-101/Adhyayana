# Project Changelog & Dependency Audit Ledger

> All dependency additions, toolchain modifications, and architectural decision records (ADRs) must be logged here pursuant to **AGENTS.md Rule 5**.

---

## [Unreleased]

### Phase 1 Design System Specification Refinement — 2026-09-05
#### UI/UX Architecture & Layout Specifications
- **Canvas & Aesthetic Tokens Refined**: Locked warm editorial paper (`#FAF8F5`) and deep ink charcoal (`#121213`) canvas with glassmorphic panel utilities (`backdrop-blur-md bg-white/70 dark:bg-stone-900/70 border-stone-200/50 dark:border-stone-800/50`).
- **Typography Pairing Standardized**: Updated display typography to `Newsreader` (editorial serif) for brand identity and puzzle titles; standardized `Inter` / `Plus Jakarta Sans` for UI cards, inputs, and letter tile slots.
- **Dual-Shell Navigation Topology Formalized**: Documented architectural specs for Platform Shell (standard routes with center links, streak flame counter, avatar dropdown, and pinned footer) and Puzzle Focus Mode Shell (`/puzzles/:id` with hamburger drawer, active title, rules modal help button, and hidden footer).
- **Discovery Catalog & Rules Modal Contracts**: Documented sticky desktop sidebar/mobile dropdown filter specs for `/puzzles` and the lifecycle contract for the interactive Rules Modal.

### Master Engineering Roadmap Formalization — 2026-09-05
#### Engineering Strategy & Workflows
- **Master Roadmap Codification**: Authored `docs/workflows/roadmap.md` establishing the single source of truth for all 7 project phases:
  - *Phase 1*: Shell, Dual-Navigation Architecture & Design Foundation (In Progress).
  - *Phase 2*: Puzzles Catalog, Discovery & Filter Engine.
  - *Phase 3*: Modular Puzzle Engine #1 — Word Blanks (Vertical Slice).
  - *Phase 4*: Authentication, Player Profiles & Cloud Persistence.
  - *Phase 5*: Modular Puzzle Engine #2 — Contexto (Semantic Proximity).
  - *Phase 6*: XP Engine, Dashboard Analytics & Leaderboards.
  - *Phase 7*: Real-Time Multiplayer Duels & Community.
- **Architectural Principles Locked**: Enforced Iterative Vertical Slices, Contract-First & Type Parity, Strict State & Scope Boundaries, and Pedagogy-First development across all phases.

### UI/UX Design System & Agent Skill Integration — 2026-09-05
#### Design System & Agent Tooling
- **Embedded Permanent Agent Skill**: Created `.agent/skills/ui-ux-pro-max/SKILL.md` embedding UI/UX design intelligence, WCAG AA contrast rules, 4px spacing scale, Lucide-React SVG iconography, and presentation state isolation.
- **Authoritative Design System**: Established `docs/architecture/design-system.md` consolidating tailored design specifications for Adhyayana:
  - Typography: `Lexend` / `Outfit` for headings; `Inter` / `Plus Jakarta Sans` for body, definitions, and letter tile grids.
  - Palette: Indigo/Slate foundation (`#4F46E5`), Emerald victory state (`#16A34A`), Amber near-miss indicator (`#D97706`), and slate background/surface tokens.
  - Component Blueprints: Formal specs for game board containers, letter tile slots, clue cards, and bottom-anchored guess input bars.
- **Root Directory Sanitization**: Cleaned up transient root folders to maintain pristine monorepo structure.

### Backend Runtime & Modular Core Scaffolding — 2026-09-05
#### Infrastructure & API Architecture
- **FastAPI Core Initialization**: Initialized `backend/app/main.py` with CORS middleware, `/health` endpoint, and `/api/v1` router mount.
- **Environment & Settings**: Created `backend/app/core/config.py` using `pydantic-settings.BaseSettings` for type-safe environment configuration.
- **Modular Puzzle Contracts**: Created `backend/app/engines/base.py` defining `AbstractPuzzleEngine`, `BasePuzzleInit`, `BaseGuessRequest`, and `BaseGuessResponse`.
- **Test Harness**: Configured `backend/tests/` with `pytest`, `pytest-asyncio`, and `httpx.AsyncClient` test fixtures.
- **Contract & Type Parity**: Synchronized `/health` and base puzzle envelope schemas across `docs/specs/api-contracts.json` and `frontend/src/types/backend.ts`.

---

## Dependency Rationale Log

| Date | Target | Package Name | Version | Rationale & Security Justification | Approved By |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-09-05 | `backend` | `fastapi` | `>=0.110.0` | High-performance async REST API framework for algorithmic scoring and endpoints. | Backend Engineer |
| 2026-09-05 | `backend` | `uvicorn[standard]` | `>=0.29.0` | Production ASGI web server implementation for FastAPI with uvloop and httptools. | Backend Engineer |
| 2026-09-05 | `backend` | `pydantic` | `>=2.6.0` | High-speed data validation and schema serialization with V2 core. | Backend Engineer |
| 2026-09-05 | `backend` | `pydantic-settings` | `>=2.2.0` | Type-safe environment variable parsing with validation and dot-env support. | Backend Engineer |
| 2026-09-05 | `backend` | `python-dotenv` | `>=1.0.0` | Secure local development environment variable file parsing. | Backend Engineer |
| 2026-09-05 | `backend` | `pytest` | `>=8.0.0` | Primary testing framework for unit, integration, and contract tests. | Backend Engineer |
| 2026-09-05 | `backend` | `pytest-asyncio` | `>=0.23.0` | Async support for pytest enabling native coroutine testing with FastAPI. | Backend Engineer |
| 2026-09-05 | `backend` | `httpx` | `>=0.27.0` | Async HTTP client for test requests via ASGI transport without binding network ports. | Backend Engineer |
| *Pending* | `frontend` | `react` | `^18.3.1` | Core UI rendering library. Zero CVEs, standard web foundation. | Teammate 1 & 2 |
| *Pending* | `frontend` | `vite` | `^5.4.0` | Fast ESM build tool and development server. | Teammate 1 & 2 |
| *Pending* | `frontend` | `tailwindcss` | `^3.4.0` | Utility-first styling engine for responsive layout. | Teammate 1 & 2 |
| *Pending* | `frontend` | `lucide-react` | `^0.400.0` | Consistent, accessible SVG icon library adhering to UI-UX Pro Max rules. | Teammate 1 & 2 |
| *Pending* | `frontend` | `firebase` | `^10.13.0` | Client SDK for Firebase Auth and Firestore persistence. | Teammate 1 & 2 |
| *Pending* | `backend` | `firebase-admin` | `>=6.5.0` | Server-side verification of Firebase ID tokens. | Teammate 1 & 2 |
| *Pending* | `backend` | `numpy` | `>=2.0.0` | Vector operations for high-speed cosine distance scoring. | Teammate 1 & 2 |
