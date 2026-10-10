import React from 'react';
import { NavTab } from '../types';
import { BookOpen, Sparkles, Download, HelpCircle } from 'lucide-react';
import { rawSalesDataset, downloadCsv } from '../data/mockDatasets';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openDocs }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2.5 text-left text-slate-100 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-cyan-500/20">
            BI
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white font-display">
              Power BI Academy
            </span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
              Beginner to Analyst
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${activeTab === 'dashboard' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('learning-path')} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${activeTab === 'learning-path' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Learning Path
          </button>
          <button 
            onClick={() => setActiveTab('dashboard-studio')} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${activeTab === 'dashboard-studio' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Studio Laporan
          </button>
          <button 
            onClick={() => setActiveTab('case-studies')} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${activeTab === 'case-studies' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Studi Kasus
          </button>
          <button 
            onClick={() => setActiveTab('quiz')} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${activeTab === 'quiz' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Kuis & Evaluasi
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => downloadCsv('Sales_Data_Practice.csv', rawSalesDataset)}
            title="Unduh dataset penjualan sintetis format CSV"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Unduh CSV</span>
          </button>
          
          <button
            onClick={openDocs}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dokumentasi & Setup</span>
          </button>
        </div>
      </div>
    </header>
  );
};
