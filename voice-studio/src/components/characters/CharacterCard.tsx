import React, { useState } from 'react';
import { Character } from '../../types';
import { User, Volume2, Edit3, Trash2, Sliders, Play, Loader2 } from 'lucide-react';
import { generateSpeechForLine } from '../../services/ttsClient';

interface CharacterCardProps {
  character: Character;
  onEdit: (char: Character) => void;
  onDelete: (charId: string) => void;
  provider?: 'gemini' | 'mock';
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onEdit,
  onDelete,
  provider,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testAudioUrl, setTestAudioUrl] = useState<string | null>(null);

  const handleTestVoice = async () => {
    if (isTesting) return;
    setIsTesting(true);

    try {
      const sampleText = `Hello, I'm ${character.name}. Ready for matchday in the World League!`;
      const take = await generateSpeechForLine({
        line: {
          id: `test-${character.id}`,
          chapter: 'TEST',
          page: 1,
          panel: 1,
          characterId: character.id,
          dialogue: sampleText,
          emotion: 'neutral',
          speed: 1.0,
          takes: [],
          status: 'idle',
        },
        character,
        provider,
      });

      if (take.audioBlobUrl) {
        setTestAudioUrl(take.audioBlobUrl);
        const audio = new Audio(take.audioBlobUrl);
        audio.play().catch(console.error);
      }
    } catch (err: any) {
      console.error('Test voice error:', err);
      alert(`Voice Test Failed: ${err.message || 'Check server configuration.'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 hover:shadow-sky-950/20">
      <div>
        {/* Header with Avatar & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${character.avatarColor || 'from-sky-500 to-blue-700'} flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}
            >
              {character.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">{character.name}</h3>
              <p className="text-xs text-sky-400 font-medium">{character.role}</p>
              {character.age && (
                <span className="text-[11px] text-slate-400">Age: {character.age}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(character)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-sky-300 transition cursor-pointer"
              title="Edit character"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(character.id)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
              title="Delete character"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voice Description */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-3 text-xs text-slate-300 italic leading-relaxed">
          &ldquo;{character.voiceDescription}&rdquo;
        </div>

        {/* Voice Parameters */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-3">
          <div className="bg-slate-800/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50">
            <span className="text-slate-500 block text-[10px]">Pace / Speed</span>
            <span className="font-mono text-slate-200 font-semibold">{character.defaultSpeed}x</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg px-2.5 py-1.5 border border-slate-700/50">
            <span className="text-slate-500 block text-[10px]">Engine</span>
            <span className="font-mono text-sky-400 font-semibold">Gemini 3.8</span>
          </div>
        </div>

        {/* Gemini Voice Badge */}
        <div className="flex items-center justify-between bg-slate-950/80 rounded-xl px-3 py-2 border border-slate-800">
          <span className="text-slate-400 font-mono text-xs flex items-center gap-1.5 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Gemini Voice:</span>
          </span>
          <span className="font-mono text-sky-300 font-bold text-xs bg-sky-950/60 border border-sky-800 px-2.5 py-0.5 rounded-lg">
            {character.voice || 'Fenrir'}
          </span>
        </div>
      </div>

      {/* Footer test button */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={handleTestVoice}
          disabled={isTesting}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>Generating Preview...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Test Sample Voice</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
