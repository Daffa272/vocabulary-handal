import React, { useState } from 'react';
import { Character, EmotionTag, ScriptLine } from '../../types';
import { FileText, Upload, Check, X, AlertTriangle, ArrowRight } from 'lucide-react';

interface BulkImportModalProps {
  characters: Character[];
  currentChapter: string;
  currentPage: number;
  onImportLines: (newLines: ScriptLine[], mode: 'append' | 'replacePage') => void;
  onClose: () => void;
}

interface ParsedLinePreview {
  chapter: string;
  page: number;
  panel: number;
  characterId: string;
  characterName: string;
  emotion: EmotionTag;
  dialogue: string;
  speed: number;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  characters,
  currentChapter,
  currentPage,
  onImportLines,
  onClose,
}) => {
  const [tab, setTab] = useState<'text' | 'csv'>('text');
  const [inputText, setInputText] = useState(
`CH2 P1 P1 | Lucas | Hey Berg! Did you seriously eat a dozen hard-boiled eggs before morning tactical drill?!
CH2 P1 P2 | Berg | Eleven eggs is a reasonable number.
CH2 P1 P3 | Diego | Eleven eggs! The kid is going to sink like an anchor when we hit the counter-attack.
CH2 P1 P4 | Daniel | Quiet down, both of you. Match officials are in the tunnel. Protect the midfield lines and stay sharp.`
  );
  const [importMode, setImportMode] = useState<'append' | 'replacePage'>('append');
  const [parsedLines, setParsedLines] = useState<ParsedLinePreview[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to match character name / alias
  const resolveCharacter = (charNameInput: string): Character => {
    const clean = charNameInput.trim().toLowerCase();
    const found = characters.find((c) => {
      const cName = c.name.toLowerCase();
      if (cName === clean) return true;
      if (cName.includes(clean)) return true;
      // Match by last name
      const parts = cName.split(' ');
      if (parts[parts.length - 1] === clean) return true;
      return false;
    });

    return found || characters[0];
  };

  // Helper to parse emotion if present e.g. "Berg [sarcastic]" or "Coach (angry)"
  const parseEmotion = (text: string): { name: string; emotion: EmotionTag } => {
    const match = text.match(/^(.*?)[\[\(]([a-zA-Z]+)[\]\)]$/);
    if (match) {
      const name = match[1].trim();
      const rawEmotion = match[2].trim().toLowerCase();
      const validEmotions: EmotionTag[] = [
        'neutral',
        'excited',
        'angry',
        'sad',
        'sleepy',
        'sarcastic',
        'shouting',
        'whisper',
      ];
      const emotion = validEmotions.includes(rawEmotion as any) ? (rawEmotion as EmotionTag) : 'neutral';
      return { name, emotion };
    }
    return { name: text.trim(), emotion: 'neutral' };
  };

  const handleParse = () => {
    setErrorMsg(null);
    const results: ParsedLinePreview[] = [];

    const lines = inputText.split(/\r?\n/).filter((l) => l.trim().length > 0);

    for (let idx = 0; idx < lines.length; idx++) {
      const rawLine = lines[idx].trim();
      if (rawLine.startsWith('#') || rawLine.startsWith('//')) continue; // comments

      if (tab === 'csv') {
        // CSV parsing (simple comma or semicolon separator)
        const parts = rawLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((p) => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 3) {
          // If header row, skip
          if (idx === 0 && parts[0].toLowerCase().includes('chapter')) continue;

          const ch = parts[0] || currentChapter;
          const pg = parseInt(parts[1], 10) || currentPage;
          const pnl = parseInt(parts[2], 10) || 1;
          const charInput = parts[3] || 'Berg';
          const { name: parsedCharName, emotion: extractedEmotion } = parseEmotion(charInput);
          const character = resolveCharacter(parsedCharName);
          const emotion = (parts[4]?.toLowerCase() as EmotionTag) || extractedEmotion;
          const dialogue = parts[5] || parts[3] || '';
          const speed = parseFloat(parts[6]) || 1.0;

          if (dialogue) {
            results.push({
              chapter: ch,
              page: pg,
              panel: pnl,
              characterId: character.id,
              characterName: character.name,
              emotion: emotion || 'neutral',
              dialogue,
              speed,
            });
          }
        }
      } else {
        // Standard text format: CH2 P1 P2 | Berg | Dialogue
        // Or: P1 | Berg | Dialogue
        const segments = rawLine.split('|').map((s) => s.trim());
        if (segments.length >= 2) {
          let ch = currentChapter;
          let pg = currentPage;
          let pnl = 1;

          const locPart = segments[0];
          // Try matching CH#
          const chMatch = locPart.match(/CH(\d+)/i);
          if (chMatch) ch = `CH${chMatch[1]}`;

          // Try matching P#
          const pMatches = Array.from(locPart.matchAll(/P(\d+)/gi));
          if (pMatches.length >= 2) {
            pg = parseInt(pMatches[0][1], 10);
            pnl = parseInt(pMatches[1][1], 10);
          } else if (pMatches.length === 1) {
            // Check if there is also "Panel #"
            const panelMatch = locPart.match(/Panel\s*(\d+)/i);
            if (panelMatch) {
              pg = parseInt(pMatches[0][1], 10);
              pnl = parseInt(panelMatch[1], 10);
            } else {
              pnl = parseInt(pMatches[0][1], 10);
            }
          }

          let charInput = '';
          let dialogue = '';

          if (segments.length >= 3) {
            charInput = segments[1];
            dialogue = segments.slice(2).join(' | ');
          } else {
            charInput = segments[0];
            dialogue = segments[1];
          }

          const { name: parsedCharName, emotion } = parseEmotion(charInput);
          const character = resolveCharacter(parsedCharName);

          results.push({
            chapter: ch,
            page: pg,
            panel: pnl,
            characterId: character.id,
            characterName: character.name,
            emotion,
            dialogue,
            speed: 1.0,
          });
        }
      }
    }

    if (results.length === 0) {
      setErrorMsg('Could not parse any valid lines. Please verify the format or delimiter.');
    } else {
      setParsedLines(results);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      if (file.name.endsWith('.csv')) {
        setTab('csv');
      }
    };
    reader.readAsText(file);
  };

  const executeImport = () => {
    if (parsedLines.length === 0) return;

    const newScriptLines: ScriptLine[] = parsedLines.map((p, i) => ({
      id: `line-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      chapter: p.chapter,
      page: p.page,
      panel: p.panel,
      characterId: p.characterId,
      dialogue: p.dialogue,
      emotion: p.emotion,
      speed: p.speed,
      takes: [],
      status: 'idle',
    }));

    onImportLines(newScriptLines, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 max-w-3xl w-full rounded-2xl p-6 shadow-2xl relative text-slate-200 max-h-[92vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Bulk Script & Dialogue Import</h3>
            <p className="text-xs text-slate-400">Paste script text or upload CSV from your writer notes</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setTab('text')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              tab === 'text'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            Script Text Format (CH2 P1 P2 | Character | Dialogue)
          </button>
          <button
            onClick={() => setTab('csv')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              tab === 'csv'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            CSV Format
          </button>

          <label className="ml-auto text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Upload File (.txt / .csv)</span>
            <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Text Area */}
        <div className="mb-3">
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              tab === 'csv'
                ? 'Chapter,Page,Panel,Character,Emotion,Text,Speed\nCH2,1,1,Lucas,excited,"Hey Berg!",1.1\nCH2,1,2,Berg,neutral,"Eleven eggs is a reasonable number.",0.9'
                : 'CH2 P1 P2 | Berg | Eleven eggs is a reasonable number.\nCH2 P1 P3 | Diego [sarcastic] | Eleven eggs! The kid is going to sink.'
            }
            className="w-full bg-slate-950 font-mono text-xs border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed"
          />
        </div>

        {/* Parse Button */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="text-[11px] text-slate-400">
            Current destination default: <strong className="text-sky-300">{currentChapter} • Page {currentPage}</strong>
          </div>
          <button
            onClick={handleParse}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
          >
            Parse & Preview Script
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed lines preview table */}
        {parsedLines.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col mb-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Parsed Lines Preview ({parsedLines.length} lines detected)</span>
              <span className="text-[11px] text-sky-400 font-mono">Ready to import</span>
            </div>
            <div className="overflow-y-auto max-h-48 p-2 divide-y divide-slate-800/60 text-xs">
              {parsedLines.map((item, idx) => (
                <div key={idx} className="py-2 px-2 flex items-center gap-3 hover:bg-slate-900/40 rounded-lg">
                  <span className="font-mono text-sky-400 font-semibold w-16 shrink-0">
                    {item.chapter} P{item.page}
                  </span>
                  <span className="font-mono text-slate-400 w-16 shrink-0">
                    Panel {item.panel}
                  </span>
                  <span className="font-bold text-slate-200 w-28 truncate shrink-0">
                    {item.characterName}
                  </span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 shrink-0 capitalize">
                    {item.emotion}
                  </span>
                  <span className="text-slate-300 truncate flex-1 italic">
                    &ldquo;{item.dialogue}&rdquo;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer controls: Mode selection & Confirm */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="append"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
                className="accent-sky-500"
              />
              <span>Append lines</span>
            </label>
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="replacePage"
                checked={importMode === 'replacePage'}
                onChange={() => setImportMode('replacePage')}
                className="accent-sky-500"
              />
              <span>Replace current page lines</span>
            </label>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={executeImport}
              disabled={parsedLines.length === 0}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-950/50 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Import {parsedLines.length} Lines</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
