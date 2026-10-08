/**
 * WordBlanksBoard Engine Canvas
 * Main container for the Word Blanks modular puzzle engine.
 * Orchestrates 17-level curriculum, sequential puzzle gating, full-level unlocking,
 * tactile tile inputs, and strict adherence to the Adhyayana design tokens.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Layers,
  ChevronLeft,
  ChevronRight,
  Grid,
  X,
  Compass,
  HelpCircle,
} from 'lucide-react';
import { NavigationContext } from '@/context/NavigationContext';
import {
  DiscoveredWord,
  WordBlanksLevel,
  WordBlanksPuzzle,
} from '@/types/wordBlanks';
import {
  CLIENT_WORD_BLANKS_LEVELS,
  evaluateWordBlanksGuess,
  fetchWordBlanksLevels,
  getStoredDiscoveredWords,
  saveStoredDiscoveredWords,
  getClearedPuzzlesCount,
} from '@/services/wordBlanksApi';
import { LetterTileInput } from './LetterTileInput';
import { DiscoveredWordsSidebar } from './DiscoveredWordsSidebar';

interface FeedbackState {
  type: 'success' | 'duplicate' | 'error' | 'info';
  message: string;
}

export const WordBlanksBoard: React.FC = () => {
  const navContext = React.useContext(NavigationContext);
  const openRulesModal = navContext?.openRulesModal || (() => {});
  const [levels, setLevels] = useState<WordBlanksLevel[]>(CLIENT_WORD_BLANKS_LEVELS);
  const [activeLevelIdx, setActiveLevelIdx] = useState<number>(1);
  const [activePuzzleNum, setActivePuzzleNum] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [resetSignal, setResetSignal] = useState<number>(0);
  const [showQuickJump, setShowQuickJump] = useState<boolean>(false);

  // Horizontal scroll container reference for level tabs
  const levelScrollRef = useRef<HTMLDivElement>(null);

  // In-memory cache of discovered words keyed by `level:puzzle`
  const [discoveredMap, setDiscoveredMap] = useState<Record<string, DiscoveredWord[]>>(() => {
    const initial: Record<string, DiscoveredWord[]> = {};
    initial['1:1'] = getStoredDiscoveredWords(1, 1);
    return initial;
  });

  // Track cache version to trigger re-renders when words are updated
  const [cacheVersion, setCacheVersion] = useState<number>(0);

  // Fetch remote level configurations on mount
  useEffect(() => {
    let isMounted = true;
    fetchWordBlanksLevels().then((fetched) => {
      if (isMounted && fetched.length > 0) {
        setLevels(fetched);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Active level model
  const activeLevel: WordBlanksLevel = useMemo(() => {
    return levels.find((l) => l.level === activeLevelIdx) || levels[0] || CLIENT_WORD_BLANKS_LEVELS[0];
  }, [levels, activeLevelIdx]);

  // Total puzzles in current level
  const totalPuzzlesInLevel = activeLevel.puzzles?.length || 1;

  // Active puzzle model
  const activePuzzle: WordBlanksPuzzle = useMemo(() => {
    if (activeLevel.puzzles && activeLevel.puzzles.length > 0) {
      const found = activeLevel.puzzles.find((p) => p.puzzle_number === activePuzzleNum);
      if (found) return found;
      if (activePuzzleNum <= activeLevel.puzzles.length) {
        return activeLevel.puzzles[activePuzzleNum - 1];
      }
      return activeLevel.puzzles[0];
    }
    return {
      id: `wb-l${activeLevelIdx}-p1`,
      puzzle_number: 1,
      stem: activeLevel.stem || '_ A T',
      word_length: activeLevel.word_length || 3,
      blank_count: activeLevel.blank_count || 1,
      min_words_to_clear: activeLevel.min_words_to_unlock || 3,
      pedagogical_note: activeLevel.description,
    };
  }, [activeLevel, activeLevelIdx, activePuzzleNum]);

  // Load words for active level & puzzle on switch
  const activeCacheKey = `${activeLevelIdx}:${activePuzzleNum}`;
  const activeDiscovered: DiscoveredWord[] = useMemo(() => {
    if (discoveredMap[activeCacheKey] !== undefined) {
      return discoveredMap[activeCacheKey];
    }
    return getStoredDiscoveredWords(activeLevelIdx, activePuzzleNum);
  }, [discoveredMap, activeCacheKey, activeLevelIdx, activePuzzleNum, cacheVersion]);

  // Ensure current puzzle words are in memory state
  useEffect(() => {
    if (discoveredMap[activeCacheKey] === undefined) {
      const stored = getStoredDiscoveredWords(activeLevelIdx, activePuzzleNum);
      setDiscoveredMap((prev) => ({
        ...prev,
        [activeCacheKey]: stored,
      }));
    }
  }, [activeCacheKey, activeLevelIdx, activePuzzleNum, discoveredMap]);

  // Minimum words required to clear the current puzzle
  const minWordsToClearCurrent = activePuzzle.min_words_to_clear || 3;
  const isCurrentPuzzleCleared = activeDiscovered.length >= minWordsToClearCurrent;

  // Check if a specific puzzle within the active level is unlocked
  const isPuzzleUnlocked = (pNum: number): boolean => {
    if (pNum === 1) return true;
    const prevWords = getStoredDiscoveredWords(activeLevelIdx, pNum - 1);
    return prevWords.length >= 3;
  };

  // Check if user can advance to next puzzle
  const canGoNext =
    activePuzzleNum < totalPuzzlesInLevel &&
    (isCurrentPuzzleCleared || isPuzzleUnlocked(activePuzzleNum + 1));

  // Count cleared puzzles in active level
  const clearedPuzzlesInActiveLevel = useMemo(() => {
    return getClearedPuzzlesCount(activeLevelIdx, totalPuzzlesInLevel, 3);
  }, [activeLevelIdx, totalPuzzlesInLevel, cacheVersion]);

  // Level unlock calculation: Level 1 always unlocked; Level N unlocked IF AND ONLY IF all puzzles of Level N-1 are cleared
  const isLevelUnlocked = (lvlNum: number): boolean => {
    if (lvlNum === 1) return true;
    const prevLvl = levels.find((l) => l.level === lvlNum - 1);
    if (!prevLvl) return false;
    const prevTotal = prevLvl.puzzles?.length || 30;
    const prevCleared = getClearedPuzzlesCount(prevLvl.level, prevTotal, 3);
    return prevCleared >= prevTotal;
  };

  // Cumulative session XP across all levels and puzzles
  const totalSessionXp = useMemo(() => {
    let xp = 0;
    levels.forEach((lvl) => {
      const pCount = lvl.puzzles?.length || 30;
      for (let p = 1; p <= pCount; p++) {
        const key = `${lvl.level}:${p}`;
        const words = discoveredMap[key] || getStoredDiscoveredWords(lvl.level, p);
        words.forEach((w) => {
          xp += w.xp_awarded;
        });
      }
    });
    return xp;
  }, [levels, discoveredMap, cacheVersion]);

  // Level completion milestone: Unlocks next level tier only when ALL puzzles in the current level are cleared!
  const hasAchievedNextUnlock =
    totalPuzzlesInLevel > 0 && clearedPuzzlesInActiveLevel >= totalPuzzlesInLevel;

  // Horizontal scroll buttons handler
  const handleScrollLevels = (direction: 'left' | 'right') => {
    if (levelScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      levelScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Stepper Handlers
  const handlePrevPuzzle = () => {
    if (activePuzzleNum > 1) {
      setActivePuzzleNum((prev) => prev - 1);
      setFeedback(null);
      setResetSignal((s) => s + 1);
    }
  };

  const handleNextPuzzle = () => {
    if (canGoNext) {
      setActivePuzzleNum((prev) => prev + 1);
      setFeedback(null);
      setResetSignal((s) => s + 1);
    }
  };

  const handleJumpToPuzzle = (puzzleNum: number) => {
    if (!isPuzzleUnlocked(puzzleNum)) return;
    setActivePuzzleNum(puzzleNum);
    setShowQuickJump(false);
    setFeedback(null);
    setResetSignal((s) => s + 1);
  };

  const handleGuessSubmit = async (formedWord: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await evaluateWordBlanksGuess({
        level: activeLevelIdx,
        puzzle_number: activePuzzleNum,
        entered_word: formedWord,
        session_discovered: activeDiscovered.map((d) => d.word),
      });

      if (response.is_valid && !response.is_duplicate && response.discovered_word) {
        // Successful new valid word
        const updated = [response.discovered_word, ...activeDiscovered];
        setDiscoveredMap((prev) => ({
          ...prev,
          [activeCacheKey]: updated,
        }));
        saveStoredDiscoveredWords(activeLevelIdx, updated, activePuzzleNum);
        setCacheVersion((v) => v + 1);

        setFeedback({
          type: 'success',
          message: response.feedback_message,
        });
        // Clear blank inputs on success
        setResetSignal((prev) => prev + 1);
      } else if (response.is_duplicate) {
        setFeedback({
          type: 'duplicate',
          message: response.feedback_message,
        });
      } else {
        setFeedback({
          type: 'error',
          message: response.feedback_message,
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network verification failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="word-blanks-board"
      className="w-full flex flex-col gap-6 max-w-6xl mx-auto"
    >
      {/* Level Selector Bar with Sleek Scroll and Navigation Controls */}
      <div className="w-full bg-white dark:bg-[#202024] border border-stone-200 dark:border-[#2E2E34] rounded-2xl p-2 shadow-xs">
        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScrollLevels('left')}
            className="hidden sm:inline-flex shrink-0 p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-[#E4E4E7] hover:bg-stone-100 dark:hover:bg-[#28282D] transition-colors cursor-pointer"
            aria-label="Scroll levels left"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={levelScrollRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {levels.map((lvl) => {
              const unlocked = isLevelUnlocked(lvl.level);
              const isActive = lvl.level === activeLevelIdx;
              const totalInLevel = lvl.puzzles?.length || 30;
              const clearedCount = getClearedPuzzlesCount(lvl.level, totalInLevel, 3);
              const isCompleted = clearedCount >= totalInLevel;

              return (
                <button
                  key={`level-tab-${lvl.level}`}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => {
                    if (unlocked) {
                      setActiveLevelIdx(lvl.level);
                      setActivePuzzleNum(1);
                      setFeedback(null);
                      setResetSignal((s) => s + 1);
                    }
                  }}
                  data-testid={`level-selector-btn-${lvl.level}`}
                  className={`min-w-[130px] sm:min-w-[145px] shrink-0 px-3 py-2.5 rounded-xl text-left transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/30'
                      : unlocked
                        ? 'bg-stone-100/90 dark:bg-[#1E1E22] hover:bg-stone-200/80 dark:hover:bg-[#28282D] text-stone-800 dark:text-[#E4E4E7] border border-stone-200/80 dark:border-[#2E2E34]'
                        : 'bg-stone-100/40 dark:bg-[#161618]/40 text-stone-400 dark:text-stone-600 opacity-60 border border-stone-200/30 dark:border-[#2E2E34]/30 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
                        isActive
                          ? 'text-indigo-100'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      Level {lvl.level}
                    </span>
                    {!unlocked && <Lock size={12} className="text-stone-400" />}
                    {unlocked && isCompleted && (
                      <CheckCircle2
                        size={12}
                        className={isActive ? 'text-indigo-200' : 'text-emerald-500'}
                      />
                    )}
                  </div>
                  <div className="font-serif font-bold text-xs sm:text-sm tracking-wide truncate">
                    {lvl.title || lvl.stem}
                  </div>
                  <div
                    className={`flex items-center justify-between text-[10px] mt-1 font-mono ${
                      isActive ? 'text-indigo-100' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    <span>+{lvl.xp_per_word} XP</span>
                    <span>{clearedCount}/{totalInLevel} clr</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleScrollLevels('right')}
            className="hidden sm:inline-flex shrink-0 p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-[#E4E4E7] hover:bg-stone-100 dark:hover:bg-[#28282D] transition-colors cursor-pointer"
            aria-label="Scroll levels right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Dual-Column Canvas */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8">
        {/* Left Column: Game Canvas */}
        <div className="flex-1 w-full space-y-5">
          {/* Active Level Header & Pedagogical Prompt */}
          <div className="rounded-3xl bg-white dark:bg-[#202024] border border-stone-200 dark:border-[#2E2E34] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-mono uppercase tracking-wider font-semibold">
                  {activeLevel.difficulty}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  {activePuzzle.blank_count} {activePuzzle.blank_count === 1 ? 'blank' : 'blanks'} • {activePuzzle.word_length} letters
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openRulesModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300/80 dark:border-[#3E3E48] hover:bg-stone-100 dark:hover:bg-[#28282D] text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                  title="View rules and illustrative examples"
                >
                  <HelpCircle size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span>How to Play</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500 dark:text-stone-400">
                  <Layers size={13} />
                  <span>
                    {clearedPuzzlesInActiveLevel}/{totalPuzzlesInLevel} to unlock Level {activeLevelIdx + 1}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                <Compass size={13} />
                <span>Level {activeLevelIdx}: {activeLevel.title || 'Generative Word Blanks'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#E4E4E7]">
                Stem Pattern: <span className="text-indigo-600 dark:text-indigo-400">{activePuzzle.stem}</span>
              </h2>
              {/* Objective prompt without candidate answer spoilers */}
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
                {activePuzzle.pedagogical_note || activeLevel.description}
              </p>
            </div>

            {/* Dynamic Stepper Bar (Prev, Stage Info, Quick-Jump, Next) */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#161618] border border-stone-200 dark:border-[#2E2E34]">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  data-testid="prev-puzzle-btn"
                  disabled={activePuzzleNum <= 1}
                  onClick={handlePrevPuzzle}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    activePuzzleNum <= 1
                      ? 'opacity-40 cursor-not-allowed text-stone-400 dark:text-stone-600 bg-stone-200/40 dark:bg-stone-800/40'
                      : 'bg-white dark:bg-[#202024] hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-[#3E3E48] cursor-pointer shadow-xs'
                  }`}
                >
                  <ChevronLeft size={15} />
                  <span>Prev</span>
                </button>

                <div
                  data-testid="puzzle-stepper-info"
                  className="flex items-center gap-2 text-xs font-mono"
                >
                  <span className="font-bold text-stone-800 dark:text-[#E4E4E7]">
                    Puzzle {activePuzzleNum} of {totalPuzzlesInLevel}
                  </span>
                  {isCurrentPuzzleCleared ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                      <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                      ✓ Cleared ({activeDiscovered.length}/{minWordsToClearCurrent})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 dark:bg-[#202024] text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-[#3E3E48]">
                      {activeDiscovered.length}/{minWordsToClearCurrent} words
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  data-testid="quick-jump-btn"
                  onClick={() => setShowQuickJump(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-[#3E3E48] hover:bg-stone-100 dark:hover:bg-[#28282D] text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Grid size={13} />
                  <span>All Puzzles ({clearedPuzzlesInActiveLevel}/{totalPuzzlesInLevel})</span>
                </button>

                <button
                  type="button"
                  data-testid="next-puzzle-btn"
                  disabled={!canGoNext}
                  onClick={handleNextPuzzle}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    !canGoNext
                      ? 'opacity-40 cursor-not-allowed text-stone-400 dark:text-stone-600 bg-stone-200/40 dark:bg-stone-800/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white cursor-pointer shadow-xs'
                  }`}
                  title={
                    !canGoNext && activePuzzleNum < totalPuzzlesInLevel
                      ? `Find at least ${minWordsToClearCurrent} words to unlock next puzzle`
                      : ''
                  }
                >
                  <span>Next</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Interactive Letter Tiles Grid */}
            <div className="pt-2 pb-2 border-t border-stone-100 dark:border-[#2E2E34]">
              <LetterTileInput
                stem={activePuzzle.stem}
                onSubmit={handleGuessSubmit}
                isLoading={isSubmitting}
                resetSignal={resetSignal}
              />
            </div>
          </div>

          {/* Real-time Feedback Banner */}
          {feedback && (
            <div
              data-testid="evaluation-feedback-banner"
              className={`p-4 rounded-2xl border text-sm flex items-start gap-3 transition-all animate-in fade-in duration-200 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : feedback.type === 'duplicate'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : feedback.type === 'duplicate' ? (
                <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium leading-snug">
                {feedback.message}
              </div>
            </div>
          )}

          {/* Level Unlock Celebration Milestone Banner (Only appears when ALL puzzles in level are completed!) */}
          {hasAchievedNextUnlock && activeLevelIdx < levels.length && (
            <div
              data-testid="unlock-celebration-banner"
              className="p-5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/30 border border-indigo-500/30 text-indigo-950 dark:text-indigo-200 flex items-center justify-between gap-4 animate-in fade-in duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base">
                    Level {activeLevelIdx + 1} Unlocked!
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Magnificent! You have cleared all {totalPuzzlesInLevel} puzzles in Level {activeLevelIdx}. You can now advance to Level {activeLevelIdx + 1}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveLevelIdx(activeLevelIdx + 1);
                  setActivePuzzleNum(1);
                  setFeedback(null);
                  setResetSignal((s) => s + 1);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs whitespace-nowrap shadow-sm transition-colors cursor-pointer"
              >
                Advance to Level {activeLevelIdx + 1} →
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Telemetry Sidebar */}
        <DiscoveredWordsSidebar
          discoveredWords={activeDiscovered}
          currentLevel={activeLevelIdx}
          minWordsToUnlock={minWordsToClearCurrent}
          isNextLevelUnlocked={hasAchievedNextUnlock}
          totalXp={totalSessionXp}
        />
      </div>

      {/* Quick-Jump Stage Picker Modal */}
      {showQuickJump && (
        <div
          data-testid="quick-jump-modal"
          className="fixed inset-0 z-50 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowQuickJump(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#1E1E22] border border-stone-200 dark:border-[#2E2E34] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-[#2E2E34] pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-[#E4E4E7]">
                  Level {activeLevelIdx} Stages: {activeLevel.title || 'Curriculum Puzzles'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  {clearedPuzzlesInActiveLevel} of {totalPuzzlesInLevel} stages cleared • Select an unlocked stage
                </p>
              </div>

              <button
                type="button"
                data-testid="close-quick-jump-modal"
                onClick={() => setShowQuickJump(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Puzzles Grid */}
            <div className="flex-1 overflow-y-auto pr-1 py-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {(activeLevel.puzzles || []).map((pz) => {
                const words = getStoredDiscoveredWords(activeLevelIdx, pz.puzzle_number);
                const cleared = words.length >= (pz.min_words_to_clear || 3);
                const isSelected = pz.puzzle_number === activePuzzleNum;
                const isStageUnlocked = isPuzzleUnlocked(pz.puzzle_number);

                return (
                  <button
                    key={`qj-puzzle-${pz.puzzle_number}`}
                    type="button"
                    disabled={!isStageUnlocked}
                    data-testid={`quick-jump-stage-${pz.puzzle_number}`}
                    onClick={() => handleJumpToPuzzle(pz.puzzle_number)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      !isStageUnlocked
                        ? 'opacity-40 cursor-not-allowed bg-stone-100/50 dark:bg-[#161618]/50 border-stone-200 dark:border-[#2E2E34] text-stone-400 dark:text-stone-600'
                        : isSelected
                          ? 'bg-indigo-500/10 dark:bg-indigo-400/10 border-indigo-500 text-indigo-950 dark:text-indigo-200 shadow-xs ring-2 ring-indigo-500/30 cursor-pointer'
                          : cleared
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-400 text-stone-800 dark:text-[#E4E4E7] cursor-pointer'
                            : 'bg-stone-50 dark:bg-[#161618] border-stone-200 dark:border-[#2E2E34] hover:border-indigo-400/60 text-stone-800 dark:text-[#E4E4E7] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-stone-500 dark:text-stone-400">
                      <span>#{pz.puzzle_number}</span>
                      {!isStageUnlocked ? (
                        <Lock size={12} className="text-stone-400 shrink-0" />
                      ) : cleared ? (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      ) : null}
                    </div>
                    <div className="font-serif font-bold text-sm tracking-wide truncate">
                      {pz.stem}
                    </div>
                    <div className="text-[10px] font-mono mt-1 text-stone-500 dark:text-stone-400">
                      {!isStageUnlocked ? (
                        <span>Locked</span>
                      ) : (
                        <span>{words.length} / {pz.min_words_to_clear || 3} words</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
