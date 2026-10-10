import React, { useState } from 'react';
import { calculateDescriptiveStats, generateStructuredInterpretation } from '../../utils/statistics';
import { rawSalesDataset } from '../../data/mockDatasets';
import { 
  FileSearch, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  BarChart2,
  Layers,
  Info
} from 'lucide-react';

export const DataInterpretationLab: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'margin' | 'trend' | 'discount'>('margin');

  // Compute live dataset slices based on scenario
  let numbersForStats: number[] = [];
  let scenarioTitle = "";
  let metricLabel = "";
  let scenarioContext = "";

  if (selectedScenario === 'margin') {
    numbersForStats = rawSalesDataset.map(r => Number(((r.profit / r.salesAmount) * 100).toFixed(1)));
    scenarioTitle = "Kasus 1: Diagnostik Margin Keuntungan & Kerugian Parsial";
    metricLabel = "Profit Margin % Seluruh Transaksi";
    scenarioContext = "kategori Furnitur (khususnya Meja Konferensi) memiliki transaksi bermargin minus (-9.1% hingga -20%), mengindikasikan struktur diskon melebihi marjin kotor produk";
  } else if (selectedScenario === 'trend') {
    numbersForStats = rawSalesDataset.map(r => Math.round(r.salesAmount / 1000000));
    scenarioTitle = "Kasus 2: Tren Nilai Transaksi Penjualan Bulanan";
    metricLabel = "Nilai Transaksi (Juta Rupiah)";
    scenarioContext = "penjualan menunjukkan kenaikan di kuartal IV dengan lonjakan transaksi B2B korporat di atas Rp 100 Juta";
  } else {
    numbersForStats = rawSalesDataset.map(r => Number((r.discount * 100).toFixed(0)));
    scenarioTitle = "Kasus 3: Distribusi Besaran Diskon yang Diberikan";
    metricLabel = "Persentase Diskon (%)";
    scenarioContext = "sebagian besar transaksi diberikan diskon 0% hingga 5%, namun ada diskon 15%-20% yang berkorelasi dengan penurunan laba";
  }

  const stats = calculateDescriptiveStats(numbersForStats);
  const report = generateStructuredInterpretation(metricLabel, stats, scenarioContext);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 8 LAB</span>
              <span>·</span>
              <span>STATISTICAL INTERPRETATION ENGINE</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Data Interpretation Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Membaca makna di balik grafik menggunakan kerangka profesional 5 tahap: Observasi Objektif, Bukti Statistik, Interpretasi Bisnis, Investigasi Lanjutan, dan Batasan Data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              5-Step Evidence Framework
            </span>
          </div>
        </div>

        {/* Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 mr-2 font-medium">Pilih Studi Kasus Interpretasi:</span>
          
          <button
            onClick={() => setSelectedScenario('margin')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedScenario === 'margin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1. Diagnostik Profit Margin Negatif
          </button>

          <button
            onClick={() => setSelectedScenario('trend')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedScenario === 'trend'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            2. Analisis Tren Transaksi & Skewness
          </button>

          <button
            onClick={() => setSelectedScenario('discount')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedScenario === 'discount'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3. Kebijakan Diskon vs Margin
          </button>
        </div>
      </div>

      {/* Main Grid: Data Visualization & Structured 5-Step Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Visual Representation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white font-display">
                Sebaran Data Aktual ({numbersForStats.length} Observasi)
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {metricLabel}
              </span>
            </div>

            {/* Custom SVG Distribution Mini-Chart */}
            <div className="h-44 w-full bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-end gap-1.5 justify-between">
              {numbersForStats.map((val, idx) => {
                const maxVal = Math.max(...numbersForStats) || 1;
                const minVal = Math.min(...numbersForStats);
                const heightPct = Math.max(12, Math.min(100, Math.round(((val - minVal) / (maxVal - minVal || 1)) * 90 + 10)));
                const isNegative = val < 0;
                const isOutlier = stats.outliers.includes(val);

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 px-2 py-1 bg-slate-800 text-[10px] text-white rounded shadow-lg whitespace-nowrap pointer-events-none font-mono">
                      Nilai: {val} {selectedScenario === 'margin' ? '%' : ''}
                    </div>

                    <div 
                      className={`w-full rounded-t transition-all ${
                        isOutlier 
                          ? 'bg-amber-400' 
                          : isNegative 
                          ? 'bg-red-500' 
                          : 'bg-cyan-500/70 group-hover:bg-cyan-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>Min: {stats.min}</span>
              <span>Median: {stats.median}</span>
              <span>Max: {stats.max}</span>
            </div>

            {/* Statistical Card Indicators */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Mean (Rata-rata)</span>
                <span className="text-sm font-bold text-slate-200 font-mono">{stats.mean}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Median (Nilai Tengah)</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">{stats.median}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Standar Deviasi</span>
                <span className="text-sm font-bold text-indigo-400 font-mono">{stats.stdDev}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Pencilan (Outliers)</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{stats.outliers.length} Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The 5-Part Structured Interpretation Report (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                HASIL EVALUASI MESIN INTERPRETASI
              </span>
              <h2 className="text-lg font-bold text-white font-display mt-0.5">
                {scenarioTitle}
              </h2>
            </div>

            {/* Section A */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold font-mono">
                <span className="w-5 h-5 rounded bg-cyan-950 flex items-center justify-center text-[11px] border border-cyan-800">A</span>
                <span>WHAT DO WE OBSERVE? (Observasi Objektif)</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-7 text-[11px]">
                {report.observation}
              </p>
            </div>

            {/* Section B */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold font-mono">
                <span className="w-5 h-5 rounded bg-indigo-950 flex items-center justify-center text-[11px] border border-indigo-800">B</span>
                <span>STATISTICAL EVIDENCE (Bukti Angka Pendukung)</span>
              </div>
              <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {report.statisticalEvidence.map((ev, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] flex justify-between items-center">
                    <span className="text-slate-400">{ev.metric}:</span>
                    <span className="font-mono text-white font-semibold">{ev.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
                <span className="w-5 h-5 rounded bg-emerald-950 flex items-center justify-center text-[11px] border border-emerald-800">C</span>
                <span>WHAT DOES IT MEAN? (Makna Konteks Bisnis)</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-7 text-[11px]">
                {report.interpretation}
              </p>
            </div>

            {/* Section D */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold font-mono">
                <span className="w-5 h-5 rounded bg-amber-950 flex items-center justify-center text-[11px] border border-amber-800">D</span>
                <span>WHAT SHOULD WE INVESTIGATE NEXT? (Langkah Penyelidikan Lanjutan)</span>
              </div>
              <ul className="pl-7 space-y-1.5 text-[11px] text-slate-300">
                {report.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section E */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-semibold font-mono">
                <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[11px] border border-slate-700">E</span>
                <span>LIMITATIONS & CAVEATS (Keterbatasan Data & Peringatan Analis)</span>
              </div>
              <ul className="pl-7 space-y-1 text-[11px] text-slate-400">
                {report.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
