import React, { useState } from 'react';
import { Percent, Shield, TrendingUp, Cpu, Activity, Info, AlertTriangle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { formatFinancialNumber, formatPercent, formatRatio } from '../../services/calculationEngine';

interface RatioItemProps {
  name: string;
  formula: string;
  value: string;
  priorValue?: string;
  change?: string;
  isPositiveChange?: boolean | null;
  interpretation: string;
  benchmark?: string;
  limitations?: string;
  warning?: string;
}

const RatioCard: React.FC<RatioItemProps> = ({
  name,
  formula,
  value,
  priorValue,
  change,
  isPositiveChange,
  interpretation,
  benchmark,
  limitations,
  warning,
}) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-white tracking-tight">{name}</h4>
        {benchmark && (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            BM: {benchmark}
          </span>
        )}
      </div>

      <div className="bg-slate-950/70 border border-slate-800/80 rounded px-2.5 py-1 mb-3 text-[11px] font-mono text-cyan-300 truncate" title={formula}>
        {formula}
      </div>

      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-2xl font-bold font-mono tabular-nums text-white">{value}</span>
        {priorValue && (
          <span className="text-xs text-slate-400 font-mono">
            Prior: {priorValue}
          </span>
        )}
        {change && (
          <span
            className={`text-xs font-mono font-medium ${
              isPositiveChange === true
                ? 'text-emerald-400'
                : isPositiveChange === false
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {warning && (
        <div className="mb-2 p-2 bg-amber-950/30 border border-amber-800/50 rounded text-[11px] text-amber-300 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}

      <p className="text-xs text-slate-300 leading-relaxed mb-3">{interpretation}</p>
    </div>

    {limitations && (
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
        Asumsi & Batasan: {limitations}
      </div>
    )}
  </div>
);

export const RatioCalculatorView: React.FC = () => {
  const { activeRatios, priorRatios, currency } = useFinancial();
  const [debtDefinition, setDebtDefinition] = useState<'total' | 'interestBearing'>('total');

  const deValue = debtDefinition === 'total' 
    ? activeRatios.debtToEquity 
    : activeRatios.debtToEquityInterestBearing;
  const dePriorValue = debtDefinition === 'total'
    ? priorRatios?.debtToEquity
    : priorRatios?.debtToEquityInterestBearing;

  const diffStr = (cur: number | null, prior: number | null, suffix: string = '%', multiplier: number = 1) => {
    if (cur === null || prior === null) return undefined;
    const d = (cur - prior) * multiplier;
    const sign = d > 0 ? '+' : '';
    return `${sign}${d.toFixed(1)}${suffix}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Percent className="w-5 h-5 text-cyan-400" />
            Financial Ratio Calculator & Diagnostics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kalkulator rasio komprehensif 5 dimensi dengan rumus transparan, benchmarking industri, dan penanganan keterbatasan data.
          </p>
        </div>

        {/* Debt definition switch */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <span className="text-slate-400 px-2 font-medium">Definisi Utang:</span>
          <button
            onClick={() => setDebtDefinition('total')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              debtDefinition === 'total'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Total Liabilitas
          </button>
          <button
            onClick={() => setDebtDefinition('interestBearing')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              debtDefinition === 'interestBearing'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interest-Bearing Debt
          </button>
        </div>
      </div>

      {/* 1. LIQUIDITY SECTION */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>1. Liquidity Ratios (Kemampuan Pemenuhan Kewajiban Lancar)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RatioCard
            name="Current Ratio"
            formula="Current Ratio = Current Assets / Current Liabilities"
            value={formatRatio(activeRatios.currentRatio)}
            priorValue={formatRatio(priorRatios?.currentRatio)}
            change={diffStr(activeRatios.currentRatio, priorRatios?.currentRatio ?? null, 'x')}
            isPositiveChange={(activeRatios.currentRatio ?? 0) >= (priorRatios?.currentRatio ?? 0)}
            interpretation="Mengukur kesiapan aset likuid dan operasional melunasi kewajiban jangka pendek (< 12 bulan)."
            benchmark="1.5x - 2.5x"
            limitations="Menyertakan persediaan yang membutuhkan waktu konversi fisik menjadi kas."
          />

          <RatioCard
            name="Quick (Acid-Test) Ratio"
            formula="Quick Ratio = (Cash + Short-Term Inv + AR) / Current Liabilities"
            value={formatRatio(activeRatios.quickRatio)}
            priorValue={formatRatio(priorRatios?.quickRatio)}
            change={diffStr(activeRatios.quickRatio, priorRatios?.quickRatio ?? null, 'x')}
            isPositiveChange={(activeRatios.quickRatio ?? 0) >= (priorRatios?.quickRatio ?? 0)}
            interpretation="Mengukur kesiapan likuiditas murni tanpa mengandalkan penjualan paksa persediaan barang dagang."
            benchmark="1.0x - 1.5x"
            limitations="Asumsi bahwa piutang pelanggan dapat tertagih tepat waktu tanpa default material."
          />

          <RatioCard
            name="Cash Ratio"
            formula="Cash Ratio = Cash and Cash Equivalents / Current Liabilities"
            value={formatRatio(activeRatios.cashRatio)}
            priorValue={formatRatio(priorRatios?.cashRatio)}
            change={diffStr(activeRatios.cashRatio, priorRatios?.cashRatio ?? null, 'x')}
            isPositiveChange={(activeRatios.cashRatio ?? 0) >= (priorRatios?.cashRatio ?? 0)}
            interpretation="Tingkat proteksi likuiditas paling konservatif: uang kas seketika dibandingkan utang lancar."
            benchmark="0.2x - 0.5x"
            limitations="Kas berlebih yang terlalu tinggi dapat mengindikasikan alokasi modal yang suboptimal."
          />
        </div>
      </section>

      {/* 2. PROFITABILITY SECTION */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>2. Profitability Ratios (Efektivitas Penciptaan Laba & Return)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <RatioCard
            name="Gross Profit Margin"
            formula="Gross Margin = (Gross Profit / Revenue) × 100%"
            value={formatPercent(activeRatios.grossProfitMargin)}
            priorValue={formatPercent(priorRatios?.grossProfitMargin)}
            change={diffStr(activeRatios.grossProfitMargin, priorRatios?.grossProfitMargin ?? null)}
            isPositiveChange={(activeRatios.grossProfitMargin ?? 0) >= (priorRatios?.grossProfitMargin ?? 0)}
            interpretation="Persentase setiap rupiah pendapatan yang tersisa setelah membayar ongkos produksi langsung."
            benchmark="35% - 50%"
          />

          <RatioCard
            name="Operating Profit Margin"
            formula="Operating Margin = (Operating Income / Revenue) × 100%"
            value={formatPercent(activeRatios.operatingProfitMargin)}
            priorValue={formatPercent(priorRatios?.operatingProfitMargin)}
            change={diffStr(activeRatios.operatingProfitMargin, priorRatios?.operatingProfitMargin ?? null)}
            isPositiveChange={(activeRatios.operatingProfitMargin ?? 0) >= (priorRatios?.operatingProfitMargin ?? 0)}
            interpretation="Mengukur efisiensi manajemen operasional mengendalikan beban overhead, penjualan, dan R&D."
            benchmark="10% - 20%"
          />

          <RatioCard
            name="Net Profit Margin"
            formula="Net Margin = (Net Income / Revenue) × 100%"
            value={formatPercent(activeRatios.netProfitMargin)}
            priorValue={formatPercent(priorRatios?.netProfitMargin)}
            change={diffStr(activeRatios.netProfitMargin, priorRatios?.netProfitMargin ?? null)}
            isPositiveChange={(activeRatios.netProfitMargin ?? 0) >= (priorRatios?.netProfitMargin ?? 0)}
            interpretation="Persentase laba bersih final yang tersisa bagi pemegang saham setelah bunga dan pajak."
            benchmark="7% - 15%"
          />

          <RatioCard
            name="Return on Assets (ROA)"
            formula="ROA = (Net Income / Average Total Assets) × 100%"
            value={formatPercent(activeRatios.roa)}
            priorValue={formatPercent(priorRatios?.roa)}
            change={diffStr(activeRatios.roa, priorRatios?.roa ?? null)}
            isPositiveChange={(activeRatios.roa ?? 0) >= (priorRatios?.roa ?? 0)}
            interpretation="Mengukur seberapa produktif total kapital aset perusahaan menghasilkan laba bersih."
            benchmark="8% - 12%"
            warning={activeRatios.hasAverageBalanceWarning ? "Menggunakan saldo akhir aset karena saldo awal tidak ada" : undefined}
          />

          <RatioCard
            name="Return on Equity (ROE)"
            formula="ROE = (Net Income / Average Total Equity) × 100%"
            value={formatPercent(activeRatios.roe)}
            priorValue={formatPercent(priorRatios?.roe)}
            change={diffStr(activeRatios.roe, priorRatios?.roe ?? null)}
            isPositiveChange={(activeRatios.roe ?? 0) >= (priorRatios?.roe ?? 0)}
            interpretation="Tingkat pengembalian laba atas modal yang disetor dan laba ditahan pemegang saham."
            benchmark="15% - 22%"
            warning={activeRatios.hasAverageBalanceWarning ? "Menggunakan saldo akhir ekuitas karena saldo awal tidak ada" : undefined}
          />
        </div>
      </section>

      {/* 3. SOLVENCY & LEVERAGE */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>3. Solvency & Leverage Ratios (Struktur Modal & Kapasitas Bunga)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RatioCard
            name="Debt-to-Equity Ratio"
            formula={debtDefinition === 'total' ? "D/E = Total Liabilities / Total Equity" : "D/E = (Short Debt + Long Debt) / Total Equity"}
            value={formatRatio(deValue)}
            priorValue={formatRatio(dePriorValue)}
            change={diffStr(deValue, dePriorValue ?? null, 'x')}
            isPositiveChange={(deValue ?? 0) <= (dePriorValue ?? 0)}
            interpretation={`Rasio ketergantungan modal pada utang (${debtDefinition === 'total' ? 'Semua Kewajiban' : 'Utang Berbunga'}) dibanding modal sendiri.`}
            benchmark="< 1.5x"
            limitations="Total liabilitas menyertakan utang usaha dagang non-bunga yang merupakan modal kerja wajar."
          />

          <RatioCard
            name="Debt Ratio (Gearing)"
            formula="Debt Ratio = (Total Liabilities / Total Assets) × 100%"
            value={formatPercent(activeRatios.debtRatio)}
            priorValue={formatPercent(priorRatios?.debtRatio)}
            change={diffStr(activeRatios.debtRatio, priorRatios?.debtRatio ?? null)}
            isPositiveChange={(activeRatios.debtRatio ?? 0) <= (priorRatios?.debtRatio ?? 0)}
            interpretation="Proporsi aset perusahaan yang dibiayai oleh kreditur luar dibanding modal sendiri."
            benchmark="< 50%"
          />

          <RatioCard
            name="Interest Coverage Ratio"
            formula="Interest Coverage = Operating Income (EBIT) / Interest Expense"
            value={activeRatios.interestCoverage ? `${activeRatios.interestCoverage.toFixed(2)}x` : '—'}
            priorValue={priorRatios?.interestCoverage ? `${priorRatios.interestCoverage.toFixed(2)}x` : '—'}
            change={diffStr(activeRatios.interestCoverage, priorRatios?.interestCoverage ?? null, 'x')}
            isPositiveChange={(activeRatios.interestCoverage ?? 0) >= (priorRatios?.interestCoverage ?? 0)}
            interpretation="Berapa kali laba operasional dapat menutupi kewajiban pembayaran bunga pinjaman tahunan."
            benchmark="> 3.0x"
            limitations="Hanya menghitung bunga eksplisit laba rugi, bukan pembayaran pokok pinjaman jatuh tempo."
          />

          <RatioCard
            name="Cash Flow to Debt"
            formula="CF to Debt = Operating Cash Flow / Total Liabilities"
            value={formatPercent(activeRatios.cashFlowToDebt ? activeRatios.cashFlowToDebt * 100 : null)}
            priorValue={formatPercent(priorRatios?.cashFlowToDebt ? priorRatios.cashFlowToDebt * 100 : null)}
            interpretation="Kemampuan arus kas operasional nyata melunasi seluruh kewajiban tanpa pembiayaan baru."
            benchmark="> 20%"
          />
        </div>
      </section>

      {/* 4. EFFICIENCY & TURNOVER */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>4. Efficiency & Working Capital Velocity Ratios</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RatioCard
            name="Days Sales Outstanding (DSO)"
            formula="DSO = (Average AR / Revenue) × 365 Hari"
            value={`${activeRatios.daysSalesOutstanding ?? '—'} Hari`}
            priorValue={priorRatios?.daysSalesOutstanding ? `${priorRatios.daysSalesOutstanding} Hari` : '—'}
            interpretation="Rata-rata jangka waktu (hari) yang dibutuhkan untuk menagih piutang dari pelanggan."
            benchmark="30 - 60 Hari"
            limitations="Mengasumsikan seluruh pendapatan adalah penjualan kredit jika rincian tunai tidak ada."
          />

          <RatioCard
            name="Days Inventory Outstanding (DIO)"
            formula="DIO = (Average Inventory / COGS) × 365 Hari"
            value={`${activeRatios.daysInventoryOutstanding ?? '—'} Hari`}
            priorValue={priorRatios?.daysInventoryOutstanding ? `${priorRatios.daysInventoryOutstanding} Hari` : '—'}
            interpretation="Rata-rata lamanya persediaan barang mengendap di gudang sebelum berhasil terjual."
            benchmark="45 - 90 Hari"
          />

          <RatioCard
            name="Days Payable Outstanding (DPO)"
            formula="DPO = (Average AP / COGS) × 365 Hari"
            value={`${activeRatios.daysPayableOutstanding ?? '—'} Hari`}
            priorValue={priorRatios?.daysPayableOutstanding ? `${priorRatios.daysPayableOutstanding} Hari` : '—'}
            interpretation="Rata-rata waktu perusahaan menunda pembayaran faktur tagihan ke vendor pemasok."
            benchmark="30 - 60 Hari"
          />

          <RatioCard
            name="Cash Conversion Cycle (CCC)"
            formula="CCC = DSO + DIO - DPO"
            value={`${activeRatios.cashConversionCycle ?? '—'} Hari`}
            priorValue={priorRatios?.cashConversionCycle ? `${priorRatios.cashConversionCycle} Hari` : '—'}
            change={diffStr(activeRatios.cashConversionCycle, priorRatios?.cashConversionCycle ?? null, ' Hari')}
            isPositiveChange={(activeRatios.cashConversionCycle ?? 0) <= (priorRatios?.cashConversionCycle ?? 0)}
            interpretation="Hari yang dibutuhkan sejak kas keluar membeli bahan baku sampai kas diterima dari pembeli."
            benchmark="< 60 Hari"
          />
        </div>
      </section>

      {/* 5. CASH FLOW RATIOS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>5. Cash Flow & Free Cash Generation</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RatioCard
            name="Operating Cash Flow Ratio"
            formula="OCF Ratio = Operating Cash Flow / Current Liabilities"
            value={formatRatio(activeRatios.operatingCashFlowRatio)}
            priorValue={formatRatio(priorRatios?.operatingCashFlowRatio)}
            interpretation="Mengukur kecukupan uang tunai hasil operasi untuk membayar liabilitas lancar yang segera jatuh tempo."
            benchmark="> 0.4x"
          />

          <RatioCard
            name="Free Cash Flow (FCF)"
            formula="FCF = Operating Cash Flow - Capital Expenditures (CapEx)"
            value={formatFinancialNumber(activeRatios.freeCashFlow, currency)}
            priorValue={formatFinancialNumber(priorRatios?.freeCashFlow, currency)}
            interpretation="Arus kas murni yang tersisa untuk dividen, pelunasan utang pokok, atau akuisisi strategis setelah mendanai pemeliharaan aset modal."
            benchmark="Positif & Bertumbuh"
          />
        </div>
      </section>
    </div>
  );
};
