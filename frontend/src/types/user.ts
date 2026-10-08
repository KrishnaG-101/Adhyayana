/**
 * User Profile, Authentication, and Persistence TypeScript Definitions.
 *
 * Strictly mirrors backend schemas in backend/app/schemas/users.py and
 * master contracts in docs/specs/api-contracts.json.
 * Enforces AGENTS.md Rule 1 (Contract-First) and Rule 2 (Absolute Type Parity).
 */

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sound: boolean;
}

export interface UserStats {
  games_played: number;
  games_won: number;
  current_streak: number;
  max_streak: number;
  total_xp: number;
  word_blanks_cleared: number;
}

export interface UserProfile {
  uid: string;
  display_name: string;
  email: string | null;
  photo_url: string | null;
  is_anonymous: boolean;
  created_at: string;
  last_active_at: string;
  stats: UserStats;
  preferences: UserPreferences;
}

export interface UpdateProfileRequest {
  display_name?: string;
  photo_url?: string | null;
  preferences?: Partial<UserPreferences>;
}

export interface GuestMigrationRequest {
  total_xp: number;
  current_streak: number;
  cleared_stages_count: number;
  discovered_words_summary?: string[];
}

export interface GuestMigrationResponse {
  success: boolean;
  migrated_xp: number;
  migrated_stages: number;
  message: string;
  updated_profile: UserProfile;
}
