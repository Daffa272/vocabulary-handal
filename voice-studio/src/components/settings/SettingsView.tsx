import React, { useEffect, useState } from 'react';
import { Character, GeminiVoiceName, ProjectData, ProjectSettings, GEMINI_VOICES_CATALOG } from '../../types';
import {
  clearGeminiApiKey,
  exportProjectJson,
  importProjectJson,
  loadGeminiApiKey,
  resetProject,
  saveGeminiApiKey,
} from '../../services/storage';
import { triggerFileDownload } from '../../services/zipExporter';
import {
  Sparkles,
  CheckCircle2,
  Sliders,
  Download,
  Upload,
  RotateCcw,
  BarChart3,
  Server,
  Zap,
  Volume2,
  Eye,
  EyeOff,
  KeyRound,
  Save,
  Trash2,
} from 'lucide-react';

interface SettingsViewProps {
  project: ProjectData;
  onUpdateSettings: (settings: Partial<ProjectSettings>) => void;
  onUpdateCharacters: (characters: Character[]) => void;
  onReplaceProject: (newProject: ProjectData) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  project,
  onUpdateSettings,
  onUpdateCharacters,
  onReplaceProject,
}) => {
  const [serverHealth, setServerHealth] = useState<{
    geminiConfigured: boolean;
    provider: string;
    model: string;
    message: string;
  } | null>(null);

  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => loadGeminiApiKey());
  const [hasSavedApiKey, setHasSavedApiKey] = useState(() => Boolean(loadGeminiApiKey()));
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<string | null>(null);

  // Check backend server Gemini TTS health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerHealth(data);
        setIsLoadingHealth(false);
      })
      .catch((err) => {
        console.warn('Could not contact /api/health:', err);
        setServerHealth({
          geminiConfigured: false,
          provider: 'unknown',
          model: '',
          message: 'Server tidak dapat dihubungi.',
        });
        setIsLoadingHealth(false);
      });
  }, []);

  const handleGeminiVoiceChange = (charId: string, newVoice: GeminiVoiceName) => {
    const updated = project.characters.map((c) =>
      c.id === charId ? { ...c, voice: newVoice } : c
    );
    onUpdateCharacters(updated);
  };

  const handleSaveApiKey = () => {
    try {
      if (apiKey.trim()) {
        saveGeminiApiKey(apiKey);
        setApiKey(loadGeminiApiKey());
        setHasSavedApiKey(true);
        setApiKeyStatus('API Key tersimpan di browser ini.');
      } else {
        clearGeminiApiKey();
        setHasSavedApiKey(false);
        setApiKeyStatus('API Key dihapus.');
      }
    } catch (err) {
      console.error('Could not save Gemini API key:', err);
      setApiKeyStatus('Gagal menyimpan API Key. Periksa pengaturan penyimpanan browser.');
    }
  };

  const handleClearApiKey = () => {
    try {
      clearGeminiApiKey();
      setApiKey('');
      setHasSavedApiKey(false);
      setApiKeyStatus('API Key dihapus dari browser ini.');
    } catch (err) {
      console.error('Could not remove Gemini API key:', err);
      setApiKeyStatus('Gagal menghapus API Key dari browser.');
    }
  };

  const handleExportBackup = (includeAudio: boolean) => {
    const jsonStr = exportProjectJson(project, includeAudio);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_backup_${
      includeAudio ? 'full' : 'scripts_only'
    }.json`;
    triggerFileDownload(blob, filename);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importProjectJson(content);
        onReplaceProject(imported);
        setImportStatus('Project backup successfully imported!');
        setTimeout(() => setImportStatus(null), 3500);
      } catch (err: any) {
        alert(`Failed to import JSON backup: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = async () => {
    if (confirm('Are you sure you want to reset all comic project data to default? Any unsaved changes will be lost.')) {
      const resetData = await resetProject();
      onReplaceProject(resetData);
    }
  };

  // Character breakdown calculation
  const charStats = project.characters.map((c) => {
    const linesForChar = project.lines.filter((l) => l.characterId === c.id);
    const generatedTakesCount = linesForChar.reduce((acc, l) => acc + l.takes.length, 0);
    const charCount = linesForChar.reduce(
      (acc, l) => acc + (l.takes.length > 0 ? l.dialogue.length * l.takes.length : 0),
      0
    );
    return {
      character: c,
      linesCount: linesForChar.length,
      generatedTakesCount,
      charCount,
    };
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Gemini API Key Settings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
            <p className="text-xs text-slate-400">Masukkan API Key dari Google AI Studio untuk membuat audio.</p>
          </div>
        </div>

        <label htmlFor="gemini-api-key" className="block text-xs text-slate-300 font-semibold mb-2">
          API Key
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              id="gemini-api-key"
              type={isApiKeyVisible ? 'text' : 'password'}
              autoComplete="off"
              spellCheck={false}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setApiKeyStatus(null);
              }}
              placeholder="Masukkan Gemini API Key"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-11 text-slate-200 text-sm font-mono focus:outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={() => setIsApiKeyVisible((visible) => !visible)}
              aria-label={isApiKeyVisible ? 'Sembunyikan API Key' : 'Tampilkan API Key'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {isApiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSaveApiKey}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" /> Simpan
          </button>
          <button
            type="button"
            onClick={handleClearApiKey}
            disabled={!apiKey}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Hapus
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Key disimpan di browser ini saja, tidak dimasukkan ke backup proyek, dan dikirim ke server hanya saat membuat audio.
        </p>
        {apiKeyStatus && (
          <p role="status" className="mt-2 text-xs text-sky-300">{apiKeyStatus}</p>
        )}
      </div>

      {/* Google Gemini AI Engine Status Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Google AI Studio (Gemini 3.8 TTS Bawaan)</h3>
            <p className="text-xs text-slate-400">
              Sistem speech synthesis resmi menggunakan model AI Google langsung dari konsol
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold">Model Aktif:</span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-950 border border-sky-800 text-sky-300">
                gemini-3.8-flash-lite-tts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status API Key:</span>
              {isLoadingHealth ? (
                <span className="text-xs text-slate-500">Memeriksa...</span>
              ) : hasSavedApiKey || serverHealth?.geminiConfigured ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> API Key tersedia
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-full">
                  API Key belum diatur
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {serverHealth?.message || 'Memeriksa status server...'} Masukkan API Key Google AI Studio di atas atau atur GEMINI_API_KEY pada server. Model dapat mengolah emosi dialog komik dan gaya suara karakter secara alami.
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span className="flex items-center gap-1.5 text-sky-300">
              <Zap className="w-3.5 h-3.5" />
              <span>30 Karakter Suara Resmi Gemini Tersedia: 15 Pria & 15 Wanita</span>
            </span>
            <span className="font-mono text-slate-500 text-[11px]">Free Tier Ready</span>
          </div>
        </div>
      </div>

      {/* Voice Mapping Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pemetaan Suara Karakter (Gemini Voice Mapping)</h3>
            <p className="text-xs text-slate-400">
              Atur tipe suara Google Gemini untuk masing-masing karakter komik Anda
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Karakter Komik</th>
                <th className="py-2.5 px-3">Peran / Posisi</th>
                <th className="py-2.5 px-3">Pilihan Suara Gemini AI</th>
                <th className="py-2.5 px-3 text-right">Pace Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {project.characters.map((char) => (
                <tr key={char.id} className="hover:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${char.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                      >
                        {char.name.charAt(0)}
                      </div>
                      <span>{char.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{char.role}</td>
                  <td className="py-2.5 px-3">
                    <select
                      value={char.voice || 'Fenrir'}
                      onChange={(e) => handleGeminiVoiceChange(char.id, e.target.value as GeminiVoiceName)}
                      className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-sky-300 font-bold text-xs focus:outline-none focus:border-sky-500 cursor-pointer w-full max-w-sm"
                    >
                      <optgroup label="👨 Suara Pria (15 Karakter Suara)" className="font-bold text-slate-300 bg-slate-900">
                        {GEMINI_VOICES_CATALOG.filter((v) => v.gender === 'Male').map((v) => (
                          <option key={v.id} value={v.id} className="text-slate-200 bg-slate-950 font-normal">
                            {v.name} — {v.description}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="👩 Suara Wanita (15 Karakter Suara)" className="font-bold text-slate-300 bg-slate-900">
                        {GEMINI_VOICES_CATALOG.filter((v) => v.gender === 'Female').map((v) => (
                          <option key={v.id} value={v.id} className="text-slate-200 bg-slate-950 font-normal">
                            {v.name} — {v.description}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300 font-semibold">
                    {char.defaultSpeed}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audio Output Settings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pengaturan Format & Antrean Pemrosesan</h3>
            <p className="text-xs text-slate-400">Pengaturan ekspor audio dan jeda diam antar panel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-slate-300 font-semibold mb-2">Format Audio Output</label>
            <select
              value={project.settings.defaultOutputFormat}
              onChange={(e) =>
                onUpdateSettings({ defaultOutputFormat: e.target.value as any })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="wav">WAV Lossless PCM (Standar Bawaan Gemini)</option>
              <option value="mp3">MP3 44.1kHz High-Compatibility</option>
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-slate-300 font-semibold mb-2">
              Batas Konkurensi Antrean
            </label>
            <select
              value={project.settings.concurrencyLimit}
              onChange={(e) =>
                onUpdateSettings({ concurrencyLimit: parseInt(e.target.value, 10) })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value={1}>1 worker (Paling teratur)</option>
              <option value={2}>2 workers (Rekomendasi stabil)</option>
              <option value={3}>3 workers (Cepat paralel)</option>
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-slate-300 font-semibold mb-2">
              Jeda Diam Penggabungan (Silence Gap)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="3.0"
                value={project.settings.mergeSilenceGap}
                onChange={(e) =>
                  onUpdateSettings({ mergeSilenceGap: parseFloat(e.target.value) || 0.4 })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <span className="text-slate-400 font-mono">detik</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Jeda jeda alami antar balon dialog komik.</p>
          </div>
        </div>
      </div>

      {/* Usage Monitor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Statistik Penggunaan Karakter Dialog</h3>
            <p className="text-xs text-slate-400">
              Pelacakan jumlah karakter dialog yang telah di-generate dalam sesi ini
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Total Karakter Disintesis</span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {project.stats.totalCharactersGenerated.toLocaleString()} karakter
            </span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Total Take Rekaman Audio</span>
            <span className="text-xl font-bold font-mono text-slate-200">
              {charStats.reduce((acc, c) => acc + c.generatedTakesCount, 0)} takes
            </span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-semibold text-slate-300 mb-2">Statistik per Karakter Komik</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {charStats.map(({ character, linesCount, generatedTakesCount, charCount }) => (
              <div
                key={character.id}
                className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between"
              >
                <div className="truncate mr-2">
                  <span className="font-semibold text-slate-200 block truncate">{character.name}</span>
                  <span className="text-[10px] text-slate-500">
                    Voice: {character.voice} • {linesCount} baris
                  </span>
                </div>
                <span className="font-mono text-sky-300 text-[11px] shrink-0 font-bold">
                  {charCount.toLocaleString()} ch
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup & Project JSON Export/Import */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cadangan & Pemulihan Proyek (Backup & Restore)</h3>
            <p className="text-xs text-slate-400">
              Ekspor dan impor data proyek naskah komik dalam format JSON
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExportBackup(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Ekspor Lengkap (JSON)</span>
            </button>
            <button
              onClick={() => handleExportBackup(false)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <span>Ekspor Naskah Saja</span>
            </button>

            <label className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Impor Cadangan</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-900/60 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Template Bawaan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
