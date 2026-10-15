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

    it('does not display restored toast when setGlobalConnectionState(true) is invoked while already online', () => {
      render(<ConnectionStatusBanner />);

      // Initially online; invoke setGlobalConnectionState(true)
      act(() => {
        setGlobalConnectionState(true);
      });

      expect(screen.queryByTestId('connection-restored-banner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('connection-lost-banner')).not.toBeInTheDocument();
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

      // Verify remote words were hydrated into sidebar
      await waitFor(() => {
        expect(screen.getByText('2 words discovered')).toBeInTheDocument();
        expect(screen.getByText('BAT')).toBeInTheDocument();
        expect(screen.getByText('CAT')).toBeInTheDocument();
      });
    });

    it('displays 0 discovered words on board for an account with 0 XP without leaking guest localStorage', async () => {
      // Seed guest storage with prior guest words
      localStorage.setItem(
        'adhyayana:guest:word-blanks:v1:l1:p1:words',
        JSON.stringify([
          { word: 'BAT', part_of_speech: 'noun', definition: 'A bat.', xp_awarded: 20, discovered_at: 'now' },
          { word: 'CAT', part_of_speech: 'noun', definition: 'A cat.', xp_awarded: 20, discovered_at: 'now' },
        ])
      );
      // Also seed legacy key to ensure it is strictly ignored
      localStorage.setItem(
        'adhyayana:word-blanks:v1:l1:p1:words',
        JSON.stringify([
          { word: 'LEGACY', part_of_speech: 'noun', definition: 'Legacy.', xp_awarded: 20, discovered_at: 'now' },
        ])
      );

      // Seed authenticated session for a clean 0 XP user
      localStorage.setItem(
        'adhyayana:auth:session',
        JSON.stringify({
          uid: 'user-clean-0xp',
          email: 'fresh@adhyayana.org',
          displayName: 'Fresh Learner',
          photoURL: null,
          isAnonymous: false,
        })
      );

      vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const urlStr = url.toString();
        if (urlStr.includes('/auth/me')) {
          return {
            ok: true,
            json: async () => ({
              uid: 'user-clean-0xp',
              display_name: 'Fresh Learner',
              email: 'fresh@adhyayana.org',
              is_anonymous: false,
              stats: { total_xp: 0, word_blanks_cleared: 0, current_streak: 0, max_streak: 0, games_played: 0, games_won: 0 },
            }),
          } as Response;
        }
        if (urlStr.includes('/games/word_blanks/progress')) {
          return {
            ok: true,
            json: async () => ({
              unlocked_levels: [1],
              cleared_stages: [],
              discovered_words: {},
            }),
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

      // Verify clean board: 0 words, empty lexicon encouragement, no guest leaks
      await waitFor(() => {
        expect(screen.getByTestId('empty-lexicon-state')).toBeInTheDocument();
        expect(screen.getByText('0 / 3')).toBeInTheDocument();
        expect(screen.queryByText('BAT')).not.toBeInTheDocument();
        expect(screen.queryByText('LEGACY')).not.toBeInTheDocument();
      });
    });
  });
});
