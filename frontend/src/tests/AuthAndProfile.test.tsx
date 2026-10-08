/**
 * Test Suite for Authentication Modal, AuthContext, AvatarDropdown, and ProfilePage.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { ProfilePage } from '@/pages/ProfilePage';
import { UserProfile } from '@/types/user';

// Mock test profile
const TEST_PROFILE: UserProfile = {
  uid: 'test-user-123',
  display_name: 'Priya Verma',
  email: 'priya@adhyayana.org',
  photo_url: null,
  is_anonymous: false,
  created_at: '2026-09-01T12:00:00Z',
  last_active_at: '2026-10-08T12:00:00Z',
  stats: {
    games_played: 15,
    games_won: 12,
    current_streak: 5,
    max_streak: 8,
    total_xp: 340,
    word_blanks_cleared: 10,
  },
  preferences: {
    theme: 'dark',
    sound: true,
  },
};

describe('Phase 4: Authentication, Avatar State & Player Profile', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('AuthModal Component', () => {
    const TestModalTrigger: React.FC = () => {
      const { openAuthModal } = useAuth();
      return (
        <div>
          <button data-testid="open-modal-test-btn" onClick={openAuthModal}>
            Open Modal
          </button>
          <AuthModal />
        </div>
      );
    };

    it('does not render dialog content when closed', () => {
      render(
        <AuthProvider>
          <AuthModal />
        </AuthProvider>
      );
      expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
    });

    it('opens on trigger and supports switching between Sign In and Create Account tabs', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestModalTrigger />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('open-modal-test-btn'));
      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();

      // Switch to Create Account tab
      const registerTab = screen.getByTestId('tab-register');
      await user.click(registerTab);
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
      expect(screen.getByTestId('auth-display-name-input')).toBeInTheDocument();

      // Switch back to Sign In
      const signinTab = screen.getByTestId('tab-signin');
      await user.click(signinTab);
      expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
      expect(screen.queryByTestId('auth-display-name-input')).not.toBeInTheDocument();
    });

    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestModalTrigger />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('open-modal-test-btn'));
      const passInput = screen.getByTestId('auth-password-input');
      expect(passInput).toHaveAttribute('type', 'password');

      const toggleBtn = screen.getByLabelText('Show password');
      await user.click(toggleBtn);
      expect(passInput).toHaveAttribute('type', 'text');

      const hideBtn = screen.getByLabelText('Hide password');
      await user.click(hideBtn);
      expect(passInput).toHaveAttribute('type', 'password');
    });

    it('closes when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestModalTrigger />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('open-modal-test-btn'));
      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();

      await user.click(screen.getByTestId('close-auth-modal-btn'));
      expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
    });

    it('simulates Google authentication and closes modal on success', async () => {
      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestModalTrigger />
        </AuthProvider>
      );

      await user.click(screen.getByTestId('open-modal-test-btn'));
      const googleBtn = screen.getByTestId('google-auth-btn');
      await user.click(googleBtn);

      await waitFor(() => {
        expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('AvatarDropdown State Swapping', () => {
    it('displays Guest Learner CTA for unauthenticated sessions', async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter>
              <AvatarDropdown />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      );

      const trigger = screen.getByTestId('avatar-dropdown-trigger');
      await user.click(trigger);

      expect(screen.getByText('Guest Learner')).toBeInTheDocument();
      expect(screen.getByTestId('open-auth-modal-trigger')).toBeInTheDocument();
    });

    it('displays user profile, streaks, and sign out when session is active', async () => {
      const user = userEvent.setup();

      // Seed authenticated session in localStorage
      localStorage.setItem(
        'adhyayana:auth:session',
        JSON.stringify({
          uid: TEST_PROFILE.uid,
          email: TEST_PROFILE.email,
          displayName: TEST_PROFILE.display_name,
          photoURL: null,
          isAnonymous: false,
        })
      );

      // Mock backend response for /auth/me
      vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        if (url.toString().includes('/auth/me')) {
          return {
            ok: true,
            json: async () => TEST_PROFILE,
          } as Response;
        }
        return { ok: false, status: 404 } as Response;
      });

      render(
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter>
              <AvatarDropdown />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('PV')).toBeInTheDocument();
      });

      const trigger = screen.getByTestId('avatar-dropdown-trigger');
      await user.click(trigger);

      expect(screen.getByText('Priya Verma')).toBeInTheDocument();
      expect(screen.getByText('priya@adhyayana.org')).toBeInTheDocument();
      expect(screen.getByText(/5 streak/i)).toBeInTheDocument();
      expect(screen.getByText(/340 XP/i)).toBeInTheDocument();
      expect(screen.getByTestId('profile-nav-link')).toBeInTheDocument();
      expect(screen.getByTestId('sign-out-btn')).toBeInTheDocument();
    });
  });

  describe('ProfilePage Component', () => {
    it('renders guest banner when player is not authenticated', () => {
      render(
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter>
              <ProfilePage />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      );

      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
      expect(screen.getByTestId('guest-profile-banner')).toBeInTheDocument();
      expect(screen.getByText('Anonymous Guest')).toBeInTheDocument();
    });

    it('renders player statistics cards when authenticated', async () => {
      // Seed session
      localStorage.setItem(
        'adhyayana:auth:session',
        JSON.stringify({
          uid: TEST_PROFILE.uid,
          email: TEST_PROFILE.email,
          displayName: TEST_PROFILE.display_name,
          photoURL: null,
          isAnonymous: false,
        })
      );

      vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        if (url.toString().includes('/auth/me')) {
          return {
            ok: true,
            json: async () => TEST_PROFILE,
          } as Response;
        }
        return { ok: false, status: 404 } as Response;
      });

      render(
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter>
              <ProfilePage />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-display-name')).toHaveTextContent('Priya Verma');
      });

      // Assert stats
      expect(screen.getByTestId('stat-card-streak')).toHaveTextContent('5');
      expect(screen.getByTestId('stat-card-max-streak')).toHaveTextContent('8');
      expect(screen.getByTestId('stat-card-xp')).toHaveTextContent('340');
      expect(screen.getByTestId('stat-card-word-blanks')).toHaveTextContent('10');
      expect(screen.getByTestId('stat-card-games-won')).toHaveTextContent('12');
    });

    it('detects unmigrated guest progress and triggers migration', async () => {
      const user = userEvent.setup();

      // Seed session
      localStorage.setItem(
        'adhyayana:auth:session',
        JSON.stringify({
          uid: TEST_PROFILE.uid,
          email: TEST_PROFILE.email,
          displayName: TEST_PROFILE.display_name,
          photoURL: null,
          isAnonymous: false,
        })
      );

      // Seed unmigrated guest word blanks
      localStorage.setItem(
        'adhyayana:word-blanks:v1:l1:p1:words',
        JSON.stringify([
          { word: 'BAT', xp_awarded: 20 },
          { word: 'CAT', xp_awarded: 20 },
          { word: 'HAT', xp_awarded: 20 },
        ])
      );

      vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        const urlStr = url.toString();
        if (urlStr.includes('/auth/me')) {
          return {
            ok: true,
            json: async () => TEST_PROFILE,
          } as Response;
        }
        if (urlStr.includes('/migrate-guest-data')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              migrated_xp: 60,
              migrated_stages: 1,
              message: 'Successfully transferred 60 XP and 1 cleared stages.',
              updated_profile: {
                ...TEST_PROFILE,
                stats: {
                  ...TEST_PROFILE.stats,
                  total_xp: 400,
                  word_blanks_cleared: 11,
                },
              },
            }),
          } as Response;
        }
        return { ok: false, status: 404 } as Response;
      });

      render(
        <ThemeProvider>
          <AuthProvider>
            <MemoryRouter>
              <ProfilePage />
            </MemoryRouter>
          </AuthProvider>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('guest-migration-banner')).toBeInTheDocument();
      });

      const syncBtn = screen.getByTestId('sync-guest-progress-btn');
      await user.click(syncBtn);

      await waitFor(() => {
        expect(screen.getByText(/Successfully transferred 60 XP/i)).toBeInTheDocument();
      });
    });
  });
});
