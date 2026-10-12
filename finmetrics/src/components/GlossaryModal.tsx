import React, { useState } from 'react';
import { financialGlossary } from '../data/financialData';
import { Search, X, BookOpen } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'Laba Rugi', 'Neraca', 'Arus Kas', 'Rasio & Valuasi'];

  const filteredItems = financialGlossary.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.englishTerm.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDef.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Glosarium Istilah & Rumus Keuangan
              </h3>
              <p className="text-xs text-slate-500">
                Kamus komprehensif istilah finansial, formula resmi, dan studi kasus.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari istilah (e.g. EBITDA, DSO, FCF, APIC)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                  activeCategory === c
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {c === 'all' ? 'Semua Kategori' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Items List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Tidak ada istilah keuangan yang cocok dengan pencarian "{search}".
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.term}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.englishTerm}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded self-start sm:self-auto">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {item.shortDef}
                </p>

                {item.formula && (
                  <div className="font-mono text-xs text-slate-800 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                    <span className="text-slate-400 select-none mr-2">Rumus:</span>
                    {item.formula}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Mengapa Penting?</span>
                    <span className="text-slate-600">{item.importance}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50/70 border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-0.5">Contoh Kasus:</span>
                    <span className="text-slate-600">{item.example}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Menampilkan {filteredItems.length} istilah keuangan</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            Tutup Glosarium
          </button>
        </div>
      </div>
    </div>
  );
};
