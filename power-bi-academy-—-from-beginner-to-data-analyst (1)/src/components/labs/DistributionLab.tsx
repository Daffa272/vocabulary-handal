import React, { useState } from 'react';
import { distributionTypes } from '../../data/distributionData';
import { calculateDescriptiveStats, computeHistogramBins } from '../../utils/statistics';
import { 
  TrendingUp, 
  Sliders, 
  HelpCircle, 
  BarChart2, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Maximize2
} from 'lucide-react';

export const DistributionLab: React.FC = () => {
  const [selectedDistId, setSelectedDistId] = useState<string>('right_skewed');
  const [binCount, setBinCount] = useState<number>(10);

  const currentDist = distributionTypes.find(d => d.id === selectedDistId) || distributionTypes[0];
  
  // Real statistical calculation on dataset points
  const stats = calculateDescriptiveStats(currentDist.dataPoints);
  const bins = computeHistogramBins(currentDist.dataPoints, binCount);
  const maxBinCount = Math.max(...bins.map(b => b.count), 1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 9 LAB</span>
              <span>·</span>
              <span>STATISTICAL DISTRIBUTIONS & OUTLIERS</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Pola Distribusi Data & Deteksi Pencilan (IQR)
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pelajari bagaimana bentuk sebaran data memengaruhi keabsahan rata-rata (mean vs median), cara mendeteksi outlier menggunakan pagar 1.5x IQR, dan efek penentuan jumlah bin histogram.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              Bin Slider: {binCount} Bins
            </span>
          </div>
        </div>

        {/* Distribution Pattern Picker */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          {distributionTypes.map(dist => {
            const isSelected = dist.id === selectedDistId;
            return (
              <button
                key={dist.id}
                onClick={() => setSelectedDistId(dist.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {dist.name.split(' (')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Histogram & Stats Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dynamic Histogram Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white font-display">
                  {currentDist.name}
                </h2>
                <span className="text-xs text-slate-400">
                  {currentDist.shapeDescription}
                </span>
              </div>

              {/* Bin Slider Control */}
              <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 font-mono">Jumlah Bin: {binCount}</span>
                <input
                  type="range"
                  min={5}
                  max={25}
                  value={binCount}
                  onChange={(e) => setBinCount(Number(e.target.value))}
                  className="w-24 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Custom Interactive SVG Histogram */}
            <div className="w-full bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
              <div className="h-56 w-full flex items-end gap-2 justify-between border-b border-slate-800 pb-2">
                {bins.map((b, idx) => {
                  const barHeightPct = Math.max(6, Math.round((b.count / maxBinCount) * 92));
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 px-2.5 py-1.5 bg-slate-800 text-[10px] text-white rounded shadow-xl whitespace-nowrap pointer-events-none font-mono">
                        <div>Rentang: {b.binLabel}</div>
                        <div>Frekuensi: {b.count} ({b.frequencyPercent}%)</div>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono mb-1 group-hover:text-cyan-300">
                        {b.count > 0 ? b.count : ''}
                      </div>

                      <div 
                        className="w-full bg-gradient-to-t from-cyan-600 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 rounded-t transition-all"
                        style={{ height: `${barHeightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Bin labels row */}
              <div className="flex justify-between text-[9px] text-slate-400 font-mono px-1">
                <span>Min: {stats.min}</span>
                <span>Interval Sumbu X: Ukuran Nilai</span>
                <span>Max: {stats.max}</span>
              </div>
            </div>

            {/* Mean vs Median Indicator Badge */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-medium">Relasi Mean vs Median:</span>
                <span className="text-cyan-300 font-mono font-semibold">{currentDist.meanVsMedian}</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Selisih Riil: {(stats.mean - stats.median).toFixed(2)}
              </div>
            </div>

            {/* Real World Scenario */}
            <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs space-y-1.5">
              <span className="text-indigo-300 font-semibold block">Skenario Bisnis Nyata:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentDist.realWorldScenario}
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                <strong className="text-slate-300">Strategi Analis:</strong> {currentDist.analysisStrategy}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Descriptive Statistics & IQR Outlier Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider pb-2 border-b border-slate-800">
              Statistik Deskriptif Aktual
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Jumlah Sampel (N)</span>
                <span className="font-mono text-white font-semibold">{stats.count} Poin</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Rata-Rata (Mean)</span>
                <span className="font-mono text-cyan-300 font-semibold">{stats.mean}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Nilai Tengah (Median)</span>
                <span className="font-mono text-emerald-300 font-semibold">{stats.median}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Standar Deviasi (σ)</span>
                <span className="font-mono text-indigo-300 font-semibold">{stats.stdDev}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Koefisien Skewness</span>
                <span className="font-mono text-amber-300 font-semibold">{stats.skewness}</span>
              </div>
            </div>

            {/* Outlier Box / IQR */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Pencilan (Outlier 1.5x IQR)</span>
                <span className="font-mono text-amber-400 font-bold">{stats.outliers.length} Data</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                <div>Q1: {stats.q1} · Q3: {stats.q3}</div>
                <div>IQR (Q3 - Q1): {stats.iqr}</div>
                <div>Pagar Bawah: {(stats.q1 - 1.5 * stats.iqr).toFixed(1)}</div>
                <div>Pagar Atas: {(stats.q3 + 1.5 * stats.iqr).toFixed(1)}</div>
              </div>
              {stats.outliers.length > 0 && (
                <div className="text-[10px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/30">
                  Nilai Outlier: {stats.outliers.join(', ')}
                </div>
              )}
            </div>

            {/* Warning Note */}
            <div className="p-3 rounded-lg bg-amber-950/25 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
              {currentDist.warningNote}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
