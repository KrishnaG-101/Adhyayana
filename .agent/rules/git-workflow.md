# Git Workflow Rules & Standards

> **Scope**: Repository-wide Git conventions  
> **Applies to**: All developers, agents, and CI pipelines  

---

## 1. Branch Naming Conventions

All development must occur on topic branches originating from the latest `main` branch. Direct commits to `main` are strictly prohibited.

Branch names must follow the format: `<category>/<kebab-case-description>`

### Valid Categories
- `feat/`: New features, puzzle engine implementations, or UI enhancements.  
  *Example*: `feat/contexto-engine`, `feat/guest-auth-modal`
- `fix/`: Bug fixes, scoring formula corrections, or UI display patches.  
  *Example*: `fix/similarity-rank-off-by-one`, `fix/mobile-touch-target`
- `docs/`: Changes to documentation, specifications, or architectural notes.  
  *Example*: `docs/update-api-contracts`, `docs/firestore-indexes`
- `chore/`: Dependency updates, tooling configuration, build scripts, or refactors.  
  *Example*: `chore/bump-vite-5`, `chore/setup-ruff-linter`

---

## 2. Commit Message Standards (Conventional Commits)

Commit messages must adhere strictly to the **Conventional Commits v1.0.0** specification:

```text
<type>(<optional scope>): <imperative description>

[optional body providing technical context and rationale]

[optional footer(s) such as Closes #123]
```

### Types
- `feat`: A new feature for the user or engine
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools

*Example*:
```text
feat(engine-contexto): integrate cosine distance rank calculation

Implements vectorized dot-product calculation over normalized word embeddings
and exposes rank ordering in the evaluate_guess handler.

Closes #14
```

---

## 3. Pull Request (PR) Expectations

1. **Atomic Scope**: Each PR must address a single feature, engine, or bug fix. Avoid monolithic PRs.
2. **Review Requirement**: Every PR requires review and sign-off from the collaborating developer before merging.
3. **Checklist Requirement**: Every PR description must include:
   - Reference to associated specification in `docs/specs/`
   - Verification steps performed (unit test commands, browser tests)
   - Updated state in `docs/tracker/state.md`
   - Any added dependencies verified in `docs/tracker/changelog.md`

---

## 4. Pre-Commit Validation Checklist

Before committing or pushing:
- [ ] **Type Check**:
  - Frontend: `npm run type-check` (or `tsc --noEmit`) passes with zero errors.
  - Backend: `mypy app/` (or pyright) passes with zero errors.
- [ ] **Lint & Format**:
  - Frontend: ESLint and Prettier check clean.
  - Backend: `ruff check .` and `ruff format --check .` pass.
- [ ] **Contract Integrity**:
  - `docs/specs/api-contracts.json` reflects all endpoint payload modifications.
- [ ] **Tracker Synced**:
  - `docs/tracker/state.md` has been updated with your current task status.
- [ ] **Context & Documentation Synced (Rule 6)**:
  - `context.md` MUST be updated on every commit to record latest architectural and pedagogical context.
  - `README.md` reviewed and updated if setup, directory map, or commands changed.

