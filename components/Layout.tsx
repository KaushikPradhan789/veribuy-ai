import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from './ui/Icons';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = (view: AppView) => {
    return currentView === view 
      ? "text-white font-semibold transition-colors" 
      : "text-zinc-400 hover:text-white transition-colors";
  };

  const handleMobileNavigate = (view: AppView) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col font-sans selection:bg-accent selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onNavigate(AppView.LANDING)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Veri<span className="text-accent">Buy</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button 
              onClick={() => onNavigate(AppView.LANDING)} 
              className={getLinkClass(AppView.SCANNING)} // Scanner is conceptually home/landing
            >
              Scanner
            </button>
            <button 
              onClick={() => onNavigate(AppView.HISTORY)} 
              className={getLinkClass(AppView.HISTORY)}
            >
              History
            </button>
            <button 
              onClick={() => onNavigate(AppView.SAVED)} 
              className={getLinkClass(AppView.SAVED)}
            >
              Saved
            </button>
          </nav>

          {/* Desktop Placeholder */}
          <div className="w-8 hidden md:block"></div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col space-y-2 shadow-2xl animate-in slide-in-from-top-2">
            <button 
              onClick={() => handleMobileNavigate(AppView.LANDING)} 
              className={`p-3 rounded-xl text-left font-medium transition-all ${
                currentView === AppView.LANDING || currentView === AppView.SCANNING
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Scanner
            </button>
            <button 
              onClick={() => handleMobileNavigate(AppView.HISTORY)} 
              className={`p-3 rounded-xl text-left font-medium transition-all ${
                currentView === AppView.HISTORY
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              History
            </button>
            <button 
              onClick={() => handleMobileNavigate(AppView.SAVED)} 
              className={`p-3 rounded-xl text-left font-medium transition-all ${
                currentView === AppView.SAVED
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Saved
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        {children}
      </main>

      {/* Footer Removed */}
    </div>
  );
};

export default Layout;