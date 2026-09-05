import React from 'react';
import { BookOpen, Sparkles, Brain, Compass, Layers, ShieldCheck, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const pedagogicalPillars = [
    {
      icon: <Brain className="text-indigo-600 dark:text-indigo-400" size={24} />,
      title: 'Active Production over Passive Recognition',
      description:
        'Standard language apps rely on multiple-choice quizzes that test recognition rather than recall. Adhyayana emphasizes generative problem-solving: assembling roots, forming chains, and producing exact orthography.',
    },
    {
      icon: <Layers className="text-emerald-600 dark:text-emerald-400" size={24} />,
      title: 'Morphological & Etymological Deduction',
      description:
        'Words are not arbitrary collections of letters. By understanding Indo-European and Greco-Latin morphemes, prefixes, and suffixes, a learner unlocks the foundational mechanics of thousands of English words at once.',
    },
    {
      icon: <Compass className="text-amber-600 dark:text-amber-400" size={24} />,
      title: 'High-Dimensional Semantic Proximity',
      description:
        'Nuance lives in word relationships. Our contextual association and synonym puzzles leverage vector spaces to challenge players to identify gradients of meaning, tone, and contextual connotation.',
    },
    {
      icon: <ShieldCheck className="text-rose-600 dark:text-rose-400" size={24} />,
      title: 'Distraction-Free Focus Mode',
      description:
        'No manipulative streaks, flashing popups, or intrusive advertisements. The puzzle environment strips away cognitive friction with our dual-shell architecture, leaving only the learner, the clue, and the word.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Editorial Mission Statement */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
          <BookOpen size={14} />
          <span>Vicharanashala Philosophical Treatise</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
          Language as a Canvas of Deliberate Thought
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-lg sm:text-xl font-serif italic max-w-2xl mx-auto">
          "अध्ययन" (Adhyayana) is the sacred practice of dedicated learning, contemplative inquiry, and deep study.
        </p>
      </div>

      {/* Origin Story / Vision */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/70 dark:border-stone-800/70 backdrop-blur-md space-y-6 text-stone-700 dark:text-stone-300 leading-relaxed text-base sm:text-lg">
        <p>
          Language acquisition is too frequently reduced to flashcard memorization, mindless tapping, and addictive slot-machine gamification. Learners are left with fleeting recognition rather than intuitive mastery, rich vocabulary, or the confidence to express nuanced ideas.
        </p>
        <p>
          <strong className="text-stone-900 dark:text-stone-100 font-semibold">Adhyayana</strong> was conceived as an antidote to cognitive noise. Designed under the <em>Vicharanashala (विचारणशाला)</em> framework, we blend classical linguistics, etymology, and modern cognitive psychology into focused, elegant puzzles. Every mechanic is engineered to cultivate curiosity, lexical precision, and the sheer joy of verbal craftsmanship.
        </p>
      </div>

      {/* 4 Pedagogical Pillars */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
            The Pedagogical Pillars
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm max-w-xl mx-auto">
            Our vertical puzzle slices are built upon four fundamental cognitive mechanisms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pedagogicalPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 backdrop-blur-md space-y-4 hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                {pillar.title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Open Science */}
      <div className="p-8 sm:p-10 rounded-3xl bg-stone-100/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Contract-First, Modular Architecture
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Built on strict TypeScript, FastAPI, Pydantic v2 schemas, and isolated linguistic puzzle engines.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 text-sm font-medium transition-colors"
          >
            <Github size={16} />
            <span>GitHub Repository</span>
            <ExternalLink size={14} className="opacity-70" />
          </a>
        </div>
        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
          Every linguistic puzzle engine in Adhyayana is completely modular. From Word Blanks and Crosswords to Anagram Cascades and Root Etymologies, engines implement a unified evaluation lifecycle that allows independent extension by linguistics researchers and open-source contributors.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4 space-y-4">
        <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          Ready to immerse your mind?
        </h3>
        <div className="flex justify-center gap-4">
          <Link
            to="/puzzles"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 font-medium text-sm transition-all shadow-md"
          >
            <Sparkles size={16} />
            <span>Explore Puzzle Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
