import React from 'react';
import { Building2, Calendar, GitCompare, DollarSign, Layers } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { CurrencyCode } from '../../types/financial';

export const FilterBar: React.FC = () => {
  const {
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    activeCompany,
    selectedPeriodId,
    setSelectedPeriodId,
    comparisonPeriodId,
    setComparisonPeriodId,
    currency,
    setCurrency,
    dataMode,
    setDataMode,
  } = useFinancial();

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs select-none">
      {/* Left side filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Company Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Company:</span>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                {c.name} ({c.ticker})
              </option>
            ))}
          </select>
        </div>

        {/* Current Period Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-medium">Period:</span>
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
            className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer font-mono"
          >
            {activeCompany.periods.map((p) => (
              <option key={p.periodId} value={p.periodId} className="bg-slate-900 text-slate-200">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Period Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1">
          <GitCompare className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Compare:</span>
          <select
            value={comparisonPeriodId || ''}
            onChange={(e) => setComparisonPeriodId(e.target.value ? e.target.value : null)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer font-mono"
          >
            <option value="" className="bg-slate-900 text-slate-400">None (Prior auto)</option>
            {activeCompany.periods
              .filter((p) => p.periodId !== selectedPeriodId)
              .map((p) => (
                <option key={p.periodId} value={p.periodId} className="bg-slate-900 text-slate-200">
                  {p.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Right side toggles: Currency & Data Mode */}
      <div className="flex items-center gap-3">
        {/* Currency Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded p-0.5">
          <span className="px-2 text-slate-400 text-[11px] flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-slate-400" /> FX:
          </span>
          {(['USD', 'IDR', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
                currency === c
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Data Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded p-0.5">
          <span className="px-2 text-slate-400 text-[11px] flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" /> Mode:
          </span>
          {(['Actual', 'Budget', 'Forecast'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDataMode(mode)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                dataMode === mode
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
