import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export const Footer: React.FC = () => {
  const { isFocusMode } = useNavigation();

  // Suppress footer in Focus Mode to keep complete focus on the puzzle board
  if (isFocusMode) {
    return null;
  }

  return (
    <footer className="w-full border-t border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/80 dark:bg-[#121213]/80 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              <span>Adhyayana</span>
              <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                अध्ययन
              </span>
            </Link>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed">
              Cultivating intuitive language mastery through active recall, semantic proximity vectors, and morphological deduction under the Vicharanashala framework.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Puzzles Catalog</h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link to="/puzzles/word-blanks" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Word Blanks
                </Link>
              </li>
              <li>
                <Link to="/puzzles/contexto" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contexto Vectors
                </Link>
              </li>
              <li>
                <Link to="/puzzles/crossword" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Syntactic Crossword
                </Link>
              </li>
              <li>
                <Link to="/puzzles" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Puzzles →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Social */}
          <div className="space-y-3">
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link to="/leaderboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Multiplayer Battles
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Pedagogical Framework
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/KrishnaG-101/Adhyayana"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Github size={14} /> Open Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>&copy; {new Date().getFullYear()} Adhyayana Platform. Built with educational rigor.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:underline">Privacy Policy</Link>
            <Link to="/about" className="hover:underline">Terms of Service</Link>
            <Link to="/about" className="hover:underline">Vicharanashala</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
