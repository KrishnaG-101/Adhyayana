import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Compass, Trophy } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-theme(spacing.16))] flex-1 flex flex-col justify-center">
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20 flex flex-col items-center text-center">
        {/* Editorial Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-[#202024] border border-stone-200/80 dark:border-[#2E2E34] text-xs font-semibold text-stone-700 dark:text-[#E4E4E7] mb-8 shadow-xs">
          <Sparkles size={14} className="text-amber-500" />
          <span>Vicharanashala Pedagogical Framework</span>
        </div>

        {/* Main Hero Header */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 dark:text-[#E4E4E7] max-w-4xl leading-[1.1] mb-6">
          Language Learning Through <span className="italic text-indigo-600 dark:text-indigo-400">Deliberate</span> Inquiry
        </h1>

        {/* Pitch Paragraph */}
        <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mb-10 leading-relaxed font-sans">
          Step beyond arbitrary letter frequency guessing. Cultivate linguistic intuition through semantic vector navigation, morphological exploration, and contextual deduction.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16 sm:mb-20">
          <Link
            to="/puzzles/word-blanks"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <span>Play Daily Word Blanks</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/puzzles"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-stone-300 dark:border-[#2E2E34] bg-white/60 dark:bg-[#202024]/60 hover:bg-stone-100 dark:hover:bg-[#202024] text-stone-800 dark:text-[#E4E4E7] font-semibold text-base transition-all"
          >
            <span>Explore Catalog</span>
          </Link>
        </div>

        {/* Pillar Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full text-left">
          <Link
            to="/puzzles/word-blanks"
            className="group p-6 sm:p-8 rounded-2xl glass-panel flex flex-col justify-between transition-all hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <BookOpen size={22} />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-[#E4E4E7] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                Word Blanks
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Active recall cloze puzzles testing contextual valency and vocabulary precision.
              </p>
            </div>
          </Link>

          <Link
            to="/puzzles/contexto"
            className="group p-6 sm:p-8 rounded-2xl glass-panel flex flex-col justify-between transition-all hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Compass size={22} />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-[#E4E4E7] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                Contexto Vectors
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                High-dimensional semantic proximity rankings guiding you toward secret target concepts.
              </p>
            </div>
          </Link>

          <Link
            to="/community"
            className="group p-6 sm:p-8 rounded-2xl glass-panel flex flex-col justify-between transition-all hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800 md:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Trophy size={22} />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-[#E4E4E7] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                Multiplayer Battles
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Synchronous real-time linguistic duels measuring speed, precision, and vocabulary breadth.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
