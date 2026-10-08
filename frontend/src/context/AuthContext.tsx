/**
 * Reactive Authentication & User Persistence Context.
 *
 * Manages authenticated user identity, guest sessions, token lifecycle,
 * modal triggers, and automatic migration of local guest gameplay progress.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UpdateProfileRequest,
  GuestMigrationRequest,
  GuestMigrationResponse,
} from '@/types/user';
import {
  getStoredSessionUser,
  setStoredSessionUser,
  getSessionToken,
  mockSignInWithGoogle,
  mockSignInWithEmail,
  mockRegisterWithEmail,
  mockSignOut,
  AuthSessionUser,
} from '@/services/firebase';
import { fetchMyProfile, updateMyProfile, migrateGuestData } from '@/services/authApi';

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isGuest: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: UpdateProfileRequest) => Promise<UserProfile>;
  migrateGuestProgress: () => Promise<GuestMigrationResponse | null>;
  hasPendingGuestProgress: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const GUEST_MIGRATED_FLAG = 'adhyayana:auth:guest_migrated';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  // Hydrate user profile from backend or construct resilient fallback
  const syncProfileWithToken = useCallback(async (sessionUser: AuthSessionUser, authToken: string) => {
    try {
      const profile = await fetchMyProfile(authToken);
      setUser(profile);
    } catch {
      // Offline fallback: construct valid UserProfile conforming to type contract
      const fallbackProfile: UserProfile = {
        uid: sessionUser.uid,
        display_name: sessionUser.displayName || 'Learner',
        email: sessionUser.email,
        photo_url: sessionUser.photoURL,
        is_anonymous: sessionUser.isAnonymous,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        stats: {
          games_played: 0,
          games_won: 0,
          current_streak: 0,
          max_streak: 0,
          total_xp: 0,
          word_blanks_cleared: 0,
        },
        preferences: {
          theme: 'system',
          sound: true,
        },
      };
      setUser(fallbackProfile);
    }
  }, []);

  // Restore session from localStorage on initial render
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = getStoredSessionUser();
        if (stored) {
          const storedToken = await getSessionToken(stored);
          setToken(storedToken);
          await syncProfileWithToken(stored, storedToken);
        }
      } catch (err) {
        console.error('[AuthContext] Session hydration error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [syncProfileWithToken]);

  // Inspect localStorage to see if guest has unmigrated puzzle progress
  const checkPendingGuestProgress = useCallback((): boolean => {
    if (localStorage.getItem(GUEST_MIGRATED_FLAG) === 'true') {
      return false;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('adhyayana:word-blanks:v1:l') && key.endsWith(':words')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(parsed) && parsed.length > 0) {
            return true;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
    return false;
  }, []);

  const hasPendingGuestProgress = Boolean(user && !user.is_anonymous && checkPendingGuestProgress());

  // Migrate guest localStorage data into Firestore profile
  const migrateGuestProgress = useCallback(async (): Promise<GuestMigrationResponse | null> => {
    if (!token || !user) return null;

    let totalXp = 0;
    let clearedCount = 0;
    const discoveredWords: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('adhyayana:word-blanks:v1:l') && key.endsWith(':words')) {
        try {
          const words = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(words)) {
            words.forEach((w: { word?: string; xp_awarded?: number }) => {
              if (w.word) discoveredWords.push(w.word);
              if (typeof w.xp_awarded === 'number') totalXp += w.xp_awarded;
            });
            if (words.length >= 3) {
              clearedCount++;
            }
          }
        } catch {
          // Ignore parse error
        }
      }
    }

    if (totalXp === 0 && clearedCount === 0) {
      localStorage.setItem(GUEST_MIGRATED_FLAG, 'true');
      return null;
    }

    const payload: GuestMigrationRequest = {
      total_xp: totalXp,
      current_streak: clearedCount > 0 ? 1 : 0,
      cleared_stages_count: clearedCount,
      discovered_words_summary: discoveredWords.slice(0, 50),
    };

    try {
      const result = await migrateGuestData(token, payload);
      setUser(result.updated_profile);
      localStorage.setItem(GUEST_MIGRATED_FLAG, 'true');
      return result;
    } catch (err) {
      console.warn('[AuthContext] Guest migration failed:', err);
      // Fallback: update local state directly
      const updatedUser: UserProfile = {
        ...user,
        stats: {
          ...user.stats,
          total_xp: user.stats.total_xp + totalXp,
          word_blanks_cleared: user.stats.word_blanks_cleared + clearedCount,
          games_won: user.stats.games_won + clearedCount,
          games_played: user.stats.games_played + clearedCount,
          current_streak: Math.max(user.stats.current_streak, payload.current_streak),
        },
      };
      setUser(updatedUser);
      localStorage.setItem(GUEST_MIGRATED_FLAG, 'true');
      return {
        success: true,
        migrated_xp: totalXp,
        migrated_stages: clearedCount,
        message: 'Progress synchronized locally.',
        updated_profile: updatedUser,
      };
    }
  }, [token, user]);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const { user: sessionUser, token: authToken } = await mockSignInWithGoogle();
      setStoredSessionUser(sessionUser);
      setToken(authToken);
      await syncProfileWithToken(sessionUser, authToken);
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  }, [closeAuthModal, syncProfileWithToken]);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { user: sessionUser, token: authToken } = await mockSignInWithEmail(email, pass);
      setStoredSessionUser(sessionUser);
      setToken(authToken);
      await syncProfileWithToken(sessionUser, authToken);
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  }, [closeAuthModal, syncProfileWithToken]);

  const registerWithEmail = useCallback(async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { user: sessionUser, token: authToken } = await mockRegisterWithEmail(name, email, pass);
      setStoredSessionUser(sessionUser);
      setToken(authToken);
      await syncProfileWithToken(sessionUser, authToken);
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  }, [closeAuthModal, syncProfileWithToken]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await mockSignOut();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: UpdateProfileRequest): Promise<UserProfile> => {
    if (!token || !user) {
      throw new Error('User not authenticated.');
    }
    try {
      const updated = await updateMyProfile(token, updates);
      setUser(updated);
      return updated;
    } catch {
      // Fallback local update
      const fallbackUpdated: UserProfile = {
        ...user,
        display_name: updates.display_name ?? user.display_name,
        photo_url: updates.photo_url !== undefined ? updates.photo_url : user.photo_url,
        preferences: {
          ...user.preferences,
          ...(updates.preferences || {}),
        },
      };
      setUser(fallbackUpdated);
      return fallbackUpdated;
    }
  }, [token, user]);

  const isGuest = user === null || user.is_anonymous;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isGuest,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        signOut,
        updateProfile,
        migrateGuestProgress,
        hasPendingGuestProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const DEFAULT_AUTH_VALUE: AuthContextValue = {
  user: null,
  token: null,
  isLoading: false,
  isGuest: true,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  signOut: async () => {},
  updateProfile: async () => ({} as UserProfile),
  migrateGuestProgress: async () => null,
  hasPendingGuestProgress: false,
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  return context ?? DEFAULT_AUTH_VALUE;
};
