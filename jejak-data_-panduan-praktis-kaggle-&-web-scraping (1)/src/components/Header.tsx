import React from 'react';
import { 
  Compass, 
  Terminal, 
  BookOpen, 
  Search, 
  Send, 
  Code2, 
  Table2, 
  ShieldCheck, 
  HelpCircle, 
  CheckSquare, 
  Download, 
  Laptop
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  completedMissionsCount: number;
  totalMissions: number;
  quizScore: number | null;
  onOpenWindowsGuide: () => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  completedMissionsCount,
  totalMissions,
  quizScore,
  onOpenWindowsGuide,
  onDownloadZip,
  isDownloadingZip
}) => {
  const progressPercent = Math.round((completedMissionsCount / totalMissions) * 100);

  const navItems = [
    { id: 'modules', label: 'Modul Belajar', icon: BookOpen },
    { id: 'inspect-sim', label: 'Simulator Inspect', icon: Search },
    { id: 'request-sim', label: 'Simulator Request/Response', icon: Send },
    { id: 'code-builder', label: 'Pembangun Kode', icon: Code2 },
    { id: 'dataset-lab', label: 'Eksplorasi Hasil', icon: Table2 },
    { id: 'ethics-check', label: 'Checklist Etika', icon: ShieldCheck },
    { id: 'quiz', label: 'Kuis (15 Soal)', icon: HelpCircle },
    { id: 'missions', label: 'Misi Ekspedisi', icon: CheckSquare },
    { id: 'scripts', label: 'Folder Latihan Python', icon: Terminal },
  ];

  return (
    <header className="border-b border-stone-200 bg-[#0d1b2a] text-stone-100">
      {/* Top Banner & Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Jejak Data · Laboratorium Eksplorasi Digital</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="text-stone-400">Panduan Windows & Python</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Panduan Praktis Kaggle & Web Scraping
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl font-sans">
              Belajar sambil mencoba (hands-on): pahami struktur HTML, kirim HTTP request, unduh dataset Kaggle, dan olah CSV di Windows tanpa pusing.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenWindowsGuide}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-700 border border-stone-700 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer"
            >
              <Laptop className="w-3.5 h-3.5 text-sky-400" />
              <span>Panduan Windows</span>
            </button>

            <button
              onClick={onDownloadZip}
              disabled={isDownloadingZip}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-sm hover:shadow active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingZip ? 'Mengemas ZIP...' : 'Unduh Paket ZIP Lengkap'}</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-400 gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-stone-300">Progres Ekspedisi:</span>
            <div className="w-36 sm:w-48 bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
              <div 
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-medium text-amber-400">{completedMissionsCount}/{totalMissions} Misi ({progressPercent}%)</span>
          </div>

          <div className="flex items-center gap-3">
            {quizScore !== null ? (
              <span className="text-emerald-400 font-mono">
                Skor Kuis Terakhir: {quizScore}/15 ({Math.round((quizScore / 15) * 100)}%)
              </span>
            ) : (
              <span className="text-stone-400">Kuis belum dikerjakan</span>
            )}
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-mono">Simulator offline · Tanya AI online</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="border-t border-stone-800/90 bg-[#09131e] px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1 max-w-7xl mx-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
