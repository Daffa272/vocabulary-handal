import React, { useState } from 'react';
import { daxFunctionsList, executeDaxSimulation } from '../../data/daxFunctions';
import { rawSalesDataset } from '../../data/mockDatasets';
import { 
  FunctionSquare, 
  Play, 
  HelpCircle, 
  Layers, 
  Sliders, 
  Code2, 
  CheckCircle2, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const DaxFormulaLab: React.FC = () => {
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>('calculate');
  const [targetCategory, setTargetCategory] = useState<string>('Technology');
  const [minProfitFilter, setMinProfitFilter] = useState<number>(10000000);

  const selectedFunction = daxFunctionsList.find(f => f.id === selectedFunctionId) || daxFunctionsList[0];

  const simulationResult = executeDaxSimulation(selectedFunction.id, rawSalesDataset, {
    selectedCategory: targetCategory,
    minProfit: minProfitFilter
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 6 LAB</span>
              <span>·</span>
              <span>FORMULA ENGINE & DAX MEASURES</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              DAX Formula Lab: Logika Kalkulasi Analitis
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Kuasai Data Analysis Expressions (DAX) melalui editor interaktif. Eksplorasi sintaks, pahami perbedaan Row Context vs Filter Context, dan uji evaluasi measure pada dataset penjualan aktual.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              30 Transaksi Aktif
            </span>
          </div>
        </div>

        {/* Function Category Picker */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          {daxFunctionsList.map(func => {
            const isSelected = func.id === selectedFunctionId;
            return (
              <button
                key={func.id}
                onClick={() => setSelectedFunctionId(func.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {func.name}()
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Code Editor & Execution Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Formula Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white font-display">
                  Editor Measure DAX Interaktif
                </h2>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                selectedFunction.contextType === 'Filter Context'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                  : selectedFunction.contextType === 'Row Context'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                  : 'bg-purple-950 text-purple-300 border border-purple-800/60'
              }`}>
                Konteks: {selectedFunction.contextType}
              </span>
            </div>

            {/* Simulated DAX Code Canvas */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-400 text-[11px] font-sans flex items-center justify-between">
                <span>Formula Measure Aktif:</span>
                <span className="text-emerald-400 font-mono text-[10px]">Valid DAX Syntax</span>
              </div>
              <div className="text-cyan-400 font-semibold text-sm">
                {selectedFunction.id === 'calculate' ? (
                  <>
                    {targetCategory} Sales = <br />
                    <span className="text-purple-400">CALCULATE</span>(<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;[Total Sales],<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;Sales[Category] = <span className="text-emerald-300">"{targetCategory}"</span><br />
                    )
                  </>
                ) : selectedFunction.id === 'filter' ? (
                  <>
                    High Profit Orders = <br />
                    <span className="text-purple-400">CALCULATE</span>(<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;[Total Orders],<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">FILTER</span>(Sales, Sales[Profit] &gt; <span className="text-amber-300">{minProfitFilter.toLocaleString('id-ID')}</span>)<br />
                    )
                  </>
                ) : (
                  <span>{selectedFunction.sampleFormula}</span>
                )}
              </div>
            </div>

            {/* Dynamic Interactive Parameter Sliders if applicable */}
            {selectedFunction.id === 'calculate' && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <label className="text-slate-300 font-medium block">
                  Ubah Parameter Filter Kondisi:
                </label>
                <div className="flex gap-2">
                  {['Technology', 'Furniture', 'Office Supplies'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTargetCategory(cat)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        targetCategory === cat
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedFunction.id === 'filter' && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Ambang Batas Laba Filter:</span>
                  <span className="font-mono text-cyan-400">Rp {minProfitFilter.toLocaleString('id-ID')}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={1000000}
                  value={minProfitFilter}
                  onChange={(e) => setMinProfitFilter(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            )}

            {/* Syntax Breakdown List */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-semibold font-mono block">
                Penjelasan Bagian Argumen Sintaks:
              </span>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="font-mono text-cyan-300 text-[11px]">
                  {selectedFunction.syntax}
                </div>
                {selectedFunction.syntaxBreakdown.map((item, idx) => (
                  <div key={idx} className="text-slate-300 text-[11px] pl-2 border-l border-slate-800">
                    <span className="font-mono text-indigo-300">{item.param}</span>: {item.desc}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Notes */}
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg text-xs space-y-1">
              <span className="text-cyan-300 font-semibold block">Aplikasi Kasus Nyata:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedFunction.businessApplication}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live Calculation Output & Evaluation Context (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Execution Output */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 font-mono">
                HASIL EVALUASI LIVE VERTIPAQ
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Synchronized</span>
              </span>
            </div>

            {/* KPI Callout */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-cyan-500/30 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider block">
                {simulationResult.metricName}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight text-cyan-300">
                {simulationResult.formattedDisplay}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Tipe Output: {selectedFunction.returnType}
              </span>
            </div>

            {/* Explanation of execution */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-medium block">Detail Komputasi:</span>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                {simulationResult.explanation}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>Filter Context Diterapkan:</span>
                <span className="font-mono text-cyan-400">{simulationResult.appliedFilters}</span>
              </div>
            </div>
          </div>

          {/* Context Explainer Box */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Memahami Dua Konteks DAX</span>
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-cyan-300 block mb-0.5">1. Filter Context (Konteks Filter)</strong>
                <p className="text-slate-400 leading-relaxed">
                  Menentukan baris-baris mana saja dalam tabel yang diikutsertakan dalam kalkulasi. Diciptakan oleh slicer pengguna, baris tabel visual, atau fungsi <code className="text-cyan-300 font-mono">CALCULATE</code>.
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <strong className="text-indigo-300 block mb-0.5">2. Row Context (Konteks Baris)</strong>
                <p className="text-slate-400 leading-relaxed">
                  Menentukan baris spesifik saat ini. Ada saat membuat Calculated Column atau saat fungsi iterator seperti <code className="text-indigo-300 font-mono">SUMX</code> menelusuri data baris demi baris.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
