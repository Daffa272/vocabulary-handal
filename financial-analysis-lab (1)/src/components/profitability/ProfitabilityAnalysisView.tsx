import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { formatFinancialNumber, formatPercent, safeDivide } from '../../services/calculationEngine';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const ProfitabilityAnalysisView: React.FC = () => {
  const { activePeriod, comparisonPeriod, activeRatios, currency, activeCompany } = useFinancial();

  const curIS = activePeriod.incomeStatement;
  const priorIS = comparisonPeriod?.incomeStatement;

  // Diagnostic questions
  const revGrowth = priorIS ? safeDivide(curIS.revenue - priorIS.revenue, priorIS.revenue, 100) : null;
  const netGrowth = priorIS ? safeDivide(curIS.netIncome - priorIS.netIncome, priorIS.netIncome, 100) : null;
  const cogsGrowth = priorIS ? safeDivide(curIS.costOfGoodsSold - priorIS.costOfGoodsSold, priorIS.costOfGoodsSold, 100) : null;
  const opexGrowth = priorIS ? safeDivide(curIS.operatingExpenses.total - priorIS.operatingExpenses.total, priorIS.operatingExpenses.total, 100) : null;

  const isCostGrowingFaster = (cogsGrowth ?? 0) > (revGrowth ?? 0) || (opexGrowth ?? 0) > (revGrowth ?? 0);
  const isProfitPacing = (netGrowth ?? 0) >= (revGrowth ?? 0);

  // Waterfall dataset Revenue -> COGS -> Gross Profit -> OpEx -> Operating Income -> Interest & Tax -> Net Income
  const waterfallData = [
    { name: 'Revenue', value: curIS.revenue, fill: '#0284c7', display: formatFinancialNumber(curIS.revenue, currency, true) },
    { name: 'Less: COGS', value: -curIS.costOfGoodsSold, fill: '#f43f5e', display: `-${formatFinancialNumber(curIS.costOfGoodsSold, currency, true)}` },
    { name: 'Gross Profit', value: curIS.grossProfit, fill: '#0ea5e9', display: formatFinancialNumber(curIS.grossProfit, currency, true) },
    { name: 'Less: OpEx', value: -curIS.operatingExpenses.total, fill: '#f43f5e', display: `-${formatFinancialNumber(curIS.operatingExpenses.total, currency, true)}` },
    { name: 'Operating Income', value: curIS.operatingIncome, fill: '#10b981', display: formatFinancialNumber(curIS.operatingIncome, currency, true) },
    { name: 'Less: Int & Tax', value: -(curIS.interestExpense + curIS.incomeTaxExpense), fill: '#f43f5e', display: `-${formatFinancialNumber(curIS.interestExpense + curIS.incomeTaxExpense, currency, true)}` },
    { name: 'Net Income', value: curIS.netIncome, fill: '#22c55e', display: formatFinancialNumber(curIS.netIncome, currency, true) },
  ];

  // Revenue vs COGS trend
  const comparisonTrend = activeCompany.periods.map((p) => ({
    label: p.label,
    revenue: p.incomeStatement.revenue,
    cogs: p.incomeStatement.costOfGoodsSold,
    grossProfit: p.incomeStatement.grossProfit,
    grossMargin: (p.incomeStatement.grossProfit / p.incomeStatement.revenue) * 100,
    operatingMargin: (p.incomeStatement.operatingIncome / p.incomeStatement.revenue) * 100,
    netMargin: (p.incomeStatement.netIncome / p.incomeStatement.revenue) * 100,
  }));

  // Product breakdown data
  const products = activePeriod.products || [
    { name: 'Core Product Division A', revenue: curIS.revenue * 0.45, cogs: curIS.costOfGoodsSold * 0.42, grossProfit: curIS.grossProfit * 0.48, marginPercent: 42.0 },
    { name: 'Commercial Systems B', revenue: curIS.revenue * 0.35, cogs: curIS.costOfGoodsSold * 0.36, grossProfit: curIS.grossProfit * 0.34, marginPercent: 37.0 },
    { name: 'Support & Recurring C', revenue: curIS.revenue * 0.20, cogs: curIS.costOfGoodsSold * 0.22, grossProfit: curIS.grossProfit * 0.18, marginPercent: 31.0 },
  ];

  // Business Units data
  const businessUnits = activePeriod.businessUnits || [
    { name: 'Domestic Operations', revenue: curIS.revenue * 0.65, operatingIncome: curIS.operatingIncome * 0.70, headcount: 320 },
    { name: 'Export & Regional', revenue: curIS.revenue * 0.35, operatingIncome: curIS.operatingIncome * 0.30, headcount: 140 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Profitability Analysis & Margin Bridge
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dekomposisi struktural margin, elastisitas biaya terhadap omzet, dan kontribusi laba per segmen produk.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          Active: {activePeriod.label}
        </div>
      </div>

      {/* Diagnostic Answers Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Apakah Revenue Naik?</span>
            {revGrowth && revGrowth > 0 ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">
            {formatPercent(revGrowth, true)}
          </div>
          <p className="text-[11px] text-slate-400">
            {revGrowth && revGrowth > 0 ? 'Ekspansi top-line positif' : 'Pendapatan terkoreksi/stagnan'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Profit Mengikuti Revenue?</span>
            {isProfitPacing ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">
            Δ Laba: {formatPercent(netGrowth, true)}
          </div>
          <p className="text-[11px] text-slate-400">
            {isProfitPacing ? 'Pertumbuhan berkualitas (leverage positif)' : 'Pertumbuhan margin terdelusi'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Kenaikan Biaya vs Omzet?</span>
            {!isCostGrowingFaster ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white">
            COGS Δ: {formatPercent(cogsGrowth, true)}
          </div>
          <p className="text-[11px] text-slate-400">
            {isCostGrowingFaster ? 'Biaya naik lebih cepat dari omzet' : 'Biaya terkendali di bawah omzet'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Segmen Laba Terbesar</span>
            <PieIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-cyan-300 truncate">
            {products[0]?.name}
          </div>
          <p className="text-[11px] text-slate-400">
            Margin Kotor: {products[0]?.marginPercent}%
          </p>
        </div>
      </div>

      {/* Waterfall Profit Bridge Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Waterfall Laba: Revenue ke Net Income</h3>
            <p className="text-xs text-slate-400">Penelusuran pengurangan biaya langsung, operasional, beban bunga, dan pajak</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Accounting Walkthrough</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                formatter={(val: any) => [formatFinancialNumber(Number(val), currency), 'Nilai']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dual Charts: Multi-Period Margin Trajectory & Product Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Trajectory */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-1">Evolusi Margin Profitabilitas</h3>
          <p className="text-xs text-slate-400 mb-4">Tren Gross Margin, Operating Margin, dan Net Margin</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(v: any) => [`${Number(v).toFixed(1)}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="grossMargin" name="Gross Margin %" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="operatingMargin" name="Operating Margin %" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="netMargin" name="Net Margin %" stroke="#38bdf8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Mix Gross Profit Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-1">Kontribusi Laba Bersih per Lini Produk</h3>
          <p className="text-xs text-slate-400 mb-4">Portofolio produk dan tingkat profitabilitas kotor</p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={products}
                    dataKey="grossProfit"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {products.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                    formatter={(v: any) => [formatFinancialNumber(Number(v), currency), 'Gross Profit']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-2 text-xs">
              {products.map((p, idx) => (
                <div key={p.name} className="flex items-center justify-between p-2 bg-slate-950/60 rounded border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-300 font-medium">{p.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-white font-semibold">{formatFinancialNumber(p.grossProfit, currency, true)}</span>
                    <span className="text-slate-500 ml-2">({p.marginPercent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
