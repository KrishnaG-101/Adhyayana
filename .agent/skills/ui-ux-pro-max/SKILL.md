---
name: ui-ux-pro-max
description: >-
  UI/UX design intelligence, design tokens, styling rules, and accessibility standards for Adhyayana.
  Use whenever designing, styling, or auditing UI components, layouts, puzzle boards, or CSS/Tailwind tokens.
---

# UI/UX Pro Max Skill (`ui-ux-pro-max`)

This skill defines the authoritative visual hierarchy, accessibility guardrails, typography, token scales, and component guidelines for the **Adhyayana** platform. It integrates modern UI/UX best practices to create an engaging, premium, and cognitively accessible language learning experience.

For the full design specifications, color tokens, and component blueprints, consult [`docs/architecture/design-system.md`](docs/architecture/design-system.md).

---

## Trigger Conditions
Activate this skill when:
- Creating, styling, or refactoring UI components in `frontend/src/components/` or `frontend/src/engines/`.
- Defining or adjusting Tailwind CSS configuration, design tokens, or color themes.
- Designing game board containers, letter tile slots, clue cards, or input bars.
- Auditing user interfaces for accessibility (WCAG AA), responsive breakpoints, or contrast compliance.
- The user asks: "design component", "style puzzle board", "improve UI/UX", or "audit accessibility".

---

## Core Design Principles

### 1. Visual Hierarchy & Spacing System
- Enforce a strict **4px base token scale**:
  - `4px` (`p-1`, `gap-1`): Micro gaps, inline badge spacing.
  - `8px` (`p-2`, `gap-2`): Tight padding, icon-to-label gaps.
  - `12px` (`p-3`, `gap-3`): Medium component padding, compact tile gaps.
  - `16px` (`p-4`, `gap-4`): Standard container padding, form field padding.
  - `24px` (`p-6`, `gap-6`): Card padding, section gaps.
  - `32px` (`p-8`, `gap-8`): Large section margins.
  - `48px` (`p-12`): Modal and page block margins.
  - `64px` (`p-16`): Hero sections and major layout boundaries.
- **Touch Target Discipline**: All interactive elements (buttons, tile slots, icons) must have a minimum hit area of `44x44px` on mobile/touch viewports.

### 2. Contrast & WCAG AA Accessibility
- **Minimum Contrast Ratio**: Maintain at least `4.5:1` for normal text and `3:1` for large text/headings against background surfaces in both light and dark modes.
- **Visible Keyboard Focus**: Never suppress focus outlines. Enforce clear keyboard navigation with:
  ```css
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
  ```
- **Motion Reduction**: Respect user OS motion preferences. Always wrap dynamic animations with `motion-reduce` fallbacks:
  ```css
  transition-transform duration-200 motion-reduce:transition-none motion-reduce:transform-none
  ```
- **Semantic HTML**: Use proper button (`<button>`), input (`<input>`), and landmark tags (`<main>`, `<header>`, `<nav>`) with explicit `aria-label` where text is not visible.

### 3. Design Elements & Iconography
- **Zero Raw Emojis for UI Icons**: Never use raw system emojis (e.g., 🔍, ❌, ✅, 💡) as operational UI icons.
- **Lucide-React SVG Icons**: Always import clean, consistent SVG icons from `lucide-react` (e.g. `<Search size={18} />`, `<CheckCircle2 />`, `<AlertCircle />`).
- **Icon Sizing & Aria**: Decorative icons must have `aria-hidden="true"`. Actionable icon buttons must include an accessible `aria-label` or `<span className="sr-only">`.

### 4. Component Purity & State Isolation (AGENTS.md Rule 3)
- **Pure Presentation**: Components in `frontend/src/components/` must remain pure presentational building blocks driven by props.
- **Engine Encapsulation**: Puzzle-specific scoring formulas, vector rank telemetry, and state transitions belong strictly in `frontend/src/engines/<puzzle-name>/`.
- **Zero Global Bleed**: Never register engine-specific styling hacks into global CSS.

---

## Pre-Delivery UI Quality Checklist

Before finalizing any frontend interface or component:
- [ ] **No Emoji Icons**: All icons use `lucide-react` SVG components.
- [ ] **Touch Target Size**: Minimum `44×44px` interactive area for clickable elements.
- [ ] **Contrast Ratio**: Text passes WCAG AA `4.5:1` minimum in both light and dark modes.
- [ ] **Focus Rings**: Interactive elements exhibit visible `focus-visible:ring-2` on keyboard tab.
- [ ] **Motion Safety**: `prefers-reduced-motion` fallbacks applied to transitions/animations.
- [ ] **Responsive Breakpoints**: Layout verified at `375px` (mobile), `768px` (tablet), `1024px` (desktop), `1440px` (wide).
- [ ] **Hover & Active States**: Smooth micro-interactions (`transition-colors duration-150`, active presses).
