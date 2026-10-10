import React, { useState } from 'react';
import { visualCatalogList } from '../../data/visualCatalog';
import { VisualCatalogItem } from '../../types';
import { 
  BarChart2, 
  Search, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ListOrdered, 
  ChevronRight,
  BarChart3,
  TrendingUp,
  PieChart,
  Layers,
  CreditCard,
  MapPin,
  GitFork,
  Filter
} from 'lucide-react';

export const VisualizationCatalogView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVisualId, setActiveVisualId] = useState<string>(visualCatalogList[0].id);

  const filteredVisuals = visualCatalogList.filter(v => {
    const matchCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        v.whyChoose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeVisual = visualCatalogList.find(v => v.id === activeVisualId) || visualCatalogList[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 7 KATALOG</span>
              <span>·</span>
              <span>14 STANDARD POWER BI VISUALS</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Katalog Visualisasi & Pemilihan Chart yang Tepat
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Panduan memilih visualisasi berdasarkan pertanyaan bisnis, jumlah dimensi, struktur kolom yang dibutuhkan, cara membaca pola, dan jebakan umum yang harus dihindari.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'KPI', 'Comparison', 'Trend', 'Composition', 'Distribution', 'Advanced'].map(cat => (
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

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jenis chart..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Visuals List & Deep-Dive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 14 Visual Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {filteredVisuals.map(v => {
            const isSelected = v.id === activeVisualId;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVisualId(v.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <BarChart3 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <span className="font-semibold block truncate text-slate-100">{v.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{v.category}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Deep-Dive Visual Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white font-display">
                {activeVisual.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Kategori: {activeVisual.category}
              </span>
            </div>

            {/* Why choose */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-cyan-400 font-semibold font-mono block">Mengapa Memilih Visual Ini?</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeVisual.whyChoose}
              </p>
            </div>

            {/* Business Questions Answered */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block font-mono">
                1. Pertanyaan Bisnis yang Dijawab:
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside bg-slate-950 p-3 rounded-lg border border-slate-800">
                {activeVisual.businessQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>

            {/* Required Columns */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block font-mono">
                2. Kolom / Field Data yang Diperlukan:
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside bg-slate-950 p-3 rounded-lg border border-slate-800">
                {activeVisual.requiredColumns.map((col, idx) => (
                  <li key={idx} className="font-mono text-[10px] text-cyan-300">{col}</li>
                ))}
              </ul>
            </div>

            {/* How to Build */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block font-mono">
                3. Langkah Pembuatan di Power BI:
              </span>
              <ol className="space-y-1 text-slate-300 text-[11px] list-decimal list-inside bg-slate-950 p-3 rounded-lg border border-slate-800">
                {activeVisual.buildSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Common Pitfalls & Mistakes */}
            <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Kesalahan Desain & Interpretasi yang Perlu Dihindari:</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {activeVisual.commonPitfalls.map((pitfall, idx) => (
                  <li key={idx}>{pitfall}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
