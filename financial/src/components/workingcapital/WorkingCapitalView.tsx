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
import { Boxes, Clock, Scale, ArrowRight } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { formatFinancialNumber } from '../../services/calculationEngine';

export const WorkingCapitalView: React.FC = () => {
  const { activePeriod, activeRatios, currency, activeCompany, allRatiosMap } = useFinancial();

  const curBS = activePeriod.balanceSheet;
  const nwc = curBS.totalCurrentAssets - curBS.totalCurrentLiabilities;

  const dso = activeRatios.daysSalesOutstanding ?? 45;
  const dio = activeRatios.daysInventoryOutstanding ?? 60;
  const dpo = activeRatios.daysPayableOutstanding ?? 40;
  const ccc = activeRatios.cashConversionCycle ?? (dso + dio - dpo);

  // Multi-period CCC components
  const cccTrend = activeCompany.periods.map((p) => {
    const r = allRatiosMap[p.periodId];
    return {
      label: p.label,
      nwc: p.balanceSheet.totalCurrentAssets - p.balanceSheet.totalCurrentLiabilities,
      dso: r?.daysSalesOutstanding ?? 0,
      dio: r?.daysInventoryOutstanding ?? 0,
      dpo: r?.daysPayableOutstanding ?? 0,
      ccc: r?.cashConversionCycle ?? 0,
      ar: p.balanceSheet.accountsReceivable,
      inventory: p.balanceSheet.inventory,
      ap: p.balanceSheet.accountsPayable,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-400" />
            Working Capital & Cash Conversion Cycle (CCC)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis efisiensi perputaran modal kerja, hari penagihan piutang (DSO), hari stok gudang (DIO), dan tempo utang vendor (DPO).
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          Active: {activePeriod.label}
        </div>
      </div>

      {/* Working Capital Headline Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Net Working Capital</span>
            <span className="text-[10px] font-mono text-slate-500">CA - CL</span>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white">
            {formatFinancialNumber(nwc, currency, true)}
          </div>
          <p className="text-[11px] text-slate-400">Modal kerja operasional bersih</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>DSO (Piutang)</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-cyan-300">
            {dso.toFixed(0)} Hari
          </div>
          <p className="text-[11px] text-slate-400">Lama penagihan faktur penjualan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>DIO (Persediaan)</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-300">
            {dio.toFixed(0)} Hari
          </div>
          <p className="text-[11px] text-slate-400">Lama barang mengendap di gudang</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>DPO (Utang Usaha)</span>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-purple-300">
            {dpo.toFixed(0)} Hari
          </div>
          <p className="text-[11px] text-slate-400">Jangka waktu bayar ke pemasok</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-1 bg-cyan-950/20 border-cyan-800/40">
          <div className="text-xs text-cyan-300 font-semibold flex items-center justify-between">
            <span>Cash Conversion Cycle</span>
            <span className="text-[10px] font-mono text-cyan-400">DSO + DIO - DPO</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400">
            {ccc.toFixed(0)} Hari
          </div>
          <p className="text-[11px] text-slate-400">Hari kas terikat dalam operasi</p>
        </div>
      </div>

      {/* Visual Timeline of Cash Conversion Cycle */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-2">Visualisasi Jalur Alur Konversi Kas (Timeline Diagram)</h3>
        <p className="text-xs text-slate-400 mb-6">
          Memperlihatkan jeda waktu antara pembayaran kas ke supplier hingga pelunasan kas oleh pembeli
        </p>

        <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            {/* Step 1 */}
            <div className="flex-1 p-3 bg-slate-900 rounded border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px]">Beli Bahan Baku</span>
              <span className="text-slate-200 font-semibold">Hari 0</span>
            </div>
            <ArrowRight className="hidden md:block w-4 h-4 text-slate-600 shrink-0" />

            {/* Step 2 */}
            <div className="flex-1 p-3 bg-purple-950/30 rounded border border-purple-800/40 text-center">
              <span className="text-purple-300 block text-[11px]">Bayar Pemasok (DPO)</span>
              <span className="text-white font-mono font-bold">Hari {dpo.toFixed(0)}</span>
              <span className="text-[10px] text-purple-400 block mt-0.5">Kas Keluar</span>
            </div>
            <ArrowRight className="hidden md:block w-4 h-4 text-slate-600 shrink-0" />

            {/* Step 3 */}
            <div className="flex-1 p-3 bg-amber-950/30 rounded border border-amber-800/40 text-center">
              <span className="text-amber-300 block text-[11px]">Barang Terjual (DIO)</span>
              <span className="text-white font-mono font-bold">Hari {dio.toFixed(0)}</span>
              <span className="text-[10px] text-amber-400 block mt-0.5">Faktur Diterbitkan</span>
            </div>
            <ArrowRight className="hidden md:block w-4 h-4 text-slate-600 shrink-0" />

            {/* Step 4 */}
            <div className="flex-1 p-3 bg-emerald-950/30 rounded border border-emerald-800/40 text-center">
              <span className="text-emerald-300 block text-[11px]">Kas Tertagih (DSO)</span>
              <span className="text-white font-mono font-bold">Hari {(dio + dso).toFixed(0)}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Kas Masuk</span>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded text-center text-xs">
            <span className="text-slate-400">Total Waktu Kas Terikat (Cash Conversion Cycle): </span>
            <span className="text-cyan-300 font-mono font-bold text-sm">
              {(dio + dso).toFixed(0)} Hari (Operasi) - {dpo.toFixed(0)} Hari (Supplier) = {ccc.toFixed(0)} Hari
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Period CCC Component Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-1">Evolusi Hari Modal Kerja (DSO, DIO, DPO)</h3>
          <p className="text-xs text-slate-400 mb-4">Tren kecepatan penagihan, gudang, dan pembayaran utang dagang</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cccTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}d`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(v: any) => [`${Number(v).toFixed(0)} Hari`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="dso" name="DSO (Piutang)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dio" name="DIO (Persediaan)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dpo" name="DPO (Utang Pemasok)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-1">Tren Net Working Capital (Nilai Moneter)</h3>
          <p className="text-xs text-slate-400 mb-4">Besaran kas yang terikat dalam modal kerja lancar</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cccTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => formatFinancialNumber(v, currency, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
                  formatter={(v: any) => [formatFinancialNumber(Number(v), currency), 'Net Working Capital']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="nwc" name="Net Working Capital" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Trade-Off Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          Trade-off Strategis: Likuiditas vs Efisiensi Operasional vs Risiko Stockout
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded space-y-1">
            <div className="font-semibold text-slate-100">Dilema Pengurangan Persediaan (DIO Rendah)</div>
            <p className="text-slate-400 leading-relaxed">
              Menekan persediaan mempercepat perputaran kas dan memangkas biaya simpan gudang, tetapi meningkatkan risiko kekurangan persediaan (stockout) saat lonjakan permintaan mendadak atau keterlambatan pengiriman material.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded space-y-1">
            <div className="font-semibold text-slate-100">Dilema Ketatnya Piutang (DSO Rendah)</div>
            <p className="text-slate-400 leading-relaxed">
              Kebijakan pembayaran kredit yang terlalu kaku mempercepat penagihan uang tunai, namun dapat mendorong pelanggan beralih ke kompetitor yang menawarkan tenor pembayaran lebih fleksibel (misal: 60 hari vs 30 hari).
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded space-y-1">
            <div className="font-semibold text-slate-100">Dilema Penundaan Utang Pemasok (DPO Tinggi)</div>
            <p className="text-slate-400 leading-relaxed">
              Memperpanjang DPO memanfaatkan kredit pemasok sebagai pembiayaan modal kerja gratis, namun penundaan berlebih dapat merusak reputasi vendor, menghilangkan diskon tunai (early payment discount), atau memicu penghentian pasokan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
