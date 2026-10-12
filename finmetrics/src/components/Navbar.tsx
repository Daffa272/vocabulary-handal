import React from 'react';
import { BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGlossary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGlossary,
}) => {
  const navItems = [
    { id: 'income', label: 'Laba Rugi' },
    { id: 'balance', label: 'Neraca Keuangan' },
    { id: 'cashflow', label: 'Arus Kas' },
    { id: 'ratios', label: 'Rasio & Komparasi' },
    { id: 'calculator', label: 'Kalkulator Lab' },
    { id: 'quiz', label: 'Kuis Evaluasi' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group-hover:text-sky-700 transition-colors">
            FinMetrics<span className="text-sky-600 font-semibold ml-0.5">Lab</span>
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-sky-700 font-semibold border-b-2 border-sky-600'
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Glosarium Finansial</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50 gap-2 scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 font-medium ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Beranda
        </button>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 font-medium ${
              activeTab === item.id ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
