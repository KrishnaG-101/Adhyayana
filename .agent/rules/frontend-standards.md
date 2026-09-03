# Frontend Engineering Standards

> **Scope**: `frontend/` directory  
> **Framework**: React 18 + Vite + TypeScript (Strict) + Tailwind CSS  

---

## 1. Component Architecture & Style

1. **Functional Components**: All components must be written as React Functional Components using standard arrow syntax or function declarations with explicit TypeScript props typing:
   ```typescript
   interface GuessBarProps {
     currentGuess: string;
     disabled?: boolean;
     onSubmit: (guess: string) => void;
   }

   export const GuessBar: React.FC<GuessBarProps> = ({
     currentGuess,
     disabled = false,
     onSubmit,
   }) => {
     // implementation
   };
   ```
2. **Component File Structure**:
   - One primary component per file.
   - Sub-components private to a feature stay in a `components/` subfolder adjacent to the feature.
   - Reusable global design system components reside in `frontend/src/components/`.

---

## 2. TypeScript & Strict Type Safety

1. **Zero Inline `any`**:
   - The use of `any` is strictly prohibited anywhere in the codebase.
   - Use `unknown` with type narrowing (e.g. `typeof`, `instanceof`, custom type guards) when handling dynamic or external payloads.
2. **Type Parity**:
   - All network transfer types must mirror `backend/app/schemas/` and be placed in `frontend/src/types/`.
3. **Props and State**:
   - Never use type assertions (`as SomeType`) to bypass compiler checks unless interfacing with non-typed third-party libraries.
   - Discriminated unions must be used for lifecycle states (`status: 'IDLE' | 'PLAYING' | 'EVALUATING' | 'WON' | 'FAILED'`).

---

## 3. Tailwind CSS Styling & Class Ordering

1. **Recommended Class Order**:
   - Follow standard Tailwind recommended order:
     `Layout (display, position) -> Box Model (margin, padding, width, height) -> Typography -> Visuals (colors, borders, shadows) -> Interactivity (hover, focus, transitions)`
   - *Example*:
     ```tsx
     <button className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors duration-150">
       Submit Guess
     </button>
     ```
2. **Design Tokens & Dark Mode**:
   - Always support dark mode via `dark:` variant classes.
   - Use semantic color classes (e.g. `text-slate-900 dark:text-slate-100`, `bg-white dark:bg-slate-900`) rather than arbitrary hex values.
3. **No Inline CSS Styles**:
   - Inline styles (`style={{ ... }}`) are prohibited except for dynamic CSS variables or computed position coordinates (e.g. progress bar width percentages).

---

## 4. State Management & Side Effects

1. **Keep State Local**: Keep state as close as possible to where it is consumed. Use local component state or engine reducer before reaching for global context.
2. **Custom Hooks**: Encapsulate complex side effects (e.g. keyboard shortcuts, audio effects, countdown timers) in reusable custom hooks (`frontend/src/hooks/`).
3. **No Unhandled Promises**: All asynchronous calls to Firebase or the FastAPI backend must be enclosed in `try / catch` blocks with error states displayed to the user.
