import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ProjectData, Character, ScriptLine, ProjectSettings } from './types';
import { INITIAL_PROJECT } from './data/sampleProject';
import { loadProject, saveProject } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { LegalNoticeBanner } from './components/layout/LegalNotice';
import { ScriptEditor } from './components/script/ScriptEditor';
import { CharacterLibrary } from './components/characters/CharacterLibrary';
import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  const [project, setProject] = useState<ProjectData>(INITIAL_PROJECT);
  const [activeTab, setActiveTab] = useState<'script' | 'characters' | 'settings'>('script');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load project from IndexedDB / localStorage on mount
  useEffect(() => {
    let isCancelled = false;
    loadProject()
      .then((loaded) => {
        if (!isCancelled) {
          setProject(loaded);
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Error loading project:', err);
        setIsLoaded(true);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  // Autosave whenever project changes (debounced by 600ms)
  useEffect(() => {
    if (!isLoaded) return;

    setIsSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProject(project)
        .then(() => setIsSaving(false))
        .catch((err) => {
          console.error('Autosave error:', err);
          setIsSaving(false);
        });
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [project, isLoaded]);

  // Global keyboard shortcuts (Space to toggle audio playback, Ctrl+Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in an input or textarea, only check for Ctrl+Enter
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.key === ' ' && !isInput) {
        // Toggle the first playing audio or last audio element
        const audios = document.querySelectorAll('audio');
        let toggled = false;
        for (let i = 0; i < audios.length; i++) {
          const a = audios[i];
          if (!a.paused) {
            a.pause();
            toggled = true;
            break;
          }
        }
        if (!toggled && audios.length > 0) {
          audios[0].play().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update handlers
  const handleSelectChapter = (chapter: string) => {
    setProject((prev) => ({
      ...prev,
      currentChapter: chapter,
      currentPage: 1,
    }));
  };

  const handleSelectPage = (page: number) => {
    setProject((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleUpdateLine = useCallback((lineId: string, updates: Partial<ScriptLine>) => {
    setProject((prev) => ({
      ...prev,
      lines: prev.lines.map((l) => (l.id === lineId ? { ...l, ...updates } : l)),
    }));
  }, []);

  const handleDeleteLine = useCallback((lineId: string) => {
    setProject((prev) => ({
      ...prev,
      lines: prev.lines.filter((l) => l.id !== lineId),
    }));
  }, []);

  const handleDuplicateLine = useCallback((line: ScriptLine) => {
    setProject((prev) => {
      const newLine: ScriptLine = {
        ...line,
        id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        takes: [],
        status: 'idle',
        errorMessage: undefined,
      };
      const idx = prev.lines.findIndex((l) => l.id === line.id);
      const updatedLines = [...prev.lines];
      if (idx >= 0) {
        updatedLines.splice(idx + 1, 0, newLine);
      } else {
        updatedLines.push(newLine);
      }
      return { ...prev, lines: updatedLines };
    });
  }, []);

  const handleAddLine = useCallback(
    (chapter: string, page: number, panel: number, characterId: string) => {
      setProject((prev) => {
        const newLine: ScriptLine = {
          id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          chapter,
          page,
          panel,
          characterId,
          dialogue: '',
          emotion: 'neutral',
          speed: 1.0,
          takes: [],
          status: 'idle',
        };
        return {
          ...prev,
          lines: [...prev.lines, newLine],
        };
      });
    },
    []
  );

  const handleImportLines = useCallback(
    (newLines: ScriptLine[], mode: 'append' | 'replacePage') => {
      setProject((prev) => {
        if (mode === 'replacePage') {
          const retainedLines = prev.lines.filter(
            (l) => !(l.chapter === prev.currentChapter && l.page === prev.currentPage)
          );
          return {
            ...prev,
            lines: [...retainedLines, ...newLines],
          };
        } else {
          return {
            ...prev,
            lines: [...prev.lines, ...newLines],
          };
        }
      });
    },
    []
  );

  const handleUpdateCharacters = useCallback((characters: Character[]) => {
    setProject((prev) => ({
      ...prev,
      characters,
    }));
  }, []);

  const handleUpdateSettings = useCallback((settingsUpdates: Partial<ProjectSettings>) => {
    setProject((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settingsUpdates,
      },
    }));
  }, []);

  const handleTrackCharacterUsage = useCallback((charCount: number) => {
    setProject((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalCharactersGenerated: prev.stats.totalCharactersGenerated + charCount,
        totalGenerations: prev.stats.totalGenerations + 1,
        lastGeneratedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const handleReplaceProject = useCallback((newProject: ProjectData) => {
    setProject(newProject);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Safety & Legal Notice Banner */}
      <LegalNoticeBanner />

      {/* Main App Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        characterCount={project.characters.length}
        totalCharactersGenerated={project.stats.totalCharactersGenerated}
        isSaving={isSaving}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'script' && (
          <ScriptEditor
            lines={project.lines}
            characters={project.characters}
            currentChapter={project.currentChapter}
            currentPage={project.currentPage}
            onSelectChapter={handleSelectChapter}
            onSelectPage={handleSelectPage}
            onUpdateLine={handleUpdateLine}
            onDeleteLine={handleDeleteLine}
            onDuplicateLine={handleDuplicateLine}
            onAddLine={handleAddLine}
            onImportLines={handleImportLines}
            provider={project.settings.provider}
            outputFormat={project.settings.defaultOutputFormat}
            concurrencyLimit={project.settings.concurrencyLimit}
            onTrackCharacterUsage={handleTrackCharacterUsage}
          />
        )}

        {activeTab === 'characters' && (
          <CharacterLibrary
            characters={project.characters}
            onUpdateCharacters={handleUpdateCharacters}
            provider={project.settings.provider}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            project={project}
            onUpdateSettings={handleUpdateSettings}
            onUpdateCharacters={handleUpdateCharacters}
            onReplaceProject={handleReplaceProject}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Voice Studio</span>
            <span>•</span>
            <span>Comic & Manga Audio Generator</span>
          </div>
          <div className="text-slate-500">
            Fictional World League Football Audio • Respect creator licensing & voice rights.
          </div>
        </div>
      </footer>
    </div>
  );
}
