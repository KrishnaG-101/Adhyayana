import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, BookOpen, Compass, Grid, ArrowRight } from 'lucide-react';

export const PuzzlesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const puzzles = [
    {
      id: 'word-blanks',
      slug: 'word-blanks',
      title: 'Word Blanks (Fill-in-the-Blanks)',
      summary: 'Deduce masked letters from active recall clues and morphological syntax hints.',
      difficulty: 'Beginner',
      gameType: 'Fill-in-Blanks',
      isNew: true,
      icon: <BookOpen className="text-emerald-600 dark:text-emerald-400" size={24} />,
    },
    {
      id: 'contexto',
      slug: 'contexto',
      title: 'Contexto Semantic Proximity',
      summary: 'Find the hidden word through numerical semantic embedding distance feedback.',
      difficulty: 'Intermediate',
      gameType: 'Semantic Distance',
      isNew: true,
      icon: <Compass className="text-amber-600 dark:text-amber-400" size={24} />,
    },
    {
      id: 'crossword',
      slug: 'crossword',
      title: 'Syntactic Crossword',
      summary: 'Intersecting lexical definition matrix balancing speed and precision.',
      difficulty: 'Advanced',
      gameType: 'Crossword',
      isNew: false,
      icon: <Grid className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
  ];

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const filteredPuzzles = puzzles.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(p.difficulty);
    const matchesType = selectedType.length === 0 || selectedType.includes(p.gameType);
    return matchesSearch && matchesDifficulty && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Linguistic Puzzles Catalog
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
          Explore challenges designed for active vocabulary recall, semantic distance, and syntax reasoning.
        </p>
      </div>

      {/* Top Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-stone-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search puzzles by title, concept, or linguistic skill..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs transition-all"
        />
      </div>

      {/* Mobile Filter Dropdown Pills */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs">
        {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => toggleFilter(selectedDifficulty, setSelectedDifficulty, diff)}
            className={`px-3 py-1.5 rounded-full border transition-all shrink-0 ${
              selectedDifficulty.includes(diff)
                ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Main Grid with Desktop Sidebar */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="sticky top-24 p-5 rounded-2xl glass-panel space-y-6">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-3">Difficulty</h3>
              <div className="space-y-2 text-sm">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <label key={diff} className="flex items-center gap-2.5 cursor-pointer select-none text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={selectedDifficulty.includes(diff)}
                      onChange={() => toggleFilter(selectedDifficulty, setSelectedDifficulty, diff)}
                      className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{diff}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200/80 dark:border-stone-800/80 pt-4">
              <h3 className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-3">Game Mechanic</h3>
              <div className="space-y-2 text-sm">
                {['Fill-in-Blanks', 'Semantic Distance', 'Crossword'].map((type) => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer select-none text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={selectedType.includes(type)}
                      onChange={() => toggleFilter(selectedType, setSelectedType, type)}
                      className="rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Puzzle Card Grid */}
        <div className="flex-1">
          {filteredPuzzles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-panel text-stone-500">
              No puzzles found matching your filter criteria.
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
                      <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                        {puzzle.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {puzzle.isNew && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                            <Sparkles size={12} /> New
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium">
                          {puzzle.difficulty}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {puzzle.title}
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {puzzle.summary}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Play Now</span>
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
