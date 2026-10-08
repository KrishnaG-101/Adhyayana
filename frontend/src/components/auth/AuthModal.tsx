/**
 * Authentication Modal Dialog.
 *
 * Provides tabbed Sign In and Account Registration with Google OAuth
 * and Email/Password options. Adheres strictly to Adhyayana design tokens
 * and accessibility guidelines.
 */

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    isLoading,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    if (isAuthModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    setError(null);
  }, [mode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleGoogleSubmit = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed.';
      setError(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    if (mode === 'register' && !displayName.trim()) {
      setError('Please enter your full name or display alias.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(displayName.trim(), email.trim(), password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setError(msg);
    }
  };

  return (
    <div
      data-testid="auth-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
              Adhyayana • अध्ययन
            </span>
            <h2
              id="auth-modal-title"
              className="font-serif text-2xl font-bold text-stone-900 dark:text-[#E4E4E7] mt-0.5"
            >
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Preserve learning streaks, save lexical progress, and sync across devices.
            </p>
          </div>

          <button
            type="button"
            data-testid="close-auth-modal-btn"
            onClick={closeAuthModal}
            aria-label="Close authentication modal"
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-[#161618] rounded-xl border border-stone-200/60 dark:border-[#2E2E34]">
          <button
            type="button"
            data-testid="tab-signin"
            onClick={() => setMode('signin')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-white dark:bg-[#28282D] text-stone-900 dark:text-[#E4E4E7] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            data-testid="tab-register"
            onClick={() => setMode('register')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-[#28282D] text-stone-900 dark:text-[#E4E4E7] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          data-testid="google-auth-btn"
          disabled={isLoading}
          onClick={handleGoogleSubmit}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white dark:bg-[#161618] hover:bg-stone-50 dark:hover:bg-[#202024] border border-stone-300 dark:border-[#3E3E48] text-stone-700 dark:text-stone-200 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 dark:border-[#2E2E34] w-full" />
          <span className="bg-white dark:bg-[#1E1E22] px-3 text-[11px] font-mono uppercase text-stone-600 dark:text-stone-300 relative">
            or with email
          </span>
        </div>

        {/* Diagnostic Error Banner */}
        {error && (
          <div
            data-testid="auth-error-banner"
            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 animate-in fade-in"
          >
            <AlertCircle size={15} className="text-rose-500 shrink-0 mt-0.5" />
            <span className="flex-1 font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-display-name"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
              >
                Display Name / Learner Alias
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  id="auth-display-name"
                  data-testid="auth-display-name-input"
                  type="text"
                  required
                  placeholder="e.g. Arjun Sharma"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-[#3E3E48] bg-[#FAF8F5] dark:bg-[#161618] text-stone-900 dark:text-[#E4E4E7] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                id="auth-email"
                data-testid="auth-email-input"
                type="email"
                required
                placeholder="learner@adhyayana.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-[#3E3E48] bg-[#FAF8F5] dark:bg-[#161618] text-stone-900 dark:text-[#E4E4E7] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                id="auth-password"
                data-testid="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 rounded-xl border border-stone-300 dark:border-[#3E3E48] bg-[#FAF8F5] dark:bg-[#161618] text-stone-900 dark:text-[#E4E4E7] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            data-testid="auth-submit-btn"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Sign In to Adhyayana' : 'Complete Registration'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
