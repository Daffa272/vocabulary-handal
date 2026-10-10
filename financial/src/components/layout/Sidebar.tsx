import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Percent,
  TrendingUp,
  ShieldAlert,
  ArrowLeftRight,
  Boxes,
  Scale,
  Sparkles,
  Calculator,
  UploadCloud,
  FileText,
  GraduationCap,
  AlertCircle,
  Database,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Core Executive',
    items: [
      { id: 'overview', label: 'Financial Overview', icon: LayoutDashboard },
      { id: 'statements', label: 'Financial Statements', icon: FileSpreadsheet },
      { id: 'ratios', label: 'Financial Ratios', icon: Percent },
    ],
  },
  {
    title: 'Diagnostic Deep Dive',
    items: [
      { id: 'profitability', label: 'Profitability Analysis', icon: TrendingUp },
      { id: 'liquidity', label: 'Liquidity & Solvency', icon: ShieldAlert },
      { id: 'cashflow', label: 'Cash Flow Analysis', icon: ArrowLeftRight },
      { id: 'workingcapital', label: 'Working Capital & CCC', icon: Boxes },
    ],
  },
  {
    title: 'Planning & Valuation',
    items: [
      { id: 'budget', label: 'Budget vs Actual', icon: Scale },
      { id: 'forecast', label: 'Forecast & Scenarios', icon: Sparkles },
      { id: 'valuation', label: 'Company Valuation (DCF)', icon: Calculator },
    ],
  },
  {
    title: 'Intelligence & Tooling',
    items: [
      { id: 'interpretation', label: 'Interpretation Lab', icon: AlertCircle },
      { id: 'import', label: 'Data Import & Mapping', icon: UploadCloud },
      { id: 'reports', label: 'Reports & Export', icon: FileText },
      { id: 'learning', label: 'Learning Center', icon: GraduationCap },
      { id: 'admin', label: 'Admin Data Hub (Input Data)', icon: Database },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, validationIssues, activeCompany } = useFinancial();

  const errorCount = validationIssues.filter((i) => i.severity === 'error').length;
  const warningCount = validationIssues.filter((i) => i.severity === 'warning').length;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm tracking-tight">
            FL
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              Financial Analysis Lab
            </h1>
            <p className="text-[11px] text-slate-400 tracking-normal">Corporate Financial Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              {group.title}
            </div>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate flex-1">{item.label}</span>
                    {item.id === 'interpretation' && warningCount > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                        {warningCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Status Panel */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{activeCompany.ticker} Data</span>
          </span>
          <span className="text-[10px] text-slate-400">Demo Synthetic</span>
        </div>

        {errorCount > 0 ? (
          <div className="flex items-center justify-between px-2 py-1 bg-red-950/40 border border-red-800/60 rounded text-[11px] text-red-300">
            <span>Balance Discrepancy</span>
            <span className="font-mono font-bold">{errorCount}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-1 bg-emerald-950/30 border border-emerald-800/50 rounded text-[11px] text-emerald-400">
            <span>Audit Check</span>
            <span>Balanced</span>
          </div>
        )}
      </div>
    </aside>
  );
};
