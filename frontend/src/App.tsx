import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { NavigationProvider } from '@/context/NavigationContext';
import { Layout } from '@/components/layout/Layout';

// Page Components
import { HomePage } from '@/pages/HomePage';
import { PuzzlesPage } from '@/pages/PuzzlesPage';
import { PuzzleViewPage } from '@/pages/PuzzleViewPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { AboutPage } from '@/pages/AboutPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="puzzles" element={<PuzzlesPage />} />
              <Route path="puzzles/:puzzleId" element={<PuzzleViewPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="about" element={<AboutPage />} />
              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </NavigationProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
