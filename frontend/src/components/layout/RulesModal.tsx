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
      <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-white/95 dark:bg-stone-900/95 p-6 sm:p-8 z-10 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <h2 id="rules-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              How to Play: {activePuzzleTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeRulesModal}
            aria-label="Close rules dialog"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Instructions Body */}
        <div className="py-5 space-y-4 text-sm text-stone-600 dark:text-stone-300">
          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Pedagogical Objective
            </h3>
            <p className="leading-relaxed">
              Exercise active cognitive recall and contextual reasoning. Solve the challenge with minimum hints to maximize your linguistic intuition.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
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
                <span>Submit using <kbd className="px-1.5 py-0.5 text-xs bg-stone-200 dark:bg-stone-800 rounded">Enter</kbd>. Every guess is analytical feedback.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
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
