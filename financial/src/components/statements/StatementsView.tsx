import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertOctagon,
  Percent,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import {
  formatFinancialNumber,
  formatPercent,
  safeDivide,
} from '../../services/calculationEngine';

export const StatementsView: React.FC = () => {
  const {
    activeCompany,
    activePeriod,
    comparisonPeriod,
    currency,
    balanceTolerance,
    setBalanceTolerance,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow'>('income');
  const [showCommonSize, setShowCommonSize] = useState<boolean>(false);
  const [showHorizontalGrowth, setShowHorizontalGrowth] = useState<boolean>(true);

  const curIS = activePeriod.incomeStatement;
  const curBS = activePeriod.balanceSheet;
  const curCF = activePeriod.cashFlow;

  const priorIS = comparisonPeriod?.incomeStatement;
  const priorBS = comparisonPeriod?.balanceSheet;
  const priorCF = comparisonPeriod?.cashFlow;

  // Balance Sheet equilibrium check
  const calculatedLiabEquity = curBS.totalLiabilities + curBS.totalEquity;
  const bsDelta = curBS.totalAssets - calculatedLiabEquity;
  const isBsBalanced = Math.abs(bsDelta) <= balanceTolerance;

  // Cash Flow reconciliation check
  const calculatedEndingCash = curCF.beginningCash + curCF.netChangeInCash;
  const isCfRollforwardBalanced = Math.abs(calculatedEndingCash - curCF.endingCash) <= balanceTolerance;
  const isBsCashReconciled = Math.abs(curCF.endingCash - curBS.cashAndEquivalents) <= balanceTolerance;

  // Common size helper (% of Revenue for IS, % of Assets for BS)
  const isCS = (val: number) => safeDivide(val, curIS.revenue, 100);
  const bsCS = (val: number) => safeDivide(val, curBS.totalAssets, 100);

  // YoY growth helper
  const yoyGrowth = (cur: number, prior?: number) => {
    if (!prior || prior === 0) return null;
    return safeDivide(cur - prior, Math.abs(prior), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            Financial Statements (3-Statement Linked Model)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized financial statements with common-size vertical analysis and period-over-period horizontal growth.
          </p>
        </div>

        {/* Statement Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'income'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income Statement
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'balance'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'cashflow'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cash Flow Statement
          </button>
        </div>
      </div>

      {/* Analysis Options Bar & Reconciliation Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showCommonSize}
              onChange={(e) => setShowCommonSize(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-slate-400" />
              Common-Size Vertical Analysis (% Base)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showHorizontalGrowth}
              onChange={(e) => setShowHorizontalGrowth(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Horizontal Growth (YoY %)</span>
          </label>
        </div>

        {/* Verification Pill / Warning */}
        <div className="flex items-center gap-3">
          {activeTab === 'balance' && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium ${
                  isBsBalanced
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/60 border border-red-800 text-red-300'
                }`}
              >
                {isBsBalanced ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Assets = Liabilities + Equity (Δ: 0)</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                    <span>Unbalanced Delta: {bsDelta.toFixed(2)}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Tol:</span>
                <input
                  type="number"
                  value={balanceTolerance}
                  onChange={(e) => setBalanceTolerance(Number(e.target.value) || 0.01)}
                  className="w-12 bg-slate-950 border border-slate-800 rounded px-1 text-slate-200 text-center"
                  step="0.1"
                />
              </div>
            </div>
          )}

          {activeTab === 'cashflow' && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium ${
                isCfRollforwardBalanced && isBsCashReconciled
                  ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                  : 'bg-amber-950/60 border border-amber-800 text-amber-300'
              }`}
            >
              {isCfRollforwardBalanced && isBsCashReconciled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reconciled to Balance Sheet Cash</span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cash Reconciliation Variance</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STATEMENTS TABLES */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        {/* ===================== INCOME STATEMENT ===================== */}
        {activeTab === 'income' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4 w-1/3">Income Statement Line Item</th>
                  <th className="py-3 px-4 text-right">{activePeriod.label}</th>
                  {showCommonSize && <th className="py-3 px-4 text-right text-cyan-400">% Rev</th>}
                  {comparisonPeriod && <th className="py-3 px-4 text-right">{comparisonPeriod.label}</th>}
                  {comparisonPeriod && showCommonSize && <th className="py-3 px-4 text-right text-slate-500">% Rev</th>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <th className="py-3 px-4 text-right">YoY %</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums text-slate-200">
                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900/60">
                  <td className="py-2.5 px-4 font-sans text-white">Revenue (Turnover)</td>
                  <td className="py-2.5 px-4 text-right">{formatFinancialNumber(curIS.revenue, currency)}</td>
                  {showCommonSize && <td className="py-2.5 px-4 text-right text-cyan-400">100.0%</td>}
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-400">{formatFinancialNumber(priorIS?.revenue, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2.5 px-4 text-right text-slate-500">100.0%</td>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <td className={`py-2.5 px-4 text-right ${(yoyGrowth(curIS.revenue, priorIS?.revenue) ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(yoyGrowth(curIS.revenue, priorIS?.revenue), true)}
                    </td>
                  )}
                </tr>

                <tr className="hover:bg-slate-800/40 text-slate-400">
                  <td className="py-2 px-4 font-sans pl-8">Cost of Goods Sold (COGS)</td>
                  <td className="py-2 px-4 text-right">({formatFinancialNumber(curIS.costOfGoodsSold, currency)})</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.costOfGoodsSold))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right">({formatFinancialNumber(priorIS?.costOfGoodsSold, currency)})</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.costOfGoodsSold) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <td className="py-2 px-4 text-right text-slate-300">
                      {formatPercent(yoyGrowth(curIS.costOfGoodsSold, priorIS?.costOfGoodsSold), true)}
                    </td>
                  )}
                </tr>

                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-950/40 border-t border-slate-700">
                  <td className="py-2.5 px-4 font-sans text-cyan-300">Gross Profit</td>
                  <td className="py-2.5 px-4 text-right text-cyan-200">{formatFinancialNumber(curIS.grossProfit, currency)}</td>
                  {showCommonSize && <td className="py-2.5 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.grossProfit))}</td>}
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-300">{formatFinancialNumber(priorIS?.grossProfit, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2.5 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.grossProfit) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <td className={`py-2.5 px-4 text-right ${(yoyGrowth(curIS.grossProfit, priorIS?.grossProfit) ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(yoyGrowth(curIS.grossProfit, priorIS?.grossProfit), true)}
                    </td>
                  )}
                </tr>

                <tr className="hover:bg-slate-800/40 text-slate-400">
                  <td className="py-2 px-4 font-sans pl-8">Research & Development (R&D)</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curIS.operatingExpenses.rd, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.operatingExpenses.rd))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right">{formatFinancialNumber(priorIS?.operatingExpenses.rd, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.operatingExpenses.rd) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curIS.operatingExpenses.rd, priorIS?.operatingExpenses.rd), true)}</td>}
                </tr>

                <tr className="hover:bg-slate-800/40 text-slate-400">
                  <td className="py-2 px-4 font-sans pl-8">Selling, General & Administrative (SG&A)</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curIS.operatingExpenses.sga, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.operatingExpenses.sga))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right">{formatFinancialNumber(priorIS?.operatingExpenses.sga, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.operatingExpenses.sga) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curIS.operatingExpenses.sga, priorIS?.operatingExpenses.sga), true)}</td>}
                </tr>

                <tr className="hover:bg-slate-800/40 text-slate-400">
                  <td className="py-2 px-4 font-sans pl-8">Depreciation & Amortization</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curIS.operatingExpenses.depreciation, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.operatingExpenses.depreciation))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right">{formatFinancialNumber(priorIS?.operatingExpenses.depreciation, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.operatingExpenses.depreciation) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curIS.operatingExpenses.depreciation, priorIS?.operatingExpenses.depreciation), true)}</td>}
                </tr>

                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-950/40">
                  <td className="py-2 px-4 font-sans pl-4 text-slate-300">Total Operating Expenses</td>
                  <td className="py-2 px-4 text-right text-slate-300">({formatFinancialNumber(curIS.operatingExpenses.total, currency)})</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.operatingExpenses.total))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">({formatFinancialNumber(priorIS?.operatingExpenses.total, currency)})</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.operatingExpenses.total) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curIS.operatingExpenses.total, priorIS?.operatingExpenses.total), true)}</td>}
                </tr>

                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900/80 border-t border-slate-700">
                  <td className="py-2.5 px-4 font-sans text-emerald-400">Operating Income (EBIT)</td>
                  <td className="py-2.5 px-4 text-right text-emerald-300">{formatFinancialNumber(curIS.operatingIncome, currency)}</td>
                  {showCommonSize && <td className="py-2.5 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.operatingIncome))}</td>}
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-300">{formatFinancialNumber(priorIS?.operatingIncome, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2.5 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.operatingIncome) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <td className={`py-2.5 px-4 text-right ${(yoyGrowth(curIS.operatingIncome, priorIS?.operatingIncome) ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(yoyGrowth(curIS.operatingIncome, priorIS?.operatingIncome), true)}
                    </td>
                  )}
                </tr>

                <tr className="hover:bg-slate-800/40 text-slate-400">
                  <td className="py-2 px-4 font-sans pl-8">Interest Expense</td>
                  <td className="py-2 px-4 text-right">({formatFinancialNumber(curIS.interestExpense, currency)})</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.interestExpense))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right">({formatFinancialNumber(priorIS?.interestExpense, currency)})</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.interestExpense) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curIS.interestExpense, priorIS?.interestExpense), true)}</td>}
                </tr>

                <tr className="hover:bg-slate-800/40 text-slate-400">
                  <td className="py-2 px-4 font-sans pl-8">Income Tax Expense</td>
                  <td className="py-2 px-4 text-right">({formatFinancialNumber(curIS.incomeTaxExpense, currency)})</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.incomeTaxExpense))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right">({formatFinancialNumber(priorIS?.incomeTaxExpense, currency)})</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.incomeTaxExpense) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curIS.incomeTaxExpense, priorIS?.incomeTaxExpense), true)}</td>}
                </tr>

                <tr className="hover:bg-slate-800/40 font-bold bg-slate-950 border-t-2 border-slate-700 text-white">
                  <td className="py-3 px-4 font-sans text-cyan-400 text-sm">Net Income (Bottom Line)</td>
                  <td className="py-3 px-4 text-right text-cyan-300 text-sm">{formatFinancialNumber(curIS.netIncome, currency)}</td>
                  {showCommonSize && <td className="py-3 px-4 text-right text-cyan-400">{formatPercent(isCS(curIS.netIncome))}</td>}
                  {comparisonPeriod && <td className="py-3 px-4 text-right text-slate-300">{formatFinancialNumber(priorIS?.netIncome, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-3 px-4 text-right text-slate-500">{formatPercent(priorIS ? isCS(priorIS.netIncome) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <td className={`py-3 px-4 text-right ${(yoyGrowth(curIS.netIncome, priorIS?.netIncome) ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(yoyGrowth(curIS.netIncome, priorIS?.netIncome), true)}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ===================== BALANCE SHEET ===================== */}
        {activeTab === 'balance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4 w-1/3">Balance Sheet Line Item</th>
                  <th className="py-3 px-4 text-right">{activePeriod.label}</th>
                  {showCommonSize && <th className="py-3 px-4 text-right text-cyan-400">% Assets</th>}
                  {comparisonPeriod && <th className="py-3 px-4 text-right">{comparisonPeriod.label}</th>}
                  {comparisonPeriod && showCommonSize && <th className="py-3 px-4 text-right text-slate-500">% Assets</th>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <th className="py-3 px-4 text-right">YoY %</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums text-slate-200">
                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={6} className="py-2 px-4 font-sans text-cyan-400 uppercase tracking-wider text-[11px]">
                    Current Assets
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Cash & Cash Equivalents</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.cashAndEquivalents, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.cashAndEquivalents))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.cashAndEquivalents, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.cashAndEquivalents) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.cashAndEquivalents, priorBS?.cashAndEquivalents), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Accounts Receivable</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.accountsReceivable, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.accountsReceivable))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.accountsReceivable, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.accountsReceivable) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.accountsReceivable, priorBS?.accountsReceivable), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Inventories</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.inventory, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.inventory))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.inventory, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.inventory) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.inventory, priorBS?.inventory), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Other Current Assets</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.otherCurrentAssets, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.otherCurrentAssets))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.otherCurrentAssets, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.otherCurrentAssets) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.otherCurrentAssets, priorBS?.otherCurrentAssets), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900/80">
                  <td className="py-2 px-4 font-sans pl-4 text-slate-200">Total Current Assets</td>
                  <td className="py-2 px-4 text-right text-white">{formatFinancialNumber(curBS.totalCurrentAssets, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.totalCurrentAssets))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatFinancialNumber(priorBS?.totalCurrentAssets, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.totalCurrentAssets) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-emerald-400">{formatPercent(yoyGrowth(curBS.totalCurrentAssets, priorBS?.totalCurrentAssets), true)}</td>}
                </tr>

                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={6} className="py-2 px-4 font-sans text-cyan-400 uppercase tracking-wider text-[11px]">
                    Non-Current Assets
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Property, Plant & Equipment (PP&E)</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.propertyPlantEquipment, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.propertyPlantEquipment))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.propertyPlantEquipment, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.propertyPlantEquipment) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.propertyPlantEquipment, priorBS?.propertyPlantEquipment), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Intangibles & Goodwill</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.intangibleAssets, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.intangibleAssets))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.intangibleAssets, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.intangibleAssets) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.intangibleAssets, priorBS?.intangibleAssets), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-bold bg-slate-950 border-t-2 border-slate-700 text-white">
                  <td className="py-3 px-4 font-sans text-cyan-400 text-sm">TOTAL ASSETS</td>
                  <td className="py-3 px-4 text-right text-cyan-300 text-sm">{formatFinancialNumber(curBS.totalAssets, currency)}</td>
                  {showCommonSize && <td className="py-3 px-4 text-right text-cyan-400">100.0%</td>}
                  {comparisonPeriod && <td className="py-3 px-4 text-right text-slate-200 text-sm">{formatFinancialNumber(priorBS?.totalAssets, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-3 px-4 text-right text-slate-500">100.0%</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-3 px-4 text-right text-emerald-400">{formatPercent(yoyGrowth(curBS.totalAssets, priorBS?.totalAssets), true)}</td>}
                </tr>

                {/* LIABILITIES & EQUITY */}
                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={6} className="py-2 px-4 font-sans text-rose-400 uppercase tracking-wider text-[11px]">
                    Current Liabilities
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Accounts Payable</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.accountsPayable, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.accountsPayable))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.accountsPayable, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.accountsPayable) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.accountsPayable, priorBS?.accountsPayable), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Short-Term Debt & Current Maturities</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.shortTermDebt, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.shortTermDebt))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.shortTermDebt, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.shortTermDebt) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.shortTermDebt, priorBS?.shortTermDebt), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900/80">
                  <td className="py-2 px-4 font-sans pl-4 text-slate-200">Total Current Liabilities</td>
                  <td className="py-2 px-4 text-right text-white">{formatFinancialNumber(curBS.totalCurrentLiabilities, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.totalCurrentLiabilities))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatFinancialNumber(priorBS?.totalCurrentLiabilities, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.totalCurrentLiabilities) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.totalCurrentLiabilities, priorBS?.totalCurrentLiabilities), true)}</td>}
                </tr>

                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={6} className="py-2 px-4 font-sans text-rose-400 uppercase tracking-wider text-[11px]">
                    Non-Current Liabilities & Total Debt
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Long-Term Borrowings</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.longTermDebt, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.longTermDebt))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.longTermDebt, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.longTermDebt) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.longTermDebt, priorBS?.longTermDebt), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900/80">
                  <td className="py-2 px-4 font-sans pl-4 text-rose-300">Total Liabilities</td>
                  <td className="py-2 px-4 text-right text-rose-300">{formatFinancialNumber(curBS.totalLiabilities, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.totalLiabilities))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatFinancialNumber(priorBS?.totalLiabilities, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.totalLiabilities) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curBS.totalLiabilities, priorBS?.totalLiabilities), true)}</td>}
                </tr>

                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={6} className="py-2 px-4 font-sans text-emerald-400 uppercase tracking-wider text-[11px]">
                    Shareholders' Equity
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Common Stock & Paid-in Capital</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.commonStock + curBS.additionalPaidInCapital, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.commonStock + curBS.additionalPaidInCapital))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS ? priorBS.commonStock + priorBS.additionalPaidInCapital : 0, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.commonStock + priorBS.additionalPaidInCapital) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">0.0%</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Retained Earnings</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curBS.retainedEarnings, currency)}</td>
                  {showCommonSize && <td className="py-2 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.retainedEarnings))}</td>}
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorBS?.retainedEarnings, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.retainedEarnings) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-emerald-400">{formatPercent(yoyGrowth(curBS.retainedEarnings, priorBS?.retainedEarnings), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-bold bg-slate-900 border-t border-slate-700">
                  <td className="py-2.5 px-4 font-sans pl-4 text-emerald-300">TOTAL SHAREHOLDERS' EQUITY</td>
                  <td className="py-2.5 px-4 text-right text-emerald-300">{formatFinancialNumber(curBS.totalEquity, currency)}</td>
                  {showCommonSize && <td className="py-2.5 px-4 text-right text-cyan-400">{formatPercent(bsCS(curBS.totalEquity))}</td>}
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-200">{formatFinancialNumber(priorBS?.totalEquity, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-2.5 px-4 text-right text-slate-500">{formatPercent(priorBS ? bsCS(priorBS.totalEquity) : null)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2.5 px-4 text-right text-emerald-400">{formatPercent(yoyGrowth(curBS.totalEquity, priorBS?.totalEquity), true)}</td>}
                </tr>

                {/* Final Balance check line */}
                <tr className="hover:bg-slate-800/40 font-bold bg-slate-950 border-t-2 border-slate-600 text-white">
                  <td className="py-3 px-4 font-sans text-cyan-400 text-sm">TOTAL LIABILITIES & EQUITY</td>
                  <td className="py-3 px-4 text-right text-cyan-300 text-sm">{formatFinancialNumber(calculatedLiabEquity, currency)}</td>
                  {showCommonSize && <td className="py-3 px-4 text-right text-cyan-400">100.0%</td>}
                  {comparisonPeriod && <td className="py-3 px-4 text-right text-slate-200 text-sm">{formatFinancialNumber(priorBS ? priorBS.totalLiabilities + priorBS.totalEquity : 0, currency)}</td>}
                  {comparisonPeriod && showCommonSize && <td className="py-3 px-4 text-right text-slate-500">100.0%</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-3 px-4 text-right text-emerald-400">{formatPercent(yoyGrowth(calculatedLiabEquity, priorBS ? priorBS.totalLiabilities + priorBS.totalEquity : 0), true)}</td>}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ===================== CASH FLOW STATEMENT ===================== */}
        {activeTab === 'cashflow' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4 w-1/3">Cash Flow Activities</th>
                  <th className="py-3 px-4 text-right">{activePeriod.label}</th>
                  {comparisonPeriod && <th className="py-3 px-4 text-right">{comparisonPeriod.label}</th>}
                  {showHorizontalGrowth && comparisonPeriod && (
                    <th className="py-3 px-4 text-right">YoY %</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums text-slate-200">
                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={4} className="py-2 px-4 font-sans text-cyan-400 uppercase tracking-wider text-[11px]">
                    Operating Activities (Core Business)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Net Income (Accrual Profit)</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curCF.operatingActivities.netIncome, currency)}</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorCF?.operatingActivities.netIncome, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curCF.operatingActivities.netIncome, priorCF?.operatingActivities.netIncome), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Depreciation & Non-Cash Amortization</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curCF.operatingActivities.depreciationAmortization, currency)}</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorCF?.operatingActivities.depreciationAmortization, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(curCF.operatingActivities.depreciationAmortization, priorCF?.operatingActivities.depreciationAmortization), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Change in Accounts Receivable (Δ AR)</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curCF.operatingActivities.changeInReceivables, currency)}</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorCF?.operatingActivities.changeInReceivables, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">—</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Change in Inventories (Δ Inventory)</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curCF.operatingActivities.changeInInventory, currency)}</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorCF?.operatingActivities.changeInInventory, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">—</td>}
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Change in Accounts Payable (Δ AP)</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curCF.operatingActivities.changeInPayables, currency)}</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">{formatFinancialNumber(priorCF?.operatingActivities.changeInPayables, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">—</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900 border-t border-slate-700">
                  <td className="py-2.5 px-4 font-sans pl-4 text-cyan-300">Net Cash Flow from Operating Activities</td>
                  <td className="py-2.5 px-4 text-right text-cyan-200">{formatFinancialNumber(curCF.operatingActivities.total, currency)}</td>
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-200">{formatFinancialNumber(priorCF?.operatingActivities.total, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2.5 px-4 text-right text-emerald-400">{formatPercent(yoyGrowth(curCF.operatingActivities.total, priorCF?.operatingActivities.total), true)}</td>}
                </tr>

                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={4} className="py-2 px-4 font-sans text-amber-400 uppercase tracking-wider text-[11px]">
                    Investing Activities (CapEx & Reinvestment)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Capital Expenditures (CapEx PP&E)</td>
                  <td className="py-2 px-4 text-right">({formatFinancialNumber(Math.abs(curCF.investingActivities.capitalExpenditures), currency)})</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">({formatFinancialNumber(Math.abs(priorCF?.investingActivities.capitalExpenditures ?? 0), currency)})</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">{formatPercent(yoyGrowth(Math.abs(curCF.investingActivities.capitalExpenditures), Math.abs(priorCF?.investingActivities.capitalExpenditures ?? 0)), true)}</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900 border-t border-slate-700">
                  <td className="py-2.5 px-4 font-sans pl-4 text-amber-300">Net Cash Used in Investing Activities</td>
                  <td className="py-2.5 px-4 text-right text-amber-200">{formatFinancialNumber(curCF.investingActivities.total, currency)}</td>
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-200">{formatFinancialNumber(priorCF?.investingActivities.total, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-300">—</td>}
                </tr>

                <tr className="bg-slate-950/60 font-semibold text-slate-300">
                  <td colSpan={4} className="py-2 px-4 font-sans text-purple-400 uppercase tracking-wider text-[11px]">
                    Financing Activities (Debt & Capital Return)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-sans pl-8 text-slate-300">Dividends Paid to Shareholders</td>
                  <td className="py-2 px-4 text-right">({formatFinancialNumber(Math.abs(curCF.financingActivities.dividendsPaid), currency)})</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">({formatFinancialNumber(Math.abs(priorCF?.financingActivities.dividendsPaid ?? 0), currency)})</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-300">—</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-semibold bg-slate-900 border-t border-slate-700">
                  <td className="py-2.5 px-4 font-sans pl-4 text-purple-300">Net Cash Flow from Financing Activities</td>
                  <td className="py-2.5 px-4 text-right text-purple-200">{formatFinancialNumber(curCF.financingActivities.total, currency)}</td>
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-200">{formatFinancialNumber(priorCF?.financingActivities.total, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-300">—</td>}
                </tr>

                {/* Rollforward and reconciliation */}
                <tr className="hover:bg-slate-800/40 font-bold bg-slate-950/80 border-t-2 border-slate-700 text-white">
                  <td className="py-2.5 px-4 font-sans text-cyan-400">NET CHANGE IN CASH & EQUIVALENTS</td>
                  <td className="py-2.5 px-4 text-right text-cyan-300">{formatFinancialNumber(curCF.netChangeInCash, currency)}</td>
                  {comparisonPeriod && <td className="py-2.5 px-4 text-right text-slate-200">{formatFinancialNumber(priorCF?.netChangeInCash, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2.5 px-4 text-right text-emerald-400">—</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 text-slate-400">
                  <td className="py-2 px-4 font-sans pl-8">Beginning Cash Balance</td>
                  <td className="py-2 px-4 text-right">{formatFinancialNumber(curCF.beginningCash, currency)}</td>
                  {comparisonPeriod && <td className="py-2 px-4 text-right">{formatFinancialNumber(priorCF?.beginningCash, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-2 px-4 text-right text-slate-400">—</td>}
                </tr>
                <tr className="hover:bg-slate-800/40 font-bold bg-slate-950 text-white border-b-2 border-slate-600">
                  <td className="py-3 px-4 font-sans text-emerald-400 text-sm">ENDING CASH BALANCE (RECONCILED TO BS)</td>
                  <td className="py-3 px-4 text-right text-emerald-300 text-sm">{formatFinancialNumber(curCF.endingCash, currency)}</td>
                  {comparisonPeriod && <td className="py-3 px-4 text-right text-slate-200 text-sm">{formatFinancialNumber(priorCF?.endingCash, currency)}</td>}
                  {showHorizontalGrowth && comparisonPeriod && <td className="py-3 px-4 text-right text-emerald-400">{formatPercent(yoyGrowth(curCF.endingCash, priorCF?.endingCash), true)}</td>}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer educational note */}
      <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          Model Structure Note: Laporan keuangan ini menerapkan model terintegrasi standar akuntansi korporat (US GAAP / IFRS kompatibel).
          Net Income mengalir ke Retained Earnings neraca dan baris pertama arus kas operasional; Saldo Kas Akhir merekonsiliasi pos Kas dan Setara Kas pada neraca secara matematis.
        </div>
      </div>
    </div>
  );
};
