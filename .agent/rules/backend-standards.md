# Backend Engineering Standards

> **Scope**: `backend/` directory  
> **Framework**: Python 3.11+ + FastAPI + Pydantic v2  

---

## 1. FastAPI Endpoint Architecture

1. **`async def` Handlers**: All API route handlers must be declared as asynchronous functions (`async def`):
   ```python
   @router.post(
       "/puzzles/{puzzle_id}/guess",
       response_model=PuzzleGuessResponse,
       status_code=status.HTTP_200_OK,
       summary="Evaluate user guess",
   )
   async def evaluate_guess(
       puzzle_id: str,
       payload: PuzzleGuessRequest,
       user: FirebaseUser = Depends(get_current_user),
       engine_service: PuzzleEngineService = Depends(get_engine_service),
   ) -> PuzzleGuessResponse:
       ...
   ```
2. **Standard Error Responses**: Handlers must raise `HTTPException` with detail payloads that serialize to `StandardErrorResponse` (defined in `docs/specs/api-contracts.json`).
3. **Route Versioning**: All public endpoints must be organized under `/api/v1/`.

---

## 2. Pydantic v2 Schemas & Validation

1. **Pydantic v2 Syntax**:
   - Use `model_config = ConfigDict(...)` instead of the legacy v1 `class Config:`.
   - Use `Field(..., description="...")` on all schema attributes.
   - Use `@field_validator` and `@model_validator(mode='after')` instead of legacy `@validator` / `@root_validator`.
2. **Explicit Nullability and Types**:
   - Never use `Any` or raw untyped `dict`.
   - Use Python 3.10+ union syntax `str | None` instead of `Optional[str]`.
3. **Serialization & Aliasing**:
   - Use `populate_by_name = True` in `model_config` to allow interoperability with camelCase JSON serialization while preserving snake_case Python naming:
   ```python
   from pydantic import BaseModel, ConfigDict, Field

   class BaseSchema(BaseModel):
       model_config = ConfigDict(
           populate_by_name=True,
           str_strip_whitespace=True,
           extra="forbid",
       )
   ```

---

## 3. Dependency Injection & Service Layer

1. **FastAPI `Depends`**:
   - All external resources (Firebase Admin client, embedding caches, database connections, authentication context) must be injected via FastAPI's `Depends` mechanism.
   - Never instantiate singletons or services directly inside route handler functions.
2. **Service Decoupling**:
   - Route handlers (`app/api/routes/`) only handle HTTP status codes, request parsing, and dependency injection.
   - All algorithmic scoring and data manipulation logic must reside in service classes or engine handlers (`app/engines/<puzzle_name>/`).

---

## 4. Code Quality & Typing

1. **Strict Type Annotations**: Every function, method parameter, and return value must be fully type annotated.
2. **Linter & Formatter**: Code must comply with **Ruff** formatting and linting rules. Line length limit is set to 88 or 100 characters.
3. **No Blocking Synchronous I/O**: Heavy synchronous file I/O or model downloading must be handled either during startup lifespan events (`lifespan`) or offloaded via `asyncio.to_thread`.
