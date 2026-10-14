import React, { useState, useMemo } from 'react';
import { Character, ScriptLine, AudioTake } from '../../types';
import { ScriptLineItem } from './ScriptLineItem';
import { BulkImportModal } from './BulkImportModal';
import { PageMergeModal } from '../audio/PageMergeModal';
import { exportLinesToZip } from '../../services/zipExporter';
import { generateSpeechForLine } from '../../services/ttsClient';
import {
  Plus,
  Play,
  Sparkles,
  Download,
  Upload,
  Music,
  FolderArchive,
  BookOpen,
  FileCode,
  Search,
  Filter,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ScriptEditorProps {
  lines: ScriptLine[];
  characters: Character[];
  currentChapter: string;
  currentPage: number;
  onSelectChapter: (chapter: string) => void;
  onSelectPage: (page: number) => void;
  onUpdateLine: (lineId: string, updates: Partial<ScriptLine>) => void;
  onDeleteLine: (lineId: string) => void;
  onDuplicateLine: (line: ScriptLine) => void;
  onAddLine: (chapter: string, page: number, panel: number, characterId: string) => void;
  onImportLines: (newLines: ScriptLine[], mode: 'append' | 'replacePage') => void;
  provider?: 'gemini' | 'mock';
  outputFormat: string;
  concurrencyLimit: number;
  onTrackCharacterUsage: (count: number) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  lines,
  characters,
  currentChapter,
  currentPage,
  onSelectChapter,
  onSelectPage,
  onUpdateLine,
  onDeleteLine,
  onDuplicateLine,
  onAddLine,
  onImportLines,
  provider,
  outputFormat,
  concurrencyLimit,
  onTrackCharacterUsage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [characterFilter, setCharacterFilter] = useState<string>('all');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);

  // Batch generation queue state
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [batchError, setBatchError] = useState<string | null>(null);

  // ZIP download progress
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState({ percent: 0, text: '' });

  // Extract distinct chapters and pages
  const availableChapters = useMemo(() => {
    const set = new Set<string>();
    lines.forEach((l) => set.add(l.chapter));
    if (!set.has(currentChapter)) set.add(currentChapter);
    return Array.from(set).sort();
  }, [lines, currentChapter]);

  const availablePages = useMemo(() => {
    const set = new Set<number>();
    lines.filter((l) => l.chapter === currentChapter).forEach((l) => set.add(l.page));
    if (!set.has(currentPage)) set.add(currentPage);
    return Array.from(set).sort((a, b) => a - b);
  }, [lines, currentChapter, currentPage]);

  // Current page lines
  const pageLines = useMemo(() => {
    return lines.filter((l) => l.chapter === currentChapter && l.page === currentPage);
  }, [lines, currentChapter, currentPage]);

  // Filtered lines for display
  const displayLines = useMemo(() => {
    return pageLines.filter((l) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        l.dialogue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChar = characterFilter === 'all' || l.characterId === characterFilter;
      return matchesSearch && matchesChar;
    });
  }, [pageLines, searchQuery, characterFilter]);

  // Single line generator
  const handleGenerateSingleLine = async (line: ScriptLine) => {
    const character = characters.find((c) => c.id === line.characterId) || characters[0];
    onUpdateLine(line.id, { status: 'generating', errorMessage: undefined });

    try {
      const newTake = await generateSpeechForLine({
        line,
        character,
        provider,
        outputFormat,
      });

      const updatedTakes = [...line.takes.slice(-4), newTake]; // keep up to 5 takes
      onUpdateLine(line.id, {
        takes: updatedTakes,
        selectedTakeId: newTake.id,
        status: 'done',
        errorMessage: undefined,
      });

      onTrackCharacterUsage(line.dialogue.length);
    } catch (err: any) {
      console.error('Line generation error:', err);
      onUpdateLine(line.id, {
        status: 'failed',
        errorMessage: err.message || 'Generation failed',
      });
    }
  };

  // Batch generator with queue concurrency limit
  const handleGenerateBatch = async (linesToGenerate: ScriptLine[]) => {
    if (linesToGenerate.length === 0 || isBatchGenerating) return;

    setIsBatchGenerating(true);
    setBatchError(null);
    setBatchProgress({ current: 0, total: linesToGenerate.length, percent: 0 });

    // Mark all as queued
    linesToGenerate.forEach((l) => {
      onUpdateLine(l.id, { status: 'queued', errorMessage: undefined });
    });

    let completedCount = 0;
    const queue = [...linesToGenerate];

    const worker = async () => {
      while (queue.length > 0) {
        const line = queue.shift();
        if (!line) break;

        onUpdateLine(line.id, { status: 'generating' });
        const character = characters.find((c) => c.id === line.characterId) || characters[0];

        try {
          const newTake = await generateSpeechForLine({
            line,
            character,
            provider,
            outputFormat,
          });

          const currentLineObj = lines.find((l) => l.id === line.id) || line;
          const updatedTakes = [...currentLineObj.takes.slice(-4), newTake];

          onUpdateLine(line.id, {
            takes: updatedTakes,
            selectedTakeId: newTake.id,
            status: 'done',
            errorMessage: undefined,
          });

          onTrackCharacterUsage(line.dialogue.length);
        } catch (err: any) {
          console.error(`Batch generation error on line ${line.id}:`, err);
          onUpdateLine(line.id, {
            status: 'failed',
            errorMessage: err.message || 'Generation failed',
          });
        } finally {
          completedCount++;
          setBatchProgress({
            current: completedCount,
            total: linesToGenerate.length,
            percent: Math.round((completedCount / linesToGenerate.length) * 100),
          });
        }
      }
    };

    // Run workers up to concurrencyLimit
    const workerPromises = Array.from(
      { length: Math.min(concurrencyLimit, linesToGenerate.length) },
      () => worker()
    );

    await Promise.all(workerPromises);
    setIsBatchGenerating(false);
  };

  // Download page ZIP
  const handleDownloadPageZip = async () => {
    setIsZipping(true);
    try {
      const zipName = `${currentChapter}_Page_${currentPage}_Voice_Lines`;
      await exportLinesToZip(pageLines, characters, zipName, (percent, text) => {
        setZipProgress({ percent, text });
      });
    } catch (err: any) {
      alert(`Export ZIP Error: ${err.message}`);
    } finally {
      setIsZipping(false);
    }
  };

  // Download chapter ZIP
  const handleDownloadChapterZip = async () => {
    setIsZipping(true);
    try {
      const chapterLines = lines.filter((l) => l.chapter === currentChapter);
      const zipName = `${currentChapter}_Full_Chapter_Audio`;
      await exportLinesToZip(chapterLines, characters, zipName, (percent, text) => {
        setZipProgress({ percent, text });
      });
    } catch (err: any) {
      alert(`Export ZIP Error: ${err.message}`);
    } finally {
      setIsZipping(false);
    }
  };

  // Add line to current page
  const handleAddLineToPage = () => {
    const nextPanel = pageLines.length > 0 ? pageLines[pageLines.length - 1].panel : 1;
    onAddLine(currentChapter, currentPage, nextPanel, characters[0]?.id || 'char-berg');
  };

  // Add new page
  const handleAddNewPage = () => {
    const nextPageNum = (availablePages[availablePages.length - 1] || 0) + 1;
    onSelectPage(nextPageNum);
    onAddLine(currentChapter, nextPageNum, 1, characters[0]?.id || 'char-berg');
  };

  // Add new chapter
  const handleAddNewChapter = () => {
    const chapterNums = availableChapters
      .map((c) => parseInt(c.replace(/\D/g, ''), 10))
      .filter((n) => !isNaN(n));
    const nextChNum = chapterNums.length > 0 ? Math.max(...chapterNums) + 1 : 1;
    const newChapterId = `CH${nextChNum}`;
    onSelectChapter(newChapterId);
    onSelectPage(1);
    onAddLine(newChapterId, 1, 1, characters[0]?.id || 'char-berg');
  };

  // Line reordering
  const handleMoveLine = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pageLines.length) return;

    const lineA = pageLines[index];
    const lineB = pageLines[targetIndex];

    // Swap their panels or positions
    const tempPanel = lineA.panel;
    onUpdateLine(lineA.id, { panel: lineB.panel });
    onUpdateLine(lineB.id, { panel: tempPanel });
  };

  return (
    <div className="space-y-6">
      {/* Chapter & Page Navigation Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Chapters tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <span className="text-xs font-mono font-bold uppercase text-slate-400 mr-1 flex items-center gap-1.5 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Chapter:
          </span>
          {availableChapters.map((ch) => (
            <button
              key={ch}
              onClick={() => onSelectChapter(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                currentChapter === ch
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {ch}
            </button>
          ))}
          <button
            onClick={handleAddNewChapter}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-sky-300 rounded-lg transition cursor-pointer"
            title="Add new Chapter"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Page tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-mono font-bold uppercase text-slate-400 mr-1 shrink-0">
            Page:
          </span>
          {availablePages.map((pg) => (
            <button
              key={pg}
              onClick={() => onSelectPage(pg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                currentPage === pg
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Page {pg}
            </button>
          ))}
          <button
            onClick={handleAddNewPage}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-sky-300 rounded-lg transition cursor-pointer"
            title="Add new Page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search page dialogue..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Character filter */}
          <select
            value={characterFilter}
            onChange={(e) => setCharacterFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">All Characters</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk Import */}
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Import script or CSV dialogue"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Bulk Import</span>
          </button>

          {/* Merge Page Audio */}
          <button
            onClick={() => setShowMergeModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Merge all lines into one page audio track"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span>Merge Page Audio</span>
          </button>

          {/* Generate All (Page) */}
          <button
            onClick={() => handleGenerateBatch(pageLines)}
            disabled={isBatchGenerating || pageLines.length === 0}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-950/50 transition cursor-pointer"
          >
            {isBatchGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating ({batchProgress.current}/{batchProgress.total})</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate All (Page)</span>
              </>
            )}
          </button>

          {/* Download Page ZIP */}
          <button
            onClick={handleDownloadPageZip}
            disabled={isZipping || pageLines.length === 0}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Download all lines of this page as ZIP"
          >
            {isZipping ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span>Page ZIP</span>
          </button>
        </div>
      </div>

      {/* Batch Generation Progress Bar */}
      {isBatchGenerating && (
        <div className="bg-slate-900 border border-sky-800/80 rounded-2xl p-4 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-sky-300 mb-2">
            <span className="font-semibold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              Batch Synthesizing Dialogue Lines...
            </span>
            <span className="font-mono font-bold">
              {batchProgress.current} / {batchProgress.total} ({batchProgress.percent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${batchProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* ZIP Compression Progress */}
      {isZipping && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-lg text-xs flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Packaging ZIP Archive...</span>
              <span className="font-mono text-sky-400">{zipProgress.percent}%</span>
            </div>
            <div className="text-[11px] text-slate-400">{zipProgress.text}</div>
          </div>
        </div>
      )}

      {/* Script Lines List */}
      <div className="space-y-4">
        {displayLines.map((line, idx) => (
          <ScriptLineItem
            key={line.id}
            line={line}
            characters={characters}
            onUpdateLine={onUpdateLine}
            onDeleteLine={onDeleteLine}
            onDuplicateLine={onDuplicateLine}
            onMoveUp={() => handleMoveLine(idx, 'up')}
            onMoveDown={() => handleMoveLine(idx, 'down')}
            onGenerate={handleGenerateSingleLine}
            isFirst={idx === 0}
            isLast={idx === displayLines.length - 1}
          />
        ))}

        {displayLines.length === 0 && (
          <div className="py-16 text-center bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 p-8">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              No dialogue lines on {currentChapter} • Page {currentPage}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
              Add your first character dialogue line, or use Bulk Import to paste dialogue from your script.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleAddLineToPage}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dialogue Line</span>
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
              >
                <span>Bulk Import Script</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Add Line Button */}
      {displayLines.length > 0 && (
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={handleAddLineToPage}
            className="w-full py-3 bg-slate-900/80 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-sky-500/60 rounded-2xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition cursor-pointer group shadow-sm"
          >
            <Plus className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Add Next Dialogue Line (Panel {(displayLines[displayLines.length - 1]?.panel || 1)})</span>
          </button>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <BulkImportModal
          characters={characters}
          currentChapter={currentChapter}
          currentPage={currentPage}
          onImportLines={onImportLines}
          onClose={() => setShowBulkModal(false)}
        />
      )}

      {/* Page Merge Modal */}
      {showMergeModal && (
        <PageMergeModal
          lines={pageLines}
          characters={characters}
          chapter={currentChapter}
          page={currentPage}
          onClose={() => setShowMergeModal(false)}
        />
      )}
    </div>
  );
};
