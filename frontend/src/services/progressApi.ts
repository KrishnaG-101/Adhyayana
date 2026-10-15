/**
 * Game Progress and Cross-Device Synchronization API Client.
 *
 * Implements network requests to FastAPI backend:
 * - GET /api/v1/games/{game_id}/progress
 * - POST /api/v1/games/{game_id}/progress
 */

import {
  SyncGameProgressRequest,
  SyncGameProgressResponse,
  WordBlanksProgressData,
} from '@/types/progress';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Retrieves the player's persistent progress document from Cloud Firestore.
 */
export async function fetchGameProgress(
  gameId: string,
  token: string
): Promise<WordBlanksProgressData> {
  const response = await fetch(`${API_BASE_URL}/api/v1/games/${gameId}/progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail?.message || `Failed to fetch game progress: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Synchronizes stage clearance, unlocked levels, and discovered words to Cloud Firestore.
 */
export async function syncGameProgress(
  gameId: string,
  token: string,
  payload: SyncGameProgressRequest
): Promise<SyncGameProgressResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/games/${gameId}/progress`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail?.message || `Failed to sync game progress: ${response.status}`
    );
  }

  return response.json();
}
