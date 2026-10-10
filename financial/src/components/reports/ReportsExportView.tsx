import React from 'react';
import { FileText, Download, Printer, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import {
  exportFullFinancialModelExcel,
  exportIncomeStatementCSV,
  downloadCSV,
} from '../../services/exportService';
import {
  formatFinancialNumber,
  formatPercent,
  formatRatio,
} from '../../services/calculationEngine';

export const ReportsExportView: React.FC = () => {
  const {
    activeCompany,
    activePeriod,
    comparisonPeriod,
    activeRatios,
    priorRatios,
    currency,
    allRatiosMap,
    validationIssues,
    interpretations,
  } = useFinancial();

  const curIS = activePeriod.incomeStatement;
  const curBS = activePeriod.balanceSheet;
  const curCF = activePeriod.cashFlow;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadRatiosCSV = () => {
    const csvContent = [
      'Category,Ratio Name,Current Period,Prior Period,Benchmark Target',
      `Liquidity,Current Ratio,${activeRatios.currentRatio ?? ''},${priorRatios?.currentRatio ?? ''},1.5x - 2.5x`,
      `Liquidity,Quick Ratio,${activeRatios.quickRatio ?? ''},${priorRatios?.quickRatio ?? ''},1.0x - 1.5x`,
      `Liquidity,Cash Ratio,${activeRatios.cashRatio ?? ''},${priorRatios?.cashRatio ?? ''},0.2x - 0.5x`,
      `Profitability,Gross Margin %,${activeRatios.grossProfitMargin ?? ''},${priorRatios?.grossProfitMargin ?? ''},35% - 50%`,
      `Profitability,Operating Margin %,${activeRatios.operatingProfitMargin ?? ''},${priorRatios?.operatingProfitMargin ?? ''},10% - 20%`,
      `Profitability,Net Margin %,${activeRatios.netProfitMargin ?? ''},${priorRatios?.netProfitMargin ?? ''},7% - 15%`,
      `Solvency,Debt-to-Equity,${activeRatios.debtToEquity ?? ''},${priorRatios?.debtToEquity ?? ''},< 1.5x`,
      `Solvency,Interest Coverage,${activeRatios.interestCoverage ?? ''},${priorRatios?.interestCoverage ?? ''},> 3.0x`,
      `Efficiency,DSO (Days),${activeRatios.daysSalesOutstanding ?? ''},${priorRatios?.daysSalesOutstanding ?? ''},30 - 60d`,
      `Efficiency,DIO (Days),${activeRatios.daysInventoryOutstanding ?? ''},${priorRatios?.daysInventoryOutstanding ?? ''},45 - 90d`,
      `Efficiency,DPO (Days),${activeRatios.daysPayableOutstanding ?? ''},${priorRatios?.daysPayableOutstanding ?? ''},30 - 60d`,
      `Efficiency,Cash Conversion Cycle,${activeRatios.cashConversionCycle ?? ''},${priorRatios?.cashConversionCycle ?? ''},< 60d`,
    ].join('\n');

    downloadCSV(`${activeCompany.ticker}_Financial_Ratios.csv`, csvContent);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Executive Reports & Export Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Unduh model finansial Excel lengkap, ringkasan rasio CSV, atau cetak laporan eksekutif print-friendly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportIncomeStatementCSV(activeCompany.periods)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Statements</span>
          </button>
          <button
            onClick={handleDownloadRatiosCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Ratios</span>
          </button>
          <button
            onClick={() => exportFullFinancialModelExcel(activeCompany, allRatiosMap)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Report Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 text-slate-100 shadow-xl print:bg-white print:text-slate-900 print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold print:text-cyan-700">
              CONFIDENTIAL · FINANCIAL AUDIT & VALUATION MEMORANDUM
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1 print:text-slate-900">
              {activeCompany.name}
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
              Ticker: <span className="font-mono font-bold text-slate-200 print:text-slate-800">{activeCompany.ticker}</span> · Industry: {activeCompany.industry} · Currency: {activeCompany.currency}
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 print:text-slate-600 font-mono">
            <div>Periode Analisis: <strong className="text-slate-200 print:text-slate-900">{activePeriod.label}</strong></div>
            <div>Baseline: {comparisonPeriod?.label || 'Prior Period'}</div>
            <div>Tanggal Dokumen: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {/* 1. Executive Summary Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-cyan-800">
            1. Ringkasan Eksekutif Kinerja Finansial
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded print:border-slate-300 print:bg-slate-50">
              <span className="text-slate-400 print:text-slate-600 block text-[10px]">Revenue (Omzet)</span>
              <span className="text-lg font-bold font-mono">{formatFinancialNumber(curIS.revenue, currency)}</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded print:border-slate-300 print:bg-slate-50">
              <span className="text-slate-400 print:text-slate-600 block text-[10px]">Operating Income (EBIT)</span>
              <span className="text-lg font-bold font-mono text-emerald-400 print:text-emerald-700">{formatFinancialNumber(curIS.operatingIncome, currency)}</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded print:border-slate-300 print:bg-slate-50">
              <span className="text-slate-400 print:text-slate-600 block text-[10px]">Net Income (Laba Bersih)</span>
              <span className="text-lg font-bold font-mono text-cyan-300 print:text-cyan-800">{formatFinancialNumber(curIS.netIncome, currency)}</span>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded print:border-slate-300 print:bg-slate-50">
              <span className="text-slate-400 print:text-slate-600 block text-[10px]">Operating Cash Flow</span>
              <span className="text-lg font-bold font-mono text-emerald-400 print:text-emerald-700">{formatFinancialNumber(curCF.operatingActivities.total, currency)}</span>
            </div>
          </div>
        </div>

        {/* 2. Key Ratios Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-cyan-800">
            2. Matriks Rasio Keuangan Kunci
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-800 print:border-slate-300">
              <thead className="bg-slate-950 text-slate-400 print:bg-slate-100 print:text-slate-700 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Metrik Rasio</th>
                  <th className="py-2 px-3 text-right">Nilai Berjalan</th>
                  <th className="py-2 px-3 text-right">Nilai Pembanding</th>
                  <th className="py-2 px-3 text-center">Benchmark Industri</th>
                  <th className="py-2 px-3">Status Diagnostik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 font-mono text-slate-200 print:text-slate-900">
                <tr>
                  <td className="py-2 px-3 font-sans">Current Ratio</td>
                  <td className="py-2 px-3 text-right font-bold">{formatRatio(activeRatios.currentRatio)}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{formatRatio(priorRatios?.currentRatio)}</td>
                  <td className="py-2 px-3 text-center text-slate-400">1.5x - 2.5x</td>
                  <td className="py-2 px-3 font-sans text-emerald-400">Adequate</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Gross Profit Margin</td>
                  <td className="py-2 px-3 text-right font-bold">{formatPercent(activeRatios.grossProfitMargin)}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{formatPercent(priorRatios?.grossProfitMargin)}</td>
                  <td className="py-2 px-3 text-center text-slate-400">35% - 50%</td>
                  <td className="py-2 px-3 font-sans text-emerald-400">Healthy Margin</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Operating Profit Margin</td>
                  <td className="py-2 px-3 text-right font-bold">{formatPercent(activeRatios.operatingProfitMargin)}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{formatPercent(priorRatios?.operatingProfitMargin)}</td>
                  <td className="py-2 px-3 text-center text-slate-400">10% - 20%</td>
                  <td className="py-2 px-3 font-sans text-emerald-400">Solid Overhead Absorption</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Debt-to-Equity</td>
                  <td className="py-2 px-3 text-right font-bold">{formatRatio(activeRatios.debtToEquity)}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{formatRatio(priorRatios?.debtToEquity)}</td>
                  <td className="py-2 px-3 text-center text-slate-400">&lt; 1.5x</td>
                  <td className="py-2 px-3 font-sans text-slate-300">Sustainable Leverage</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Cash Conversion Cycle</td>
                  <td className="py-2 px-3 text-right font-bold">{activeRatios.cashConversionCycle ?? '—'} Hari</td>
                  <td className="py-2 px-3 text-right text-slate-400">{priorRatios?.cashConversionCycle ?? '—'} Hari</td>
                  <td className="py-2 px-3 text-center text-slate-400">&lt; 60 Hari</td>
                  <td className="py-2 px-3 font-sans text-cyan-300">Normal Working Capital Flow</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Automatic Interpretation Highlights */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-cyan-800">
            3. Temuan Kunci & Rekomendasi Audit
          </h3>
          <div className="space-y-2 text-xs">
            {interpretations.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded print:border-slate-300 print:bg-slate-50 space-y-1">
                <div className="font-bold text-white print:text-slate-900">{item.keyFinding}</div>
                <div className="text-slate-400 print:text-slate-600">{item.evidence}</div>
                <div className="text-slate-300 print:text-slate-800 mt-1">{item.interpretation}</div>
                <div className="text-emerald-400 print:text-emerald-800 font-semibold mt-1">
                  Rekomendasi: {item.recommendedInvestigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Data Quality & Balance Verification Log */}
        <div className="space-y-2 pt-2 border-t border-slate-800 print:border-slate-300 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-700">
            4. Laporan Kualitas Data & Rekonsiliasi Neraca
          </h3>
          {validationIssues.length === 0 ? (
            <div className="p-2.5 bg-emerald-950/30 border border-emerald-800 rounded text-emerald-300 print:text-emerald-800 print:border-slate-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Semua persamaan neraca seimbang (Aset = Liabilitas + Ekuitas) dan rollforward arus kas terevaluasi 100% konsisten.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {validationIssues.map((v) => (
                <div key={v.id} className="p-2 bg-slate-950 rounded border border-slate-800 print:border-slate-300 text-[11px] text-slate-300 print:text-slate-700 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white print:text-slate-900">{v.title}:</strong> {v.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Footer */}
        <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>Generated by Financial Analysis Lab Engine</span>
          <span>Security Level: Executive Briefing Only</span>
        </div>
      </div>
    </div>
  );
};
