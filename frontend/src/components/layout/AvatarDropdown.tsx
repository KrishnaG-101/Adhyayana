import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Sun, Moon, Monitor, LogIn, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme, Theme } from '@/context/ThemeContext';

interface AvatarDropdownProps {
  isAuthenticated?: boolean;
}

export const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ isAuthenticated = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Avatar */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <User size={18} aria-hidden="true" />
      </button>

      {/* Dropdown Floating Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {isAuthenticated ? (
            /* Authenticated User View */
            <div className="space-y-3">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Learner User</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">learner@adhyayana.org</p>
              </div>
              <nav className="space-y-1 text-sm">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Settings size={16} /> Settings
                </Link>
              </nav>
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-sm font-medium transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Guest User View */
            <div className="space-y-3">
              <div>
                <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">Guest Learner</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  Sign in to preserve learning streaks across devices.
                </p>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-sm active:scale-95"
              >
                <LogIn size={16} /> Sign In / Register
              </button>
            </div>
          )}

          {/* Theme Segmented Switcher */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-3 mt-3">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">Theme Mode</p>
            <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg transition-all ${
                    theme === t.id
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
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
