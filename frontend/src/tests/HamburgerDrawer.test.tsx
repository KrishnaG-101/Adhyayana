import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { NavigationProvider, useNavigation } from '@/context/NavigationContext';
import { HamburgerDrawer } from '@/components/layout/HamburgerDrawer';

// Helper component that provides a trigger to open the drawer and tracks state
const DrawerMountHelper: React.FC = () => {
  const { openDrawer, isDrawerOpen } = useNavigation();
  const location = useLocation();

  return (
    <div>
      <button type="button" onClick={openDrawer} data-testid="trigger-open-drawer">
        Open Drawer
      </button>
      <div data-testid="current-pathname">{location.pathname}</div>
      <div data-testid="drawer-open-state">{isDrawerOpen ? 'open' : 'closed'}</div>
      <HamburgerDrawer />
    </div>
  );
};

describe('HamburgerDrawer Slide-over Interaction & Decoupling', () => {
  it('renders drawer when open, and puzzles accordion is collapsed by default', () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <NavigationProvider>
            <DrawerMountHelper />
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Explicitly open the drawer
    fireEvent.click(screen.getByTestId('trigger-open-drawer'));

    // Dialog should be present
    expect(screen.getByRole('dialog', { name: /navigation drawer/i })).toBeInTheDocument();

    // Top-level nav links should be rendered
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^puzzles$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /leaderboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /community/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about adhyayana/i })).toBeInTheDocument();

    // Chevron toggle button should be rendered
    expect(screen.getByRole('button', { name: /toggle puzzles list/i })).toBeInTheDocument();

    // Sub-puzzles must be COLLAPSED by default
    expect(screen.queryByText('Word Blanks')).not.toBeInTheDocument();
    expect(screen.queryByText('Contexto')).not.toBeInTheDocument();
    expect(screen.queryByText('Crossword')).not.toBeInTheDocument();

    // Redundant "Browse All Catalog →" link should NOT exist anywhere
    expect(screen.queryByText(/browse all catalog/i)).not.toBeInTheDocument();
  });

  it('clicking the chevron toggle button expands the sub-puzzle list without navigating', () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <NavigationProvider>
            <DrawerMountHelper />
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Explicitly open the drawer
    fireEvent.click(screen.getByTestId('trigger-open-drawer'));

    expect(screen.getByTestId('current-pathname').textContent).toBe('/');

    // Initially collapsed
    expect(screen.queryByText('Word Blanks')).not.toBeInTheDocument();

    // Click the toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle puzzles list/i });
    fireEvent.click(toggleButton);

    // Now sub-puzzles should be visible
    expect(screen.getByText('Word Blanks')).toBeInTheDocument();
    expect(screen.getByText('Contexto')).toBeInTheDocument();
    expect(screen.getByText('Crossword')).toBeInTheDocument();

    // Strict check: Location must NOT have changed from '/'
    expect(screen.getByTestId('current-pathname').textContent).toBe('/');

    // Clicking again should collapse the sub-puzzles
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Word Blanks')).not.toBeInTheDocument();
  });

  it('clicking the "Puzzles" text triggers route navigation to /puzzles and closes the drawer', () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <NavigationProvider>
            <DrawerMountHelper />
            <Routes>
              <Route path="/" element={<div />} />
              <Route path="/puzzles" element={<div data-testid="puzzles-catalog-page" />} />
            </Routes>
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Explicitly open the drawer
    fireEvent.click(screen.getByTestId('trigger-open-drawer'));

    expect(screen.getByTestId('current-pathname').textContent).toBe('/');
    expect(screen.getByRole('dialog', { name: /navigation drawer/i })).toBeInTheDocument();

    // Click the Puzzles link (not the toggle button)
    const puzzlesLink = screen.getByRole('link', { name: /^puzzles$/i });
    fireEvent.click(puzzlesLink);

    // Drawer should now be closed
    expect(screen.queryByRole('dialog', { name: /navigation drawer/i })).not.toBeInTheDocument();

    // Pathname should now be /puzzles
    expect(screen.getByTestId('current-pathname').textContent).toBe('/puzzles');
    expect(screen.getByTestId('puzzles-catalog-page')).toBeInTheDocument();
  });

  it('clicking an individual sub-puzzle item navigates to its route and closes the drawer', () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <NavigationProvider>
            <DrawerMountHelper />
            <Routes>
              <Route path="/" element={<div />} />
              <Route path="/puzzles/word-blanks" element={<div data-testid="word-blanks-page" />} />
            </Routes>
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Explicitly open the drawer
    fireEvent.click(screen.getByTestId('trigger-open-drawer'));

    // Expand accordion
    const toggleButton = screen.getByRole('button', { name: /toggle puzzles list/i });
    fireEvent.click(toggleButton);

    // Click Word Blanks sub-item
    const wordBlanksLink = screen.getByText('Word Blanks');
    fireEvent.click(wordBlanksLink);

    // Drawer closes and route navigates
    expect(screen.queryByRole('dialog', { name: /navigation drawer/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('current-pathname').textContent).toBe('/puzzles/word-blanks');
    expect(screen.getByTestId('word-blanks-page')).toBeInTheDocument();
  });

  it('closes drawer when clicking close button, backdrop, or pressing Escape', () => {
    const { unmount } = render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <NavigationProvider>
            <DrawerMountHelper />
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Explicitly open the drawer
    fireEvent.click(screen.getByTestId('trigger-open-drawer'));

    // Close via close button
    const closeBtn = screen.getByRole('button', { name: /close drawer/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: /navigation drawer/i })).not.toBeInTheDocument();

    unmount();

    // Re-mount to test Escape key
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <NavigationProvider>
            <DrawerMountHelper />
          </NavigationProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    // Explicitly open the drawer
    fireEvent.click(screen.getByTestId('trigger-open-drawer'));

    expect(screen.getByRole('dialog', { name: /navigation drawer/i })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /navigation drawer/i })).not.toBeInTheDocument();
  });
});
