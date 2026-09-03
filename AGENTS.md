# Antigravity Baseline Operational Directives

> **Scope**: Monorepo Root (`Adhyayana`)  
> **Applies to**: All Antigravity AI Agents, subagents, and human collaborators  
> **Enforcement**: Mandatory  

---

## Prime Operational Rules

### Rule 1: Contract-First Development
Never create, modify, or extend an API route or network payload in `backend/` or `frontend/` without first declaring and locking the schema in [`docs/specs/api-contracts.json`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/docs/specs/api-contracts.json).
- Changes to API contracts must be reviewed and locked prior to code generation.
- Endpoint implementation PRs must link to the specific contract definition in `api-contracts.json`.

### Rule 2: Absolute Type Parity
Any data model or schema defined or altered in [`backend/app/schemas/`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/backend/app/schemas/) must immediately and identically mirror into [`frontend/src/types/`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/frontend/src/types/).
- Field names must follow strict snake_case to camelCase mapping or explicit alias serialization.
- Nullability, optionality, and array dimensions must match without discrepancy.
- Zero `any` types are permitted in TypeScript; zero untyped `dict` or `Any` are permitted in Pydantic.

### Rule 3: Modular & Isolated Puzzle Engines
Never hardcode puzzle-specific logic, scoring algorithms, or domain schemas into global layouts, shared route containers, or top-level navigation components.
- All puzzle mechanics must reside strictly inside isolated engine containers:
  - Frontend: [`frontend/src/engines/<puzzle-name>/`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/frontend/src/engines/)
  - Backend: [`backend/app/engines/<puzzle-name>/`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/backend/app/engines/)
- Engines must conform to the unified plugin lifecycle defined in [`docs/specs/puzzle-framework.md`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/docs/specs/puzzle-framework.md).

### Rule 4: Living State Tracker Synchronization
Update [`docs/tracker/state.md`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/docs/tracker/state.md) with active tasks, completed steps, architectural decisions, and current blockers at every milestone and at the conclusion of every working session.
- No task is considered complete until checked off in `state.md`.
- Blockers must be escalated immediately with an explanation and assigned owner.

### Rule 5: Dependency Guardrail & Changelog Audit
Never execute package installation commands (`npm install`, `npm i`, `pip install`, `poetry add`) without recording the dependency rationale in [`docs/tracker/changelog.md`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/docs/tracker/changelog.md).
- Rationale must include: Package name, version, exact purpose, security evaluation, bundle size impact (for frontend), and pedagogical necessity.
- Do not add packages for trivial utility functions that can be written in <20 lines of clean code.

---

## Execution Directives

- **Code Quality**: Every file created or updated must adhere to the rules in [`.agent/rules/`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/.agent/rules/).
- **Skills Utilization**: When performing contract updates, engine scaffolding, or commit creation, invoke the respective skills in [`.agent/skills/`](file:///e:/Code/Projects/Major%20Projects/Adhyayana/.agent/skills/).
- **Preservation of Comments & Docs**: Never remove architectural or pedagogical comments during refactors unless explicitly instructed.
