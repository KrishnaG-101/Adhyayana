import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, HelpCircle, ArrowLeft, RotateCcw, Award } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const PUZZLE_TITLES: Record<string, string> = {
  'word-blanks': 'Word Blanks',
  'crossword': 'Cryptic Crossword Daily',
  'spelling-bee': 'Lexical Honeycomb',
  'word-chain': 'Semantic Word Chain',
  'etymology-tree': 'Morphological Root Tree',
  'context-clues': 'Contextual Semantic Clues',
};

export const PuzzleViewPage: React.FC = () => {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const { setPuzzleTitle, openRulesModal } = useNavigation();

  const formattedTitle = puzzleId
    ? PUZZLE_TITLES[puzzleId] ||
      puzzleId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Linguistic Puzzle';

  // Reactively synchronize navigation title with current puzzle
  useEffect(() => {
    setPuzzleTitle(formattedTitle);
  }, [formattedTitle, setPuzzleTitle]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Breadcrumb / Exit Navigation */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <Link
            to="/puzzles"
            className="inline-flex items-center gap-1 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </Link>
          <span className="font-mono uppercase tracking-wider bg-stone-200/60 dark:bg-stone-800/60 px-2 py-0.5 rounded">
            Engine Slot: {puzzleId}
          </span>
        </div>

        {/* Engine Mount Placeholder Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
            <Sparkles size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {formattedTitle}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
              Focus Mode active. Cognitive distractions have been minimized. The modular puzzle engine for{' '}
              <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                frontend/src/engines/{puzzleId}
              </code>{' '}
              will mount into this vertical slice container.
            </p>
          </div>

          {/* Simulated Puzzle Board Mockup */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#121213] border border-stone-200/60 dark:border-stone-800/60 space-y-4">
            <div className="text-xs uppercase font-mono tracking-widest text-stone-400">
              Active Challenge: Session Alpha-1
            </div>

            <div className="flex items-center justify-center gap-2">
              {['A', 'D', 'H', 'Y', 'A', 'Y', 'A', 'N', 'A'].map((letter, index) => (
                <div
                  key={index}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 flex items-center justify-center font-mono font-bold text-base sm:text-lg text-stone-800 dark:text-stone-200 shadow-sm"
                >
                  {letter}
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 italic">
              "Dedicated contemplative learning through linguistic precision."
            </p>
          </div>

          {/* Interactive Shell Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={openRulesModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              <HelpCircle size={15} />
              <span>Inspect Rules & Pedagogical Mechanics</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Engine state reset simulated.')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-semibold transition-colors"
            >
              <RotateCcw size={15} />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Focus Mode Indicator */}
        <div className="flex items-center justify-between px-2 text-xs text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Distraction-Free Focus Shell Active
          </span>
          <span className="flex items-center gap-1">
            <Award size={13} className="text-amber-500" />
            Vicharanashala Telemetry Ready
          </span>
        </div>
      </div>
    </div>
  );
};
