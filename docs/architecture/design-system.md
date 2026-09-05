# Adhyayana Design System & Visual Specification

> **Status**: Authoritative UI/UX Design System  
> **Applies to**: `frontend/` components, dual-shell navigation layouts, catalog, and pluggable puzzle engines  
> **Version**: 1.1.0 (Phase 1 Refinement)  

---

## 1. Executive Design Philosophy

**Adhyayana (अध्ययन)** is an intellectually rigorous, gamified language acquisition platform. Its visual identity balances **editorial elegance, tactile paper warmth, and modern glassmorphism**:

- **Editorial Warmth & Restraint**: Evokes the feeling of reading a fine literary journal or solving an artisanal print puzzle. Replaces sterile neon tech aesthetics with warm organic canvas tones and dignified serif typography.
- **Cognitive Clarity Over Clutter**: Interfaces prioritize active recall, analytical feedback, and semantic contemplation. Decorative noise is eliminated in favor of clean spacing and structural typography.
- **Multidimensional Proximity Telemetry**: Visual states communicate gradations of semantic or morphological closeness (e.g., emerald completion, amber streak/near-miss feedback, neutral slate baselines).
- **Ergonomic Dual-Shell Navigation**: Distinct shell modes dynamically optimize screen real estate—offering a comprehensive platform hub for browsing and a distraction-free focus mode for puzzle solving.

---

## 2. Aesthetic & Canvas Tokens

Adhyayana utilizes a curated palette designed around warm paper in light mode and deep charcoal ink in dark mode:

### 2.1 Core Canvas & Surface Tokens

| Token Role | Light Mode Value | Dark Mode Value | Tailwind Class Equivalent | Purpose / Application |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FAF8F5` | `#121213` | `bg-[#FAF8F5] dark:bg-[#121213]` | Warm editorial paper / deep ink backdrop |
| **Surface / Card** | `#FFFFFF` | `#1C1917` | `bg-white dark:bg-stone-900` | Tile cards, clue surfaces, dialogs, drawers |
| **Muted Surface** | `#F5F2EB` | `#262626` | `bg-[#F5F2EB] dark:bg-stone-800` | Inactive tile slots, table headers, hover chips |
| **Border / Divider** | `#E7E3DA` | `#2E2E2E` | `border-[#E7E3DA] dark:border-stone-800` | Tile borders, card dividers, subtle outlines |
| **Text Primary** | `#1C1917` | `#EDEDED` | `text-stone-900 dark:text-stone-100` | Main headings, word letters, primary labels (4.5:1+) |
| **Text Secondary** | `#57534E` | `#A8A29E` | `text-stone-600 dark:text-stone-400` | Clue text, metadata, descriptions, subheaders |
| **Text Muted** | `#78716C` | `#737373` | `text-stone-500 dark:text-stone-500` | Footnotes, keyboard shortcuts, timestamps |

### 2.2 Functional & Pedagogical Accent Tokens

| Accent Role | Light Hex | Dark Hex | Semantic Meaning | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Solved** | `#16A34A` | `#22C55E` | Exact solution match, round victory | Solved tile background, victory glow, completion badges |
| **Warning / Streak** | `#D97706` | `#F59E0B` | Near-miss rank, flame streak, active counter | Streak icon/counter, top-tier proximity progress |
| **Interactive Primary** | `#4F46E5` | `#818CF8` | Primary actions, focused inputs, active tabs | Submit buttons, focus rings, selected filters |
| **Destructive / Cold** | `#DC2626` | `#EF4444` | Invalid submission, distant vector rank | Error toast alerts, reset prompts, out-of-range guesses |

### 2.3 Glassmorphism System
Used for slide-over drawers, sticky focus headers, and floating dropdown cards:
```css
/* Glassmorphic Panel Utility */
backdrop-blur-md bg-white/70 dark:bg-stone-900/70 border border-stone-200/50 dark:border-stone-800/50 shadow-lg
```

---

## 3. Typography System

