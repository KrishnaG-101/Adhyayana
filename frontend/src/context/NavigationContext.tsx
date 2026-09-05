import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
  isFocusMode: boolean;
  isDrawerOpen: boolean;
  isRulesModalOpen: boolean;
  activePuzzleTitle: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  openRulesModal: () => void;
  closeRulesModal: () => void;
  setPuzzleTitle: (title: string) => void;
  setIsFocusMode: (focus: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [activePuzzleTitle, setActivePuzzleTitle] = useState('Puzzle Focus');
  const [manualFocusOverride, setManualFocusOverride] = useState<boolean | null>(null);

  // Automatically determine focus mode from route: /puzzles/:id is focus mode, /puzzles is catalog
  const isPuzzleRoute = location.pathname.startsWith('/puzzles/') && location.pathname !== '/puzzles';
  const isFocusMode = manualFocusOverride !== null ? manualFocusOverride : isPuzzleRoute;

  // Reset drawer, modal, and manual override on location change
  useEffect(() => {
    setIsDrawerOpen(false);
    setManualFocusOverride(null);
  }, [location.pathname]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const openRulesModal = () => setIsRulesModalOpen(true);
  const closeRulesModal = () => setIsRulesModalOpen(false);

  const setPuzzleTitle = (title: string) => setActivePuzzleTitle(title);
  const setIsFocusMode = (focus: boolean) => setManualFocusOverride(focus);

  return (
    <NavigationContext.Provider
      value={{
        isFocusMode,
        isDrawerOpen,
        isRulesModalOpen,
        activePuzzleTitle,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        openRulesModal,
        closeRulesModal,
        setPuzzleTitle,
        setIsFocusMode,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
