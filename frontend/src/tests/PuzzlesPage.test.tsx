import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PuzzlesPage } from '@/pages/PuzzlesPage';

describe('PuzzlesPage Catalog and Mobile Filter Controls', () => {
  it('renders all 3 mobile filter selectors below search bar', () => {
    render(
      <MemoryRouter>
        <PuzzlesPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Filter by difficulty')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by game type')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by learning objective')).toBeInTheDocument();
  });

  it('filters puzzles correctly when selecting a mobile difficulty', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <PuzzlesPage />
      </MemoryRouter>
    );

    // Initial state: multiple puzzles present
    expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
    expect(screen.getByText('Contexto Semantic Proximity')).toBeInTheDocument();
    expect(screen.getByText('Syntactic Crossword')).toBeInTheDocument();

    // Select "Beginner" on mobile difficulty selector
    const diffSelect = screen.getByLabelText('Filter by difficulty');
    await user.selectOptions(diffSelect, 'Beginner');

    // Beginner puzzles remain
    expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
    // Non-beginner puzzles are filtered out
    expect(screen.queryByText('Contexto Semantic Proximity')).not.toBeInTheDocument();
    expect(screen.queryByText('Syntactic Crossword')).not.toBeInTheDocument();
  });

  it('filters puzzles by learning objective', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <PuzzlesPage />
      </MemoryRouter>
    );

    const objSelect = screen.getByLabelText('Filter by learning objective');
    await user.selectOptions(objSelect, 'Etymology');

    // Only Morphological Root Tree matches Etymology
    expect(screen.getByText('Morphological Root Tree')).toBeInTheDocument();
    expect(screen.queryByText('Contexto Semantic Proximity')).not.toBeInTheDocument();
    expect(screen.queryByText('Word Blanks (Fill-in-the-Blanks)')).not.toBeInTheDocument();
  });

  it('filters puzzles dynamically by search text and resets with clear button', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <PuzzlesPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search puzzles/i);
    await user.type(searchInput, 'Honeycomb');

    expect(screen.getByText('Lexical Honeycomb')).toBeInTheDocument();
    expect(screen.queryByText('Word Blanks (Fill-in-the-Blanks)')).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByLabelText('Clear search query');
    await user.click(clearBtn);

    expect(screen.getByText('Word Blanks (Fill-in-the-Blanks)')).toBeInTheDocument();
  });
});
