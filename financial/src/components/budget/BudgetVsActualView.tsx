import React, { useState, useMemo } from 'react';
import { Scale, Search, Filter, Plus, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { formatFinancialNumber, formatPercent, safeDivide } from '../../services/calculationEngine';
import { BudgetActualRow } from '../../types/financial';

export const BudgetVsActualView: React.FC = () => {
  const { activePeriod, currency, updateActivePeriod } = useFinancial();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'variance' | 'variancePercent' | 'budget'>('variance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Default budget rows if not in active period
  const rawRows: BudgetActualRow[] = useMemo(() => {
    if (activePeriod.budgetActual && activePeriod.budgetActual.length > 0) {
      return activePeriod.budgetActual;
    }
    return [
      { accountName: 'North America Direct Sales', category: 'Revenue', department: 'Commercial', budget: 90_000_000, actual: 92_340_000, variance: 2_340_000, variancePercent: 2.6, isFavorable: true },
      { accountName: 'Global Channel Partner Sales', category: 'Revenue', department: 'Global Sales', budget: 75_000_000, actual: 69_660_000, variance: -5_340_000, variancePercent: -7.1, isFavorable: false },
      { accountName: 'Raw Steel & Alloy Direct Materials', category: 'COGS', department: 'Procurement', budget: 52_000_000, actual: 55_400_000, variance: 3_400_000, variancePercent: 6.5, isFavorable: false },
      { accountName: 'Direct Assembly Line Labor', category: 'COGS', department: 'Operations', budget: 42_000_000, actual: 41_800_000, variance: -200_000, variancePercent: -0.5, isFavorable: true },
      { accountName: 'Engineering Prototype Testing', category: 'OpEx', department: 'R&D', budget: 12_000_000, actual: 11_200_000, variance: -800_000, variancePercent: -6.7, isFavorable: true },
      { accountName: 'Executive Flight & Conference Travel', category: 'OpEx', department: 'Administration', budget: 4_500_000, actual: 5_100_000, variance: 600_000, variancePercent: 13.3, isFavorable: false },
      { accountName: 'Factory Robotics CapEx Upgrade', category: 'CapEx', department: 'Operations', budget: 7_500_000, actual: 7_800_000, variance: 300_000, variancePercent: 4.0, isFavorable: false },
    ];
  }, [activePeriod]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    rawRows.forEach((r) => set.add(r.department));
    return Array.from(set);
  }, [rawRows]);

  // Categories
  const categories = ['All', 'Revenue', 'COGS', 'OpEx', 'CapEx'];

  // Filtering & sorting
  const filteredRows = useMemo(() => {
    return rawRows
      .filter((r) => {
        const matchesSearch = r.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              r.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
        const matchesDept = selectedDepartment === 'All' || r.department === selectedDepartment;
        return matchesSearch && matchesCategory && matchesDept;
      })
      .sort((a, b) => {
        let valA = a[sortBy] ?? 0;
        let valB = b[sortBy] ?? 0;
        if (sortOrder === 'desc') return valB > valA ? 1 : -1;
        return valA > valB ? 1 : -1;
      });
  }, [rawRows, searchQuery, selectedCategory, selectedDepartment, sortBy, sortOrder]);

  // Summary Totals
  const totalBudgetRev = rawRows.filter((r) => r.category === 'Revenue').reduce((acc, r) => acc + r.budget, 0);
  const totalActualRev = rawRows.filter((r) => r.category === 'Revenue').reduce((acc, r) => acc + r.actual, 0);
  const revVariance = totalActualRev - totalBudgetRev;

  const totalBudgetExp = rawRows.filter((r) => r.category !== 'Revenue').reduce((acc, r) => acc + r.budget, 0);
  const totalActualExp = rawRows.filter((r) => r.category !== 'Revenue').reduce((acc, r) => acc + r.actual, 0);
  const expVariance = totalActualExp - totalBudgetExp;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            Budget vs Actual Variance Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis varians anggaran vs realisasi dengan pembedaan otomatis status Favorable vs Unfavorable berdasarkan karakteristik akun.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          Periode: {activePeriod.label}
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Total Pendapatan (Revenue Variance)</div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-white">
              {formatFinancialNumber(totalActualRev, currency, true)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Budget: {formatFinancialNumber(totalBudgetRev, currency, true)}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className={`font-mono font-semibold ${revVariance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {revVariance >= 0 ? '+' : ''}{formatFinancialNumber(revVariance, currency, true)} ({formatPercent(safeDivide(revVariance, totalBudgetRev, 100), true)})
            </span>
            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${revVariance >= 0 ? 'bg-emerald-950/60 text-emerald-300' : 'bg-rose-950/60 text-rose-300'}`}>
              {revVariance >= 0 ? 'Favorable' : 'Unfavorable'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Total Pengeluaran & Biaya (Expense Variance)</div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-white">
              {formatFinancialNumber(totalActualExp, currency, true)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Budget: {formatFinancialNumber(totalBudgetExp, currency, true)}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className={`font-mono font-semibold ${expVariance <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {expVariance >= 0 ? '+' : ''}{formatFinancialNumber(expVariance, currency, true)} ({formatPercent(safeDivide(expVariance, totalBudgetExp, 100), true)})
            </span>
            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${expVariance <= 0 ? 'bg-emerald-950/60 text-emerald-300' : 'bg-rose-950/60 text-rose-300'}`}>
              {expVariance <= 0 ? 'Favorable' : 'Unfavorable'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Aturan Pengujian Varians (Business Logic)</div>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            • <strong className="text-emerald-400">Revenue</strong>: Realisasi &gt; Anggaran = <strong className="text-emerald-400">Favorable</strong> (Penjualan melampaui target).<br />
            • <strong className="text-rose-400">Beban/COGS/OpEx</strong>: Realisasi &gt; Anggaran = <strong className="text-rose-400">Unfavorable</strong> (Over-budget/pemborosan).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama akun atau departemen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-48"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Departemen:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">Semua Departemen</option>
              {departments.map((d) => (
                <option key={d} value={d} className="bg-slate-900">{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 text-slate-200 px-2 py-1 rounded border border-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="variance">Besaran Varians</option>
            <option value="variancePercent">Persentase Varians</option>
            <option value="budget">Anggaran</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 hover:text-white"
          >
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {/* Variance Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Nama Akun / Uraian</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Departemen</th>
                <th className="py-3 px-4 text-right">Budget (Rencana)</th>
                <th className="py-3 px-4 text-right">Actual (Realisasi)</th>
                <th className="py-3 px-4 text-right">Varians (Act - Bud)</th>
                <th className="py-3 px-4 text-right">Varians %</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums text-slate-200">
              {filteredRows.map((row, idx) => {
                const isFavorable = row.isFavorable;
                const varPct = row.variancePercent;
                return (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-sans font-medium text-white">{row.accountName}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-400">{row.category}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-400">{row.department}</td>
                    <td className="py-2.5 px-4 text-right">{formatFinancialNumber(row.budget, currency)}</td>
                    <td className="py-2.5 px-4 text-right text-slate-100">{formatFinancialNumber(row.actual, currency)}</td>
                    <td className={`py-2.5 px-4 text-right font-semibold ${isFavorable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.variance > 0 ? '+' : ''}{formatFinancialNumber(row.variance, currency)}
                    </td>
                    <td className={`py-2.5 px-4 text-right ${isFavorable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(varPct, true)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase ${
                          isFavorable
                            ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-300'
                            : 'bg-rose-950/60 border border-rose-800/50 text-rose-300'
                        }`}
                      >
                        {isFavorable ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Favorable</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-400" />
                            <span>Unfavorable</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
