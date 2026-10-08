# Current Development State

> **Master Roadmap**: Defined and tracked in [`docs/workflows/roadmap.md`](../workflows/roadmap.md)

## Current Sprint Status
- **Current Phase**: Phase 4 (Authentication, Player Profiles & Cloud Persistence) — Complete
- **Next Milestone**: Phase 5: Modular Puzzle Engine #2 — Contexto (Semantic Proximity & Vector Embeddings)
- **Active Task**: Phase 4 Complete (Contract-First Auth Schemas, FastAPI Bearer Token Dependency, User Profile & Guest Migration Endpoints, AuthModal Dialog, AvatarDropdown State Swapping, Player Profile Page `/profile`, and LocalStorage-to-Cloud Migration Engine)

## Active Assignments
- **Lead Systems Architect / Backend**: Phase 4 Complete: Declared contracts in `api-contracts.json`, created Pydantic v2 schemas in `schemas/users.py`, Firebase verification provider in `core/firebase.py`, FastAPI `get_current_user` Bearer dependency in `api/deps.py`, routes `GET /api/v1/auth/me`, `PATCH /api/v1/users/profile`, `POST /api/v1/users/migrate-guest-data`, and verified with 22/22 Pytest tests passing.
- **Frontend Engineer**: Phase 4 Complete: Mirrored types in `types/user.ts`, API client in `services/authApi.ts`, Firebase provider & mock auth in `services/firebase.ts`, reactive `AuthContext.tsx`, accessible `AuthModal.tsx`, dynamic `AvatarDropdown.tsx`, player profile page `ProfilePage.tsx` (`/profile`), and verified with 43/43 Vitest tests passing and clean production build.

## Operational Endpoints
- **Active Health Probe**: `GET /health` -> `{"status": "healthy", "service": "adhyayana-backend", "version": "0.1.0"}`
- **Puzzle Catalog Discovery**: `GET /api/v1/puzzles` -> `PuzzleCatalogResponse`
- **Puzzle Metadata Lookup**: `GET /api/v1/puzzles/{puzzle_id}` -> `PuzzleMetadata`
- **Word Blanks Progression Levels**: `GET /api/v1/puzzles/word-blanks/levels` -> `List[WordBlanksLevel]` (17 levels, 450+ stems)
- **Word Blanks Guess Evaluator**: `POST /api/v1/puzzles/word-blanks/evaluate` -> `WordBlanksEvaluationResponse`
- **Authenticated User Profile**: `GET /api/v1/auth/me` -> `UserProfile`
- **Profile & Preference Update**: `PATCH /api/v1/users/profile` -> `UserProfile`
- **Guest State Cloud Migration**: `POST /api/v1/users/migrate-guest-data` -> `GuestMigrationResponse`

## Blockers & Dependencies
- None currently.

## Next Up (Iteration Backlog — Phase 5)
- [x] Phase 4: Declare UserProfile, Auth, and Migration schemas in `docs/specs/api-contracts.json`
- [x] Phase 4: Implement backend token verification and user endpoints with 22/22 pytest tests
- [x] Phase 4: Implement frontend AuthContext, AuthModal, AvatarDropdown, and ProfilePage with 43/43 vitest tests
- [x] Phase 4: Implement guest-to-cloud localStorage progress migration engine
- [ ] Phase 5: Declare Contexto engine contracts and cosine distance schemas in `docs/specs/api-contracts.json`
- [ ] Phase 5: Implement backend embedding model / vector rank evaluator in `backend/app/engines/contexto/`
- [ ] Phase 5: Build frontend Contexto interactive game board in `frontend/src/engines/contexto/`

---

