import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Compass, Trophy } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-5xl mx-auto text-center">
      {/* Editorial Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-8 shadow-xs">
        <Sparkles size={14} className="text-amber-500" />
        <span>Vicharanashala Pedagogical Framework</span>
      </div>

      {/* Main Hero Header */}
      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 dark:text-stone-100 max-w-3xl leading-[1.1] mb-6">
        Language Learning Through <span className="italic text-indigo-600 dark:text-indigo-400">Deliberate</span> Inquiry
      </h1>

      {/* Pitch Paragraph */}
      <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mb-10 leading-relaxed font-sans">
        Step beyond arbitrary letter frequency guessing. Cultivate linguistic intuition through semantic vector navigation, morphological exploration, and contextual deduction.
      </p>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
        <Link
          to="/puzzles/word-blanks"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <span>Play Daily Word Blanks</span>
          <ArrowRight size={18} />
        </Link>
        <Link
          to="/puzzles"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-base transition-all"
        >
          <span>Explore Catalog</span>
        </Link>
      </div>

      {/* Pillar Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
        <div className="p-6 rounded-2xl glass-panel">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">Word Blanks</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Active recall cloze puzzles testing contextual valency and vocabulary precision.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
            <Compass size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">Contexto Vectors</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            High-dimensional semantic proximity rankings guiding you toward secret target concepts.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <Trophy size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">Multiplayer Battles</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Synchronous real-time linguistic duels measuring speed, precision, and vocabulary breadth.
          </p>
        </div>
      </div>
    </div>
  );
};
