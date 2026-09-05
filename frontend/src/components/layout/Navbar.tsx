import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, HelpCircle } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { AvatarDropdown } from './AvatarDropdown';

export const Navbar: React.FC = () => {
  const { isFocusMode, activePuzzleTitle, openDrawer, openRulesModal } = useNavigation();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Puzzles', path: '/puzzles' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Community', path: '/community' },
    { label: 'About', path: '/about' },
  ];

  if (isFocusMode) {
    /* =========================================================================
     * PUZZLE FOCUS MODE SHELL NAVBAR
     * ========================================================================= */
    return (
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/60 dark:border-stone-800/60 bg-[#FAF8F5]/80 dark:bg-[#121213]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Hamburger Drawer Trigger */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={openDrawer}
              aria-label="Open navigation drawer"
              className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Center: Active Puzzle Title */}
          <div className="flex-1 text-center px-4">
            <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
              {activePuzzleTitle}
            </h1>
          </div>

          {/* Right: Help Button & Avatar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openRulesModal}
              aria-label="View puzzle rules"
              className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <HelpCircle size={22} />
            </button>
            <AvatarDropdown />
          </div>
        </div>
      </header>
    );
  }

  /* =========================================================================
   * PLATFORM SHELL NAVBAR
   * ========================================================================= */
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/60 dark:border-stone-800/60 bg-[#FAF8F5]/80 dark:bg-[#121213]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 hover:opacity-90 transition-opacity"
          >
            <span>Adhyayana</span>
            <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              अध्ययन
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Streak Counter & Avatar */}
        <div className="flex items-center gap-4">
          {/* Flame Streak Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-sm font-semibold shadow-xs"
            title="Current Daily Streak: 5 Days"
          >
            <Flame size={18} className="fill-amber-500 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>5</span>
          </div>

          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
};
