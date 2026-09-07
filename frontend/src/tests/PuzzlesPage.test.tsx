import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { PuzzlesPage } from '@/pages/PuzzlesPage';
import { CLIENT_CATALOG_FIXTURE } from '@/services/catalogApi';

// Helper component that displays the active URL search parameters for assertion
const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-testid="current-search-params">{location.search}</div>;
};

describe('PuzzlesPage Dynamic Catalog & URL Search Parameter Synchronization', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders dynamic puzzle cards with levels, XP badges, and mobile filter selectors', async () => {
    // Mock successful API response
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => CLIENT_CATALOG_FIXTURE,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/puzzles']}>
        <LocationDisplay />
        <PuzzlesPage />
      </MemoryRouter>
    );

    // Mobile filter selectors should exist
    expect(screen.getByLabelText('Filter by difficulty')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by game type')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by learning objective')).toBeInTheDocument();

    // Puzzles should load from catalog
    await waitFor(() => {
      expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
      expect(screen.getByText('Contexto Semantic Proximity')).toBeInTheDocument();
      expect(screen.getByText('Syntactic Crossword')).toBeInTheDocument();
    });

    // Verify progression levels and XP badges
    expect(screen.getByText('5 Levels')).toBeInTheDocument();
    expect(screen.getByText(/Up to 750 XP/i)).toBeInTheDocument();
    expect(screen.getByText('3 Levels')).toBeInTheDocument();
    expect(screen.getByText(/Up to 600 XP/i)).toBeInTheDocument();
    expect(screen.getByText('4 Levels')).toBeInTheDocument();
    expect(screen.getByText(/Up to 1200 XP/i)).toBeInTheDocument();
  });

  it('filters puzzles and syncs difficulty parameter to URL search parameters', async () => {
    const user = userEvent.setup();

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => CLIENT_CATALOG_FIXTURE,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/puzzles']}>
        <LocationDisplay />
        <PuzzlesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
    });

    // Select Beginner
    const diffSelect = screen.getByLabelText('Filter by difficulty');
    await user.selectOptions(diffSelect, 'Beginner');

    // Beginner puzzle remains, intermediate and advanced are filtered out
    expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
    expect(screen.queryByText('Contexto Semantic Proximity')).not.toBeInTheDocument();
    expect(screen.queryByText('Syntactic Crossword')).not.toBeInTheDocument();

    // URL search params must reflect difficulty=beginner
    expect(screen.getByTestId('current-search-params').textContent).toContain('difficulty=beginner');
  });

  it('filters puzzles by learning objective and updates URL search params', async () => {
    const user = userEvent.setup();

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => CLIENT_CATALOG_FIXTURE,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/puzzles']}>
        <LocationDisplay />
        <PuzzlesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Syntactic Crossword')).toBeInTheDocument();
    });

    const objSelect = screen.getByLabelText('Filter by learning objective');
    await user.selectOptions(objSelect, 'Etymology');

    // Syntactic Crossword matches etymology
    expect(screen.getByText('Syntactic Crossword')).toBeInTheDocument();
    expect(screen.queryByText('Word Blanks (Fill-in-the-Blanks)')).not.toBeInTheDocument();
    expect(screen.queryByText('Contexto Semantic Proximity')).not.toBeInTheDocument();

    expect(screen.getByTestId('current-search-params').textContent).toContain('objective=etymology');
  });

  it('filters puzzles dynamically by search text and synchronizes search param', async () => {
    const user = userEvent.setup();

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => CLIENT_CATALOG_FIXTURE,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/puzzles']}>
        <LocationDisplay />
        <PuzzlesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search puzzles/i);
    await user.type(searchInput, 'proximity');

    expect(screen.getByText('Contexto Semantic Proximity')).toBeInTheDocument();
    expect(screen.queryByText('Word Blanks (Fill-in-the-Blanks)')).not.toBeInTheDocument();

    expect(screen.getByTestId('current-search-params').textContent).toContain('search=proximity');

    // Clear search
    const clearBtn = screen.getByLabelText('Clear search query');
    await user.click(clearBtn);

    expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
    expect(screen.getByTestId('current-search-params').textContent).toBe('');
  });

  it('hydrates initial filter state from URL search params on page load', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => CLIENT_CATALOG_FIXTURE,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/puzzles?difficulty=advanced']}>
        <LocationDisplay />
        <PuzzlesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Advanced puzzle visible
      expect(screen.getByText('Syntactic Crossword')).toBeInTheDocument();
      // Beginner and Intermediate filtered out
      expect(screen.queryByText('Word Blanks (Fill-in-the-Blanks)')).not.toBeInTheDocument();
      expect(screen.queryByText('Contexto Semantic Proximity')).not.toBeInTheDocument();
    });

    const diffSelect = screen.getByLabelText('Filter by difficulty') as HTMLSelectElement;
    expect(diffSelect.value).toBe('advanced');
  });

  it('gracefully falls back to client fixture with offline indicator when network fails', async () => {
    // Force network failure
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network connection refused'));

    render(
      <MemoryRouter initialEntries={['/puzzles']}>
        <PuzzlesPage />
      </MemoryRouter>
    );

    // Offline indicator must appear
    await waitFor(() => {
      expect(screen.getByText(/Offline mode/i)).toBeInTheDocument();
    });

    // Puzzles should still be present from fallback fixture
    expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
    expect(screen.getByText('Contexto Semantic Proximity')).toBeInTheDocument();
    expect(screen.getByText('Syntactic Crossword')).toBeInTheDocument();
  });
});
