/**
 * Firebase Client SDK & Authentication Infrastructure Provider.
 *
 * Configures Google Cloud Firebase Auth client SDKs for live Google OAuth popup,
 * Email/Password authentication, and user token management. Provides resilient
 * local mock authentication when Firebase environment variables are not populated
 * or when executing offline/automated tests.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

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

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isLiveFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('[Firebase] Client initialization error, falling back to mock provider:', err);
  }
}

/**
 * Maps a Firebase Auth user object to an AuthSessionUser session shape.
 */
export function mapFirebaseUserToSession(fbUser: FirebaseUser): AuthSessionUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    isAnonymous: fbUser.isAnonymous,
  };
}

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
  if (auth?.currentUser && auth.currentUser.uid === user.uid) {
    try {
      return await auth.currentUser.getIdToken();
    } catch (err) {
      console.warn('[Firebase] getIdToken failed, falling back to session token:', err);
    }
  }
  return `mock-token-${user.uid}`;
}

/**
 * Real or simulated Google OAuth popup authentication flow.
 */
export async function signInWithGoogle(): Promise<{ user: AuthSessionUser; token: string }> {
  if (auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const sessionUser = mapFirebaseUserToSession(result.user);
      setStoredSessionUser(sessionUser);
      const token = await result.user.getIdToken();
      return { user: sessionUser, token };
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in cancelled. Please try again.');
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked by browser. Please allow popups for this site.');
      }
      console.warn('[Firebase] Live Google sign-in failed, attempting mock fallback in dev:', err);
      if (import.meta.env.MODE === 'test') {
        return mockSignInWithGoogle();
      }
      throw err;
    }
  }
  return mockSignInWithGoogle();
}

/**
 * Real or simulated Email/Password sign-in flow.
 */
export async function signInWithEmail(
  email: string,
  pass: string
): Promise<{ user: AuthSessionUser; token: string }> {
  if (auth) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const sessionUser = mapFirebaseUserToSession(result.user);
      setStoredSessionUser(sessionUser);
      const token = await result.user.getIdToken();
      return { user: sessionUser, token };
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      if (import.meta.env.MODE === 'test') {
        return mockSignInWithEmail(email, pass);
      }
      throw err;
    }
  }
  return mockSignInWithEmail(email, pass);
}

/**
 * Real or simulated Email/Password account registration flow.
 */
export async function registerWithEmail(
  displayName: string,
  email: string,
  pass: string
): Promise<{ user: AuthSessionUser; token: string }> {
  if (auth) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName.trim()) {
        try {
          await updateFirebaseProfile(result.user, { displayName: displayName.trim() });
        } catch (profileErr) {
          console.warn('[Firebase] Display name update error:', profileErr);
        }
      }
      const sessionUser: AuthSessionUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName.trim() || result.user.displayName,
        photoURL: result.user.photoURL,
        isAnonymous: result.user.isAnonymous,
      };
      setStoredSessionUser(sessionUser);
      const token = await result.user.getIdToken();
      return { user: sessionUser, token };
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists.');
      }
      if (err.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (import.meta.env.MODE === 'test') {
        return mockRegisterWithEmail(displayName, email, pass);
      }
      throw err;
    }
  }
  return mockRegisterWithEmail(displayName, email, pass);
}

/**
 * Real or simulated account sign-out flow.
 */
export async function signOut(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('[Firebase] Sign out error:', err);
    }
  }
  setStoredSessionUser(null);
}

/**
 * Subscribes to Firebase Auth state transitions.
 */
export function subscribeToAuthState(
  callback: (user: AuthSessionUser | null, token: string | null) => void
): () => void {
  if (auth && import.meta.env.MODE !== 'test') {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const sessionUser = mapFirebaseUserToSession(fbUser);
        let token = `mock-token-${fbUser.uid}`;
        try {
          token = await fbUser.getIdToken();
        } catch {
          // Token retrieval failure fallback
        }
        setStoredSessionUser(sessionUser);
        callback(sessionUser, token);
      } else {
        const current = getStoredSessionUser();
        if (!current) {
          callback(null, null);
        }
      }
    });
  }
  return () => {};
}

/**
 * Simulates a Google OAuth popup authentication flow (mock mode).
 */
export async function mockSignInWithGoogle(): Promise<{ user: AuthSessionUser; token: string }> {
  await new Promise((r) => setTimeout(r, 100));

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
 * Simulates an Email/Password sign-in flow (mock mode).
 */
export async function mockSignInWithEmail(
  email: string,
  _pass: string
): Promise<{ user: AuthSessionUser; token: string }> {
  await new Promise((r) => setTimeout(r, 100));

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
 * Simulates an Email/Password account registration flow (mock mode).
 */
export async function mockRegisterWithEmail(
  displayName: string,
  email: string,
  _pass: string
): Promise<{ user: AuthSessionUser; token: string }> {
  await new Promise((r) => setTimeout(r, 100));

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
 * Clears the active authentication session (mock mode).
 */
export async function mockSignOut(): Promise<void> {
  await new Promise((r) => setTimeout(r, 50));
  setStoredSessionUser(null);
}
