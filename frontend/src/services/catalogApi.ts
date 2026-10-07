/**
 * Resilient Puzzle Catalog API Service
 * Fetches dynamic catalog data from backend API with transparent client-side fixture fallback.
 */

import { PuzzleCatalogResponse } from '@/types/catalog';

export interface CatalogFetchResult {
  catalog: PuzzleCatalogResponse;
  isOffline: boolean;
}

/**
 * Embedded client-side catalog fixture mirroring backend/app/services/catalog.py seed data.
 * Used when backend runtime is offline or unreachable.
 */
export const CLIENT_CATALOG_FIXTURE: PuzzleCatalogResponse = {
  total_count: 3,
  puzzles: [
    {
      id: 'word-blanks',
      slug: 'word-blanks',
      title: 'Word Blanks (Fill-in-the-Blanks)',
      short_description:
        'Deduce masked letters from active recall clues and morphological syntax hints.',
      difficulty: 'beginner',
      game_type: 'fill-in-blanks',
      learning_objectives: ['vocabulary', 'morphology'],
      is_new: true,
      thumbnail_icon: 'BookOpen',
      available_levels: [
        {
          level: 1,
          label: 'Level 1: 3-Letter Common Stems',
          base_xp: 50,
          unlocked_by_default: true,
        },
        {
          level: 2,
          label: 'Level 2: 4-Letter Affixed Lemmas',
          base_xp: 100,
          unlocked_by_default: true,
        },
        {
          level: 3,
          label: 'Level 3: 5-Letter Root Morphemes',
          base_xp: 150,
          unlocked_by_default: false,
        },
        {
          level: 4,
          label: 'Level 4: Bound Morphemic Clusters',
          base_xp: 200,
          unlocked_by_default: false,
        },
        {
          level: 5,
          label: 'Level 5: Polysyllabic Classical Lemmas',
          base_xp: 250,
          unlocked_by_default: false,
        },
      ],
      total_levels: 5,
      max_xp: 750,
    },
    {
      id: 'contexto',
      slug: 'contexto',
      title: 'Contexto Semantic Proximity',
      short_description:
        'Find the hidden word through numerical semantic embedding distance feedback.',
      difficulty: 'intermediate',
      game_type: 'semantic-similarity',
      learning_objectives: ['vocabulary', 'inference'],
      is_new: true,
      thumbnail_icon: 'Compass',
      available_levels: [
        {
          level: 1,
          label: 'Level 1: Core Semantic Neighborhoods',
          base_xp: 100,
          unlocked_by_default: true,
        },
        {
          level: 2,
          label: 'Level 2: Abstract Conceptual Clusters',
          base_xp: 200,
          unlocked_by_default: false,
        },
        {
          level: 3,
          label: 'Level 3: Distant Polysemous Vectors',
          base_xp: 300,
          unlocked_by_default: false,
        },
      ],
      total_levels: 3,
      max_xp: 600,
    },
    {
      id: 'crossword',
      slug: 'crossword',
      title: 'Syntactic Crossword',
      short_description:
        'Intersecting lexical definition matrix balancing speed, syntax, and orthographic precision.',
      difficulty: 'advanced',
      game_type: 'crossword',
      learning_objectives: ['syntax', 'etymology'],
      is_new: false,
      thumbnail_icon: 'Grid',
      available_levels: [
        {
          level: 1,
          label: 'Level 1: 5x5 Mini Orthographic Matrix',
          base_xp: 150,
          unlocked_by_default: true,
        },
        {
          level: 2,
          label: 'Level 2: 7x7 Syntactic Intersection',
          base_xp: 250,
          unlocked_by_default: false,
        },
        {
          level: 3,
          label: 'Level 3: 9x9 Etymological Grid',
          base_xp: 350,
          unlocked_by_default: false,
        },
        {
          level: 4,
          label: 'Level 4: 11x11 Master Lexical Nexus',
          base_xp: 450,
          unlocked_by_default: false,
        },
      ],
      total_levels: 4,
      max_xp: 1200,
    },
  ],
};

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000';

/**
 * Fetches the registered puzzle catalog from the backend API.
 * Automatically catches network errors and gracefully falls back to the client-side fixture.
 */
export async function fetchPuzzleCatalog(): Promise<
  PuzzleCatalogResponse & { is_offline?: boolean }
> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/puzzles`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PuzzleCatalogResponse = await response.json();
    return { ...data, is_offline: false };
  } catch (error) {
    console.warn(
      '[Catalog API] Backend unavailable; falling back to client-side catalog fixture',
      error
    );
    return { ...CLIENT_CATALOG_FIXTURE, is_offline: true };
  }
}
