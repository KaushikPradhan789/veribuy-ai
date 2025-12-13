import React from 'react';
import { MessageSquare as ShoppingCart } from '../ui/Icons';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: AppView;
  onNavigate?: (view: AppView) => void;
  onHomeClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onHomeClick }) => {
  const getLinkClass = (view: AppView) => {
    return currentView === view
      ? 'text-white font-semibold transition-colors'
      : 'text-zinc-400 hover:text-white transition-colors';
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col font-sans selection:bg-accent selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => (onHomeClick ? onHomeClick() : onNavigate?.(AppView.LANDING))}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Veri<span className="text-accent">Buy</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={() => onNavigate?.(AppView.SCANNING)}
              className={getLinkClass(AppView.SCANNING)}
            >
              Scanner
            </button>
            <button 
              onClick={() => onNavigate?.(AppView.HISTORY)}
              className={getLinkClass(AppView.HISTORY)}
            >
              History
            </button>
            <button 
              onClick={() => onNavigate?.(AppView.SAVED)}
              className={getLinkClass(AppView.SAVED)}
            >
              Saved
            </button>
          </nav>

          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             <img src="https://picsum.photos/100/100" alt="User" className="opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 text-center text-zinc-600 text-sm">
        <p>Powered by Google Gemini 2.5 Flash & 3.0 Pro</p>
      </footer>
    </div>
  );
};

export default Layout;