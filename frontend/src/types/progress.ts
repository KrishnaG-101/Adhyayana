/**
 * TypeScript Type Definitions for Game Engine Progress and Cloud Synchronization.
 *
 * Synchronized with docs/specs/api-contracts.json and backend/app/schemas/progress.py.
 * Follows AGENTS.md Rule 2: Absolute Type Parity.
 */

import { UserProfile } from './user';

export interface DiscoveredWordRecord {
  word: string;
  xp_awarded: number;
  discovered_at: string; // ISO 8601 string
}

export interface WordBlanksProgressData {
  game_id: 'word_blanks';
  unlocked_levels: number[];
  cleared_stages: string[];
  discovered_words: Record<string, DiscoveredWordRecord[]>;
  total_words_count: number;
  total_xp_earned: number;
  last_played_at: string;
}

export interface SyncGameProgressRequest {
  unlocked_levels: number[];
  cleared_stages: string[];
  discovered_words: Record<string, DiscoveredWordRecord[]>;
  new_xp_delta?: number;
}

export interface SyncGameProgressResponse {
  success: boolean;
  game_id: string;
  synced_stages_count: number;
  synced_words_count: number;
  total_xp: number;
  message: string;
  updated_profile: UserProfile;
}
