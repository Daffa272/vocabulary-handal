import React, { useState } from 'react';
import { glossaryItemsList } from '../../data/glossary';
import { GlossaryItem } from '../../types';
import { 
  BookMarked, 
  Search, 
  Layers, 
  HelpCircle, 
  Sparkles,
  Tag
} from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = glossaryItemsList.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.relatedTerms.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>REFERENSI STANDAR INDUSTRI</span>
              <span>·</span>
              <span>KAMUS ISTILAH ANALISIS DATA</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Glosarium Istilah Microsoft Power BI & Data Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Kamus istilah teknis bahasa Inggris dan Indonesia untuk memperkuat fondasi konsep analitik Anda, mulai dari VertiPaq, Star Schema, hingga Context Transition.
            </p>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Core BI', 'Power Query', 'Modeling', 'DAX', 'Architecture'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah, formula, konsep..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Glossary Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-display">
                {item.term}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {item.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.definition}
            </p>

            {item.exampleOrFormula && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                {item.exampleOrFormula}
              </div>
            )}

            {item.relatedTerms.length > 0 && (
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                <Tag className="w-3 h-3 text-slate-500" />
                <span>Terkait:</span>
                {item.relatedTerms.map((rt, rIdx) => (
                  <span key={rIdx} className="bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                    {rt}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
