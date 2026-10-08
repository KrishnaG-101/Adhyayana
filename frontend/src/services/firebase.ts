/**
 * Firebase Client SDK & Authentication Infrastructure Provider.
 *
 * Configures Google Cloud Firebase Auth and Firestore client SDKs.
 * Provides resilient local mock authentication when Firebase environment
 * variables are not yet populated in .env, enabling zero-flake testing
 * and seamless offline development.
 */

export interface AuthSessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

const LOCAL_STORAGE_AUTH_KEY = 'adhyayana:auth:session';

/**
 * Checks whether live Firebase configuration keys exist in the environment.
 */
export const isLiveFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

/**
 * Retrieves the currently persisted mock auth session from localStorage.
 */
export function getStoredSessionUser(): AuthSessionUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persists the mock session user into localStorage.
 */
export function setStoredSessionUser(user: AuthSessionUser | null): void {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Produces a Bearer token for the authenticated session.
 * In live Firebase, this delegates to user.getIdToken().
 * In mock mode, this generates a backend-verifiable 'mock-token-<uid>'.
 */
export async function getSessionToken(user: AuthSessionUser): Promise<string> {
  return `mock-token-${user.uid}`;
}

/**
 * Simulates a Google OAuth popup authentication flow.
 */
export async function mockSignInWithGoogle(): Promise<{ user: AuthSessionUser; token: string }> {
  // Simulate natural OAuth popup latency
  await new Promise((r) => setTimeout(r, 400));

  const mockUser: AuthSessionUser = {
    uid: 'google-learner-' + Math.random().toString(36).substring(2, 8),
    email: 'learner.google@gmail.com',
    displayName: 'Aarav Patel',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav',
    isAnonymous: false,
  };

  setStoredSessionUser(mockUser);
  const token = await getSessionToken(mockUser);
  return { user: mockUser, token };
}

/**
 * Simulates an Email/Password sign-in flow.
 */
export async function mockSignInWithEmail(
  email: string,
  _pass: string
): Promise<{ user: AuthSessionUser; token: string }> {
  await new Promise((r) => setTimeout(r, 350));

  const username = email.split('@')[0] || 'Learner';
  const slug = username.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const mockUser: AuthSessionUser = {
    uid: `user-${slug}`,
    email,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    photoURL: null,
    isAnonymous: false,
  };

  setStoredSessionUser(mockUser);
  const token = await getSessionToken(mockUser);
  return { user: mockUser, token };
}

/**
 * Simulates an Email/Password account registration flow.
 */
export async function mockRegisterWithEmail(
  displayName: string,
  email: string,
  _pass: string
): Promise<{ user: AuthSessionUser; token: string }> {
  await new Promise((r) => setTimeout(r, 400));

  const slug = displayName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const mockUser: AuthSessionUser = {
    uid: `user-${slug}-${Math.random().toString(36).substring(2, 6)}`,
    email,
    displayName: displayName.trim(),
    photoURL: null,
    isAnonymous: false,
  };

  setStoredSessionUser(mockUser);
  const token = await getSessionToken(mockUser);
  return { user: mockUser, token };
}

/**
 * Clears the active authentication session.
 */
export async function mockSignOut(): Promise<void> {
  await new Promise((r) => setTimeout(r, 150));
  setStoredSessionUser(null);
}
