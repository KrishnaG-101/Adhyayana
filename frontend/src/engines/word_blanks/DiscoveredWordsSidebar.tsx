/**
 * DiscoveredWordsSidebar Component
 * Displays live telemetry of discovered words, parts of speech, Wiktionary definitions, and session XP.
 * The list is scrollable with the first 5 entries comfortably visible.
 */

import React from 'react';
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { DiscoveredWord } from '@/types/wordBlanks';

interface DiscoveredWordsSidebarProps {
  discoveredWords: DiscoveredWord[];
  currentLevel: number;
  minWordsToUnlock: number;
  isNextLevelUnlocked: boolean;
  totalXp: number;
}

export const DiscoveredWordsSidebar: React.FC<DiscoveredWordsSidebarProps> = ({
  discoveredWords,
  currentLevel,
  minWordsToUnlock,
  isNextLevelUnlocked,
  totalXp,
}) => {
  const wordsCount = discoveredWords.length;
  const progressRatio = Math.min(wordsCount / minWordsToUnlock, 1);

  return (
    <aside
      data-testid="discovered-words-sidebar"
      className="w-full lg:w-80 xl:w-96 rounded-3xl bg-white/90 dark:bg-[#1E1E22]/90 border border-stone-200/90 dark:border-[#2E2E34]/90 p-5 shadow-sm flex flex-col gap-4 backdrop-blur-md"
    >
      {/* Sidebar Header & Counters */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#2E2E34] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-[#E4E4E7]">
              Lexicon Recall
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {wordsCount} {wordsCount === 1 ? 'word' : 'words'} discovered
            </p>
          </div>
        </div>

        {/* Live Session XP Badge */}
        <div
          data-testid="total-xp-badge"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-semibold text-xs"
        >
          <Sparkles size={13} className="text-amber-500 animate-pulse" />
          <span>+{totalXp} XP</span>
        </div>
      </div>

      {/* Level Unlock Progress Indicator */}
      <div className="rounded-2xl bg-stone-50 dark:bg-[#161618] border border-stone-200/70 dark:border-[#2E2E34]/70 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
            {isNextLevelUnlocked ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="text-emerald-700 dark:text-emerald-400">
                  Tier Unlocked
                </span>
              </>
            ) : (
              <span>Target to Unlock Level {currentLevel + 1}</span>
            )}
          </span>
          <span className="font-mono text-stone-500 dark:text-stone-400">
            {wordsCount} / {minWordsToUnlock}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isNextLevelUnlocked ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>

      {/* Discovered Words Scrollable List (First 5 visible) */}
      <div className="flex-1">
        <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 px-1">
          Discovered Entries
        </div>

        {discoveredWords.length === 0 ? (
          <div
            data-testid="empty-lexicon-state"
            className="rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 p-6 text-center space-y-2 bg-[#FAF8F5]/50 dark:bg-[#161618]/50"
          >
            <p className="font-serif italic text-sm text-stone-600 dark:text-stone-400">
              "Every word begins with an inquiry."
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500 leading-relaxed">
              Fill in the missing letter tiles and submit to unveil Wiktionary definitions and
              accumulate XP.
            </p>
          </div>
        ) : (
          <div
            data-testid="discovered-words-list"
            className="max-h-[380px] sm:max-h-[440px] overflow-y-auto space-y-2.5 pr-1.5"
          >
            {discoveredWords.map((item, index) => (
              <div
                key={`${item.word}-${index}`}
                data-testid={`word-card-${item.word}`}
                className="group p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#161618] border border-stone-200/80 dark:border-[#2E2E34]/80 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-stone-900 dark:text-[#E4E4E7] tracking-wide">
                      {item.word}
                    </span>
                    {item.part_of_speech && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300/40 dark:border-stone-700/40">
                        {item.part_of_speech}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                    +{item.xp_awarded} XP
                  </span>
                </div>

                {item.definition ? (
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                    {item.definition}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic">
                    Recognized lexical lemma.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
