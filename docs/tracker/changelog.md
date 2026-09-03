# Project Changelog & Dependency Audit Ledger

> All dependency additions, toolchain modifications, and architectural decision records (ADRs) must be logged here pursuant to **AGENTS.md Rule 5**.

---

## [Unreleased]

### Initialized — 2026-09-03
#### Architecture & Repository Initialization
- **Scaffolded Monorepo Structure**:
  - `frontend/`: Vite + React + TypeScript + Tailwind CSS structure.
  - `backend/`: Python 3.11+ + FastAPI + Pydantic v2 structure.
  - `docs/`: Specs, architecture, and tracker documentation.
  - `.agent/`: Antigravity rules and skills.
- **Specifications Created**:
  - `context.md`: Vicharanashala pedagogical framework & system context.
  - `AGENTS.md`: Foundational agent rules and developer guardrails.
  - `docs/specs/puzzle-framework.md`: Pluggable puzzle engine contracts.
  - `docs/specs/api-contracts.json`: Master JSON schema API registry.
  - `docs/architecture/system-overview.md`: System topology, boundaries, and auth flow.
  - `docs/architecture/data-model.md`: Cloud Firestore collections, schemas, and indexes.
  - `docs/tracker/state.md`: Active sprint tracker.

---

## Dependency Rationale Log

| Date | Target | Package Name | Version | Rationale & Security Justification | Approved By |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *Pending* | `frontend` | `react` | `^18.3.1` | Core UI rendering library. Zero CVEs, standard web foundation. | Teammate 1 & 2 |
| *Pending* | `frontend` | `vite` | `^5.4.0` | Fast ESM build tool and development server. | Teammate 1 & 2 |
| *Pending* | `frontend` | `tailwindcss` | `^3.4.0` | Utility-first styling engine for responsive layout. | Teammate 1 & 2 |
| *Pending* | `frontend` | `firebase` | `^10.13.0` | Client SDK for Firebase Auth and Firestore persistence. | Teammate 1 & 2 |
| *Pending* | `backend` | `fastapi` | `>=0.112.0` | High-performance async REST API framework. | Teammate 1 & 2 |
| *Pending* | `backend` | `pydantic` | `>=2.8.0` | Strict data validation and schema serialization. | Teammate 1 & 2 |
| *Pending* | `backend` | `firebase-admin` | `>=6.5.0` | Server-side verification of Firebase ID tokens. | Teammate 1 & 2 |
| *Pending* | `backend` | `numpy` | `>=2.0.0` | Vector operations for high-speed cosine distance scoring. | Teammate 1 & 2 |
