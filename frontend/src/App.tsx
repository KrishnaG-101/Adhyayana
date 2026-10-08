import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { NavigationProvider } from '@/context/NavigationContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Layout } from '@/components/layout/Layout';

// Page Components
import { HomePage } from '@/pages/HomePage';
import { PuzzlesPage } from '@/pages/PuzzlesPage';
import { PuzzleViewPage } from '@/pages/PuzzleViewPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { AboutPage } from '@/pages/AboutPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <NavigationProvider>
            <AuthModal />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="puzzles" element={<PuzzlesPage />} />
                <Route path="puzzles/:puzzleId" element={<PuzzleViewPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                {/* Fallback to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </NavigationProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
