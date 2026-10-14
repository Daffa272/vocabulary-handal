import React, { useState } from 'react';
import { Character, EmotionTag, ScriptLine, AudioTake } from '../../types';
import { WaveformPlayer } from '../audio/WaveformPlayer';
import { triggerFileDownload, formatAudioFilename } from '../../services/zipExporter';
import { base64ToBlob, ensureTakeBlobUrl } from '../../services/ttsClient';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Download,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  History,
  Volume2,
  RotateCcw,
} from 'lucide-react';

interface ScriptLineItemProps {
  line: ScriptLine;
  characters: Character[];
  onUpdateLine: (lineId: string, updates: Partial<ScriptLine>) => void;
  onDeleteLine: (lineId: string) => void;
  onDuplicateLine: (line: ScriptLine) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onGenerate: (line: ScriptLine) => void;
  isFirst: boolean;
  isLast: boolean;
  isSelected?: boolean;
}

const EMOTION_OPTIONS: { value: EmotionTag; label: string; color: string }[] = [
  { value: 'neutral', label: 'Neutral', color: 'bg-slate-700 text-slate-200' },
  { value: 'excited', label: 'Excited', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { value: 'shouting', label: 'Shouting', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { value: 'angry', label: 'Angry', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { value: 'sarcastic', label: 'Sarcastic', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { value: 'sleepy', label: 'Sleepy', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'whisper', label: 'Whisper', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  { value: 'sad', label: 'Sad', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
];

export const ScriptLineItem: React.FC<ScriptLineItemProps> = ({
  line,
  characters,
  onUpdateLine,
  onDeleteLine,
  onDuplicateLine,
  onMoveUp,
  onMoveDown,
  onGenerate,
  isFirst,
  isLast,
  isSelected = false,
}) => {
  const currentCharacter = characters.find((c) => c.id === line.characterId);
  const activeTakeId = line.selectedTakeId || (line.takes.length > 0 ? line.takes[line.takes.length - 1].id : undefined);
  const activeTake = line.takes.find((t) => t.id === activeTakeId) || line.takes[line.takes.length - 1];

  const [showTakeList, setShowTakeList] = useState(false);

  const handleDownloadTake = (take: AudioTake, format: 'mp3' | 'wav') => {
    let blob: Blob;
    if (take.audioBase64) {
      blob = base64ToBlob(take.audioBase64, format === 'wav' ? 'audio/wav' : 'audio/mpeg');
    } else if (take.audioBlobUrl) {
      fetch(take.audioBlobUrl)
        .then((r) => r.blob())
        .then((b) => {
          const filename = formatAudioFilename(line, currentCharacter, take.takeNumber, format);
          triggerFileDownload(b, filename);
        });
      return;
    } else {
      return;
    }

    const filename = formatAudioFilename(line, currentCharacter, take.takeNumber, format);
    triggerFileDownload(blob, filename);
  };

  const handleDeleteTake = (takeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remainingTakes = line.takes.filter((t) => t.id !== takeId);
    const newSelectedId = remainingTakes.length > 0 ? remainingTakes[remainingTakes.length - 1].id : undefined;
    onUpdateLine(line.id, {
      takes: remainingTakes,
      selectedTakeId: newSelectedId,
      status: remainingTakes.length > 0 ? 'done' : 'idle',
    });
  };

  const handleSelectTake = (takeId: string) => {
    onUpdateLine(line.id, { selectedTakeId: takeId });
  };

  const maxCharLimit = 1000;
  const isOverLimit = line.dialogue.length > maxCharLimit;

  return (
    <div
      className={`bg-slate-900/90 border transition-all duration-150 rounded-2xl p-4 md:p-5 shadow-lg ${
        isSelected
          ? 'border-sky-500 shadow-sky-950/40 ring-1 ring-sky-500/50'
          : 'border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Top row: Panel tag, Character, Emotion, Speed, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center flex-wrap gap-2">
          {/* Panel tag */}
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono font-bold text-sky-400">
            Panel {line.panel}
          </div>

          {/* Character selector */}
          <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-xl px-2 py-1">
            <div
              className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${currentCharacter?.avatarColor || 'from-sky-500 to-blue-700'} flex items-center justify-center text-white font-bold text-xs shrink-0`}
            >
              {currentCharacter?.name ? currentCharacter.name.charAt(0) : '?'}
            </div>
            <select
              value={line.characterId}
              onChange={(e) => onUpdateLine(line.id, { characterId: e.target.value })}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {characters.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name} ({c.role})
                </option>
              ))}
            </select>
          </div>

          {/* Emotion tag dropdown */}
          <div className="relative">
            <select
              value={line.emotion}
              onChange={(e) => onUpdateLine(line.id, { emotion: e.target.value as EmotionTag })}
              className="bg-slate-950/90 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer capitalize"
            >
              {EMOTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  Emotion: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Speed slider */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-[10px] text-slate-400 font-mono">Speed</span>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={line.speed}
              onChange={(e) => onUpdateLine(line.id, { speed: parseFloat(e.target.value) })}
              className="w-16 h-1 accent-sky-500"
              title={`Line speed multiplier: ${line.speed}x`}
            />
            <span className="font-mono text-[10px] text-sky-300 w-8 text-right font-medium">
              {line.speed.toFixed(2)}x
            </span>
          </div>
        </div>

        {/* Right side line actions: move, duplicate, delete */}
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Move line up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Move line down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onDuplicateLine(line)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-sky-300 transition cursor-pointer"
            title="Duplicate line"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteLine(line.id)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
            title="Delete line"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dialogue and voice acting direction */}
      <div className="relative mb-3">
        <textarea
          rows={2}
          value={line.dialogue}
          onChange={(e) => onUpdateLine(line.id, { dialogue: e.target.value })}
          placeholder="Enter dialogue line (e.g. 'Eleven eggs is a reasonable number.')..."
          className={`w-full bg-slate-950/90 border rounded-xl p-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition leading-relaxed ${
            isOverLimit ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-sky-500'
          }`}
        />
        <div className="mt-2">
          <label
            htmlFor={`voice-acting-${line.id}`}
            className="block text-[11px] font-semibold text-slate-300 mb-1"
          >
            Voice Acting Description
          </label>
          <textarea
            id={`voice-acting-${line.id}`}
            rows={2}
            value={line.voiceActingDescription || ''}
            onChange={(e) => onUpdateLine(line.id, { voiceActingDescription: e.target.value })}
            placeholder="Contoh: speak softly, pause before the last word, sound breathless..."
            className="w-full resize-y bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition leading-relaxed"
          />
        </div>
        <div className="flex items-center justify-between mt-1 px-1 text-[11px]">
          <span className="text-slate-500 italic">
            Default: {currentCharacter?.name}: {currentCharacter?.voiceDescription.split(',')[0]}
          </span>
          <span
            className={`font-mono ${
              isOverLimit ? 'text-rose-400 font-bold' : line.dialogue.length > 500 ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            {line.dialogue.length} / {maxCharLimit} chars
          </span>
        </div>
      </div>

      {/* Error alert if failed */}
      {line.status === 'failed' && (
        <div className="mb-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-snug">{line.errorMessage || 'Generation failed. Check API key in Settings.'}</span>
          </div>
          <button
            onClick={() => onGenerate(line)}
            className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 rounded-lg text-white font-semibold text-xs shrink-0 flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Bottom row: Generation control & Takes playback */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Generate / Regenerate Button */}
          <button
            onClick={() => onGenerate(line)}
            disabled={line.status === 'generating' || line.status === 'queued' || !line.dialogue.trim()}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
              line.takes.length > 0
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950/50'
            }`}
            title="Generate audio with TTS (Ctrl+Enter)"
          >
            {line.status === 'generating' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Generating...</span>
              </>
            ) : line.status === 'queued' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Queued...</span>
              </>
            ) : line.takes.length > 0 ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Take Another ({line.takes.length}/5)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Speech</span>
              </>
            )}
          </button>

          {/* Takes switcher badges (up to 5 takes) */}
          {line.takes.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 px-1 font-mono uppercase font-semibold">Takes:</span>
              {line.takes.map((take) => {
                const isActive = take.id === activeTake?.id;
                return (
                  <button
                    key={take.id}
                    onClick={() => handleSelectTake(take.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title={`Take ${take.takeNumber} (${take.duration.toFixed(1)}s)`}
                  >
                    <span>T{take.takeNumber}</span>
                    {isActive && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Downloads & Single line export */}
        {activeTake && (
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-[10px] text-slate-500 font-mono">
              {activeTake.format.toUpperCase()} • {activeTake.duration.toFixed(1)}s
            </span>
            <button
              onClick={() => handleDownloadTake(activeTake, 'mp3')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
              title="Download line as MP3"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>MP3</span>
            </button>
            <button
              onClick={() => handleDownloadTake(activeTake, 'wav')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
              title="Download line as WAV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>WAV</span>
            </button>
            {line.takes.length > 1 && (
              <button
                onClick={(e) => handleDeleteTake(activeTake.id, e)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                title={`Delete Take ${activeTake.takeNumber}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active Take Waveform Player */}
      {activeTake && (
        <div className="mt-3 pt-2">
          <WaveformPlayer
            audioUrl={ensureTakeBlobUrl(activeTake)}
            compact={false}
          />
        </div>
      )}
    </div>
  );
};
