import React from 'react';
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
  AreaChart,
  Area,
} from 'recharts';
import { Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import {
  formatFinancialNumber,
  formatPercent,
  formatRatio,
  safeDivide,
} from '../../services/calculationEngine';
import { KpiCard } from './KpiCard';

export const OverviewDashboard: React.FC = () => {
  const {
    activeCompany,
    activePeriod,
    comparisonPeriod,
    activeRatios,
    priorRatios,
    currency,
    validationIssues,
    allRatiosMap,
  } = useFinancial();

  const curIS = activePeriod.incomeStatement;
  const curBS = activePeriod.balanceSheet;
  const curCF = activePeriod.cashFlow;

  const priorIS = comparisonPeriod?.incomeStatement;
  const priorBS = comparisonPeriod?.balanceSheet;
  const priorCF = comparisonPeriod?.cashFlow;

  // Percentage calculations
  const revGrowth = priorIS
    ? safeDivide(curIS.revenue - priorIS.revenue, priorIS.revenue, 100)
    : null;
  const revDiffAbs = priorIS ? curIS.revenue - priorIS.revenue : null;

  const gpDiff = priorIS ? curIS.grossProfit - priorIS.grossProfit : null;
  const gpGrowth = priorIS
    ? safeDivide(curIS.grossProfit - priorIS.grossProfit, priorIS.grossProfit, 100)
    : null;

  const opDiff = priorIS ? curIS.operatingIncome - priorIS.operatingIncome : null;
  const opGrowth = priorIS
    ? safeDivide(curIS.operatingIncome - priorIS.operatingIncome, priorIS.operatingIncome, 100)
    : null;

  const niDiff = priorIS ? curIS.netIncome - priorIS.netIncome : null;
  const niGrowth = priorIS
    ? safeDivide(curIS.netIncome - priorIS.netIncome, priorIS.netIncome, 100)
    : null;

  const assetsDiff = priorBS ? curBS.totalAssets - priorBS.totalAssets : null;
  const assetsGrowth = priorBS
    ? safeDivide(curBS.totalAssets - priorBS.totalAssets, priorBS.totalAssets, 100)
    : null;

  const liabDiff = priorBS ? curBS.totalLiabilities - priorBS.totalLiabilities : null;
  const liabGrowth = priorBS
    ? safeDivide(curBS.totalLiabilities - priorBS.totalLiabilities, priorBS.totalLiabilities, 100)
    : null;

  const eqDiff = priorBS ? curBS.totalEquity - priorBS.totalEquity : null;
  const eqGrowth = priorBS
    ? safeDivide(curBS.totalEquity - priorBS.totalEquity, priorBS.totalEquity, 100)
    : null;

  const ocfDiff = priorCF
    ? curCF.operatingActivities.total - priorCF.operatingActivities.total
    : null;
  const ocfGrowth = priorCF
    ? safeDivide(
        curCF.operatingActivities.total - priorCF.operatingActivities.total,
        Math.abs(priorCF.operatingActivities.total),
        100
      )
    : null;

  const crDiff = priorRatios?.currentRatio
    ? (activeRatios.currentRatio ?? 0) - priorRatios.currentRatio
    : null;
  const deDiff = priorRatios?.debtToEquity
    ? (activeRatios.debtToEquity ?? 0) - priorRatios.debtToEquity
    : null;

  // Chart data across all periods for trend visualization
  const trendData = activeCompany.periods.map((p) => {
    const r = allRatiosMap[p.periodId];
    return {
      period: p.label,
      revenue: p.incomeStatement.revenue,
      grossProfit: p.incomeStatement.grossProfit,
      operatingIncome: p.incomeStatement.operatingIncome,
      netIncome: p.incomeStatement.netIncome,
      operatingCashFlow: p.cashFlow.operatingActivities.total,
      netMargin: r?.netProfitMargin ?? 0,
      currentRatio: r?.currentRatio ?? 0,
      totalAssets: p.balanceSheet.totalAssets,
      totalLiabilities: p.balanceSheet.totalLiabilities,
      totalEquity: p.balanceSheet.totalEquity,
    };
  });

  const errors = validationIssues.filter((i) => i.severity === 'error');

  return (
    <div className="space-y-6">
      {/* Top Header / Synthetic notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Financial Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic diagnostic snapshot of revenue, profitability, capital structure, and liquidity for{' '}
            <span className="text-slate-200 font-semibold">{activeCompany.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-cyan-950/40 border border-cyan-800/50 rounded text-cyan-300 font-mono">
            {activePeriod.label} vs {comparisonPeriod?.label ?? 'None'}
          </span>
          <span className="px-2 py-1 bg-slate-800/60 border border-slate-700/60 rounded text-slate-400">
            Synthetic Model
          </span>
        </div>
      </div>

      {/* Validation Banner if errors detected */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-lg flex items-start gap-2.5 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <span className="font-semibold text-red-200">Data Integrity Notice:</span>{' '}
            {errors[0].title} — {errors[0].impact}
          </div>
        </div>
      )}

      {/* 14 Key KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <KpiCard
          label="Revenue"
          currentValue={formatFinancialNumber(curIS.revenue, currency, true)}
          priorValue={formatFinancialNumber(priorIS?.revenue, currency, true)}
          changeValue={formatFinancialNumber(revDiffAbs, currency, true)}
          changePercent={revGrowth}
          higherIsBetter={true}
          formulaNote="Total Top-line Turnover"
        />

        <KpiCard
          label="Revenue Growth"
          currentValue={formatPercent(revGrowth, true)}
          priorValue="—"
          changePercent={revGrowth}
          higherIsBetter={true}
          statusText={revGrowth && revGrowth > 10 ? 'Robust' : 'Moderate'}
          formulaNote="(Rev_t - Rev_t-1) / Rev_t-1"
        />

        <KpiCard
          label="Gross Profit"
          currentValue={formatFinancialNumber(curIS.grossProfit, currency, true)}
          priorValue={formatFinancialNumber(priorIS?.grossProfit, currency, true)}
          changeValue={formatFinancialNumber(gpDiff, currency, true)}
          changePercent={gpGrowth}
          higherIsBetter={true}
          formulaNote="Revenue - COGS"
        />

        <KpiCard
          label="Gross Margin"
          currentValue={formatPercent(activeRatios.grossProfitMargin)}
          priorValue={formatPercent(priorRatios?.grossProfitMargin)}
          changePercent={
            priorRatios?.grossProfitMargin
              ? (activeRatios.grossProfitMargin ?? 0) - priorRatios.grossProfitMargin
              : null
          }
          higherIsBetter={true}
          formulaNote="Gross Profit / Revenue"
        />

        <KpiCard
          label="Operating Profit (EBIT)"
          currentValue={formatFinancialNumber(curIS.operatingIncome, currency, true)}
          priorValue={formatFinancialNumber(priorIS?.operatingIncome, currency, true)}
          changeValue={formatFinancialNumber(opDiff, currency, true)}
          changePercent={opGrowth}
          higherIsBetter={true}
          formulaNote="Gross Profit - OpEx"
        />

        <KpiCard
          label="Operating Margin"
          currentValue={formatPercent(activeRatios.operatingProfitMargin)}
          priorValue={formatPercent(priorRatios?.operatingProfitMargin)}
          changePercent={
            priorRatios?.operatingProfitMargin
              ? (activeRatios.operatingProfitMargin ?? 0) - priorRatios.operatingProfitMargin
              : null
          }
          higherIsBetter={true}
          formulaNote="Operating Income / Revenue"
        />

        <KpiCard
          label="Net Income"
          currentValue={formatFinancialNumber(curIS.netIncome, currency, true)}
          priorValue={formatFinancialNumber(priorIS?.netIncome, currency, true)}
          changeValue={formatFinancialNumber(niDiff, currency, true)}
          changePercent={niGrowth}
          higherIsBetter={true}
          formulaNote="Bottom-line earnings"
        />

        <KpiCard
          label="Net Profit Margin"
          currentValue={formatPercent(activeRatios.netProfitMargin)}
          priorValue={formatPercent(priorRatios?.netProfitMargin)}
          changePercent={
            priorRatios?.netProfitMargin
              ? (activeRatios.netProfitMargin ?? 0) - priorRatios.netProfitMargin
              : null
          }
          higherIsBetter={true}
          formulaNote="Net Income / Revenue"
        />

        <KpiCard
          label="Total Assets"
          currentValue={formatFinancialNumber(curBS.totalAssets, currency, true)}
          priorValue={formatFinancialNumber(priorBS?.totalAssets, currency, true)}
          changeValue={formatFinancialNumber(assetsDiff, currency, true)}
          changePercent={assetsGrowth}
          higherIsBetter={true}
          formulaNote="Current + Non-Current Assets"
        />

        <KpiCard
          label="Total Liabilities"
          currentValue={formatFinancialNumber(curBS.totalLiabilities, currency, true)}
          priorValue={formatFinancialNumber(priorBS?.totalLiabilities, currency, true)}
          changeValue={formatFinancialNumber(liabDiff, currency, true)}
          changePercent={liabGrowth}
          higherIsBetter={false}
          formulaNote="Total obligations"
        />

        <KpiCard
          label="Total Equity"
          currentValue={formatFinancialNumber(curBS.totalEquity, currency, true)}
          priorValue={formatFinancialNumber(priorBS?.totalEquity, currency, true)}
          changeValue={formatFinancialNumber(eqDiff, currency, true)}
          changePercent={eqGrowth}
          higherIsBetter={true}
          formulaNote="Assets - Liabilities"
        />

        <KpiCard
          label="Operating Cash Flow"
          currentValue={formatFinancialNumber(curCF.operatingActivities.total, currency, true)}
          priorValue={formatFinancialNumber(priorCF?.operatingActivities.total, currency, true)}
          changeValue={formatFinancialNumber(ocfDiff, currency, true)}
          changePercent={ocfGrowth}
          higherIsBetter={true}
          formulaNote="Net cash from core ops"
        />

        <KpiCard
          label="Current Ratio"
          currentValue={formatRatio(activeRatios.currentRatio)}
          priorValue={formatRatio(priorRatios?.currentRatio)}
          changePercent={crDiff ? Number((crDiff * 100).toFixed(1)) : null}
          higherIsBetter={true}
          statusText={
            (activeRatios.currentRatio ?? 0) >= 1.5
              ? 'Adequate'
              : (activeRatios.currentRatio ?? 0) >= 1.0
              ? 'Lean'
              : 'Strained'
          }
          formulaNote="Current Assets / Current Liab"
        />

        <KpiCard
          label="Debt-to-Equity"
          currentValue={formatRatio(activeRatios.debtToEquity)}
          priorValue={formatRatio(priorRatios?.debtToEquity)}
          changePercent={deDiff ? Number((deDiff * 100).toFixed(1)) : null}
          higherIsBetter={false}
          statusText={
            (activeRatios.debtToEquity ?? 0) > 2.0 ? 'High Leverage' : 'Balanced'
          }
          formulaNote="Total Liab / Total Equity"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trajectory Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Revenue & Earnings Trajectory</h3>
              <p className="text-xs text-slate-400">Volume vs operating margin progression across periods</p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">Top vs Bottom Line</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => formatFinancialNumber(val, currency, true)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#38bdf8"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(value: any, name: any) => {
                    if (name === 'Net Margin %') return [`${Number(value).toFixed(1)}%`, name];
                    return [formatFinancialNumber(Number(value), currency), name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="operatingIncome" name="Operating Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="netMargin"
                  name="Net Margin %"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capital Structure & Balance Sheet Evolution */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Capital Structure Evolution</h3>
              <p className="text-xs text-slate-400">Total Assets vs Debt and Equity distribution</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Balance Sheet Depth</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => formatFinancialNumber(val, currency, true)}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(value: any, name: any) => [formatFinancialNumber(Number(value), currency), name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="totalLiabilities" name="Total Liabilities" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                <Area type="monotone" dataKey="totalEquity" name="Total Equity" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-Factor Holistic Interpretation Box (Compliant with Section 4 rules) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Multi-Factor Financial Context Interpretation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded space-y-1.5">
            <div className="text-slate-100 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Earnings Quality & Cash Conversion</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Operating Cash Flow of{' '}
              <span className="font-mono text-slate-200">
                {formatFinancialNumber(curCF.operatingActivities.total, currency, true)}
              </span>{' '}
              reconciles against Net Income of{' '}
              <span className="font-mono text-slate-200">
                {formatFinancialNumber(curIS.netIncome, currency, true)}
              </span>
              . Cash generation{' '}
              {curCF.operatingActivities.total >= curIS.netIncome
                ? 'exceeds accrual accounting profits, validating high earnings quality and clean collection cycles.'
                : 'lags accrual earnings, indicating working capital absorption via inventory build or receivables.'}
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded space-y-1.5">
            <div className="text-slate-100 font-semibold flex items-center gap-1.5">
              <span>Capital Structure Resilience</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Debt-to-Equity is positioned at{' '}
              <span className="font-mono text-slate-200">
                {formatRatio(activeRatios.debtToEquity)}
              </span>{' '}
              (Interest-bearing D/E:{' '}
              <span className="font-mono text-slate-200">
                {formatRatio(activeRatios.debtToEquityInterestBearing)}
              </span>
              ). The company{' '}
              {(activeRatios.interestCoverage ?? 0) > 3
                ? `maintains strong interest coverage headroom of ${formatRatio(activeRatios.interestCoverage)} over debt service costs.`
                : 'shows moderate interest coverage buffer, warranting disciplined fixed-charge monitoring.'}
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded space-y-1.5">
            <div className="text-slate-100 font-semibold flex items-center gap-1.5">
              <span>Working Capital Velocity</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Current Ratio is{' '}
              <span className="font-mono text-slate-200">
                {formatRatio(activeRatios.currentRatio)}
              </span>{' '}
              with Quick Ratio at{' '}
              <span className="font-mono text-slate-200">
                {formatRatio(activeRatios.quickRatio)}
              </span>
              . Liquid reserves cover short-term liabilities without requiring forced inventory discounting.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <span>
            Diagnostic Note: Corporate health is evaluated across multi-period trends, business model, and liquidity
            continuity rather than any isolated single-period ratio threshold.
          </span>
          <span className="font-mono text-slate-400">{activeCompany.industry} Benchmark</span>
        </div>
      </div>
    </div>
  );
};
