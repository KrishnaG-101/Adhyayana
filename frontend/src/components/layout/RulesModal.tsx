import React, { useEffect } from 'react';
import { X, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export const RulesModal: React.FC = () => {
  const { isRulesModalOpen, closeRulesModal, activePuzzleTitle } = useNavigation();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRulesModalOpen) {
        closeRulesModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRulesModalOpen, closeRulesModal]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isRulesModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRulesModalOpen]);

  if (!isRulesModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={closeRulesModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-white/95 dark:bg-[#202024]/95 p-6 sm:p-8 z-10 shadow-2xl border border-stone-200 dark:border-[#2E2E34] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#2E2E34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <h2 id="rules-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              How to Play: {activePuzzleTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeRulesModal}
            aria-label="Close rules dialog"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#28282D] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Instructions Body */}
        <div className="py-5 space-y-4 text-sm text-stone-600 dark:text-stone-300">
          {activePuzzleTitle?.toLowerCase().includes('word blanks') ? (
            <>
              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  How Word Blanks Works
                </h3>
                <p className="leading-relaxed">
                  You are presented with a stem pattern containing fixed letters and missing blanks (e.g., <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#161618] font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">_ A T</code>). Type letters into the blank slots to generate valid dictionary words.
                </p>
              </section>

              {/* Illustrative Examples Card */}
              <section className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-[#161618]/80 border border-stone-200 dark:border-[#2E2E34] space-y-2">
                <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Illustrative Example (Stem: <span className="font-bold text-indigo-600 dark:text-indigo-400">_ A T</span>)
                </h4>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono px-2 py-0.5 rounded bg-white dark:bg-[#202024] border border-stone-300 dark:border-[#383840] font-bold">B + AT</span>
                    <span className="text-stone-400">→</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">BAT</span>
                    <span className="text-stone-500 text-[11px] font-mono">(Valid word • +20 XP awarded)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono px-2 py-0.5 rounded bg-white dark:bg-[#202024] border border-stone-300 dark:border-[#383840] font-bold">C + AT</span>
                    <span className="text-stone-400">→</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">CAT</span>
                    <span className="text-stone-500 text-[11px] font-mono">(Valid word • +20 XP awarded)</span>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Progression Rules
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Stage Clearance:</strong> Find at least 3 valid dictionary words to clear the active stem and unlock the next puzzle.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Level Advancement:</strong> Clear all puzzles in the active level to unlock the next progressive difficulty tier.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Lexicon Exploration:</strong> You can continue finding bonus words on any cleared puzzle to earn extra XP and expand your vocabulary coverage.</span>
                  </li>
                </ul>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Pedagogical Objective
                </h3>
                <p className="leading-relaxed">
                  Exercise active cognitive recall and contextual reasoning. Solve the challenge with minimum hints to maximize your linguistic intuition.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Rules & Mechanics
                </h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Enter candidate English words matching the morphological constraints.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>Color-coded telemetry informs you of vector closeness: Emerald for exact, Amber for near-misses.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      Submit using <kbd className="px-1.5 py-0.5 text-xs bg-stone-200 dark:bg-[#161618] text-stone-800 dark:text-[#E4E4E7] rounded border border-stone-300 dark:border-[#2E2E34]">Enter</kbd>. Every guess is analytical feedback.
                    </span>
                  </li>
                </ul>
              </section>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-stone-200 dark:border-[#2E2E34] flex justify-end">
          <button
            type="button"
            onClick={closeRulesModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-sm active:scale-95"
          >
            <span>Start Playing</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
