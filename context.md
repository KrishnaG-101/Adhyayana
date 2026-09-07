# Adhyayana (अध्ययन) — System & Pedagogical Context Specification

> **Document Class**: Foundational System Specification (Vicharanashala Pattern)  
> **Target System**: Adhyayana Web Application (English Linguistic Pedagogy)  
> **Status**: Active / Authoritative  
> **Version**: 1.4.0  
> **Last Synchronized Milestone**: Phase 2 Step 2.1: Puzzle Catalog API Contracts, Progression Schemas & Discovery Engine (Completed)  

---

## 1. Executive Vision & Philosophy

**Adhyayana (अध्ययन)** is a high-rigor, gamified language acquisition platform designed to cultivate linguistic intuition, deep vocabulary comprehension, morphological agility, and syntactic reasoning. 

Traditional digital word games rely heavily on shallow, combinatorial guesswork (e.g., anagram unscrambling, letter-grid searches, or 5-letter frequency elimination). Adhyayana fundamentally departs from this paradigm by anchoring pedagogical progression in **active cognitive recall, semantic proximity, morphological decomposition, and syntactic inference**.

The learning experience is structured around daily and modular linguistic challenges that bridge the gap between dictionary rote memorization and contextual, intuitive language mastery.

---

## 2. Pedagogical Framework & Constraints (Vicharanashala Pattern)

Adhyayana implements the **Vicharanashala (विचारणशाला — "Laboratory of Deliberation")** framework: an instructional model centered on deliberative inquiry, hypothesis formulation, and analytical feedback rather than binary win/loss endpoints.

### 2.1 Core Learning Vectors
1. **Semantic Proximity & Vector Proximity**:
   - Learners explore words based on their contextual and conceptual distance to a target meaning rather than surface spelling.
   - Leverages high-dimensional semantic embeddings (e.g., Word2Vec, GloVe, or transformer-derived token embeddings) to guide the player through semantic neighborhoods.
2. **Morphological Exploration**:
   - Explicit awareness of roots, prefixes, suffixes, etymological shifts, and compound forms.
   - Puzzles incentivize recognizing morphological affinities and structural transformations across lexical families.
3. **Syntactic & Contextual Reasoning**:
   - Cloze-style contextual inference, structural constraints, and grammatical valency rather than arbitrary letter arrangements.
4. **Active Recall over Passive Recognition**:
   - The user must generate candidate words from memory guided by distance metrics, definitions, or structural constraints, building stronger neural pathways than multiple-choice recognition.

### 2.2 Pedagogical Constraints & Non-Negotiables
- **Immediate Analytical Feedback**: Under no circumstances should an evaluation screen reduce user effort to an uninformative "Wrong! Try again." Every submission must return qualitative and quantitative diagnostic telemetry:
  - Vector proximity / rank percentile (e.g., "Top 100 closest words in semantic space").
  - Part-of-speech (POS) and morphological alignment indicators.
  - Contextual valence or domain affinity.
- **Progressive Scaffolding**: Difficulty scales through narrowing feedback windows, multi-step lexical constraints, and decreasing hint generosity.
- **English Lexicon Scope**: Initial implementations target the modern English lexicon (standardized against curated word lists such as CEFR B1–C2 tiers and Google Web Trillion Word/COCA frequency bands), explicitly excluding obscure archaic noise while preserving rich academic and literary vocabularies.

---

## 3. System Architecture & Topology

Adhyayana adopts a clean client-server architecture with separation between high-performance algorithmic calculation and persistent session management.

```
+-------------------------------------------------------------------------+
|                              Client Layer                               |
|                  Vite + React 18 + TypeScript + Tailwind                |
|                                                                         |
|  +---------------------+   +---------------------+   +---------------+  |
|  | Engine: Contexto    |   | Engine: Crossword   |   | Engine: Blank |  |
|  +---------------------+   +---------------------+   +---------------+  |
|           |                           |                      |          |
|  +-------------------------------------------------------------------+  |
|  |                         Engine Runner Host                        |  |
|  +-------------------------------------------------------------------+  |
|           |                                                  |          |
+-----------|--------------------------------------------------|----------+
            | HTTP / REST (API Contracts)                      | Firebase Client SDK
            v                                                  v
+------------------------------------+             +----------------------+
|          Backend Layer             |             | Persistence & Auth   |
|       FastAPI + Pydantic v2        |             | Cloud Firestore      |
|                                    |             | & Firebase Auth      |
|  +-------------------------------+ |             |                      |
|  | Auth Middleware (Firebase JWT)| |             | - users              |
|  +-------------------------------+ |             | - daily_puzzles      |
|  | Pluggable Engine Handlers     | |             | - sessions           |
|  | (Vector Similarity / Scoring) | |             | - game_history       |
|  +-------------------------------+ |             +----------------------+
|  | Embedding Cache & Lexicon     | |
|  +-------------------------------+ |
+------------------------------------+
```

