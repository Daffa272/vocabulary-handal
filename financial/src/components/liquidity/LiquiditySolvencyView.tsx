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
} from 'recharts';
import { ShieldCheck, AlertOctagon, HelpCircle, Activity } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { formatFinancialNumber, formatPercent, formatRatio } from '../../services/calculationEngine';

export const LiquiditySolvencyView: React.FC = () => {
  const { activePeriod, activeRatios, currency, activeCompany, allRatiosMap } = useFinancial();

  const curBS = activePeriod.balanceSheet;
  const curIS = activePeriod.incomeStatement;

  const liquidityGap = curBS.totalCurrentAssets - curBS.totalCurrentLiabilities;
  const isSurplus = liquidityGap >= 0;

  // Multi-period liquidity and solvency trend
  const trendData = activeCompany.periods.map((p) => {
    const r = allRatiosMap[p.periodId];
    return {
      label: p.label,
      currentAssets: p.balanceSheet.totalCurrentAssets,
      currentLiabilities: p.balanceSheet.totalCurrentLiabilities,
      gap: p.balanceSheet.totalCurrentAssets - p.balanceSheet.totalCurrentLiabilities,
      currentRatio: r?.currentRatio ?? 0,
      quickRatio: r?.quickRatio ?? 0,
      debtToEquity: r?.debtToEquity ?? 0,
      interestCoverage: r?.interestCoverage ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Liquidity, Solvency & Capital Health
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis ketahanan likuiditas jangka pendek, risiko jatuh tempo utang, dan kapasitas penyangga beban bunga.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          Solvency Stress Check: {activeCompany.ticker}
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Short-Term Liquidity Gap</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className={`text-xl font-bold font-mono tabular-nums ${isSurplus ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatFinancialNumber(liquidityGap, currency, true)}
          </div>
          <p className="text-[11px] text-slate-400">
            {isSurplus ? 'Surplus modal kerja lancar' : 'Defisit likuiditas jangka pendek'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Current Ratio</span>
            <span className="text-[10px] font-mono text-slate-400">Target ≥ 1.5x</span>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {formatRatio(activeRatios.currentRatio)}
          </div>
          <p className="text-[11px] text-slate-400">
            Aset lancar vs liabilitas lancar
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Debt-to-Equity</span>
            <span className="text-[10px] font-mono text-slate-400">Target &lt; 1.5x</span>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {formatRatio(activeRatios.debtToEquity)}
          </div>
          <p className="text-[11px] text-slate-400">
            Total utang / total ekuitas
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Interest Coverage</span>
            <span className="text-[10px] font-mono text-slate-400">Target &gt; 3.0x</span>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {activeRatios.interestCoverage ? `${activeRatios.interestCoverage.toFixed(2)}x` : '—'}
          </div>
          <p className="text-[11px] text-slate-400">
            EBIT / Beban bunga tahunan
          </p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Assets vs Current Liabilities Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Current Assets vs Current Liabilities</h3>
              <p className="text-xs text-slate-400">Perbandingan bantalan likuiditas modal kerja dari waktu ke waktu</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Buffer Watch</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(val: any) => [formatFinancialNumber(Number(val), currency), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="currentAssets" name="Current Assets" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="currentLiabilities" name="Current Liabilities" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Debt-to-Equity & Interest Coverage Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Struktur Leverage & Cakupan Bunga</h3>
              <p className="text-xs text-slate-400">Pergerakan rasio D/E dan Interest Coverage</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Leverage Trajectory</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}x`} />
                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}x`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(v: any, name: any) => [`${Number(v).toFixed(2)}x`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line yAxisId="left" type="monotone" dataKey="debtToEquity" name="Debt to Equity" stroke="#f43f5e" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="interestCoverage" name="Interest Coverage (EBIT/Int)" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Structured Diagnostic Insights */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-cyan-400" />
          Konteks Industri & Evaluasi Solvabilitas Komparatif
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded space-y-1">
            <div className="font-semibold text-slate-100">Ketergantungan Struktur Utang</div>
            <p className="text-slate-400 leading-relaxed">
              Total kewajiban tercatat sebesar{' '}
              <span className="font-mono text-slate-200">{formatFinancialNumber(curBS.totalLiabilities, currency)}</span>{' '}
              terhadap ekuitas{' '}
              <span className="font-mono text-slate-200">{formatFinancialNumber(curBS.totalEquity, currency)}</span>.
              Porsi utang berbunga (pinjaman bank + obligasi jangka panjang) adalah{' '}
              <span className="font-mono text-slate-200">
                {formatFinancialNumber(curBS.shortTermDebt + curBS.longTermDebt, currency)}
              </span>
              , menunjukkan bahwa {(curBS.accountsPayable / curBS.totalLiabilities * 100).toFixed(0)}% liabilitas berasal dari utang usaha dagang non-bunga.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded space-y-1">
            <div className="font-semibold text-slate-100">Sensitivitas Beban Bunga Terhadap Syok EBIT</div>
            <p className="text-slate-400 leading-relaxed">
              Dengan laba operasional saat ini{' '}
              <span className="font-mono text-slate-200">{formatFinancialNumber(curIS.operatingIncome, currency)}</span>{' '}
              dan beban bunga tahunan{' '}
              <span className="font-mono text-slate-200">{formatFinancialNumber(curIS.interestExpense, currency)}</span>,
              perusahaan dapat menahan penurunan EBIT hingga{' '}
              <span className="font-mono text-emerald-400 font-semibold">
                {((1 - 1 / (activeRatios.interestCoverage ?? 1)) * 100).toFixed(0)}%
              </span>{' '}
              sebelum laba operasional impas dengan beban bunga bank.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          Acuan Benchmark: Standar rasio solvabilitas sangat bergantung pada intensitas modal industri ({activeCompany.industry}).
          Industri manufaktur berat dengan aset tetap tinggi secara normal memiliki rasio D/E hingga 1.5x - 2.0x, sementara sektor teknologi umumnya beroperasi di bawah 0.5x.
        </div>
      </div>
    </div>
  );
};
