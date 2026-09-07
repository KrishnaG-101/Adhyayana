import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Sparkles,
  BookOpen,
  Compass,
  Grid,
  ArrowRight,
  ChevronDown,
  X,
  RotateCcw,
  Zap,
  Layers,
  WifiOff,
} from 'lucide-react';
import { fetchPuzzleCatalog, CLIENT_CATALOG_FIXTURE } from '@/services/catalogApi';
import {
  PuzzleMetadata,
  DifficultyLevel,
  GameType,
  LearningObjective,
} from '@/types/catalog';

interface FilterOption<T extends string> {
  value: T | 'all';
  label: string;
}

const DIFFICULTIES: FilterOption<DifficultyLevel>[] = [
  { value: 'all', label: 'All Difficulties' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'master', label: 'Master' },
];

const GAME_TYPES: FilterOption<GameType>[] = [
  { value: 'all', label: 'All Game Types' },
  { value: 'fill-in-blanks', label: 'Fill-in-Blanks' },
  { value: 'semantic-similarity', label: 'Semantic Similarity' },
  { value: 'crossword', label: 'Crossword' },
  { value: 'morphology-matrix', label: 'Morphology Matrix' },
];

const LEARNING_OBJECTIVES: FilterOption<LearningObjective>[] = [
  { value: 'all', label: 'All Objectives' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'morphology', label: 'Morphology' },
  { value: 'syntax', label: 'Syntax' },
  { value: 'etymology', label: 'Etymology' },
  { value: 'inference', label: 'Inference' },
];

/** Dynamic Lucide icon lookup for puzzle thumbnail metadata */
const renderThumbnailIcon = (iconName: string) => {
  const iconProps = { size: 24 };
  switch (iconName.toLowerCase()) {
    case 'bookopen':
      return <BookOpen {...iconProps} className="text-emerald-600 dark:text-emerald-400" />;
    case 'compass':
      return <Compass {...iconProps} className="text-amber-600 dark:text-amber-400" />;
    case 'grid':
      return <Grid {...iconProps} className="text-indigo-600 dark:text-indigo-400" />;
    case 'sparkles':
    default:
      return <Sparkles {...iconProps} className="text-indigo-600 dark:text-indigo-400" />;
  }
};

/** Formats a game type slug to title case */
const formatGameType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'fill-in-blanks':
      return 'Fill-in-Blanks';
    case 'semantic-similarity':
      return 'Semantic Similarity';
    case 'crossword':
      return 'Crossword';
    case 'morphology-matrix':
      return 'Morphology Matrix';
    default:
      return type;
  }
};

