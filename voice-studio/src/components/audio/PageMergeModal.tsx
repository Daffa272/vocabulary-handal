import React, { useState } from 'react';
import { Character, ScriptLine, AudioTake } from '../../types';
import { mergeAudioTakes } from '../../services/audioMerger';
import { WaveformPlayer } from './WaveformPlayer';
import { triggerFileDownload } from '../../services/zipExporter';
import { Music, Download, Sliders, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PageMergeModalProps {
  lines: ScriptLine[];
  characters: Character[];
  chapter: string;
  page: number;
  onClose: () => void;
}

export const PageMergeModal: React.FC<PageMergeModalProps> = ({
  lines,
  characters,
  chapter,
  page,
  onClose,
}) => {
  const [silenceGap, setSilenceGap] = useState(0.4);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedResult, setMergedResult] = useState<{
    blob: Blob;
    url: string;
    duration: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter lines that have generated takes
  const linesWithTakes = lines.map((line) => {
    const activeTake =
      line.takes.find((t) => t.id === line.selectedTakeId) || line.takes[line.takes.length - 1];
    const character = characters.find((c) => c.id === line.characterId);
    return { line, activeTake, character };
  });

  const availableTakes = linesWithTakes
    .map((item) => item.activeTake)
    .filter((t): t is AudioTake => Boolean(t));

  const handleMerge = async () => {
    if (availableTakes.length === 0) {
      setErrorMsg('No audio takes found on this page. Please generate audio for dialogue lines first.');
      return;
    }

    setIsMerging(true);
    setErrorMsg(null);

    try {
      const result = await mergeAudioTakes(availableTakes, silenceGap);
      setMergedResult(result);
    } catch (err: any) {
      console.error('Audio merge error:', err);
      setErrorMsg(err.message || 'Failed to concatenate audio takes.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownloadMerged = () => {
    if (!mergedResult) return;
    const filename = `${chapter.toLowerCase()}_p${page}_full_dialogue_merged.wav`;
    triggerFileDownload(mergedResult.blob, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl p-6 shadow-2xl relative text-slate-200 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Merge Full Page Audio Track</h3>
            <p className="text-xs text-slate-400">
              Stitch all dialogue lines on {chapter} • Page {page} into one master audio track
            </p>
          </div>
        </div>

        {/* Silence Gap Slider */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold text-slate-200">Dialogue Silence Gap</span>
            </div>
            <span className="font-mono text-xs font-bold text-sky-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {silenceGap.toFixed(2)} seconds
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.05"
            value={silenceGap}
            onChange={(e) => setSilenceGap(parseFloat(e.target.value))}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Fast pacing (0.1s)</span>
            <span>Standard comic beat (0.4s)</span>
            <span>Dramatic pause (2.0s)</span>
          </div>
        </div>

        {/* List of lines that will be merged */}
        <div className="flex-1 overflow-y-auto mb-4 bg-slate-950/60 rounded-xl border border-slate-800/80 p-3 max-h-48 divide-y divide-slate-800/50 text-xs">
          {linesWithTakes.map(({ line, activeTake, character }, idx) => (
            <div key={line.id} className="py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[11px] text-sky-400 font-bold shrink-0">
                  Panel {line.panel}
                </span>
                <span className="font-semibold text-slate-200 shrink-0">
                  {character?.name || 'Unknown'}:
                </span>
                <span className="text-slate-400 truncate italic">
                  &ldquo;{line.dialogue}&rdquo;
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                {activeTake ? (
                  <span className="bg-emerald-950/60 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono">
                    Take {activeTake.takeNumber} ({activeTake.duration.toFixed(1)}s)
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[10px]">
                    No audio
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Merged audio player */}
        {mergedResult && (
          <div className="mb-4 bg-slate-950 p-4 rounded-xl border border-sky-900/60 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Merged Audio Ready ({mergedResult.duration.toFixed(1)}s total)</span>
              </div>
              <button
                onClick={handleDownloadMerged}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Merged Track (WAV)</span>
              </button>
            </div>
            <WaveformPlayer audioUrl={mergedResult.url} compact={false} />
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-auto">
          <span className="text-xs text-slate-400">
            {availableTakes.length} of {lines.length} lines have audio ready
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleMerge}
              disabled={isMerging || availableTakes.length === 0}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-950/50 flex items-center gap-2 cursor-pointer transition"
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-300" />
                  <span>Merging Track...</span>
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" />
                  <span>{mergedResult ? 'Re-merge Audio' : 'Generate Merged Track'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
