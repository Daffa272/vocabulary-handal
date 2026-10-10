import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
} from 'recharts';
import { Sparkles, Sliders, RefreshCw, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import {
  generateForecastProjections,
  calculateBreakEvenRevenue,
  calculateCAGR,
} from '../../services/forecastEngine';
import { formatFinancialNumber, formatPercent } from '../../services/calculationEngine';

export const ForecastScenarioView: React.FC = () => {
  const { activePeriod, scenarioAssumptions, setScenarioAssumptions, currency } = useFinancial();

  const [activeScenario, setActiveScenario] = useState<'base' | 'optimistic' | 'pessimistic'>('base');

  const currentAssumptions = scenarioAssumptions[activeScenario];

  // Helper to update specific slider
  const updateAssumption = (key: keyof typeof currentAssumptions, value: number) => {
    setScenarioAssumptions((prev) => ({
      ...prev,
      [activeScenario]: {
        ...prev[activeScenario],
        [key]: value,
      },
    }));
  };

  // Generate 5-year projections for all 3 scenarios for comparison
  const baseProjections = useMemo(
    () => generateForecastProjections(activePeriod, scenarioAssumptions.base, 5),
    [activePeriod, scenarioAssumptions.base]
  );
  const optProjections = useMemo(
    () => generateForecastProjections(activePeriod, scenarioAssumptions.optimistic, 5),
    [activePeriod, scenarioAssumptions.optimistic]
  );
  const pessProjections = useMemo(
    () => generateForecastProjections(activePeriod, scenarioAssumptions.pessimistic, 5),
    [activePeriod, scenarioAssumptions.pessimistic]
  );

  const activeProjections =
    activeScenario === 'base'
      ? baseProjections
      : activeScenario === 'optimistic'
      ? optProjections
      : pessProjections;

  // Break-even revenue for Year 1 of active scenario
  const breakEvenRevYear1 = calculateBreakEvenRevenue(
    activeProjections[0]?.operatingExpenses ?? 0,
    currentAssumptions.grossMarginPercent
  );

  // Revenue 5-Year CAGR
  const cagrRevenue = calculateCAGR(
    activePeriod.incomeStatement.revenue,
    activeProjections[activeProjections.length - 1]?.revenue ?? 0,
    5
  );

  // Multi-scenario comparison chart data
  const scenarioComparisonData = activeProjections.map((p, idx) => ({
    year: p.periodLabel,
    baseRev: baseProjections[idx]?.revenue ?? 0,
    optRev: optProjections[idx]?.revenue ?? 0,
    pessRev: pessProjections[idx]?.revenue ?? 0,
    activeNetIncome: p.netIncome,
    activeFCF: p.freeCashFlow,
  }));

  // Historical + Forecast joined chart data
  const historicalPoint = {
    period: `${activePeriod.year} (Hist)`,
    revenue: activePeriod.incomeStatement.revenue,
    grossProfit: activePeriod.incomeStatement.grossProfit,
    netIncome: activePeriod.incomeStatement.netIncome,
    fcf: activePeriod.cashFlow.operatingActivities.total - Math.abs(activePeriod.cashFlow.investingActivities.capitalExpenditures),
  };

  const trajectoryData = [
    historicalPoint,
    ...activeProjections.map((p) => ({
      period: p.periodLabel,
      revenue: p.revenue,
      grossProfit: p.grossProfit,
      netIncome: p.netIncome,
      fcf: p.freeCashFlow,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Financial Forecast & Multi-Scenario Planning
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model proyeksi 5 tahun dinamis dengan formula transparan dan simulasi sensitivitas skenario Base, Optimistic, dan Pessimistic.
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveScenario('base')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeScenario === 'base'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Base Case
          </button>
          <button
            onClick={() => setActiveScenario('optimistic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeScenario === 'optimistic'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Optimistic (+Growth)
          </button>
          <button
            onClick={() => setActiveScenario('pessimistic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeScenario === 'pessimistic'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pessimistic (-Margin)
          </button>
        </div>
      </div>

      {/* Assumptions Control Panel (Sliders) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Asumsi Proyeksi ({activeScenario.toUpperCase()} SCENARIO)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            Geser slider untuk melihat dampak instan pada laporan laba rugi, kas, dan neraca
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Slider 1: Revenue Growth */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Revenue Growth YoY</span>
              <span className="font-mono text-cyan-300 font-bold">{currentAssumptions.revenueGrowthPercent.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="-10"
              max="40"
              step="0.5"
              value={currentAssumptions.revenueGrowthPercent}
              onChange={(e) => updateAssumption('revenueGrowthPercent', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Kenaikan volume & harga penjualan</span>
          </div>

          {/* Slider 2: Gross Margin */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Target Gross Margin</span>
              <span className="font-mono text-cyan-300 font-bold">{currentAssumptions.grossMarginPercent.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="65"
              step="0.5"
              value={currentAssumptions.grossMarginPercent}
              onChange={(e) => updateAssumption('grossMarginPercent', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Proporsi laba kotor terhadap omzet</span>
          </div>

          {/* Slider 3: OpEx Growth */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">OpEx Overhead Growth</span>
              <span className="font-mono text-cyan-300 font-bold">{currentAssumptions.opExGrowthPercent.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={currentAssumptions.opExGrowthPercent}
              onChange={(e) => updateAssumption('opExGrowthPercent', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Pertumbuhan biaya gaji, SG&A, R&D</span>
          </div>

          {/* Slider 4: CapEx % of Rev */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">CapEx Belanja Modal</span>
              <span className="font-mono text-cyan-300 font-bold">{currentAssumptions.capExPercentOfRevenue.toFixed(1)}% Rev</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={currentAssumptions.capExPercentOfRevenue}
              onChange={(e) => updateAssumption('capExPercentOfRevenue', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Investasi mesin & fasilitas fisik</span>
          </div>

          {/* Slider 5: Tax Rate */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Tarif Pajak Efektif</span>
              <span className="font-mono text-cyan-300 font-bold">{currentAssumptions.taxRatePercent.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              step="1"
              value={currentAssumptions.taxRatePercent}
              onChange={(e) => updateAssumption('taxRatePercent', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Beban pajak penghasilan terutang</span>
          </div>

          {/* Slider 6: Target DSO */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Target DSO (Piutang)</span>
              <span className="font-mono text-cyan-300 font-bold">{currentAssumptions.targetDSO} Hari</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={currentAssumptions.targetDSO}
              onChange={(e) => updateAssumption('targetDSO', parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Efisiensi hari penagihan kas pelanggan</span>
          </div>

          {/* Slider 7: Inventory Growth */}
          <div className="space-y-2 bg-slate-950/60 p-3 rounded border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Pertumbuhan Persediaan</span>
              <span className="font-mono text-cyan-300 font-bold">{currentAssumptions.inventoryGrowthPercent.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="-10"
              max="25"
              step="0.5"
              value={currentAssumptions.inventoryGrowthPercent}
              onChange={(e) => updateAssumption('inventoryGrowthPercent', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Stok barang untuk mendukung ekspansi</span>
          </div>

          {/* KPI Output: Break-even & CAGR */}
          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded flex flex-col justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Break-even Sales (Y1)</span>
              <span className="text-base font-bold font-mono text-cyan-300">
                {formatFinancialNumber(breakEvenRevYear1, currency, true)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">5-Yr Rev CAGR:</span>
              <span className="font-mono font-bold text-emerald-400">+{cagrRevenue}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical vs Forecast Trajectory */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Historical vs Forecast (5-Tahun)</h3>
              <p className="text-xs text-slate-400">Proyeksi pertumbuhan Revenue, Net Income, dan Free Cash Flow</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">{activeScenario.toUpperCase()}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(v: any) => [formatFinancialNumber(Number(v), currency), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="netIncome" name="Net Income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fcf" name="Free Cash Flow" stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3-Scenario Revenue Comparison Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Komparasi 3 Skenario Proyeksi Penjualan</h3>
              <p className="text-xs text-slate-400">Divergensi omzet antara Base Case, Optimistic, dan Pessimistic</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Scenario Cone</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(v: any) => [formatFinancialNumber(Number(v), currency), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="optRev" name="Optimistic Case" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="baseRev" name="Base Case" stroke="#0ea5e9" strokeWidth={2.5} />
                <Line type="monotone" dataKey="pessRev" name="Pessimistic Case" stroke="#f43f5e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transparent Detailed Projections Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-white">Proyeksi Laporan Keuangan Multi-Tahun ({activeScenario.toUpperCase()})</span>
          <span className="text-slate-400 font-mono">Formula: Akrual & Arus Kas Terintegrasi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-2.5 px-4">Line Item</th>
                <th className="py-2.5 px-4 text-right">Baseline ({activePeriod.year})</th>
                {activeProjections.map((p) => (
                  <th key={p.year} className="py-2.5 px-4 text-right">{p.periodLabel}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums text-slate-200">
              <tr className="hover:bg-slate-800/40 font-semibold">
                <td className="py-2 px-4 font-sans text-white">Revenue</td>
                <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(activePeriod.incomeStatement.revenue, currency)}</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right text-cyan-300">{formatFinancialNumber(p.revenue, currency)}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 text-slate-400">
                <td className="py-2 px-4 font-sans pl-8">Cost of Goods Sold (COGS)</td>
                <td className="py-2 px-4 text-right">({formatFinancialNumber(activePeriod.incomeStatement.costOfGoodsSold, currency)})</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right">({formatFinancialNumber(p.cogs, currency)})</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 font-semibold bg-slate-950/40">
                <td className="py-2 px-4 font-sans text-slate-200">Gross Profit</td>
                <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(activePeriod.incomeStatement.grossProfit, currency)}</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right text-white">{formatFinancialNumber(p.grossProfit, currency)}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 text-slate-400">
                <td className="py-2 px-4 font-sans pl-8">Operating Expenses (OpEx)</td>
                <td className="py-2 px-4 text-right">({formatFinancialNumber(activePeriod.incomeStatement.operatingExpenses.total, currency)})</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right">({formatFinancialNumber(p.operatingExpenses, currency)})</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 font-semibold text-emerald-400">
                <td className="py-2 px-4 font-sans">Operating Income (EBIT)</td>
                <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(activePeriod.incomeStatement.operatingIncome, currency)}</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right">{formatFinancialNumber(p.operatingIncome, currency)}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 font-bold bg-slate-950 text-white">
                <td className="py-2.5 px-4 font-sans text-cyan-400">Net Income (Bottom Line)</td>
                <td className="py-2.5 px-4 text-right text-slate-400">{formatFinancialNumber(activePeriod.incomeStatement.netIncome, currency)}</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2.5 px-4 text-right text-cyan-300">{formatFinancialNumber(p.netIncome, currency)}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 text-slate-300">
                <td className="py-2 px-4 font-sans">Operating Cash Flow</td>
                <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(activePeriod.cashFlow.operatingActivities.total, currency)}</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right text-emerald-300">{formatFinancialNumber(p.operatingCashFlow, currency)}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 text-slate-300 font-semibold bg-slate-950/60">
                <td className="py-2 px-4 font-sans text-emerald-400">Free Cash Flow (FCF)</td>
                <td className="py-2 px-4 text-right text-slate-400">
                  {formatFinancialNumber(activePeriod.cashFlow.operatingActivities.total - Math.abs(activePeriod.cashFlow.investingActivities.capitalExpenditures), currency)}
                </td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right text-emerald-300">{formatFinancialNumber(p.freeCashFlow, currency)}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/40 text-slate-400">
                <td className="py-2 px-4 font-sans">Ending Cash Balance</td>
                <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(activePeriod.cashFlow.endingCash, currency)}</td>
                {activeProjections.map((p) => (
                  <td key={p.year} className="py-2 px-4 text-right text-slate-200">{formatFinancialNumber(p.endingCash, currency)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Disclaimer from Section 12 */}
      <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Catatan Batasan Model Proyeksi:</strong> Seluruh angka proyeksi di atas adalah estimasi berbasis asumsi matematis yang ditentukan pengguna, bukan jaminan kinerja masa depan. Nilai riil dapat dipengaruhi oleh volatilitas makroekonomi, persaingan industri, inflasi beban pokok, dan siklus permintaan pasar.
        </div>
      </div>
    </div>
  );
};
