import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, BookOpen, Compass, Grid, ArrowRight, ChevronDown, X, RotateCcw } from 'lucide-react';

interface PuzzleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  gameType: 'Fill-in-Blanks' | 'Semantic Similarity' | 'Crossword';
  learningObjectives: string[];
  isNew: boolean;
  icon: React.ReactNode;
}

export const PuzzlesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedObjective, setSelectedObjective] = useState<string>('All');

  const puzzles: PuzzleItem[] = [
    {
      id: 'word-blanks',
      slug: 'word-blanks',
      title: 'Word Blanks (Fill-in-the-Blanks)',
      summary: 'Deduce masked letters from active recall clues and morphological syntax hints.',
      difficulty: 'Beginner',
      gameType: 'Fill-in-Blanks',
      learningObjectives: ['Morphology', 'Vocabulary'],
      isNew: true,
      icon: <BookOpen className="text-emerald-600 dark:text-emerald-400" size={24} />,
    },
    {
      id: 'contexto',
      slug: 'contexto',
      title: 'Contexto Semantic Proximity',
      summary: 'Find the hidden word through numerical semantic embedding distance feedback.',
      difficulty: 'Intermediate',
      gameType: 'Semantic Similarity',
      learningObjectives: ['Vocabulary', 'Inference'],
      isNew: true,
      icon: <Compass className="text-amber-600 dark:text-amber-400" size={24} />,
    },
    {
      id: 'crossword',
      slug: 'crossword',
      title: 'Syntactic Crossword',
      summary: 'Intersecting lexical definition matrix balancing speed, syntax, and orthographic precision.',
      difficulty: 'Advanced',
      gameType: 'Crossword',
      learningObjectives: ['Syntax', 'Vocabulary'],
      isNew: false,
      icon: <Grid className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
    {
      id: 'etymology-tree',
      slug: 'etymology-tree',
      title: 'Morphological Root Tree',
      summary: 'Uncover ancient Indo-European and Greco-Latin etymological branches and derived cognates.',
      difficulty: 'Advanced',
      gameType: 'Semantic Similarity',
      learningObjectives: ['Etymology', 'Morphology'],
      isNew: true,
      icon: <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
    {
      id: 'context-clues',
      slug: 'context-clues',
      title: 'Contextual Semantic Clues',
      summary: 'Infer complex academic vocabulary from multi-sentence contextual cloze passages.',
      difficulty: 'Intermediate',
      gameType: 'Fill-in-Blanks',
      learningObjectives: ['Inference', 'Syntax'],
      isNew: false,
      icon: <BookOpen className="text-amber-600 dark:text-amber-400" size={24} />,
    },
    {
      id: 'spelling-bee',
      slug: 'spelling-bee',
      title: 'Lexical Honeycomb',
      summary: 'Construct valid words from a center mandatory letter cluster testing vocabulary breadth.',
      difficulty: 'Beginner',
      gameType: 'Crossword',
      learningObjectives: ['Vocabulary', 'Morphology'],
      isNew: false,
      icon: <Grid className="text-emerald-600 dark:text-emerald-400" size={24} />,
    },
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const gameTypes = ['All', 'Fill-in-Blanks', 'Semantic Similarity', 'Crossword'];
  const learningObjectives = ['All', 'Vocabulary', 'Morphology', 'Syntax', 'Etymology', 'Inference'];

  const resetFilters = () => {
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedObjective('All');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedDifficulty !== 'All' ||
    selectedType !== 'All' ||
    selectedObjective !== 'All' ||
    searchQuery.trim() !== '';

  const filteredPuzzles = puzzles.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      p.title.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      p.learningObjectives.some((obj) => obj.toLowerCase().includes(query)) ||
      p.gameType.toLowerCase().includes(query);

    const matchesDifficulty =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

    const matchesType =
      selectedType === 'All' || p.gameType === selectedType;

    const matchesObjective =
      selectedObjective === 'All' || p.learningObjectives.includes(selectedObjective);

    return matchesSearch && matchesDifficulty && matchesType && matchesObjective;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-[#E4E4E7] tracking-tight">
          Linguistic Puzzles Catalog
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
          Explore challenges designed for active vocabulary recall, semantic distance, and syntax reasoning.
        </p>
      </div>

      {/* Top Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-stone-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search puzzles by title, concept, or linguistic skill..."
          aria-label="Search puzzles"
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search query"
            className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Mobile Filter 3-Selector Grid (Visible below md) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:hidden mb-6">
        {/* Difficulty Selector */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="mobile-difficulty"
            className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
          >
            Difficulty
          </label>
          <div className="relative">
            <select
              id="mobile-difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by difficulty"
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Game Type Selector */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="mobile-game-type"
            className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
          >
            Game Type
          </label>
          <div className="relative">
            <select
              id="mobile-game-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by game type"
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              {gameTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Game Types' : type}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Learning Objective Selector */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="mobile-objective"
            className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
          >
            Learning Objective
          </label>
          <div className="relative">
            <select
              id="mobile-objective"
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value)}
              aria-label="Filter by learning objective"
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              {learningObjectives.map((obj) => (
                <option key={obj} value={obj}>
                  {obj === 'All' ? 'All Objectives' : obj}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-stone-200/60 dark:border-[#2E2E34]/60">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Active Filters:</span>
          {selectedDifficulty !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
              Difficulty: {selectedDifficulty}
              <button
                type="button"
                onClick={() => setSelectedDifficulty('All')}
                className="hover:text-indigo-900 dark:hover:text-indigo-100"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedType !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-medium">
              Type: {selectedType}
              <button
                type="button"
                onClick={() => setSelectedType('All')}
                className="hover:text-amber-900 dark:hover:text-amber-100"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedObjective !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              Objective: {selectedObjective}
              <button
                type="button"
                onClick={() => setSelectedObjective('All')}
                className="hover:text-emerald-900 dark:hover:text-emerald-100"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 ml-auto transition-colors"
          >
            <RotateCcw size={12} />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {/* Main Grid with Desktop Sidebar */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="sticky top-24 p-5 rounded-2xl glass-panel space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-[#2E2E34]/80">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-[#E4E4E7]">
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Difficulty Group */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 mb-3">
                Difficulty
              </h4>
              <div className="space-y-1.5 text-sm">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#202024]'
                    }`}
                  >
                    <span>{diff === 'All' ? 'All Difficulties' : diff}</span>
                    {selectedDifficulty === diff && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Mechanic Group */}
            <div className="border-t border-stone-200/80 dark:border-[#2E2E34]/80 pt-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 mb-3">
                Game Type
              </h4>
              <div className="space-y-1.5 text-sm">
                {gameTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#202024]'
                    }`}
                  >
                    <span>{type === 'All' ? 'All Game Types' : type}</span>
                    {selectedType === type && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Objective Group */}
            <div className="border-t border-stone-200/80 dark:border-[#2E2E34]/80 pt-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 mb-3">
                Learning Objective
              </h4>
              <div className="space-y-1.5 text-sm">
                {learningObjectives.map((obj) => (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => setSelectedObjective(obj)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedObjective === obj
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#202024]'
                    }`}
                  >
                    <span>{obj === 'All' ? 'All Objectives' : obj}</span>
                    {selectedObjective === obj && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Puzzle Card Grid */}
        <div className="flex-1">
          {filteredPuzzles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-panel space-y-4 text-stone-500 dark:text-stone-400">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-[#202024] flex items-center justify-center mx-auto text-stone-400">
                <Search size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
                  No puzzles match your criteria
                </h3>
                <p className="text-xs max-w-sm mx-auto">
                  Try clearing your active filters or searching for alternative linguistic keywords.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-xs"
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPuzzles.map((puzzle) => (
                <Link
                  key={puzzle.id}
                  to={`/puzzles/${puzzle.slug}`}
                  className="group p-6 rounded-2xl glass-panel hover:shadow-xl transition-all duration-200 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-[#202024] flex items-center justify-center">
                        {puzzle.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {puzzle.isNew && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                            <Sparkles size={12} /> New
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-[#202024] text-stone-600 dark:text-stone-300 text-xs font-medium">
                          {puzzle.difficulty}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-[#E4E4E7] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {puzzle.title}
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                      {puzzle.summary}
                    </p>

                    {/* Learning Objective & Game Type Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#202024] text-stone-500 dark:text-stone-400 text-[11px] font-medium">
                        {puzzle.gameType}
                      </span>
                      {puzzle.learningObjectives.map((obj) => (
                        <span
                          key={obj}
                          className="px-2 py-0.5 rounded-md bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium"
                        >
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-stone-100 dark:border-[#2E2E34] flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Play Challenge</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
