# Adhyayana Cloud Firestore Data Model Specification

> **Status**: Authoritative Data Model  
> **Target Database**: Google Cloud Firestore (Native Mode)  
> **Version**: 1.0.0  

---

## 1. Overview & Schema Architecture

Adhyayana uses Google Cloud Firestore for persistence, session tracking, daily challenge delivery, and player pedagogical history. The schema is organized into four top-level collections:

```text
Firestore Root
├── users/             # User profiles, learning stats, and streak counters
├── daily_puzzles/     # Daily puzzle definitions, seeds, and metadata
├── sessions/          # Active gameplay sessions and in-flight guess records
└── game_history/      # Completed games, historical telemetry, and analytics
```

---

## 2. Collection Schemas

### 2.1 Collection: `users`
- **Document ID**: `user_id` (matches Firebase Auth UID).
- **Purpose**: Stores player identity, profile preferences, aggregate stats, and current learning streak.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `uid` | `string` | Unique Firebase Auth identifier. |
| `display_name` | `string` | User display name or generated anonymous alias. |
| `email` | `string \| null` | User email address (null for anonymous guests). |
| `photo_url` | `string \| null` | Avatar image URL. |
| `is_anonymous` | `boolean` | True if user is playing under an anonymous guest session. |
| `created_at` | `timestamp` | UTC account creation timestamp. |
| `last_active_at` | `timestamp` | UTC timestamp of most recent activity. |
| `stats.games_played` | `number` | Total number of puzzles attempted across all engines. |
| `stats.games_won` | `number` | Total puzzles successfully solved. |
| `stats.current_streak`| `number` | Current consecutive daily puzzle completion streak. |
| `stats.max_streak` | `number` | Longest consecutive daily puzzle streak achieved. |
| `preferences.theme` | `string` | UI theme mode (`dark` \| `light` \| `system`). |
| `preferences.sound` | `boolean` | Audio feedback toggle. |

---

### 2.2 Collection: `daily_puzzles`
- **Document ID**: `puzzle_id` (format: `YYYY-MM-DD_<puzzle_type>`, e.g., `2026-09-03_contexto`).
- **Purpose**: Daily canonical challenge metadata.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `puzzle_id` | `string` | Unique identifier formatted by date and engine type. |
| `puzzle_type` | `string` | Engine identifier (`contexto`, `crossword`, `word_blanks`). |
| `release_date` | `string` | Calendar date formatted `YYYY-MM-DD`. |
| `active_from` | `timestamp` | UTC timestamp when the puzzle becomes playable. |
| `active_to` | `timestamp` | UTC timestamp when the daily puzzle closes for streak credit. |
| `difficulty` | `string` | Pedagogical tier (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`). |
| `solution_hash` | `string` | Salted SHA-256 hash of solution for client integrity checks. |
| `metadata` | `map` | Engine-specific public configuration (e.g. clue, initial grid). |
| `metadata.word_length`| `number` | Target word length (if applicable). |
| `metadata.hint_tier` | `string` | Available hint level. |

---

### 2.3 Collection: `sessions`
- **Document ID**: `session_id` (UUIDv4).
- **Purpose**: Tracks an active puzzle attempt, ephemeral guess history, and state machine progress.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `session_id` | `string` | Unique session UUID. |
| `user_id` | `string` | Firebase Auth UID of player. |
| `puzzle_id` | `string` | Reference to `daily_puzzles/{puzzle_id}`. |
| `puzzle_type` | `string` | Puzzle engine identifier. |
| `status` | `string` | Session status (`ACTIVE`, `WON`, `FAILED`, `ABANDONED`). |
| `attempts` | `array<map>` | Ordered list of submitted guesses and returned telemetry. |
| `attempts[].guess` | `string` | Guess word submitted by player. |
| `attempts[].rank` | `number` | Proximity rank calculated by backend. |
| `attempts[].similarity` | `number` | Normalized similarity score [0.0 - 1.0]. |
| `attempts[].timestamp` | `timestamp` | Submission timestamp. |
| `attempt_count` | `number` | Cached count of guesses submitted. |
| `started_at` | `timestamp` | Session start timestamp. |
| `updated_at` | `timestamp` | Last activity timestamp. |
| `completed_at` | `timestamp \| null` | Completion timestamp, or null if active. |

---

### 2.4 Collection: `game_history`
- **Document ID**: `history_id` (UUIDv4).
- **Purpose**: Immutable ledger of finalized puzzle runs for long-term pedagogical analytics.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `history_id` | `string` | Unique history record UUID. |
| `user_id` | `string` | Firebase Auth UID. |
| `puzzle_id` | `string` | Daily puzzle ID. |
| `puzzle_type` | `string` | Engine identifier. |
| `outcome` | `string` | Final outcome (`WON` \| `FAILED`). |
| `total_attempts` | `number` | Total guesses used to resolve the puzzle. |
| `duration_seconds` | `number` | Time taken in seconds from session start to victory/failure. |
| `pedagogical_metrics` | `map` | Detailed breakdown of lexical variety, average distance, etc. |
| `completed_at` | `timestamp` | UTC completion timestamp. |

---

## 3. Indexing Strategy

1. **`sessions`**:
   - Composite Index: `user_id` (ASC) + `puzzle_id` (ASC) + `status` (ASC)
   - *Query Pattern*: Finding if user already has an active session for today's puzzle.
2. **`game_history`**:
   - Composite Index: `user_id` (ASC) + `completed_at` (DESC)
   - *Query Pattern*: Fetching player history sorted chronologically.
3. **`daily_puzzles`**:
   - Composite Index: `puzzle_type` (ASC) + `release_date` (DESC)
   - *Query Pattern*: Fetching today's puzzle by engine type.
