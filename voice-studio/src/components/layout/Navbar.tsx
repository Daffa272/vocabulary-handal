import React, { useState } from 'react';
import {
  Mic2,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Save,
  CheckCircle2,
  X,
  Keyboard,
  ShieldAlert,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'script' | 'characters' | 'settings';
  onSelectTab: (tab: 'script' | 'characters' | 'settings') => void;
  characterCount: number;
  totalCharactersGenerated: number;
  isSaving: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  characterCount,
  totalCharactersGenerated,
  isSaving,
}) => {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  return (
    <>
      <header className="bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-950/60 shrink-0">
              <Mic2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>Voice Studio</span>
                  <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded font-semibold">
                    Comic TTS
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                World League Football Audio • English Dub
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Script Editor</span>
            </button>

            <button
              onClick={() => onSelectTab('characters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'characters'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Characters</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'characters'
                    ? 'bg-slate-950/30 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {characterCount}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings & Quota</span>
              <span className="md:hidden">Settings</span>
            </button>
          </nav>

          {/* Right Status Badges */}
          <div className="flex items-center gap-2">
            {/* Autosave status indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono"
              title="Project changes are saved automatically to IndexedDB / localStorage"
            >
              {isSaving ? (
                <>
                  <Save className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Autosaved</span>
                </>
              )}
            </div>

            {/* Total characters usage badge */}
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-sky-300"
              title="Total dialogue characters synthesized this session"
            >
              <span className="text-slate-500 font-sans">Used:</span>
              <span className="font-bold">{totalCharactersGenerated.toLocaleString()}</span>
              <span className="text-slate-500 font-sans text-[10px]">ch</span>
            </div>

            {/* Keyboard shortcuts trigger */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer border border-slate-800/60"
              title="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl relative text-slate-200">
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Keyboard Shortcuts</h3>
                <p className="text-xs text-slate-400">Quick controls for comic audio workflows</p>
              </div>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-800/80">
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-300 font-medium">Play / Pause Active Audio</span>
                <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg font-mono text-sky-300 text-xs shadow">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-300 font-medium">Generate Focused Line</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg font-mono text-sky-300 text-xs shadow">
                    Ctrl
                  </kbd>
                  <span className="text-slate-500">+</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg font-mono text-sky-300 text-xs shadow">
                    Enter
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-300 font-medium">Close Modal / Dialog</span>
                <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg font-mono text-sky-300 text-xs shadow">
                  Esc
                </kbd>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
