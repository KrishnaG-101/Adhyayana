import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, Home, Grid, Trophy, Users, Info } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export const HamburgerDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useNavigation();
  const [isPuzzlesExpanded, setIsPuzzlesExpanded] = useState(true);
  const location = useLocation();

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const puzzleSubRoutes = [
    { title: 'Word Blanks', path: '/puzzles/word-blanks', description: 'Active recall cloze puzzle' },
    { title: 'Contexto', path: '/puzzles/contexto', description: 'Semantic proximity vectors' },
    { title: 'Crossword', path: '/puzzles/crossword', description: 'Contextual lexical matrix' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation Drawer">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-full glass-drawer flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between">
          <Link
            to="/"
            onClick={closeDrawer}
            className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
          >
            Adhyayana
          </Link>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close drawer"
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Links */}
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={closeDrawer}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <Home size={18} /> Home
            </Link>

            {/* Puzzles Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setIsPuzzlesExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Grid size={18} />
                  <span>Puzzles</span>
                </div>
                {isPuzzlesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isPuzzlesExpanded && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <Link
                    to="/puzzles"
                    onClick={closeDrawer}
                    className="block px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
                  >
                    Browse All Catalog →
                  </Link>
                  {puzzleSubRoutes.map((p) => (
                    <Link
                      key={p.path}
                      to={p.path}
                      onClick={closeDrawer}
                      className={`block px-3 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname === p.path
                          ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/40'
                      }`}
                    >
                      <div className="font-medium text-stone-800 dark:text-stone-200">{p.title}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{p.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/leaderboard"
              onClick={closeDrawer}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/leaderboard'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <Trophy size={18} /> Leaderboard
            </Link>

            <Link
              to="/community"
              onClick={closeDrawer}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/community'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <Users size={18} /> Community
            </Link>

            <Link
              to="/about"
              onClick={closeDrawer}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <Info size={18} /> About Adhyayana
            </Link>
          </nav>
        </div>

        {/* Drawer Footer Links */}
        <div className="p-4 border-t border-stone-200/80 dark:border-stone-800/80 text-xs text-stone-500 dark:text-stone-400 space-y-2">
          <div className="flex items-center gap-4">
            <Link to="/about" onClick={closeDrawer} className="hover:underline">
              Methodology
            </Link>
            <Link to="/about" onClick={closeDrawer} className="hover:underline">
              Privacy
            </Link>
            <Link to="/about" onClick={closeDrawer} className="hover:underline">
              Terms
            </Link>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Adhyayana (अध्ययन) &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};