### 3.1 Frontend (`frontend/`)
- **Tooling & Compilation**:
  - Built with **Vite 5**, **React 18**, **TypeScript** strict mode (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, zero `any` allowance), and **Tailwind CSS**.
  - Path alias `@/*` is strictly synchronized pointing to `src/*` across both [`frontend/vite.config.ts`](frontend/vite.config.ts) and [`frontend/tsconfig.json`](frontend/tsconfig.json).
- **Design Tokens & Typography**:
  - Implements [`docs/architecture/design-system.md`](docs/architecture/design-system.md) with warm editorial paper canvas in light mode (`#FAF8F5`) and deep matte ink in dark mode (`#161618`, softer than harsh pure black).
  - Surfaces and cards utilize `#FFFFFF` (light) and `#202024` (dark) with `#2E2E34` borders, `#E4E4E7` soft paper white primary text, and `#9CA3AF` muted typography.
  - Softened pedagogical accents: emerald (`#22C55E` solved/complete), amber (`#F59E0B` streak/warning), and indigo (`#818CF8` interactive).
  - Display & branding typography rendered in `Newsreader` (serif editorial display).
  - Interface elements, cards, inputs, and letter tiles rendered in `Inter` / `Plus Jakarta Sans`.
  - Elevation & surface distinction: High-contrast solid floating dropdowns ([`AvatarDropdown.tsx`](frontend/src/components/layout/AvatarDropdown.tsx)) for crisp legibility without bleed, paired with rich glassmorphic slide-over drawers ([`HamburgerDrawer.tsx`](frontend/src/components/layout/HamburgerDrawer.tsx)) utilizing `backdrop-blur-md bg-[#FAF8F5]/85 dark:bg-[#161618]/85` over `bg-black/40 backdrop-blur-sm` backdrops.
- **Reactive Context Infrastructure**:
  - `ThemeContext` ([`frontend/src/context/ThemeContext.tsx`](frontend/src/context/ThemeContext.tsx)): Triple-state theme (`system`, `light`, `dark`) backed by `window.matchMedia` listeners and `localStorage` persistence, reactively applying the `.dark` class to `document.documentElement`.
  - `NavigationContext` ([`frontend/src/context/NavigationContext.tsx`](frontend/src/context/NavigationContext.tsx)): Reactively derives `isFocusMode` from URL route patterns (`/puzzles/:id` triggers Focus Mode; standard routes activate Platform Shell), managing drawer visibility, rules modal state, and active puzzle title synchronization.
