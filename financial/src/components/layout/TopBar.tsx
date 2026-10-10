import React from 'react';
import { Download, Printer, RefreshCw, Database, BarChart3 } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { exportFullFinancialModelExcel } from '../../services/exportService';

export const TopBar: React.FC = () => {
  const { activeCompany, activePeriod, allRatiosMap, resetDemoData, setActivePage, activePage } = useFinancial();

  const handleExportExcel = () => {
    exportFullFinancialModelExcel(activeCompany, allRatiosMap);
  };

  const handlePrint = () => {
    setActivePage('reports');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const isAdmin = activePage === 'admin';

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between gap-8 sticky top-0 z-30 select-none">
      {/* Zone 1: Brand & Context wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold text-white tracking-tight whitespace-nowrap">
          {activeCompany.name}
        </span>
        <span className="text-slate-400" aria-hidden="true">·</span>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
          {activeCompany.ticker}
        </span>
        <span className="text-slate-400" aria-hidden="true">·</span>
        <span className="text-xs text-slate-300 whitespace-nowrap">
          {activePeriod.label}
        </span>
      </div>

      {/* Zone 2: Contextual tags / Domain status */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-slate-300">
        <span>Industry: {activeCompany.industry}</span>
        <span className="text-slate-400" aria-hidden="true">·</span>
        <span>Base Currency: {activeCompany.currency}</span>
        <span className="text-slate-400" aria-hidden="true">·</span>
        <span>Shares: {(activeCompany.sharesOutstanding / 1_000_000).toFixed(1)}M</span>
      </div>

      {/* Zone 3: Primary Action buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Toggle Mode: Admin Portal vs Visualization */}
        <button
          onClick={() => setActivePage(isAdmin ? 'overview' : 'admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${
            isAdmin
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
          }`}
        >
          {isAdmin ? (
            <>
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Buka Visualisasi</span>
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Admin Input Data</span>
            </>
          )}
        </button>

        <button
          onClick={resetDemoData}
          title="Reset dataset back to default synthetic model"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded border border-slate-700/80 transition-colors whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Demo</span>
        </button>

        <button
          onClick={handlePrint}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors whitespace-nowrap"
        >
          <Printer className="w-3.5 h-3.5 text-slate-400" />
          <span>Print Report</span>
        </button>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-sm transition-colors whitespace-nowrap font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Excel</span>
        </button>
      </div>
    </header>
  );
};

