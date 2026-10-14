import React, { useState } from 'react';
import { Character, GeminiVoiceName, GEMINI_VOICES_CATALOG } from '../../types';
import { CharacterCard } from './CharacterCard';
import { UserPlus, Search, RotateCcw, X, Check, Sparkles } from 'lucide-react';
import { DEFAULT_CHARACTERS } from '../../data/defaultCharacters';

interface CharacterLibraryProps {
  characters: Character[];
  onUpdateCharacters: (chars: Character[]) => void;
  provider?: 'gemini' | 'mock';
}

export const CharacterLibrary: React.FC<CharacterLibraryProps> = ({
  characters,
  onUpdateCharacters,
  provider = 'gemini',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formAge, setFormAge] = useState<string>('20');
  const [formDesc, setFormDesc] = useState('');
  const [formVoice, setFormVoice] = useState<GeminiVoiceName>('Fenrir');
  const [formSpeed, setFormSpeed] = useState(1.0);
  const [formGender, setFormGender] = useState<'male' | 'female' | 'neutral'>('male');

  const filteredCharacters = characters.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.voiceDescription.toLowerCase().includes(q)
    );
  });

  const openAddModal = () => {
    setFormName('');
    setFormRole('');
    setFormAge('22');
    setFormDesc('confident, clear delivery, natural pace');
    setFormVoice('Fenrir');
    setFormSpeed(1.0);
    setFormGender('male');
    setIsAddingNew(true);
    setEditingCharacter(null);
  };

  const openEditModal = (char: Character) => {
    setFormName(char.name);
    setFormRole(char.role);
    setFormAge(String(char.age || ''));
    setFormDesc(char.voiceDescription);
    setFormVoice(char.voice || 'Fenrir');
    setFormSpeed(char.defaultSpeed);
    setFormGender(char.gender || 'male');
    setEditingCharacter(char);
    setIsAddingNew(false);
  };

  const closeModal = () => {
    setEditingCharacter(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isAddingNew) {
      const colors = [
        'from-blue-600 to-indigo-700',
        'from-amber-500 to-orange-600',
        'from-emerald-600 to-teal-800',
        'from-cyan-500 to-blue-600',
        'from-rose-500 to-pink-600',
        'from-violet-600 to-purple-800',
      ];
      const newChar: Character = {
        id: `char-${Date.now()}`,
        name: formName.trim(),
        role: formRole.trim() || 'Comic Character',
        age: formAge ? parseInt(formAge, 10) || formAge : undefined,
        voiceDescription: formDesc.trim() || 'Original comic voice',
        voice: formVoice,
        avatarColor: colors[characters.length % colors.length],
        defaultSpeed: formSpeed,
        gender: formGender,
      };
      onUpdateCharacters([...characters, newChar]);
    } else if (editingCharacter) {
      const updated = characters.map((c) =>
        c.id === editingCharacter.id
          ? {
              ...c,
              name: formName.trim(),
              role: formRole.trim(),
              age: formAge ? parseInt(formAge, 10) || formAge : undefined,
              voiceDescription: formDesc.trim(),
              voice: formVoice,
              defaultSpeed: formSpeed,
              gender: formGender,
            }
          : c
      );
      onUpdateCharacters(updated);
    }
    closeModal();
  };

  const handleDelete = (charId: string) => {
    if (confirm('Are you sure you want to delete this character from the library?')) {
      onUpdateCharacters(characters.filter((c) => c.id !== charId));
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset character library to the 9 default comic characters?')) {
      onUpdateCharacters(DEFAULT_CHARACTERS);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters by name, role, or voice description..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleResetToDefaults}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Reset library to 9 default comic roster"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Roster</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-sky-950/50 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Character</span>
          </button>
        </div>
      </div>

      {/* Grid of Characters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCharacters.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onEdit={openEditModal}
            onDelete={handleDelete}
            provider={provider}
          />
        ))}

        {filteredCharacters.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800/80">
            <p className="text-slate-400 text-sm mb-2">No characters found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit Character */}
      {(isAddingNew || editingCharacter) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative text-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white">
                {isAddingNew ? 'Add New Character' : `Edit ${editingCharacter?.name}`}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Set character personality, voice description, and assigned Google Gemini Voice.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Character Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Alexander Berg"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role / Position</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Striker / Captain"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age</label>
                  <input
                    type="text"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="e.g. 21"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="neutral">Neutral / Other</option>
                  </select>
                </div>
              </div>

              {/* Google Gemini Voice Dropdown */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>Google Gemini Voice (Official) *</span>
                  <span className="text-sky-400 text-[10px] font-mono">Bawaan AI Console</span>
                </label>
                <select
                  value={formVoice}
                  onChange={(e) => setFormVoice(e.target.value as GeminiVoiceName)}
                  className="w-full bg-slate-950 font-medium text-sky-300 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer text-xs"
                >
                  <optgroup label="👨 Suara Pria (15 Karakter Suara)" className="font-bold text-slate-300 bg-slate-900">
                    {GEMINI_VOICES_CATALOG.filter((v) => v.gender === 'Male').map((v) => (
                      <option key={v.id} value={v.id} className="text-slate-200 bg-slate-950 font-normal">
                        {v.name} ({v.description})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="👩 Suara Wanita (15 Karakter Suara)" className="font-bold text-slate-300 bg-slate-900">
                    {GEMINI_VOICES_CATALOG.filter((v) => v.gender === 'Female').map((v) => (
                      <option key={v.id} value={v.id} className="text-slate-200 bg-slate-950 font-normal">
                        {v.name} ({v.description})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Voice Acting Description (Style Prompt)
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="young male, 21, deep warm voice, slow calm pace, naive and sincere..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Gemini TTS uses this description to adapt voice style, tone, and pacing.
                </p>
              </div>

              {/* Slider for default speed */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 font-semibold">Speech Pace / Speed</span>
                    <span className="font-mono text-sky-400 font-bold">{formSpeed.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.6"
                    step="0.02"
                    value={formSpeed}
                    onChange={(e) => setFormSpeed(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-lg shadow-sky-950/50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Character</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