- **Dual-Shell Navigation Layout & Routes**:
  - **Fluid Full-Bleed Shell Topology**:
    - Outer header (`Navbar.tsx`) and footer (`Footer.tsx`) backgrounds stretch edge-to-edge (`w-full`) across all resolutions.
    - Inner wrappers adopt fluid scaling: `w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10` with zero horizontal scrollbar bleed (`w-full overflow-x-hidden` on `Layout.tsx`).
    - Sticky footer guarantee: `Layout.tsx` enforces `min-h-screen flex flex-col` with `<main className="flex-1 flex flex-col w-full">` and `Footer.tsx` with `mt-auto`.
  - **Platform Shell** (Standard pages: `/`, `/puzzles`, `/leaderboard`, `/community`, `/about`, `/terms`, `/privacy`):
    - Top navigation bar with editorial brand logo ("Adhyayana"), Sanskrit badge (अध्ययन), centered navigational links with active/hover underlines (`Home`, `Puzzles`, `Leaderboard`, `Community`, `About`), streak flame counter, and solid crisp avatar dropdown with guest prompt and theme switcher.
    - Landing page ([`frontend/src/pages/HomePage.tsx`](frontend/src/pages/HomePage.tsx)) featuring fluid hero typography and proportional 3-card challenge grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full`).
    - Puzzle catalog ([`frontend/src/pages/PuzzlesPage.tsx`](frontend/src/pages/PuzzlesPage.tsx)) with full responsive parity: 3-selector grid on mobile viewports (< `md`), sticky desktop sidebar (`lg:w-72`), and fluid 3-column widescreen grid (`2xl:grid-cols-3`).
    - Bespoke editorial legal pages ([`frontend/src/pages/TermsPage.tsx`](frontend/src/pages/TermsPage.tsx) and [`frontend/src/pages/PrivacyPage.tsx`](frontend/src/pages/PrivacyPage.tsx)) with custom SVG hero illustrations and structured terms/privacy sections.
    - Pinned global footer ([`frontend/src/components/layout/Footer.tsx`](frontend/src/components/layout/Footer.tsx)) with mission overview, legal links, and system telemetry.
  - **Puzzle Focus Mode Shell** (Active puzzle pages: `/puzzles/:id`):
    - Minimalist header maximizing cognitive focus, featuring left hamburger drawer trigger, centered active puzzle title, right Help (`?`) rules button, and avatar dropdown.
    - Automatic suppression of the platform footer to eliminate distraction during gameplay.
    - Focused cognitive board canvas (`max-w-2xl lg:max-w-3xl space-y-6 mx-auto`) preserving gameplay focus while top navigation stretches full-width.
    - Glassmorphic slide-over drawer ([`frontend/src/components/layout/HamburgerDrawer.tsx`](frontend/src/components/layout/HamburgerDrawer.tsx)) featuring decoupled Puzzles row (direct catalog link vs isolated rotating chevron accordion trigger, collapsed by default with redundant links removed), 44px touch targets, and automatic session preservation.
    - Pedagogical Rules Modal ([`frontend/src/components/layout/RulesModal.tsx`](frontend/src/components/layout/RulesModal.tsx)) with objective breakdown, color telemetry guides, and keyboard-accessible dismiss actions.
- **Verification & Test Rig**:
  - Unit and integration test harness configured with **Vitest**, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` ([`frontend/src/tests/`](frontend/src/tests/)) verifying navigation, modals, theme toggling, mobile catalog filters, legal routes, and drawer accordion decoupling (20/20 tests passing across 6 test suites).
  - TypeScript type parity registry maintained in [`frontend/src/types/backend.ts`](frontend/src/types/backend.ts) and [`frontend/src/types/catalog.ts`](frontend/src/types/catalog.ts) (mirrored directly from `docs/specs/api-contracts.json` and `backend/app/schemas/`).
- Pure client-side UI rendering with modular engine hosts, prepared for dynamic catalog API consumption and Firebase persistence client SDK integration.

### 3.2 Backend (`backend/`)
- Built with **Python 3.11+**, **FastAPI**, and **Pydantic v2**.
- **Runtime Entrypoint**: `backend/app/main.py` initializes the ASGI application with configured CORS middleware, root health probe (`GET /health`), and mounts versioned API routers at `/api/v1`.
- **Configuration & Validation**: `backend/app/core/config.py` provides centralized environment configuration using Pydantic Settings v2 (`BaseSettings`), handling environment variables, CORS origin parsing, and release versioning.
- **Puzzle Catalog & Discovery Engine (Phase 2)**:
  - Contract registry schemas locked in `docs/specs/api-contracts.json`: `DifficultyLevel`, `GameType`, `LearningObjective`, `PuzzleLevelInfo`, `PuzzleMetadata`, and `PuzzleCatalogResponse`.
  - Pydantic v2 schemas declared in `backend/app/schemas/puzzles.py` with `ConfigDict(populate_by_name=True, extra="forbid")`.
  - In-memory `CatalogService` provider in `backend/app/services/catalog.py` managing curated seed challenges with progressive level ladders and scaled XP reward brackets:
    - **Word Blanks**: Beginner `fill-in-blanks`, 5 progressive levels scaling from 50 to 250 base XP (`max_xp: 750`).
    - **Contexto Vectors**: Intermediate `semantic-similarity`, 3 levels scaling from 100 to 300 base XP (`max_xp: 600`).
    - **Syntactic Crossword**: Advanced `crossword`, 4 levels scaling from 150 to 450 base XP (`max_xp: 1200`).
  - Route handlers in `backend/app/api/v1/endpoints/puzzles.py`:
    - `GET /api/v1/puzzles`: Returns full `PuzzleCatalogResponse` with total count.
    - `GET /api/v1/puzzles/{puzzle_id}`: Returns detailed `PuzzleMetadata` by immutable ID or URL slug (with 404 handling).
  - Router mounted in `backend/app/api/v1/router.py` under prefix `/puzzles` with tag `Puzzles`.
  - Backend test harness in `backend/tests/test_catalog.py` verifying catalog responses, XP brackets, slug lookups, and error envelopes (8/8 tests passing).
- **Dedicated Responsibilities**:
  - Vector similarity evaluation (cosine distance, embedding matrix lookups).
  - Lexical validation and morphological analysis.
  - Anti-cheat puzzle resolution verification.
