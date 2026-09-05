# Adhyayana Master Engineering Roadmap

> **Status**: Living Master Specification & Execution Blueprint  
> **Target Scope**: End-to-end Monorepo Construction (`frontend/`, `backend/`, `docs/`)  
> **Version**: 1.0.0  

---

## Architectural Principles

1. **Iterative Vertical Slices**: Every phase must result in a functional, independently testable milestone without stubbing broken dependencies into future phases.
2. **Contract-First & Type Parity**: Every client-server interaction must have its JSON schema defined in [`docs/specs/api-contracts.json`](../specs/api-contracts.json) and mirrored in TypeScript/Pydantic models before UI or route implementation.
3. **Strict State & Scope Boundaries**: Puzzle logic remains isolated in `frontend/src/engines/<puzzle>/` and `backend/app/engines/<puzzle>/`. Global state must only hold session-level data (theme, user identity, global routing mode).
4. **Pedagogy First**: Puzzles must prioritize active recall, analytical feedback, and linguistic insight over shallow gamification.

---

## Phase 1: Shell, Dual-Navigation Architecture & Design Foundation
**Status**: [IN PROGRESS]  
**Objective**: Build the visual identity, theme engine, and dual-shell layout (Platform Shell vs. Focus Mode) with route placeholders, without any puzzle gameplay logic.

### Deliverables
- **Frontend**:
  - Vite + React 18/19 + TypeScript strict mode with Tailwind CSS.
  - Typography configuration: `Newsreader` (display serif) and `Inter` / `Plus Jakarta Sans` (interface sans).
  - Canvas tokens: Warm paper (`#FAF8F5`) and deep charcoal (`#121213`) with subtle borders and shadows.
  - Global `ThemeContext` supporting `system`, `light`, and `dark` modes with `localStorage` persistence.
  - Global `NavigationContext` managing shell state (`PLATFORM` vs. `PUZZLE_FOCUS`), drawer open/close, and modal triggers.
  - **Platform Shell**:
    - Navbar: Left brand logo, center navigation links with hover underlines (`Home`, `Puzzles`, `Leaderboard`, `Community`, `About`), right flame streak indicator and circular avatar.
    - Avatar Dropdown: Floating card with Guest view (Sign In / Register CTA, Theme toggle) and Authenticated view (Profile, Dashboard, Settings, Theme toggle, Logout).
    - Footer: Pinned to bottom of content, containing categorized links, privacy policy, and social links.
  - **Puzzle Focus Mode Shell**:
    - Minimalist Navbar: Left hamburger button, center dynamic puzzle title (`font-serif`), right Help (`?`) button and circular avatar.
    - Glassmorphic slide-over drawer: Platform navigation links, expandable puzzles tree with nested sub-routes, and essential footer links.
    - Rules Modal: Overlay dialog dismissible via top-right 'X' or backdrop click.
    - Global footer hidden.
  - Route skeletons using `react-router-dom`: `/`, `/puzzles`, `/leaderboard`, `/community`, `/about`, `/puzzles/:puzzleId`.
- **Backend**:
  - Verification of CORS configurations against `http://localhost:5173`.
  - Ensure `/health` endpoint serves client status pings cleanly.
- **Exit Criteria**:
  - Toggling between standard routes and `/puzzles/:id` seamlessly alternates the header layout and footer visibility.
  - Glassmorphic drawer and avatar dropdown open/close with keyboard and click-outside listeners.
  - Dark/Light/System theme toggles without CSS flash or styling layout shifts.
  - Zero TypeScript compile errors (`tsc --noEmit`).

---

## Phase 2: Puzzles Catalog, Discovery & Filter Engine
**Status**: [PLANNED]  
**Objective**: Enable discovery of language puzzles through a rich, searchable, and responsive catalog with metadata filtering.

### Deliverables
- **API Contract & Backend**:
  - Define `PuzzleMetadata` schema in [`docs/specs/api-contracts.json`](../specs/api-contracts.json): `id`, `slug`, `title`, `short_description`, `difficulty` (`beginner`, `intermediate`, `advanced`), `game_type` (`fill-in-blanks`, `semantic-similarity`, `crossword`), `learning_objectives` (list of tags like `vocabulary`, `syntax`, `etymology`), `is_new: bool`, `thumbnail_icon: str`.
  - Backend route: `GET /api/v1/puzzles` serving static or in-memory catalog data.
- **Frontend**:
  - `/puzzles` catalog layout:
    - Sticky desktop filter sidebar with multi-select checkboxes for Difficulty, Game Type, and Learning Objective.
    - Mobile-responsive filter dropdowns positioned below the global search bar.
    - Live search input filtering puzzle titles and descriptions.
    - Responsive card grid: Cards show thumbnail icon, "New" badge, title (`Newsreader`), one-line pitch, and difficulty tag.
    - Clicking a card navigates directly to `/puzzles/:slug`.
- **Exit Criteria**:
  - Multi-condition filtering works synchronously with instant visual feedback.
  - Mobile screens collapse the sidebar into neat inline dropdowns below the search bar without layout breakage.

---

## Phase 3: Modular Puzzle Engine #1 — Word Blanks (Vertical Slice)
**Status**: [PLANNED]  
**Objective**: Build the first complete, playable puzzle loop from end to end using the Word Blanks (Fill-in-the-Blanks) mechanic.

