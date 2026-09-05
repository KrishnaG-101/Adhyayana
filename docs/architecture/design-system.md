# Adhyayana Design System & Visual Specification

> **Status**: Authoritative UI/UX Design System  
> **Applies to**: `frontend/` components, layouts, and pluggable puzzle engines  
> **Version**: 1.0.0  

---

## 1. Executive Design Philosophy

**Adhyayana (अध्ययन)** is an intellectually rigorous language acquisition platform. Its visual design reflects **cognitive clarity, academic elegance, and engaging gamification** without childish gimmickry.

Key design pillars:
- **Clarity Over Clutter**: Interfaces minimize cognitive load, directing focus entirely toward linguistic reflection, vector semantic distance, and active recall.
- **Multidimensional Feedback**: Visual states communicate degrees of semantic or morphological closeness (e.g. cold-to-hot proximity gradients, amber near-miss indicators, emerald resolution states).
- **Responsive Ergonomics**: Every game mode functions smoothly across mobile touchscreens (44px+ hit targets) and full desktop keyboard workflows.

---

## 2. Typography

Adhyayana uses a curated typographic hierarchy optimized for reading comprehension, letter legibility, and definition parsing:

| Role | Font Family | Weights | Rationale |
| :--- | :--- | :--- | :--- |
| **Display & Headings** | `Lexend`, `Outfit`, sans-serif | 600, 700, 800 | Designed specifically to reduce visual stress and improve reading speed and fluency. |
| **Interface & Body** | `Inter`, `Plus Jakarta Sans`, sans-serif | 400, 500, 600 | Renowned for exceptional x-height, neutral letterforms, and crisp rendering at small sizes. |
| **Letter Tiles & Grids**| `Plus Jakarta Sans`, `Inter`, sans-serif | 700 | Symmetrical, centered glyph geometry ideal for isolated letter tiles and anagram slots. |

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['Lexend', 'Outfit', 'sans-serif'],
        body: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        tile: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
};
```

---

## 3. Color Tokens & Semantic Palette

The palette balances an authoritative Indigo/Slate foundation with high-visibility feedback signals.

### 3.1 Color Palette Table

| Role | Hex | Tailwind Token | Light Mode Usage | Dark Mode Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `#4F46E5` | `indigo-600` | Primary brand, CTA buttons, active accents | Focus rings, highlighted links |
| **Primary Hover** | `#4338CA` | `indigo-700` | Button hover state | Brighter contrast accents |
| **Secondary** | `#818CF8` | `indigo-400` | Secondary badges, progress markers | Secondary borders, active tags |
| **Success / Solved** | `#16A34A` | `emerald-600` | Correct guess, solved puzzle banner | Solved tile background, victory glow |
| **Warning / Near** | `#D97706` | `amber-600` | Semantic near-miss (top 100), partial match | Near-guess telemetry badge |
| **Destructive / Cold**| `#DC2626` | `red-600` | Distant guess rank, invalid word error | Error alerts, reset warnings |
| **Canvas Background** | `#F8FAFC` / `#0F172A` | `slate-50` / `slate-900` | App-wide background | App-wide background |
| **Surface / Card** | `#FFFFFF` / `#1E293B` | `white` / `slate-800` | Tile cards, clue surfaces, modals | Tile cards, clue surfaces, modals |
| **Muted Surface** | `#F1F5F9` / `#334155` | `slate-100` / `slate-700` | Inactive tile slots, table headers | Inactive tile slots, table headers |
| **Border / Divider** | `#E2E8F0` / `#334155` | `slate-200` / `slate-700` | Tile borders, card dividers | Tile borders, card dividers |
| **Text Primary** | `#0F172A` / `#F8FAFC` | `slate-900` / `slate-50` | Main headings, word letters (4.5:1+) | Main headings, word letters |
| **Text Secondary** | `#475569` / `#94A3B8` | `slate-600` / `slate-400` | Clue text, metadata, descriptions | Clue text, metadata, descriptions |

---

## 4. Spacing Scale & Layout Grid

Adhyayana strictly adheres to a **4px base spacing scale**:

| Token | Pixels | Tailwind | Intended Usage |
| :--- | :--- | :--- | :--- |
| `--space-1` | `4px` | `p-1`, `gap-1` | Micro-spacers, icon badges, inline tags |
| `--space-2` | `8px` | `p-2`, `gap-2` | Compact gaps, letter tile grid spacing |
| `--space-3` | `12px` | `p-3`, `gap-3` | Standard tile spacing, compact card padding |
| `--space-4` | `16px` | `p-4`, `gap-4` | Input padding, mobile container margins |
| `--space-6` | `24px` | `p-6`, `gap-6` | Card padding, section gaps |
| `--space-8` | `32px` | `p-8`, `gap-8` | Modal padding, desktop page gutters |
| `--space-12`| `48px` | `p-12`, `gap-12`| Major structural boundaries |
| `--space-16`| `64px` | `p-16`, `gap-16`| Hero sections, victory celebration modals |

---

## 5. Component Specifications & Blueprints

### 5.1 Game Board Container
- **Layout**: Centered flex/grid container, constrained to `max-w-2xl` on desktop to maintain optical scanning density.
- **Elevation**: Subtle soft double shadow: `shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800`.
- **Background**: `bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6`.

### 5.2 Letter Tile Slots
- **Dimensions**: Aspect-square `w-12 h-12 sm:w-14 sm:h-14`.
- **Typography**: `font-tile text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100`.
- **Interaction States**:
  - *Empty / Idle*: `border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50`.
  - *Active / Focused*: `border-2 border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20`.
  - *Evaluated (Solved / Exact)*: `border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300`.
  - *Evaluated (Near / High Semantic Rank)*: `border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300`.
  - *Evaluated (Distant / Low Proximity)*: `border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500`.

### 5.3 Clue & Analytical Telemetry Cards
- **Structure**: Rounded `rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800`.
- **Telemetry Indicators**:
  - Progress bar showing relative vector distance: `h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden`.
  - Filled track colored according to tier: Emerald (`#16A34A`), Amber (`#D97706`), or Indigo (`#4F46E5`).

### 5.4 Guess Input Bar
- **Placement**: Responsive layout — sticky or anchored at bottom on mobile viewports for thumb reachability (`h-14`).
- **Input Field**:
  - `bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-slate-100 font-medium`.
  - `focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`.
- **Submit Button**:
  - `bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`.
  - Accompanied by `<Send size={18} />` from `lucide-react`.

---

## 6. Iconography & Interaction Rules

1. **Lucide-React SVGs**: All operational icons (hints, settings, share, audio, info, search) must use `lucide-react`. Emojis must never serve as functional UI icon buttons.
2. **Keyboard Ergonomics**:
   - `Enter` submits current guess.
   - `Backspace` deletes preceding letter.
   - `Escape` dismisses modals or overlays.
3. **Motion Reduction (`prefers-reduced-motion`)**:
   - Tile flip and victory shake animations must gracefully downgrade to instant color/opacity transitions when motion reduction is enabled.
