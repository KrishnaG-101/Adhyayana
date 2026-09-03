# Pluggable Linguistic Puzzle Engine Framework Specification

> **Status**: Authoritative Plugin Contract  
> **Applies to**: `frontend/src/engines/<puzzle-name>/` and `backend/app/engines/<puzzle-name>/`  
> **Version**: 1.0.0  

---

## 1. Overview & Architectural Rationale

To prevent monolith bloat and keep puzzle mechanics completely isolated, **Adhyayana** enforces a pluggable engine architecture. Any linguistic puzzle (e.g., Contexto semantic proximity, Morphological Matrix, Crossword, Cloze/Word Blanks) must conform to this uniform contract across both frontend UI and backend algorithmic evaluation.

---

## 2. Frontend Engine Specification

### 2.1 File Structure Requirements
Every puzzle engine in the frontend must reside in its own dedicated directory:
```text
frontend/src/engines/<puzzle-name>/
├── index.tsx              # Primary Engine Component (Entrypoint)
├── state.ts               # Local state machine and action handlers
├── types.ts               # Engine UI contracts and DTO types
└── components/            # Puzzle-internal visual subcomponents
```

### 2.2 Standard Game Props Interface
The entry component (`index.tsx`) must accept standard props defining input constraints and event callbacks:

```typescript
export type EngineLifecycleState = 
  | 'IDLE'        // Puzzle initialized, waiting for first interaction
  | 'PLAYING'     // User actively inputting/solving
  | 'EVALUATING'  // Network/backend algorithmic evaluation in flight
  | 'WON'         // Puzzle solved successfully
  | 'FAILED';     // Puzzle terminated unsuccessfully or max attempts reached

export interface StandardPuzzleProps<TInitialState = unknown, TTelemetry = unknown> {
  puzzleId: string;
  initialState?: TInitialState;
  onGuessSubmit: (guess: string) => Promise<TTelemetry>;
  onStateChange?: (state: EngineLifecycleState) => void;
  disabled?: boolean;
}
```

### 2.3 Strict Frontend Documentation Comment Header
Every puzzle entry component (`index.tsx`) **must** begin with a structured top-of-file comment block:

```typescript
/**
 * ============================================================================
 * PUZZLE ENGINE: [Engine Name] (e.g., Contexto Semantic Distance)
 * ============================================================================
 * 
 * 1. EDUCATIONAL OBJECTIVE:
 *    - Detail target linguistic skill (e.g., Semantic neighborhood navigation,
 *      morphological affixation, syntactic valency).
 * 
 * 2. INPUT RULES & CONSTRAINTS:
 *    - Permitted character sets, case sensitivity, token limits, regex rules.
 * 
 * 3. UI STATE MACHINE STRATEGY:
 *    - Transition model between IDLE -> PLAYING -> EVALUATING -> WON / FAILED.
 *    - Error boundary and latency masking strategies.
 * ============================================================================
 */
```

---

## 3. Backend Engine Specification

### 3.1 File Structure Requirements
Every backend engine must reside in its own isolated subpackage:
```text
backend/app/engines/<puzzle-name>/
├── __init__.py            # Exports engine handler class or functions
├── evaluator.py           # Algorithmic scoring, distance calculation
├── schemas.py             # Pydantic v2 DTOs matching api-contracts.json
└── lexicon.py             # Domain-specific word list or vector indexes
```

### 3.2 Standard Handler Signatures
Backend puzzle engines must implement the standard lifecycle interface:

```python
from typing import Any, Dict, Protocol
from pydantic import BaseModel

class StandardPuzzleEngine(Protocol):
    async def initialize(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Initializes or restores puzzle state for a user session.
        Returns public session bootstrap state (e.g. word length, hints).
        """
        ...

    async def evaluate_guess(
        self, 
        session_data: Dict[str, Any], 
        payload: BaseModel
    ) -> Dict[str, Any]:
        """
        Evaluates user guess against target criteria (embeddings, rules, etc.).
        Returns rich pedagogical telemetry (rank, similarity, POS, feedback).
        """
        ...
```

### 3.3 Strict Backend Documentation Comment Header
Every backend engine evaluation module (`evaluator.py`) **must** begin with a structured top-of-file comment block:

```python
"""
============================================================================
BACKEND PUZZLE ENGINE: [Engine Name]
============================================================================

1. ALGORITHMIC LOGIC:
   - Mathematical model (e.g. Cosine distance between normalized embeddings).
   - Lexical lookup tables or graph traversal rules.

2. DISTANCE / SCORING FORMULAS:
   - Exact mathematical equations used to calculate closeness, rank, and score.
   - Normalization ranges (e.g. [0.0, 1.0] or 1 to N ranks).

3. PERFORMANCE & COMPLEXITY:
   - Time complexity: O(...) for query and evaluation.
   - Space complexity: Memory footprint of in-memory dictionaries or matrices.
   - Vector indexing strategies (e.g., FAISS, Annoy, or static numpy arrays).
============================================================================
"""
```

---

## 4. Engine Registration & Host Lifecycle

The global application mounts engines dynamically using an engine registry keyed by `puzzleType`:
1. The host fetches daily puzzle metadata (`puzzleId`, `puzzleType`, `difficulty`).
2. The host renders the registered frontend engine component inside a container providing authentication token, progress sync, and analytical telemetry modals.
3. The engine dispatches guesses via `onGuessSubmit` -> calls FastAPI backend route `/api/v1/puzzles/{puzzleId}/guess` -> delegates to the matching backend engine handler.
4. On terminal state (`WON` or `FAILED`), the host updates Cloud Firestore `sessions` and `game_history` records.
