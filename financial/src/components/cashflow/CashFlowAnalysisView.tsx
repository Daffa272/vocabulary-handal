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
  AreaChart,
  Area,
} from 'recharts';
import { ArrowLeftRight, CheckCircle, AlertTriangle, Droplets } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { formatFinancialNumber, formatPercent } from '../../services/calculationEngine';

export const CashFlowAnalysisView: React.FC = () => {
  const { activePeriod, activeCompany, currency, activeRatios } = useFinancial();

  const curCF = activePeriod.cashFlow;
  const curIS = activePeriod.incomeStatement;

  const ocf = curCF.operatingActivities.total;
  const netIncome = curIS.netIncome;
  const fcf = activeRatios.freeCashFlow ?? (ocf - Math.abs(curCF.investingActivities.capitalExpenditures));
  const capEx = Math.abs(curCF.investingActivities.capitalExpenditures);

  // Quality of Earnings ratio: OCF / Net Income
  const qualityOfEarnings = netIncome > 0 ? (ocf / netIncome) * 100 : null;

  // Multi-period cash flow trend
  const cfTrend = activeCompany.periods.map((p) => ({
    label: p.label,
    ocf: p.cashFlow.operatingActivities.total,
    icf: p.cashFlow.investingActivities.total,
    fcf_financing: p.cashFlow.financingActivities.total,
    netChange: p.cashFlow.netChangeInCash,
    endingCash: p.cashFlow.endingCash,
    netIncome: p.incomeStatement.netIncome,
    freeCashFlow: p.cashFlow.operatingActivities.total - Math.abs(p.cashFlow.investingActivities.capitalExpenditures),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
            Cash Flow Dynamics & Quality of Earnings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis arus kas 3 pilar (Operasi, Investasi, Pendanaan), konversi laba akrual menjadi kas, dan pembentukan Free Cash Flow.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          Active: {activePeriod.label}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Operating Cash Flow</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">
            {formatFinancialNumber(ocf, currency, true)}
          </div>
          <p className="text-[11px] text-slate-400">
            Arus kas riil dari aktivitas bisnis inti
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Free Cash Flow (FCF)</span>
            <span className="text-[10px] font-mono text-slate-400">OCF - CapEx</span>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {formatFinancialNumber(fcf, currency, true)}
          </div>
          <p className="text-[11px] text-slate-400">
            Kas bebas setelah investasi belanja modal
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Quality of Earnings</span>
            <span className="text-[10px] font-mono text-slate-400">OCF / Net Income</span>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-cyan-300">
            {qualityOfEarnings ? `${qualityOfEarnings.toFixed(1)}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400">
            {qualityOfEarnings && qualityOfEarnings >= 100
              ? 'Kualitas prima (>100% laba jadi kas)'
              : 'Kas tertinggal dari laba buku'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Ending Cash Reserve</span>
            <span className="text-[10px] font-mono text-slate-400">Saldo Akhir</span>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {formatFinancialNumber(curCF.endingCash, currency, true)}
          </div>
          <p className="text-[11px] text-slate-400">
            {curCF.netChangeInCash >= 0 ? `Surplus +${formatFinancialNumber(curCF.netChangeInCash, currency, true)}` : 'Penurunan kas'}
          </p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operating Cash Flow vs Net Income Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Quality of Earnings: OCF vs Net Income</h3>
              <p className="text-xs text-slate-400">Perbandingan laba bersih akuntansi terhadap kas operasional nyata</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Accrual vs Cash</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cfTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(val: any) => [formatFinancialNumber(Number(val), currency), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="netIncome" name="Net Income (Buku)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ocf" name="Operating Cash Flow (Kas)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3 Cash Flow Pillars: OCF, ICF, FCF_Financing */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Profil 3 Pilar Arus Kas</h3>
              <p className="text-xs text-slate-400">Arah arus kas operasi, investasi belanja modal, dan pendanaan utang/dividen</p>
            </div>
            <span className="text-xs font-mono text-purple-400">Pillar Walk</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cfTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(val: any) => [formatFinancialNumber(Number(val), currency), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="ocf" name="Operating CF" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="icf" name="Investing CF" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fcf_financing" name="Financing CF" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Free Cash Flow & Ending Cash Trend Area Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Tren Free Cash Flow & Akumulasi Saldo Kas Akhir</h3>
            <p className="text-xs text-slate-400">Pertumbuhan daya beli kas dan bantalan likuiditas korporat</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Liquidity Runway</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cfTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                formatter={(val: any) => [formatFinancialNumber(Number(val), currency), '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="freeCashFlow" name="Free Cash Flow" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="endingCash" name="Ending Cash Reserve" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Structured Diagnostic Answers */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>Diagnostik Kesehatan Arus Kas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apakah Investasi Didanai dari Operasi Sendiri?</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Arus kas operasional ({formatFinancialNumber(ocf, currency, true)}){' '}
              {ocf >= capEx
                ? `sepenuhnya menutup belanja modal CapEx (${formatFinancialNumber(capEx, currency, true)}), menghasilkan surplus Free Cash Flow sebesar ${formatFinancialNumber(fcf, currency, true)}. Perusahaan tidak bergantung pada utang baru untuk membiayai belanja aset.`
                : `kurang memadai untuk menutup CapEx (${formatFinancialNumber(capEx, currency, true)}), sehingga memerlukan dukungan dari pendanaan ekuitas atau utang baru.`}
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kestabilan dan Tren Saldo Kas</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Saldo kas akhir bergerak menjadi{' '}
              <span className="font-mono text-slate-200">{formatFinancialNumber(curCF.endingCash, currency, true)}</span>{' '}
              dengan perubahan bersih kas sebesar{' '}
              <span className="font-mono text-slate-200">{formatFinancialNumber(curCF.netChangeInCash, currency, true)}</span>.
              Pertumbuhan kas yang konsisten menunjukkan likuiditas operasional yang resilien terhadap ketidakpastian pasar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
