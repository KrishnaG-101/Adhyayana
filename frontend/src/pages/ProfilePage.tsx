/**
 * Player Profile & Pedagogical Analytics Page (/profile).
 *
 * Displays player identity, learning statistics, consecutive daily streaks,
 * cumulative XP, and cloud state migration controls.
 */

import React, { useState } from 'react';
import {
  User,
  Flame,
  Zap,
  Trophy,
  CheckCircle2,
  Layers,
  Edit2,
  Check,
  RotateCcw,
  LogIn,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme, Theme } from '@/context/ThemeContext';

export const ProfilePage: React.FC = () => {
  const {
    user,
    isGuest,
    openAuthModal,
    updateProfile,
    migrateGuestProgress,
    hasPendingGuestProgress,
  } = useAuth();

  const { theme, setTheme } = useTheme();

  const [isEditingName, setIsEditingName] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(user?.display_name || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationFeedback, setMigrationFeedback] = useState<string | null>(null);

  const stats = user?.stats || {
    games_played: 0,
    games_won: 0,
    current_streak: 0,
    max_streak: 0,
    total_xp: 0,
    word_blanks_cleared: 0,
  };

  const handleSaveDisplayName = async () => {
    if (!displayNameInput.trim() || displayNameInput.trim().length < 2) return;
    setIsSavingName(true);
    try {
      await updateProfile({ display_name: displayNameInput.trim() });
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationFeedback(null);
    try {
      const res = await migrateGuestProgress();
      if (res && res.success) {
        setMigrationFeedback(res.message);
      }
    } catch {
      setMigrationFeedback('Unable to sync progress at this moment.');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div
      data-testid="profile-page"
      className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8"
    >
      {/* Editorial Page Header */}
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-semibold">
          Learner Dashboard • शिक्षार्थी
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-[#E4E4E7]">
          Player Profile & Lexical Journey
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
          Review your linguistic trajectory, persistent daily streaks, vocabulary milestones, and account preferences.
        </p>
      </div>

      {/* Guest Mode Callout Banner */}
      {isGuest && (
        <div
          data-testid="guest-profile-banner"
          className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base flex items-center gap-2">
              <Sparkles size={18} className="text-amber-600 dark:text-amber-400" />
              Playing under Guest Session
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
              Your session progress and streaks are currently stored locally on this device. Sign in to sync across devices and secure permanent leaderboard standing.
            </p>
          </div>
          <button
            type="button"
            data-testid="guest-signin-btn"
            onClick={openAuthModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs whitespace-nowrap shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <LogIn size={15} />
            <span>Sign In / Create Account</span>
          </button>
        </div>
      )}

      {/* Pending Guest Progress Migration Banner */}
      {(hasPendingGuestProgress || migrationFeedback) && !isGuest && (
        <div
          data-testid="guest-migration-banner"
          className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-950 dark:text-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in"
        >
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base flex items-center gap-2">
              <RotateCcw size={18} className="text-indigo-600 dark:text-indigo-400" />
              {migrationFeedback ? 'Local Progress Synchronized' : 'Unsynchronized Local Progress Found'}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
              {migrationFeedback
                ? 'Your local gameplay records have been successfully merged into your permanent cloud profile.'
                : 'We detected previous puzzle clearance and XP records on this browser. Click sync to permanently credit them to your cloud account.'}
            </p>
            {migrationFeedback && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                ✓ {migrationFeedback}
              </p>
            )}
          </div>
          {!migrationFeedback && (
            <button
              type="button"
              data-testid="sync-guest-progress-btn"
              disabled={isMigrating}
              onClick={handleMigrate}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs whitespace-nowrap shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isMigrating ? 'Syncing...' : 'Sync Local Progress →'}
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Profile Identity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player Identity Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-6">
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#161618] flex items-center justify-center overflow-hidden">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </div>

            {/* Display Name Editor */}
            <div className="space-y-1 w-full flex flex-col items-center">
              {isEditingName ? (
                <div className="flex items-center gap-2 max-w-xs w-full">
                  <input
                    type="text"
                    data-testid="edit-name-input"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    className="flex-1 px-3 py-1 text-xs sm:text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter name"
                  />
                  <button
                    type="button"
                    data-testid="save-name-btn"
                    disabled={isSavingName}
                    onClick={handleSaveDisplayName}
                    className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3
                    data-testid="profile-display-name"
                    className="font-serif font-bold text-xl text-stone-900 dark:text-[#E4E4E7]"
                  >
                    {user?.display_name || 'Guest Learner'}
                  </h3>
                  {!isGuest && (
                    <button
                      type="button"
                      data-testid="edit-name-btn"
                      onClick={() => {
                        setDisplayNameInput(user?.display_name || '');
                        setIsEditingName(true);
                      }}
                      className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
                    >
                      <Edit2 size={13} />
                    </button>
                  )}
                </div>
              )}

              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                {user?.email || 'Local Guest Session'}
              </p>
            </div>
          </div>

          <div className="border-t border-stone-100 dark:border-[#2E2E34] pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
              <span>Account Status</span>
              <span className="font-semibold text-stone-900 dark:text-stone-200">
                {isGuest ? 'Anonymous Guest' : 'Verified Learner'}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
              <span>Cloud Sync</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {isGuest ? 'Local Device' : 'Cloud Synchronized'}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
              <span>Theme Mode</span>
              <span className="font-semibold capitalize text-stone-900 dark:text-stone-200">
                {theme}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Pedagogical Stats Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* 1. Current Streak */}
            <div
              data-testid="stat-card-streak"
              className="p-5 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Flame size={18} />
              </div>
              <div>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Current Streak
                </p>
                <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-[#E4E4E7] mt-0.5">
                  {stats.current_streak} <span className="text-xs font-sans font-normal text-stone-500">days</span>
                </p>
              </div>
            </div>

            {/* 2. Max Streak */}
            <div
              data-testid="stat-card-max-streak"
              className="p-5 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Longest Streak
                </p>
                <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-[#E4E4E7] mt-0.5">
                  {stats.max_streak} <span className="text-xs font-sans font-normal text-stone-500">days</span>
                </p>
              </div>
            </div>

            {/* 3. Total XP */}
            <div
              data-testid="stat-card-xp"
              className="p-5 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Cumulative XP
                </p>
                <p className="font-serif font-bold text-2xl sm:text-3xl text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {stats.total_xp}
                </p>
              </div>
            </div>

            {/* 4. Word Blanks Cleared */}
            <div
              data-testid="stat-card-word-blanks"
              className="p-5 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Blanks Cleared
                </p>
                <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-[#E4E4E7] mt-0.5">
                  {stats.word_blanks_cleared} <span className="text-xs font-sans font-normal text-stone-500">stages</span>
                </p>
              </div>
            </div>

            {/* 5. Games Won */}
            <div
              data-testid="stat-card-games-won"
              className="p-5 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-500/10 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                <Layers size={18} />
              </div>
              <div>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Puzzles Solved
                </p>
                <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-[#E4E4E7] mt-0.5">
                  {stats.games_won}
                </p>
              </div>
            </div>

            {/* 6. Success Rate */}
            <div
              data-testid="stat-card-accuracy"
              className="p-5 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Completion Rate
                </p>
                <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-[#E4E4E7] mt-0.5">
                  {stats.games_played > 0
                    ? `${Math.round((stats.games_won / stats.games_played) * 100)}%`
                    : '100%'}
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-[#E4E4E7]">
              Application Preferences
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-stone-100 dark:border-[#2E2E34]">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-[#E4E4E7]">Interface Theme</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Choose between light, dark, or system mode.</p>
              </div>
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#161618] p-1 rounded-xl border border-stone-200/60 dark:border-[#2E2E34]">
                {(['light', 'system', 'dark'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                      theme === t
                        ? 'bg-white dark:bg-[#28282D] text-stone-900 dark:text-[#E4E4E7] shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#E4E4E7]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-[#E4E4E7]">Interactive Audio</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Sound feedback for letter submission and clearance.</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const newSound = !user?.preferences.sound;
                  await updateProfile({ preferences: { theme: user?.preferences.theme || 'system', sound: newSound } });
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  user?.preferences.sound !== false
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-500'
                }`}
              >
                {user?.preferences.sound !== false ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
