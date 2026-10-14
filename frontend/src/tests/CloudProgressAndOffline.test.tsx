/**
 * Cloud Progress Synchronization & Offline Resilience Unit Tests
 * Validates persistent multi-game cloud documents, automatic background sync,
 * and immediate offline connection detection.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  ConnectionStatusBanner,
  setGlobalConnectionState,
} from '@/components/common/ConnectionStatusBanner';
import {
  fetchGameProgress,
  syncGameProgress,
} from '@/services/progressApi';
import { WordBlanksBoard } from '@/engines/word_blanks/WordBlanksBoard';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NavigationProvider } from '@/context/NavigationContext';
import { WordBlanksProgressData, SyncGameProgressRequest } from '@/types/progress';

describe('Cloud Progress & Offline Network Resilience', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ConnectionStatusBanner Component', () => {
    it('does not display any banner when connection is online', () => {
      render(<ConnectionStatusBanner />);
      expect(screen.queryByTestId('connection-lost-banner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('connection-restored-banner')).not.toBeInTheDocument();
    });

    it('immediately renders connection lost banner when offline event fires', async () => {
      render(<ConnectionStatusBanner />);

      act(() => {
        window.dispatchEvent(new Event('offline'));
      });

      expect(screen.getByTestId('connection-lost-banner')).toBeInTheDocument();
      expect(
        screen.getByText(/Adhyayana requires an active internet connection/i)
      ).toBeInTheDocument();
    });

    it('shows connection restored toast when coming back online', async () => {
      render(<ConnectionStatusBanner />);

      // Go offline first
      act(() => {
        window.dispatchEvent(new Event('offline'));
      });
      expect(screen.getByTestId('connection-lost-banner')).toBeInTheDocument();

      // Come back online
      act(() => {
        window.dispatchEvent(new Event('online'));
      });
      expect(screen.queryByTestId('connection-lost-banner')).not.toBeInTheDocument();
      expect(screen.getByTestId('connection-restored-banner')).toBeInTheDocument();
      expect(
        screen.getByText(/Connection restored. Progress synchronized with cloud/i)
      ).toBeInTheDocument();
    });

    it('responds to programmatic setGlobalConnectionState events', () => {
      render(<ConnectionStatusBanner />);

      act(() => {
        setGlobalConnectionState(false);
      });
      expect(screen.getByTestId('connection-lost-banner')).toBeInTheDocument();

      act(() => {
        setGlobalConnectionState(true);
      });
      expect(screen.queryByTestId('connection-lost-banner')).not.toBeInTheDocument();
      expect(screen.getByTestId('connection-restored-banner')).toBeInTheDocument();
    });
  });

  describe('Game Progress API Client (progressApi)', () => {
    it('fetches game progress with Authorization header', async () => {
      const mockProgress: WordBlanksProgressData = {
        game_id: 'word_blanks',
        unlocked_levels: [1, 2],
        cleared_stages: ['1:1'],
        discovered_words: {
          '1:1': [{ word: 'BAT', xp_awarded: 20, discovered_at: '2026-10-14T00:00:00Z' }],
        },
        total_words_count: 1,
        total_xp_earned: 20,
        last_played_at: '2026-10-14T00:00:00Z',
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgress,
      } as Response);

      const result = await fetchGameProgress('word_blanks', 'mock-token-xyz');

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/games/word_blanks/progress'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token-xyz',
          }),
        })
      );
      expect(result.game_id).toBe('word_blanks');
      expect(result.total_words_count).toBe(1);
    });

    it('synchronizes game progress with POST request', async () => {
      const payload: SyncGameProgressRequest = {
        unlocked_levels: [1],
        cleared_stages: ['1:1'],
        discovered_words: {
          '1:1': [{ word: 'CAT', xp_awarded: 20, discovered_at: '2026-10-14T00:00:00Z' }],
        },
        new_xp_delta: 20,
      };

      const mockResponse = {
        success: true,
        game_id: 'word_blanks',
        synced_stages_count: 1,
        synced_words_count: 1,
        total_xp: 20,
        message: 'Progress synchronized successfully.',
        updated_profile: {
          uid: 'user-123',
          display_name: 'Learner',
          stats: { total_xp: 20 },
        },
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await syncGameProgress('word_blanks', 'mock-token-xyz', payload);

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/games/word_blanks/progress'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token-xyz',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(payload),
        })
      );
      expect(result.success).toBe(true);
      expect(result.synced_words_count).toBe(1);
    });

    it('throws error when server responds with non-ok status', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: { message: 'Database unreachable' } }),
      } as Response);

      await expect(fetchGameProgress('word_blanks', 'token')).rejects.toThrow(
        /Database unreachable/i
      );
    });
  });

  describe('WordBlanksBoard Offline & Cloud Integration', () => {
    it('displays offline warning banner and disables input when connection is lost', async () => {
      render(
        <MemoryRouter>
          <NavigationProvider>
            <WordBlanksBoard />
          </NavigationProvider>
        </MemoryRouter>
      );

      // Initially online - no warning banner
      expect(screen.queryByTestId('offline-play-warning')).not.toBeInTheDocument();

      // Trigger offline event
      act(() => {
        window.dispatchEvent(new Event('offline'));
      });

      // Warning banner appears
      expect(screen.getByTestId('offline-play-warning')).toBeInTheDocument();
      expect(
        screen.getByText(/An active internet connection is required to evaluate words/i)
      ).toBeInTheDocument();

      // Input tile should be disabled
      const blankInput = screen.getByTestId('tile-blank-0');
      expect(blankInput).toBeDisabled();

      // Submit button should be disabled
      const submitBtn = screen.getByTestId('submit-guess-button');
      expect(submitBtn).toBeDisabled();
    });

    it('hydrates discovered words from cloud progress when authenticated', async () => {
      // Seed authenticated session
      localStorage.setItem(
        'adhyayana:auth:session',
        JSON.stringify({
          uid: 'user-persisted-123',
          email: 'persisted@adhyayana.org',
          displayName: 'Persisted Learner',
          photoURL: null,
          isAnonymous: false,
        })
      );

      const mockCloudProgress: WordBlanksProgressData = {
        game_id: 'word_blanks',
        unlocked_levels: [1],
        cleared_stages: [],
        discovered_words: {
          '1:1': [
            { word: 'BAT', xp_awarded: 20, discovered_at: '2026-10-14T00:00:00Z' },
            { word: 'CAT', xp_awarded: 20, discovered_at: '2026-10-14T00:00:00Z' },
          ],
        },
        total_words_count: 2,
        total_xp_earned: 40,
        last_played_at: '2026-10-14T00:00:00Z',
      };

      vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const urlStr = url.toString();
        if (urlStr.includes('/auth/me')) {
          return {
            ok: true,
            json: async () => ({
              uid: 'user-persisted-123',
              display_name: 'Persisted Learner',
              email: 'persisted@adhyayana.org',
              is_anonymous: false,
              stats: { total_xp: 40, word_blanks_cleared: 0, current_streak: 1, max_streak: 1, games_played: 1, games_won: 0 },
            }),
          } as Response;
        }
        if (urlStr.includes('/games/word_blanks/progress')) {
          return {
            ok: true,
            json: async () => mockCloudProgress,
          } as Response;
        }
        return { ok: false, status: 404 } as Response;
      });

      render(
        <MemoryRouter>
          <ThemeProvider>
            <AuthProvider>
              <NavigationProvider>
                <WordBlanksBoard />
              </NavigationProvider>
            </AuthProvider>
          </ThemeProvider>
        </MemoryRouter>
      );

      // Verify Cloud Synced indicator appears
      await waitFor(() => {
        expect(screen.getByText('Cloud Synced')).toBeInTheDocument();
      });

      // Verify remote words were hydrated into sidebar
      await waitFor(() => {
        expect(screen.getByText('2 words discovered')).toBeInTheDocument();
        expect(screen.getByText('BAT')).toBeInTheDocument();
        expect(screen.getByText('CAT')).toBeInTheDocument();
      });
    });
  });
});