/** Capitalizes a single word */
const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const PuzzlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Hydrate initial states from URL search parameters
  const initialSearch = searchParams.get('search') || '';
  const initialDifficulty = (searchParams.get('difficulty') || 'all').toLowerCase();
  const initialType = (searchParams.get('type') || 'all').toLowerCase();
  const initialObjective = (searchParams.get('objective') || 'all').toLowerCase();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedObjective, setSelectedObjective] = useState(initialObjective);

  // Catalog data & loading state
  const [puzzles, setPuzzles] = useState<PuzzleMetadata[]>(CLIENT_CATALOG_FIXTURE.puzzles);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Fetch catalog on mount
  useEffect(() => {
    let isMounted = true;
    const loadCatalog = async () => {
      try {
        const response = await fetchPuzzleCatalog();
        if (isMounted) {
          setPuzzles(response.puzzles);
          setIsOffline(Boolean(response.is_offline));
        }
      } catch (err) {
        console.error('Failed to load catalog:', err);
        if (isMounted) {
          setPuzzles(CLIENT_CATALOG_FIXTURE.puzzles);
          setIsOffline(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize state changes with URL Search Params
  const updateQueryParams = (updates: {
    search?: string;
    difficulty?: string;
    type?: string;
    objective?: string;
  }) => {
    const nextSearch = updates.search !== undefined ? updates.search : searchQuery;
    const nextDiff = updates.difficulty !== undefined ? updates.difficulty : selectedDifficulty;
    const nextType = updates.type !== undefined ? updates.type : selectedType;
    const nextObj = updates.objective !== undefined ? updates.objective : selectedObjective;

    const nextParams = new URLSearchParams();

    if (nextSearch.trim()) {
      nextParams.set('search', nextSearch.trim());
    }
    if (nextDiff && nextDiff !== 'all') {
      nextParams.set('difficulty', nextDiff);
    }
    if (nextType && nextType !== 'all') {
      nextParams.set('type', nextType);
    }
    if (nextObj && nextObj !== 'all') {
      nextParams.set('objective', nextObj);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateQueryParams({ search: query });
  };

  const handleDifficultyChange = (difficulty: string) => {
    const norm = difficulty.toLowerCase();
    setSelectedDifficulty(norm);
    updateQueryParams({ difficulty: norm });
  };

  const handleTypeChange = (type: string) => {
    const norm = type.toLowerCase();
    setSelectedType(norm);
    updateQueryParams({ type: norm });
  };

  const handleObjectiveChange = (objective: string) => {
    const norm = objective.toLowerCase();
    setSelectedObjective(norm);
    updateQueryParams({ objective: norm });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
    setSelectedType('all');
    setSelectedObjective('all');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters =
    selectedDifficulty !== 'all' ||
    selectedType !== 'all' ||
    selectedObjective !== 'all' ||
    searchQuery.trim() !== '';

  // Filtered puzzle collection
  const filteredPuzzles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return puzzles.filter((p) => {
      const matchesSearch =
        query === '' ||
        p.title.toLowerCase().includes(query) ||
        p.short_description.toLowerCase().includes(query) ||
        p.learning_objectives.some((obj) => obj.toLowerCase().includes(query)) ||
        p.game_type.toLowerCase().includes(query);

      const matchesDifficulty =
        selectedDifficulty === 'all' ||
        p.difficulty.toLowerCase() === selectedDifficulty;

      const matchesType =
        selectedType === 'all' ||
        p.game_type.toLowerCase() === selectedType;

      const matchesObjective =
        selectedObjective === 'all' ||
        p.learning_objectives.some((obj) => obj.toLowerCase() === selectedObjective);

      return matchesSearch && matchesDifficulty && matchesType && matchesObjective;
    });
  }, [puzzles, searchQuery, selectedDifficulty, selectedType, selectedObjective]);

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-[#E4E4E7] tracking-tight">
            Linguistic Puzzles Catalog
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            Explore challenges designed for active vocabulary recall, semantic distance, and syntax reasoning.
          </p>
        </div>

        {isOffline && (
          <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-medium">
            <WifiOff size={14} />
            <span>Offline mode (cached catalog)</span>
          </div>
        )}
      </div>

      {/* Top Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-stone-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search puzzles by title, concept, or linguistic skill..."
          aria-label="Search puzzles"
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => handleSearchChange('')}
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
              onChange={(e) => handleDifficultyChange(e.target.value)}
              aria-label="Filter by difficulty"
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
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
              onChange={(e) => handleTypeChange(e.target.value)}
              aria-label="Filter by game type"
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              {GAME_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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
              onChange={(e) => handleObjectiveChange(e.target.value)}
              aria-label="Filter by learning objective"
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#202024] text-stone-900 dark:text-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              {LEARNING_OBJECTIVES.map((obj) => (
                <option key={obj.value} value={obj.value}>
                  {obj.label}
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
          {selectedDifficulty !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
              Difficulty: {capitalize(selectedDifficulty)}
              <button
                type="button"
                onClick={() => handleDifficultyChange('all')}
                aria-label="Clear difficulty filter"
                className="hover:text-indigo-900 dark:hover:text-indigo-100"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-medium">
              Type: {formatGameType(selectedType)}
              <button
                type="button"
                onClick={() => handleTypeChange('all')}
                aria-label="Clear game type filter"
                className="hover:text-amber-900 dark:hover:text-amber-100"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {selectedObjective !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              Objective: {capitalize(selectedObjective)}
              <button
                type="button"
                onClick={() => handleObjectiveChange('all')}
                aria-label="Clear objective filter"
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

      {/* Main Content Layout with Desktop Sidebar */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0 space-y-6">
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
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => handleDifficultyChange(diff.value)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedDifficulty === diff.value
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#202024]'
                    }`}
                  >
                    <span>{diff.label}</span>
                    {selectedDifficulty === diff.value && <span>✓</span>}
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
                {GAME_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedType === type.value
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#202024]'
                    }`}
                  >
                    <span>{type.label}</span>
                    {selectedType === type.value && <span>✓</span>}
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
                {LEARNING_OBJECTIVES.map((obj) => (
                  <button
                    key={obj.value}
                    type="button"
                    onClick={() => handleObjectiveChange(obj.value)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedObjective === obj.value
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#202024]'
                    }`}
                  >
                    <span>{obj.label}</span>
                    {selectedObjective === obj.value && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Puzzle Card Grid */}
        <div className="flex-1">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="p-6 rounded-2xl glass-panel space-y-4 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800" />
                    <div className="w-20 h-6 rounded-full bg-stone-200 dark:bg-stone-800" />
                  </div>
                  <div className="h-6 w-3/4 rounded-md bg-stone-200 dark:bg-stone-800" />
                  <div className="h-4 w-full rounded-md bg-stone-200 dark:bg-stone-800" />
                  <div className="h-4 w-5/6 rounded-md bg-stone-200 dark:bg-stone-800" />
                  <div className="pt-4 border-t border-stone-100 dark:border-[#2E2E34] flex justify-between">
                    <div className="h-4 w-16 rounded-md bg-stone-200 dark:bg-stone-800" />
                    <div className="h-4 w-20 rounded-md bg-stone-200 dark:bg-stone-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPuzzles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-panel space-y-4 text-stone-500 dark:text-stone-400">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-[#202024] flex items-center justify-center mx-auto text-stone-400">
                <Search size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
                  No exercises match your criteria
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
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredPuzzles.map((puzzle) => (
                <Link
                  key={puzzle.id}
                  to={`/puzzles/${puzzle.slug}`}
                  className="group p-6 rounded-2xl glass-panel hover:shadow-xl transition-all duration-200 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800"
                >
                  <div>
                    {/* Top Row: Icon, New Badge, Difficulty Pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-[#202024] flex items-center justify-center">
                        {renderThumbnailIcon(puzzle.thumbnail_icon)}
                      </div>
                      <div className="flex items-center gap-2">
                        {puzzle.is_new && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                            <Sparkles size={12} /> New
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            puzzle.difficulty === 'beginner'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                              : puzzle.difficulty === 'intermediate'
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                              : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40'
                          }`}
                        >
                          {capitalize(puzzle.difficulty)}
                        </span>
                      </div>
                    </div>

                    {/* Title and Short Description */}
                    <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-[#E4E4E7] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {puzzle.title}
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                      {puzzle.short_description}
                    </p>

                    {/* Progression Ladder Badges: Levels & XP */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#202024] text-stone-700 dark:text-stone-300 text-xs font-medium">
                        <Layers size={13} className="text-stone-400" />
                        <span>{puzzle.total_levels} Levels</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                        <Zap size={13} className="text-amber-600 dark:text-amber-400 fill-amber-500" />
                        <span>Up to {puzzle.max_xp} XP</span>
                      </span>
                    </div>

                    {/* Learning Objective & Game Type Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#202024] text-stone-500 dark:text-stone-400 text-[11px] font-medium">
                        {formatGameType(puzzle.game_type)}
                      </span>
                      {puzzle.learning_objectives.map((obj) => (
                        <span
                          key={obj}
                          className="px-2 py-0.5 rounded-md bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium"
                        >
                          {capitalize(obj)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play CTA */}
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