Adhyayana pairs a classic editorial serif for brand identity and headings with a clean, high-legibility sans-serif for interactive UI and letter tiles:

| Role | Font Family | Weights | Intended Application |
| :--- | :--- | :--- | :--- |
| **Display & Headings** | `Newsreader`, Georgia, serif | 500, 600, 700 | Brand logo ("Adhyayana"), dynamic puzzle titles, hero titles, modal headers |
| **Interface & Body** | `Inter`, `Plus Jakarta Sans`, sans-serif | 400, 500, 600 | Navigation links, catalog cards, clue descriptions, buttons |
| **Letter Tiles & Inputs** | `Plus Jakarta Sans`, `Inter`, sans-serif | 700, 800 | Isolated letter boxes, anagram grids, keyboard keys, telemetry ranks |

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FAF8F5',
          dark: '#121213',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        tile: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
};
```

---

## 4. Dual-Shell Navigation Topology

To balance catalog discovery with distraction-free gameplay, Adhyayana employs two distinct layout shells:

```
+-----------------------------------------------------------------------------------+
| 1. PLATFORM SHELL (Routes: /, /puzzles, /leaderboard, /community, /about)          |
+-----------------------------------------------------------------------------------+
| [Brand: Adhyayana]     [Home]  [Puzzles]  [Leaderboard]  [Community]  [About]   🔥 5 [Avatar] |
|-----------------------------------------------------------------------------------|
|                                                                                   |
|                               Page Content Canvas                                 |
|                                                                                   |
|-----------------------------------------------------------------------------------|
| [Pinned Global Footer: Categorized links, Privacy Policy, Social links, Copyright]|
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| 2. PUZZLE FOCUS MODE SHELL (Route: /puzzles/:puzzleId)                            |
+-----------------------------------------------------------------------------------+
| [☰ Drawer Toggle]               Word Blanks: Daily #42                 [?]  [Avatar] |
|-----------------------------------------------------------------------------------|
|                                                                                   |
|                           Focused Puzzle Game Board                               |
|                            (Max Width: 2xl Centered)                              |
|                                                                                   |
|-----------------------------------------------------------------------------------|
|                        [Global Footer Hidden in Focus Mode]                       |
+-----------------------------------------------------------------------------------+
```

### 4.1 Platform Shell Specification
- **Navbar Layout**:
  - **Left**: Brand Logo (`font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100`).
  - **Center**: Navigation items (`Home`, `Puzzles`, `Leaderboard`, `Community`, `About`) with smooth hover underlines (`relative hover:text-indigo-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 after:scale-x-0 hover:after:scale-x-100`).
  - **Right**:
    - **Streak Indicator**: Flame icon with amber counter badge (`#D97706`, `font-semibold text-sm`).
    - **Profile Avatar**: Circular avatar (`w-9 h-9 rounded-full border border-stone-200 dark:border-stone-700`).
- **Floating Avatar Dropdown**:
  - Positioned floating card triggered on click with click-outside listener.
  - **Guest View**: "Sign In / Register" prominent button + Theme Mode toggle (`System`, `Light`, `Dark`).
  - **Authenticated View**: User display name and email summary + links to `Profile`, `Dashboard`, `Settings`, Theme toggle, and `Sign Out`.
- **Pinned Footer**: Attached to bottom of scrollable page content. Features grouped navigation categories, legal/privacy notices, and educational attribution.

### 4.2 Puzzle Focus Mode Shell Specification
- **Navbar Layout**:
  - **Left**: Hamburger icon button (`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800`).
  - **Center**: Active puzzle title formatted in `font-serif text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100`.
  - **Right**: Help icon (`?`) button opening the Rules Modal + Profile Avatar dropdown.
- **Glassmorphic Slide-Over Drawer**:
  - Triggered by the hamburger button; slides in from screen left with a dimmed backdrop overlay (`bg-stone-950/40 backdrop-blur-sm`).
  - Contains platform navigation links (`Home`, `Leaderboard`, `Community`, `About`), an expandable "Puzzles" accordion with direct links to all puzzle engines, and key footer links.
  - Dismissible via swipe left, Escape key, or clicking the backdrop overlay.
