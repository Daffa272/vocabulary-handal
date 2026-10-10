import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/modules/DashboardHome';
import { LearningPathView } from './components/modules/LearningPathView';
import { VisualizationCatalogView } from './components/modules/VisualizationCatalogView';
import { CaseStudiesView } from './components/modules/CaseStudiesView';
import { QuizView } from './components/modules/QuizView';
import { GlossaryView } from './components/modules/GlossaryView';
import { ReadmeModal } from './components/modules/ReadmeModal';

// Interactive Labs
import { DataConnectionLab } from './components/labs/DataConnectionLab';
import { PowerQueryLab } from './components/labs/PowerQueryLab';
import { DataModelingLab } from './components/labs/DataModelingLab';
import { DaxFormulaLab } from './components/labs/DaxFormulaLab';
import { DataInterpretationLab } from './components/labs/DataInterpretationLab';
import { DistributionLab } from './components/labs/DistributionLab';
import { BigDataLab } from './components/labs/BigDataLab';
import { DashboardStudio } from './components/labs/DashboardStudio';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);

  // Persistent Completed Modules
  const [completedModules, setCompletedModules] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('powerbi_academy_completed_modules');
      return saved ? JSON.parse(saved) : [1]; // Start with level 1 completed as introduction
    } catch {
      return [1];
    }
  });

  // Read quiz answers count from localStorage
  const [quizCount, setQuizCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('powerbi_academy_quiz_answers');
      return saved ? Object.keys(JSON.parse(saved)).length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('powerbi_academy_completed_modules', JSON.stringify(completedModules));
    } catch {
      // ignore
    }
  }, [completedModules]);

  const handleToggleComplete = (moduleId: number) => {
    setCompletedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleNavigateToLab = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleNavigateToLab} 
        openDocs={() => setIsDocsOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Persistent Left Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleNavigateToLab}
            completedModulesCount={completedModules.length}
            totalModulesCount={12}
          />
        </div>

        {/* Main Workspace Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardHome
              completedModules={completedModules}
              quizAnswersCount={quizCount}
              onNavigate={handleNavigateToLab}
            />
          )}

          {activeTab === 'learning-path' && (
            <LearningPathView
              completedModules={completedModules}
              onToggleComplete={handleToggleComplete}
              onNavigateToLab={handleNavigateToLab}
            />
          )}

          {activeTab === 'connection-lab' && (
            <DataConnectionLab />
          )}

          {activeTab === 'power-query-lab' && (
            <PowerQueryLab />
          )}

          {activeTab === 'modeling-lab' && (
            <DataModelingLab />
          )}

          {activeTab === 'dax-lab' && (
            <DaxFormulaLab />
          )}

          {activeTab === 'visualization-lab' && (
            <VisualizationCatalogView />
          )}

          {activeTab === 'interpretation-lab' && (
            <DataInterpretationLab />
          )}

          {activeTab === 'distribution-lab' && (
            <DistributionLab />
          )}

          {activeTab === 'big-data-lab' && (
            <BigDataLab />
          )}

          {activeTab === 'dashboard-studio' && (
            <DashboardStudio />
          )}

          {activeTab === 'case-studies' && (
            <CaseStudiesView />
          )}

          {activeTab === 'quiz' && (
            <QuizView />
          )}

          {activeTab === 'glossary' && (
            <GlossaryView />
          )}

          {activeTab === 'docs' && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold font-display text-white">Panduan Platform</h2>
              <button 
                onClick={() => setIsDocsOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500"
              >
                Buka Panduan Instalasi & VS Code
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Readme & Documentation Modal */}
      <ReadmeModal 
        isOpen={isDocsOpen} 
        onClose={() => setIsDocsOpen(false)} 
      />
    </div>
  );
}
