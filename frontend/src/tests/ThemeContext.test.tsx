import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

const TestThemeComponent: React.FC = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders with default theme and updates documentElement class', async () => {
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    const themeSpan = screen.getByTestId('theme');
    const resolvedSpan = screen.getByTestId('resolved-theme');

    expect(themeSpan.textContent).toBe('system');
    // System matchMedia default mock is false, so resolved is light
    expect(resolvedSpan.textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('sets theme to dark and applies dark class to documentElement and saves to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Set Dark' }));

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('adhyayana-theme')).toBe('dark');
  });

  it('sets theme to light and removes dark class from documentElement', async () => {
    const user = userEvent.setup();
    document.documentElement.classList.add('dark');

    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Set Light' }));

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('adhyayana-theme')).toBe('light');
  });

  it('toggles theme between light and dark', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    // Initial is light, toggle should make it dark
    await user.click(screen.getByRole('button', { name: 'Toggle Theme' }));
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Second toggle should make it light
    await user.click(screen.getByRole('button', { name: 'Toggle Theme' }));
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