## Completed Milestones
- [x] Monorepo directory skeleton initialization (`frontend/`, `backend/`, `docs/`, `.agent/`)
- [x] Authoritative context spec creation (`context.md` - Vicharanashala pattern)
- [x] Agent baseline rules defined (`AGENTS.md`)
- [x] Developer onboarding documentation (`README.md`)
- [x] Pluggable puzzle engine framework specification (`docs/specs/puzzle-framework.md`)
- [x] API contract registry initialization (`docs/specs/api-contracts.json`)
- [x] System architecture & topology documentation (`docs/architecture/system-overview.md`)
- [x] Firestore data model specification (`docs/architecture/data-model.md`)
- [x] Workflow rules & Antigravity skills scaffolding
- [x] Codified Rule 6 (Mandatory `context.md` sync on every commit, `README.md` sync when needed) across `AGENTS.md`, `context.md`, `README.md`, and `.agent/`
- [x] Initialize backend `requirements.txt`, `core/config.py`, and FastAPI `main.py`
- [x] Modular puzzle base contract (`AbstractPuzzleEngine`, `BasePuzzleInit`, `BaseGuessRequest`, `BaseGuessResponse`) in `backend/app/engines/base.py`
- [x] Backend test harness configured with `pytest`, `pytest-asyncio`, and `httpx.AsyncClient`
- [x] Formulated and refined authoritative UI/UX design system in `docs/architecture/design-system.md` (Phase 1 Dual-Shell, warm canvas, Newsreader typography, rules modal contract)
- [x] Embedded permanent `ui-ux-pro-max` design intelligence skill in `.agent/skills/ui-ux-pro-max/`
- [x] Formalized 7-Phase Master Engineering Roadmap in `docs/workflows/roadmap.md`
- [x] Phase 1 Frontend Scaffolding Complete: Vite + React + TypeScript + Tailwind CSS, Dual-Shell Navigation (`Navbar`, `HamburgerDrawer`, `RulesModal`, `Footer`, `Layout`), `ThemeContext`, `NavigationContext` (URL-reactive `isFocusMode`), full route skeletons (`/`, `/puzzles`, `/puzzles/:id`, `/leaderboard`, `/community`, `/about`), 8/8 Vitest tests passing, and living context synchronization (`context.md` v1.1.0).
- [x] UI/UX Polish & Legal Scaffolding: Refined dark theme canvas (`#161618`) and surfaces (`#202024`), swapped glassmorphism (solid crisp `AvatarDropdown`, glassmorphic `HamburgerDrawer`), implemented mobile 3-category filter grid on `/puzzles`, scaffolded bespoke editorial `TermsPage` (`/terms`) and `PrivacyPage` (`/privacy`), and expanded Vitest test suite to 15/15 passing tests (`context.md` v1.2.0).
- [x] Drawer Interaction Decoupling & Accordion Refactor: Decoupled Puzzles row into direct catalog link (`/puzzles`) and isolated rotating chevron accordion trigger, default collapsed state (`isPuzzlesExpanded = false`), removed redundant nested catalog link, enforced 44px touch targets across all rows, and expanded Vitest test suite to 20/20 passing tests (`context.md` v1.2.1).
- [x] Widescreen Full-Width Responsiveness & Layout Audit: Refactored Navbar, Footer, and page views to fluid scaling (`max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10`), sticky footer guarantee with `min-h-screen` and `flex-1` main, horizontal `overflow-x-hidden`, HomePage proportional 3-card grid, PuzzlesPage `2xl:grid-cols-3` catalog expansion with `lg:w-72` sidebar, and hardened `z-50` clipping prevention (`context.md` v1.3.0).
- [x] Phase 2 Step 2.1: Puzzle Catalog API contracts (`DifficultyLevel`, `GameType`, `LearningObjective`, `PuzzleLevelInfo`, `PuzzleMetadata`, `PuzzleCatalogResponse`), Pydantic v2 schemas in `backend/app/schemas/puzzles.py`, `CatalogService` in `backend/app/services/catalog.py`, endpoints `GET /api/v1/puzzles` & `/{puzzle_id}`, frontend type parity in `frontend/src/types/catalog.ts`, and test suite `backend/tests/test_catalog.py` (8/8 backend tests passing, 20/20 vitest tests passing, `context.md` v1.4.0).
- [x] Phase 2 Step 2.2: Dynamic Catalog API Client (`catalogApi.ts`) with offline fixture fallback, URL Search Parameter Synchronization (`search`, `difficulty`, `type`, `objective`) on `PuzzlesPage.tsx`, Level Ladders & XP Badges, and expanded test suite (22/22 vitest tests passing, 8/8 backend tests passing, `context.md` v1.5.0).

