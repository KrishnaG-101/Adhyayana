/**
 * Adhyayana Backend Type Parity Registry
 * Mirrored directly from backend/app/schemas/ and backend/app/engines/base.py
 * pursuant to AGENTS.md Rule 2 (Absolute Type Parity).
 */

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
}

export type PedagogicalDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface BasePuzzleInit {
  puzzleId: string;
  puzzleType: string;
  difficulty: PedagogicalDifficulty;
  metadata: Record<string, unknown>;
}

export interface BaseGuessRequest {
  puzzleId: string;
  sessionId?: string | null;
}

export interface BaseGuessResponse {
  puzzleId: string;
  status: string;
  feedback: string;
  isCorrect: boolean;
}
