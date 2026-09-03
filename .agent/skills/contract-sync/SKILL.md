---
name: contract-sync
description: >-
  Synchronizes API contracts between Pydantic v2 schemas in the backend,
  TypeScript interfaces in the frontend, and the master docs/specs/api-contracts.json registry.
  Use when the user adds or updates an API payload, data model, or network contract.
---

# Contract Synchronization Skill (`contract-sync`)

This skill enforces AGENTS.md Rule 1 (Contract-First) and Rule 2 (Type Parity). Whenever an API endpoint, data transfer object (DTO), or schema is introduced or modified, this skill ensures zero type drift across documentation, backend models, and frontend interfaces.

---

## Trigger Conditions
Activate this skill when:
- Adding a new API route or modifying an existing endpoint's request/response shape.
- Modifying a model in `backend/app/schemas/`.
- Adding or modifying a type in `frontend/src/types/`.
- The user requests: "sync contracts", "update API schema", or "verify type parity".

---

## Step-by-Step Execution Workflow

### Step 1: Lock the Master Contract in `docs/specs/api-contracts.json`
1. Open [`docs/specs/api-contracts.json`](docs/specs/api-contracts.json).
2. Locate the relevant schema definition under `definitions` (or `EngineLevelContracts`).
3. Add or update the JSON Schema definition:
   - Define exact property names (using `snake_case` for network wire consistency).
   - Specify `type`, `description`, `required` array, and validation constraints (`minimum`, `maxLength`, etc.).
   - Explicitly declare `"additionalProperties": false` unless variable metadata maps are intended.

### Step 2: Implement / Update Backend Pydantic v2 Schema
1. Open the corresponding file in [`backend/app/schemas/`](backend/app/schemas/) or engine schemas.
2. Define the Pydantic v2 model inheriting from `BaseModel`:
   - Use `Field(..., description="...")` on all fields.
   - Use Python 3.10+ union syntax (e.g. `str | None`).
   - Enable `model_config = ConfigDict(populate_by_name=True, extra="forbid")`.
3. Verify that the Pydantic schema strictly matches the JSON Schema types.

### Step 3: Mirror into Frontend TypeScript Interfaces
1. Open the corresponding interface file in [`frontend/src/types/`](frontend/src/types/) or engine types.
2. Define or update the TypeScript interface:
   - Match field names, nullability (`string | null`), and optionality (`field?: type`).
   - Use strict typing (no `any`). Use string literal unions for enum fields.

### Step 4: Verification & Parity Audit
1. Perform a side-by-side audit of:
   - Field names and case conventions.
   - Nullable vs optional fields.
   - Enum member values.
2. Run TypeScript check:
   ```bash
   cd frontend && npm run type-check
   ```
3. Run Python type check:
   ```bash
   cd backend && python -m mypy app/schemas
   ```
