import React from 'react';
import { NavTab } from '../types';
import { 
  LayoutDashboard, 
  Map, 
  Database, 
  Filter, 
  Boxes, 
  FunctionSquare, 
  BarChart2, 
  FileSearch, 
  TrendingUp, 
  HardDrive, 
  PieChart, 
  Briefcase, 
  CheckCircle2, 
  BookMarked,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  completedModulesCount: number;
  totalModulesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  completedModulesCount,
  totalModulesCount
}) => {
  const navSections = [
    {
      heading: "Utama",
      items: [
        { id: 'dashboard' as NavTab, label: 'Dashboard Belajar', icon: LayoutDashboard },
        { id: 'learning-path' as NavTab, label: 'Alur Belajar (12 Level)', icon: Map, badge: `${completedModulesCount}/${totalModulesCount}` },
      ]
    },
    {
      heading: "Laboratorium Interaktif",
      items: [
        { id: 'connection-lab' as NavTab, label: 'Data Connection Lab', icon: Database },
        { id: 'power-query-lab' as NavTab, label: 'Power Query & Cleaning', icon: Filter },
        { id: 'modeling-lab' as NavTab, label: 'Data Modeling & Star Schema', icon: Boxes },
        { id: 'dax-lab' as NavTab, label: 'DAX Formula Lab', icon: FunctionSquare },
        { id: 'visualization-lab' as NavTab, label: 'Katalog Visualisasi', icon: BarChart2 },
        { id: 'interpretation-lab' as NavTab, label: 'Data Interpretation Lab', icon: FileSearch },
        { id: 'distribution-lab' as NavTab, label: 'Pola Distribusi & Outlier', icon: TrendingUp },
        { id: 'big-data-lab' as NavTab, label: 'Koneksi Big Data (1M Baris)', icon: HardDrive },
        { id: 'dashboard-studio' as NavTab, label: 'Studio Dashboard Penjualan', icon: PieChart },
      ]
    },
    {
      heading: "Portofolio & Evaluasi",
      items: [
        { id: 'case-studies' as NavTab, label: '4 Studi Kasus Nyata', icon: Briefcase },
        { id: 'quiz' as NavTab, label: 'Kuis & Asesmen', icon: CheckCircle2 },
        { id: 'glossary' as NavTab, label: 'Kamus Istilah Power BI', icon: BookMarked },
      ]
    }
  ];

  const progressPercent = Math.round((completedModulesCount / totalModulesCount) * 100);

  return (
    <aside className="w-64 shrink-0 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Progress Widget */}
      <div className="p-4 mx-3 my-3 bg-slate-900/90 rounded-xl border border-slate-800/80 shadow-inner">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium">Progres Kurikulum</span>
          <span className="text-cyan-400 font-bold font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{completedModulesCount} dari {totalModulesCount} Selesai</span>
          <span className="text-slate-500">Target Analis</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 space-y-6 pb-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              {section.heading}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left group ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1.5 ${
                          isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 text-slate-300 font-medium mb-1">
          <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simulasi Edukatif Realistis</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Kalkulasi DAX & transformasi data dieksekusi secara nyata di browser Anda.
        </p>
      </div>
    </aside>
  );
};
