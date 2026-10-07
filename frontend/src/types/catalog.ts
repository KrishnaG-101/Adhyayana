/**
 * Adhyayana Puzzle Catalog & Level Progression Types
 * Mirrored directly from docs/specs/api-contracts.json and backend/app/schemas/puzzles.py
 * pursuant to AGENTS.md Rule 1 (Contract-First) and Rule 2 (Absolute Type Parity).
 */

export type DifficultyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'master';

export type GameType =
  | 'fill-in-blanks'
  | 'semantic-similarity'
  | 'crossword'
  | 'morphology-matrix';

export type LearningObjective =
  | 'vocabulary'
  | 'morphology'
  | 'syntax'
  | 'etymology'
  | 'inference';

export interface PuzzleLevelInfo {
  level: number;
  label: string;
  base_xp: number;
  unlocked_by_default: boolean;
}

export interface PuzzleMetadata {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  difficulty: DifficultyLevel;
  game_type: GameType;
  learning_objectives: LearningObjective[];
  is_new: boolean;
  thumbnail_icon: string;
  available_levels: PuzzleLevelInfo[];
  total_levels: number;
  max_xp: number;
}

export interface PuzzleCatalogResponse {
  puzzles: PuzzleMetadata[];
  total_count: number;
}