- **Footer Treatment**: Global footer is completely suppressed to preserve vertical canvas height and prevent distraction.

---

## 5. Responsive Catalog & Filter Rules (`/puzzles`)

The puzzle discovery catalog organizes linguistic challenges with high clarity:

- **Top Bar**: Live search input with instant debounced filtering across titles, tags, and descriptions.
- **Desktop Filter Sidebar**:
  - Sticky sidebar (`top-24 w-64 shrink-0 space-y-6`).
  - Multi-select checkbox groups:
    - *Difficulty*: Beginner, Intermediate, Advanced.
    - *Game Type*: Word Blanks, Semantic Proximity (Contexto), Crosswords.
    - *Learning Objective*: Vocabulary, Syntax, Morphology, Etymology.
- **Mobile Filter Dropdowns**:
  - Collapses desktop sidebar into clean horizontal scrollable dropdown pills directly below the search input.
- **Puzzle Card Grid**:
  - Responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - Card anatomy:
    - Thumbnail icon (`lucide-react` SVG in soft rounded background).
    - "New" badge (emerald pill: `bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300`).
    - Title in `font-serif text-xl font-bold`.
    - 1-2 sentence pedagogical pitch.
    - Difficulty pill and category tags.
    - Whole card clickable, routing directly to `/puzzles/:slug`.

---

## 6. Rules Modal Contract

Every puzzle engine features an integrated pedagogical rules modal:

- **Trigger Behavior**:
  - Automatically pops up for guests on their first session visit.
  - Opens once per puzzle for authenticated players (persisted in user profile / `localStorage`).
  - Can be manually re-opened at any time by clicking the Help (`?`) button in the Focus Shell navbar.
- **Modal Anatomy**:
  - Centered dialog with backdrop blur (`backdrop-blur-sm bg-stone-950/50`).
  - Header: Puzzle Title in `font-serif` + dismiss button (`X` icon in top-right).
  - Body:
    - Educational objective (linguistic target skill).
    - Step-by-step game mechanics with illustrative tile examples.
    - Scoring / attempt constraints.
  - Footer: "Start Playing" primary CTA button (`bg-emerald-600 hover:bg-emerald-500 text-white`).
- **Dismissal**: Dismissible via top-right 'X', `Escape` key, or backdrop click.

---

## 7. Spacing Scale & Interactive Component Specs

### 7.1 Spacing Scale (4px Base Token Scale)
- `4px` (`gap-1`, `p-1`): Inline tags, micro badges.
- `8px` (`gap-2`, `p-2`): Tile grid spacing, icon-to-text gaps.
- `12px` (`gap-3`, `p-3`): Compact card padding, sub-navigation rows.
- `16px` (`gap-4`, `p-4`): Standard form field padding, mobile margins.
- `24px` (`gap-6`, `p-6`): Card containers, desktop component gaps.
- `32px` (`gap-8`, `p-8`): Section spacing, modal margins.
- `48px` (`gap-12`, `p-12`): Major content layout divisions.
- `64px` (`gap-16`, `p-16`): Hero gutters, page bottoms.

### 7.2 Letter Tile Slots
- **Dimensions**: Aspect-square `w-12 h-12 sm:w-14 sm:h-14`.
- **Typography**: `font-tile text-xl sm:text-2xl font-bold tracking-tight`.
- **State Styling**:
  - *Empty*: `border-2 border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#121213]`.
  - *Active / Focus*: `border-2 border-indigo-600 ring-2 ring-indigo-500/20`.
  - *Solved / Exact*: `border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300`.
  - *Near / Proximity*: `border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300`.

### 7.3 Guess Input Bar
- **Placement**: Fixed or sticky bottom on mobile for thumb accessibility; centered under board on desktop.
- **Input Field**: Rounded `rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3 text-base text-stone-900 dark:text-stone-100`.
- **Submit Button**: `bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50`.
