---
name: puzzle-scaffold
description: >-
  Scaffolds a new pluggable linguistic puzzle engine pair across frontend/src/engines/<name>
  and backend/app/engines/<name> with mandatory documentation headers, standard props,
  state machines, and algorithmic evaluator templates.
  Use when the user asks to add a new puzzle engine or game mode.
---

# Puzzle Engine Scaffolding Skill (`puzzle-scaffold`)

This skill automates the creation of a new, fully compliant pluggable puzzle engine in accordance with [`docs/specs/puzzle-framework.md`](docs/specs/puzzle-framework.md). It enforces directory structure, mandatory structured comment headers, lifecycle states, and evaluator protocols.

---

## Trigger Conditions
Activate this skill when:
- The user requests: "create puzzle engine <name>", "scaffold puzzle <name>", "add new puzzle mode".
- A new linguistic game mechanic is being initialized (e.g. `contexto`, `crossword`, `morph-matrix`, `word-blanks`).

---

## Inputs Required
- `<engine-name>`: Kebab-case identifier (e.g., `contexto`, `crossword`, `word-blanks`).
- `<engine-title>`: Human-readable display title (e.g., `Contexto Semantic Distance`).
- `<educational-objective>`: Pedagogical focus (e.g., `Navigating semantic vector space`).

---

## Step-by-Step Execution Workflow

### Step 1: Create Frontend Engine Directory & Files
Create directory: `frontend/src/engines/<engine-name>/` with:

1. **`types.ts`**:
   Define engine-specific telemetry and state interfaces:
   ```typescript
   export interface EngineTelemetry {
     rank: number;
     similarity: number;
     feedback: string;
   }
   ```

2. **`index.tsx`**:
   Implement standard entry component with mandatory header:
   ```typescript
   /**
    * ============================================================================
    * PUZZLE ENGINE: <engine-title>
    * ============================================================================
    * 
    * 1. EDUCATIONAL OBJECTIVE:
    *    - <educational-objective>
    * 
    * 2. INPUT RULES & CONSTRAINTS:
    *    - Single English word, letters only, case-insensitive.
    * 
    * 3. UI STATE MACHINE STRATEGY:
    *    - IDLE -> PLAYING -> EVALUATING -> WON | FAILED
    * ============================================================================
    */

   import React, { useState } from 'react';
   import { StandardPuzzleProps, EngineLifecycleState } from '../../types';

   export const EngineEntry: React.FC<StandardPuzzleProps> = ({
     puzzleId,
     onGuessSubmit,
     onStateChange,
     disabled = false,
   }) => {
     const [state, setState] = useState<EngineLifecycleState>('IDLE');
     // render puzzle UI
     return <div className="p-4">Engine: {puzzleId}</div>;
   };

   export default EngineEntry;
   ```

3. **`state.ts`**:
   Local reducer or state handlers for in-session guesses.

---

### Step 2: Create Backend Engine Package & Handlers
Create directory: `backend/app/engines/<engine-name>/` with:

1. **`__init__.py`**:
   Package init exposing engine instance or handler class.

2. **`schemas.py`**:
   Engine-specific Pydantic v2 schemas:
   ```python
   from pydantic import BaseModel, ConfigDict, Field

   class EngineGuessPayload(BaseModel):
       model_config = ConfigDict(populate_by_name=True, extra="forbid")
       guess: str = Field(..., min_length=1, max_length=100, description="Submitted candidate word")

   class EngineTelemetryResponse(BaseModel):
       model_config = ConfigDict(populate_by_name=True, extra="forbid")
       rank: int = Field(..., description="Proximity rank relative to target")
       similarity: float = Field(..., description="Cosine similarity score [0.0 - 1.0]")
       is_solved: bool = Field(..., description="True if guess matches target solution")
   ```

3. **`evaluator.py`**:
   Implement evaluator with mandatory header:
   ```python
   """
   ============================================================================
   BACKEND PUZZLE ENGINE: <engine-title>
   ============================================================================

   1. ALGORITHMIC LOGIC:
      - Vector cosine similarity between normalized candidate and target embeddings.

   2. DISTANCE / SCORING FORMULAS:
      - Cosine Similarity: S_c(u, v) = (u . v) / (||u|| * ||v||)
      - Rank: 1-based index in descending similarity array.

   3. PERFORMANCE & COMPLEXITY:
      - Time complexity: O(D) for dot product where D is embedding dimensions.
      - Space complexity: O(V * D) for vocabulary embeddings matrix.
   ============================================================================
   """
   from typing import Any, Dict
   from .schemas import EngineGuessPayload, EngineTelemetryResponse

   class EngineEvaluator:
       async def evaluate(self, target: str, payload: EngineGuessPayload) -> EngineTelemetryResponse:
           # Implement algorithmic evaluation
           ...
   ```

---

### Step 3: Register in API Contracts
1. Add `<engine-name>` request/response schemas to [`docs/specs/api-contracts.json`](docs/specs/api-contracts.json).
2. Log the engine creation in [`docs/tracker/state.md`](docs/tracker/state.md).

