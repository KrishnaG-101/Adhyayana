import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { HamburgerDrawer } from './HamburgerDrawer';
import { RulesModal } from './RulesModal';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-stone-900 dark:bg-[#121213] dark:text-stone-100 transition-colors duration-200">
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
