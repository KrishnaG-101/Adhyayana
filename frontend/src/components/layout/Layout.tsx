import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { HamburgerDrawer } from './HamburgerDrawer';
import { RulesModal } from './RulesModal';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-stone-900 dark:bg-[#161618] dark:text-[#E4E4E7] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <HamburgerDrawer />
      <RulesModal />
    </div>
  );
};
