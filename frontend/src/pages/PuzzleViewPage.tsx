import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, HelpCircle, ArrowLeft, Award } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { WordBlanksBoard } from '@/engines/word_blanks';

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
    <div className="w-full flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="w-full max-w-6xl space-y-6 mx-auto">
        {/* Breadcrumb / Exit Navigation & Engine Controls */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <Link
            to="/puzzles"
            className="inline-flex items-center gap-1.5 hover:text-stone-800 dark:hover:text-stone-200 transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openRulesModal}
              className="inline-flex items-center gap-1.5 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline">Rules & Mechanics</span>
            </button>
            <span className="font-mono uppercase tracking-wider bg-stone-200/60 dark:bg-[#202024] px-2.5 py-0.5 rounded border border-stone-200 dark:border-[#2E2E34]">
              Engine: {puzzleId}
            </span>
          </div>
        </div>

        {/* Dynamic Engine Mounting */}
        {puzzleId === 'word-blanks' ? (
          <WordBlanksBoard />
        ) : (
          /* Placeholder Card for Unimplemented Engine Slots */
          <div className="p-8 sm:p-12 rounded-3xl bg-white/80 dark:bg-[#202024]/80 border border-stone-200/80 dark:border-[#2E2E34]/80 backdrop-blur-md shadow-sm text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
              <Sparkles size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-[#E4E4E7]">
                {formattedTitle}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                Focus Mode active. Cognitive distractions have been minimized. The modular puzzle engine for{' '}
                <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#161618] font-mono text-xs text-indigo-600 dark:text-indigo-400">
                  frontend/src/engines/{puzzleId}
                </code>{' '}
                will mount into this vertical slice container.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={openRulesModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
              >
                <HelpCircle size={15} />
                <span>Inspect Rules</span>
              </button>
            </div>
          </div>
        )}

        {/* Focus Mode Telemetry Footer */}
        <div className="flex items-center justify-between px-2 pt-4 border-t border-stone-200/40 dark:border-stone-800/40 text-xs text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Distraction-Free Focus Shell Active
          </span>
          <span className="flex items-center gap-1">
            <Award size={13} className="text-amber-500" />
            Vicharanashala Telemetry Live
          </span>
        </div>
      </div>
    </div>
  );
};
