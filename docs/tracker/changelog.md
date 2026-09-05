# Project Changelog & Dependency Audit Ledger

> All dependency additions, toolchain modifications, and architectural decision records (ADRs) must be logged here pursuant to **AGENTS.md Rule 5**.

---

## [Unreleased]

### Backend Runtime & Modular Core Scaffolding — 2026-09-05
#### Infrastructure & API Architecture
- **FastAPI Core Initialization**: Initialized `backend/app/main.py` with CORS middleware, `/health` endpoint, and `/api/v1` router mount.
- **Environment & Settings**: Created `backend/app/core/config.py` using `pydantic-settings.BaseSettings` for type-safe environment configuration.
- **Modular Puzzle Contracts**: Created `backend/app/engines/base.py` defining `AbstractPuzzleEngine`, `BasePuzzleInit`, `BaseGuessRequest`, and `BaseGuessResponse`.
- **Test Harness**: Configured `backend/tests/` with `pytest`, `pytest-asyncio`, and `httpx.AsyncClient` test fixtures.
- **Contract & Type Parity**: Synchronized `/health` and base puzzle envelope schemas across `docs/specs/api-contracts.json` and `frontend/src/types/backend.ts`.

---

## Dependency Rationale Log

| Date | Target | Package Name | Version | Rationale & Security Justification | Approved By |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-09-05 | `backend` | `fastapi` | `>=0.110.0` | High-performance async REST API framework for algorithmic scoring and endpoints. | Backend Engineer |
| 2026-09-05 | `backend` | `uvicorn[standard]` | `>=0.29.0` | Production ASGI web server implementation for FastAPI with uvloop and httptools. | Backend Engineer |
| 2026-09-05 | `backend` | `pydantic` | `>=2.6.0` | High-speed data validation and schema serialization with V2 core. | Backend Engineer |
| 2026-09-05 | `backend` | `pydantic-settings` | `>=2.2.0` | Type-safe environment variable parsing with validation and dot-env support. | Backend Engineer |
| 2026-09-05 | `backend` | `python-dotenv` | `>=1.0.0` | Secure local development environment variable file parsing. | Backend Engineer |
| 2026-09-05 | `backend` | `pytest` | `>=8.0.0` | Primary testing framework for unit, integration, and contract tests. | Backend Engineer |
| 2026-09-05 | `backend` | `pytest-asyncio` | `>=0.23.0` | Async support for pytest enabling native coroutine testing with FastAPI. | Backend Engineer |
| 2026-09-05 | `backend` | `httpx` | `>=0.27.0` | Async HTTP client for test requests via ASGI transport without binding network ports. | Backend Engineer |
| *Pending* | `frontend` | `react` | `^18.3.1` | Core UI rendering library. Zero CVEs, standard web foundation. | Teammate 1 & 2 |
| *Pending* | `frontend` | `vite` | `^5.4.0` | Fast ESM build tool and development server. | Teammate 1 & 2 |
| *Pending* | `frontend` | `tailwindcss` | `^3.4.0` | Utility-first styling engine for responsive layout. | Teammate 1 & 2 |
| *Pending* | `frontend` | `firebase` | `^10.13.0` | Client SDK for Firebase Auth and Firestore persistence. | Teammate 1 & 2 |
| *Pending* | `backend` | `firebase-admin` | `>=6.5.0` | Server-side verification of Firebase ID tokens. | Teammate 1 & 2 |
| *Pending* | `backend` | `numpy` | `>=2.0.0` | Vector operations for high-speed cosine distance scoring. | Teammate 1 & 2 |
