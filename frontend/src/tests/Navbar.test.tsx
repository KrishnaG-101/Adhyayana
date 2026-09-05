import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { NavigationProvider, useNavigation } from '@/context/NavigationContext';
import { Navbar } from '@/components/layout/Navbar';

// Helper component to mount inside route
const SetTitleHelper: React.FC<{ title: string }> = ({ title }) => {
  const { setPuzzleTitle } = useNavigation();
  React.useEffect(() => {
    setPuzzleTitle(title);
  }, [title, setPuzzleTitle]);
  return <div>Puzzle Body</div>;
};

describe('Navbar Dual-Shell Navigation', () => {
  it('renders Platform Shell on standard routes (e.g. "/")', () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <NavigationProvider>
            <Navbar />
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Platform Shell brand
    expect(screen.getByText('Adhyayana')).toBeInTheDocument();
    expect(screen.getByText('अध्ययन')).toBeInTheDocument();

    // Standard navigation links
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Puzzles' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Leaderboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Community' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();

    // Focus mode controls should not be rendered
    expect(screen.queryByLabelText('Open navigation drawer')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('View puzzle rules')).not.toBeInTheDocument();
  });

  it('renders Focus Mode Shell on puzzle routes (e.g. "/puzzles/word-blanks")', async () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/puzzles/word-blanks']}>
          <NavigationProvider>
            <Navbar />
            <Routes>
              <Route
                path="/puzzles/:id"
                element={<SetTitleHelper title="Word Blanks" />}
              />
            </Routes>
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Focus Mode title should be visible
    expect(screen.getByRole('heading', { name: 'Word Blanks' })).toBeInTheDocument();

    // Focus mode buttons should be present
    expect(screen.getByLabelText('Open navigation drawer')).toBeInTheDocument();
    expect(screen.getByLabelText('View puzzle rules')).toBeInTheDocument();

    // Standard nav links should be hidden from top bar in Focus Mode
    expect(screen.queryByRole('link', { name: 'Leaderboard' })).not.toBeInTheDocument();
  });
});
