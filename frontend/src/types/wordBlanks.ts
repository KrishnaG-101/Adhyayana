/**
 * Word Blanks Engine Types
 * Mirrored directly from docs/specs/api-contracts.json and backend/app/schemas/word_blanks.py
 * pursuant to AGENTS.md Rule 1 (Contract-First) and Rule 2 (Absolute Type Parity).
 */

import { DifficultyLevel } from './catalog';

export interface WordBlanksPuzzle {
  id: string;
  puzzle_number: number;
  stem: string;
  word_length: number;
  blank_count: number;
  min_words_to_clear: number;
  pedagogical_note: string;
}

export interface WordBlanksLevel {
  level: number;
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  xp_per_word: number;
  min_puzzles_to_unlock_next: number;
  puzzles: WordBlanksPuzzle[];

  // Optional backward compatibility fields
  stem?: string;
  word_length?: number;
  blank_count?: number;
  min_words_to_unlock?: number;
}

export interface DiscoveredWord {
  word: string;
  part_of_speech: string | null;
  definition: string | null;
  xp_awarded: number;
  discovered_at: string;
}

export interface WordBlanksGuessRequest {
  level: number;
  puzzle_number?: number;
  entered_word: string;
  session_discovered: string[];
}

export interface WordBlanksEvaluationResponse {
  is_valid: boolean;
  is_duplicate: boolean;
  matches_pattern: boolean;
  discovered_word: DiscoveredWord | null;
  xp_awarded: number;
  feedback_message: string;
}
