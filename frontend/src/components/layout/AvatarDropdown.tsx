import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Sun, Moon, Monitor, LogIn, Settings, LogOut, Flame, Zap } from 'lucide-react';
import { useTheme, Theme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const AvatarDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isGuest, signOut, openAuthModal } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isUserLoggedIn = !isGuest && user !== null;

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun size={14} /> },
    { id: 'system', label: 'System', icon: <Monitor size={14} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
  ];

  const userInitials = (() => {
    if (!user?.display_name) return 'AL';
    const parts = user.display_name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return user.display_name.slice(0, 2).toUpperCase();
  })();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Avatar */}
      <button
        type="button"
        data-testid="avatar-dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 overflow-hidden cursor-pointer"
      >
        {isUserLoggedIn && user?.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.display_name}
            className="w-full h-full object-cover"
          />
        ) : isUserLoggedIn ? (
          <span className="font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300">
            {userInitials}
          </span>
        ) : (
          <User size={18} aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Floating Card */}
      {isOpen && (
        <div
          data-testid="avatar-dropdown-menu"
          className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#FAF8F5] dark:bg-[#1E1E22] border border-stone-200 dark:border-stone-800 shadow-xl dark:shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {isUserLoggedIn && user ? (
            /* Authenticated User View */
            <div className="space-y-3">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <p className="font-serif font-bold text-stone-900 dark:text-[#E4E4E7] text-sm truncate">
                  {user.display_name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                  {user.email || 'Anonymous Session'}
                </p>

                {/* Quick Stats Micro-Bar */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-200/60 dark:border-[#2E2E34] text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <Flame size={13} /> {user.stats.current_streak} streak
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                    <Zap size={13} /> {user.stats.total_xp} XP
                  </span>
                </div>
              </div>

              <nav className="space-y-1 text-sm">
                <Link
                  to="/profile"
                  data-testid="profile-nav-link"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <User size={16} /> Profile & Stats
                </Link>
                <Link
                  to="/settings"
                  data-testid="settings-nav-link"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Settings size={16} /> Settings
                </Link>
              </nav>

              <div className="border-t border-stone-200 dark:border-stone-800 pt-3">
                <button
                  type="button"
                  data-testid="sign-out-btn"
                  onClick={async () => {
                    setIsOpen(false);
                    await signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-sm font-medium transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Guest User View */
            <div className="space-y-3">
              <div>
                <p className="font-serif font-bold text-stone-900 dark:text-[#E4E4E7] text-base">Guest Learner</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  Sign in to preserve learning streaks and track lexical progression across devices.
                </p>
              </div>

              <button
                type="button"
                data-testid="open-auth-modal-trigger"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <LogIn size={16} /> Sign In / Register
              </button>
            </div>
          )}

          {/* Theme Segmented Switcher */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-3 mt-3">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">Theme Mode</p>
            <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-[#202024] p-1 rounded-xl border border-stone-200/60 dark:border-[#2E2E34]">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-testid={`theme-option-${t.id}`}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg transition-all ${
                    theme === t.id
                      ? 'bg-white dark:bg-[#28282D] text-stone-900 dark:text-[#E4E4E7] shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-[#E4E4E7]'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