### Deliverables
- **Backend Engine (`backend/app/engines/word_blanks/`)**:
  - Subclasses `AbstractPuzzleEngine` from `backend/app/engines/base.py`.
  - Endpoint `GET /api/v1/puzzles/word-blanks/new`: Returns daily/seeded puzzle data with masked target word, hint/clue, and blank indices. The full word is never sent over the wire.
  - Endpoint `POST /api/v1/puzzles/word-blanks/evaluate`: Validates submitted letters against target indices, calculates remaining attempts, and returns structured feedback (win, fail, or try again).
- **Frontend Engine (`frontend/src/engines/word_blanks/`)**:
  - Focus Mode integration with custom puzzle board container (`max-w-2xl`).
  - First-time Rules Modal display for guests, with re-open support via header `?` icon.
  - Interactive letter tile input boxes with auto-focus advancing on keyboard entry.
  - Attempt counter, feedback toast/alert, and victory/defeat summary card showing pedagogical word definition and usage notes.
- **Exit Criteria**:
  - A user can load Word Blanks, enter guesses, receive validation feedback, and finish a round.
  - Guest sessions track current game state in `localStorage` so a page refresh does not erase an in-progress round.

---

## Phase 4: Authentication, Player Profiles & Cloud Persistence
**Status**: [PLANNED]  
**Objective**: Integrate Firebase Auth and Cloud Firestore to transition from guest play to persistent user profiles and cross-device sync.

### Deliverables
- **Firebase Infrastructure**:
  - Firebase Client SDK setup in `frontend/src/services/firebase.ts`.
  - Firebase Admin SDK setup in `backend/app/core/firebase.py`.
  - FastAPI dependency to verify Firebase ID tokens (`Bearer <token>`) and inject `UserClaims`.
- **Frontend**:
  - Sign In / Register modal with Google OAuth and Email/Password flows.
  - Avatar dropdown dynamically swaps between Guest CTA and logged-in user summary.
  - `/profile` page: View/edit username, avatar icon, bio, and account visibility.
  - Guest-to-User State Migration: If a guest signs up after completing a puzzle, migrate their current local streak and session data into Firestore.
- **Database (`Firestore`)**:
  - Collections: `users/{uid}`, `user_stats/{uid}` (streaks, puzzles completed, historical records).
- **Exit Criteria**:
  - Users can authenticate, refresh the page, and remain securely logged in.
  - Rules modal remembers that authenticated users have already seen the instructions and does not auto-open on repeat visits.

---

## Phase 5: Modular Puzzle Engine #2 — Contexto (Semantic Proximity)
**Status**: [PLANNED]  
**Objective**: Implement an NLP-driven semantic distance word puzzle where players guess a secret word guided by relative proximity rankings.

### Deliverables
- **Backend Engine (`backend/app/engines/contexto/`)**:
  - Subclasses `AbstractPuzzleEngine`.
  - Pre-computed word embedding dataset / vector distance calculation service using cosine similarity.
  - `POST /api/v1/puzzles/contexto/guess`: Takes word guess, evaluates distance against target word, and returns absolute numerical rank (e.g., Rank 1 = target, Rank 15 = extremely close, Rank 50,000 = distant).
- **Frontend Engine (`frontend/src/engines/contexto/`)**:
  - Guess submission bar with instant input validation (real English words only).
  - Telemetry distance bar: Dynamically color-coded (Green for top 300, Amber for top 3,000, Red for distant).
  - Chronological / rank-sorted history table of previous guesses with progress bars.
  - Game victory modal displaying guess count and semantic distribution chart.
- **Exit Criteria**:
  - Contexto engine responds to guesses within 200ms.
  - Visual ranking bar clearly communicates proximity feedback.

---

## Phase 6: XP Engine, Dashboard Analytics & Leaderboards
**Status**: [PLANNED]  
**Objective**: Build player progression systems, analytics dashboards, and competitive time-scoped leaderboards.

### Deliverables
- **Backend Services**:
  - XP algorithm calculating points based on puzzle difficulty, hints used, and attempt counts.
  - Endpoints: `GET /api/v1/leaderboard` (filtered by timeframes: `weekly`, `monthly`, `all_time`, and puzzle category).
  - Endpoint: `GET /api/v1/users/me/dashboard` (aggregated analytics and skill metrics).
- **Frontend**:
  - `/leaderboard`: Multi-tab views, search bar to locate specific players, and a sticky bottom bar pinning the current user's rank.
  - `/dashboard`:
    - Language Skills Radar Chart (Vocabulary, Semantic Deduction, Spelling, Speed).
    - Performance graphs (XP progression curve, Win/Loss ratios).
    - Unlocked badges and achievement shelf.
- **Exit Criteria**:
  - Completing any puzzle automatically credits XP to user profile in Firestore.
  - Leaderboard filters recalculate and sort ranks correctly.

---

## Phase 7: Real-Time Multiplayer Duels & Community
**Status**: [PLANNED]  
**Objective**: Introduce synchronous real-time puzzle battles (2 to 4 players) and social community interaction.

### Deliverables
- **Backend / Real-Time**:
  - WebSocket hub (`/ws/battles/{room_id}`) or Firestore Realtime snapshot listeners to sync battle state.
  - Matchmaking and private room invite code generator.
- **Frontend (`/community`)**:
  - Lobby system: Create Room, Join Room with Code, Quick Match.
  - Match screen: Split view showing personal puzzle board alongside live minimal progress bars of opponents.
  - Post-match breakdown with head-to-head performance graphs.
- **Exit Criteria**:
  - Up to 4 players can join a room and play the same daily/seeded puzzle synchronously with under 100ms state update latency.
