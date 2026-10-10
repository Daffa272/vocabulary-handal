import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ModuleView } from './components/ModuleView';
import { InspectSimulator } from './components/InspectSimulator';
import { RequestSimulator } from './components/RequestSimulator';
import { CodeBuilder } from './components/CodeBuilder';
import { DatasetExplorer } from './components/DatasetExplorer';
import { EthicsChecklist } from './components/EthicsChecklist';
import { QuizView } from './components/QuizView';
import { MissionsView } from './components/MissionsView';
import { ScriptsAndZipView } from './components/ScriptsAndZipView';
import { WindowsGuideModal } from './components/WindowsGuideModal';
import { ChatAssistant } from './components/ChatAssistant';
import { MISSIONS_DATA } from './data/simulatorData';
import { generateAndDownloadZip } from './utils/zipGenerator';
import { Compass, Download, CheckCircle2, Laptop } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('modules');
  const [currentModuleId, setCurrentModuleId] = useState<number>(1);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isWindowsGuideOpen, setIsWindowsGuideOpen] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data from localStorage
  useEffect(() => {
    try {
      const savedMissions = localStorage.getItem('jejak_data_missions');
      if (savedMissions) {
        setCompletedMissions(JSON.parse(savedMissions));
      }

      const savedScore = localStorage.getItem('jejak_data_quiz_score');
      if (savedScore !== null) {
        setQuizScore(parseInt(savedScore, 10));
      }
    } catch (e) {
      // Local storage fallback
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleMission = (missionId: string) => {
    setCompletedMissions((prev) => {
      const updated = { ...prev, [missionId]: !prev[missionId] };
      localStorage.setItem('jejak_data_missions', JSON.stringify(updated));
      return updated;
    });
  };

  const handleQuizScoreUpdated = (score: number) => {
    setQuizScore(score);
    // Automatically mark the quiz mission as done if score >= 11 (approx 70%)
    if (score >= 11) {
      handleToggleMission('m6-3');
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      await generateAndDownloadZip();
      showToast('Arsip jejak-data-ambil-data.zip berhasil dibuat dan diunduh!');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat file zip. Anda tetap dapat menyalin file dari menu Folder Latihan.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const completedCount = Object.values(completedMissions).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1c222b] flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d1b2a] text-white border border-stone-700 px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        completedMissionsCount={completedCount}
        totalMissions={MISSIONS_DATA.length}
        quizScore={quizScore}
        onOpenWindowsGuide={() => setIsWindowsGuideOpen(true)}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'modules' && (
          <ModuleView
            currentModuleId={currentModuleId}
            onSelectModule={setCurrentModuleId}
            onOpenInspectSimulator={() => setActiveTab('inspect-sim')}
            onOpenRequestSimulator={() => setActiveTab('request-sim')}
            onOpenCodeBuilder={() => setActiveTab('code-builder')}
            onOpenWindowsGuide={() => setIsWindowsGuideOpen(true)}
          />
        )}

        {activeTab === 'inspect-sim' && <InspectSimulator />}

        {activeTab === 'request-sim' && <RequestSimulator />}

        {activeTab === 'code-builder' && <CodeBuilder />}

        {activeTab === 'dataset-lab' && <DatasetExplorer />}

        {activeTab === 'ethics-check' && <EthicsChecklist />}

        {activeTab === 'quiz' && (
          <QuizView
            onQuizScoreUpdated={handleQuizScoreUpdated}
            onNavigateToModule={(modId) => {
              setCurrentModuleId(modId);
              setActiveTab('modules');
            }}
          />
        )}

        {activeTab === 'missions' && (
          <MissionsView
            completedMissions={completedMissions}
            onToggleMission={handleToggleMission}
            onNavigateToModule={(modId) => {
              setCurrentModuleId(modId);
              setActiveTab('modules');
            }}
          />
        )}

        {activeTab === 'scripts' && (
          <ScriptsAndZipView
            onDownloadZip={handleDownloadZip}
            isDownloadingZip={isDownloadingZip}
            onOpenWindowsGuide={() => setIsWindowsGuideOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <span className="font-serif font-bold text-stone-800">Jejak Data</span>
            <span aria-hidden="true">·</span>
            <span>Panduan Mandiri Pemula Kaggle & Web Scraping Python</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500 font-mono text-[11px]">
            <span>Latihan lokal · Tanya AI terhubung ke Gemini</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsWindowsGuideOpen(true)}
              className="text-stone-700 hover:text-stone-900 underline cursor-pointer"
            >
              Panduan Windows
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleDownloadZip}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              Unduh ZIP
            </button>
          </div>
        </div>
      </footer>

      {/* Windows Guide Modal */}
      <WindowsGuideModal
        isOpen={isWindowsGuideOpen}
        onClose={() => setIsWindowsGuideOpen(false)}
      />
      <ChatAssistant />
    </div>
  );
}