- Verifies Firebase Auth JWT bearer tokens on all authenticated endpoints.

### 3.3 Persistence & Authentication (Firebase)
- **Firebase Auth**: Provides identity, OAuth (Google/Email), anonymous guest sessions, and JWT tokens.
- **Cloud Firestore**: Acts as the system-of-record for user profiles, game history, daily puzzle catalog, and active session snapshots.

---

## 4. Extensible Pluggable Puzzle Engine Architecture

Puzzles are designed as isolated, pluggable modules residing symmetrically across frontend and backend:

```text
frontend/src/engines/<puzzle-name>/
  ├── index.tsx          # Exported Engine React Component
  ├── state.ts           # State machine & local reducers
  └── types.ts           # Engine-specific UI contracts

backend/app/engines/<puzzle-name>/
  ├── __init__.py        # Engine entrypoint & handler exports
  ├── evaluator.py       # Algorithmic evaluation & scoring formulas (subclasses AbstractPuzzleEngine)
  └── schemas.py         # Request/Response DTOs matching api-contracts.json
```

> **Phase 1 Isolation Boundary**: While Phase 1 established the master layout, dual-shell navigation, and the dynamic [`PuzzleViewPage.tsx`](frontend/src/pages/PuzzleViewPage.tsx) container slot with focus shell lifecycle triggers, individual puzzle engines remain cleanly uncoupled. Concrete puzzle engines will be developed and integrated incrementally starting with Phase 2 (Word Blanks) pursuant to [`docs/workflows/roadmap.md`](docs/workflows/roadmap.md).

### 4.1 Base Engine Contracts (`backend/app/engines/base.py`)
All backend puzzle engines inherit from the standardized abstract base contracts:
- `AbstractPuzzleEngine(ABC)`: Declares mandatory asynchronous methods `@abstractmethod async def initialize(self, **kwargs) -> BasePuzzleInit` and `@abstractmethod async def evaluate(self, payload: BaseGuessRequest) -> BaseGuessResponse`.
- `BasePuzzleInit`: Standard initialization payload (`puzzle_id`, `puzzle_type`, `difficulty`, `metadata`).
- `BaseGuessRequest`: Standard guess submission payload (`puzzle_id`, `session_id`).
- `BaseGuessResponse`: Standard evaluation envelope (`puzzle_id`, `status`, `feedback`, `is_correct`).

### 4.2 Modularity Rules
1. **Isolated State Machine**: Puzzles manage their own internal interaction loop and expose a uniform lifecycle (`IDLE` -> `PLAYING` -> `EVALUATING` -> `WON` | `FAILED`).
2. **Zero Global Bleed**: No puzzle engine may import or mutate another engine's state or register engine-specific routes directly in global layouts.
3. **Contract Symmetry**: Every backend payload schema must have an identical TypeScript interface in the frontend engine.

---

## 5. Collaboration Guardrails & Operational Directives

To maintain pristine velocity and code health between two collaborating engineers:

1. **Contract-First Paradigm**:
   - No API endpoint or route is implemented without first committing its JSON Schema definition to [`docs/specs/api-contracts.json`](docs/specs/api-contracts.json).
2. **Zero Type Drift**:
   - Backend Pydantic v2 schemas in `backend/app/schemas/` and frontend interfaces in `frontend/src/types/` must maintain 100% field, nullability, and type parity.
3. **Atomic Feature Branches**:
   - All contributions must flow through short-lived branches (`feat/*`, `fix/*`, `docs/*`, `chore/*`) with passing pre-commit checks and PR reviews.
4. **Living State Tracker Discipline**:
   - Any work initiated, completed, or blocked must be reflected in [`docs/tracker/state.md`](docs/tracker/state.md).
5. **Dependency Governance**:
   - Any additions to `package.json` or `requirements.txt` require explicit documentation in [`docs/tracker/changelog.md`](docs/tracker/changelog.md) detailing security, bundle size, and pedagogical necessity.
6. **Continuous Context Synchronization**:
   - Every single commit must update [`context.md`](context.md) to maintain living fidelity with the system's evolving architectural, pedagogical, and engine states. [`README.md`](README.md) must be reviewed and updated whenever user-facing setup, scripts, or directory structures evolve.
7. **Master Engineering Roadmap Fidelity**:
   - All feature additions, vertical slices, and architectural milestones must adhere strictly to the 7-phase phased execution blueprint codified in [`docs/workflows/roadmap.md`](docs/workflows/roadmap.md).

