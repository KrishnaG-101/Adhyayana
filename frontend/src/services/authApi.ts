/**
 * Authentication and User Profile API Client.
 *
 * Implements network requests to FastAPI backend:
 * - GET /api/v1/auth/me
 * - PATCH /api/v1/users/profile
 * - POST /api/v1/users/migrate-guest-data
 */

import {
  UserProfile,
  UpdateProfileRequest,
  GuestMigrationRequest,
  GuestMigrationResponse,
} from '@/types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Retrieves the authenticated user's profile and stats from the backend.
 */
export async function fetchMyProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || `Failed to fetch profile: ${response.status}`);
  }

  return response.json();
}

/**
 * Updates display name, avatar URL, or UI preferences.
 */
export async function updateMyProfile(
  token: string,
  updates: UpdateProfileRequest
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || `Failed to update profile: ${response.status}`);
  }

  return response.json();
}

/**
 * Migrates local guest gameplay XP, streaks, and cleared stages into Firestore profile.
 */
export async function migrateGuestData(
  token: string,
  payload: GuestMigrationRequest
): Promise<GuestMigrationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/migrate-guest-data`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || `Failed to migrate guest progress: ${response.status}`);
  }

  return response.json();
}
