import React, { useState } from 'react';
import { 
  HardDrive, 
  Cpu, 
  Layers, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const BigDataLab: React.FC = () => {
  const [dataScale, setDataScale] = useState<'10k' | '100k' | '1m'>('100k');
  const [splitDateTime, setSplitDateTime] = useState<boolean>(true);
  const [useAggregations, setUseAggregations] = useState<boolean>(true);
  const [queryFoldingEnabled, setQueryFoldingEnabled] = useState<boolean>(true);

  // Simulation calculations
  const scaleInfo = {
    '10k': { rows: 10000, rawSizeMb: 4.8, optimalRamMb: 0.4, unoptimizedRamMb: 2.1, estDaxMs: 45 },
    '100k': { rows: 100000, rawSizeMb: 48, optimalRamMb: 3.2, unoptimizedRamMb: 24.5, estDaxMs: 110 },
    '1m': { rows: 1000000, rawSizeMb: 480, optimalRamMb: 28.5, unoptimizedRamMb: 245.0, estDaxMs: 320 }
  }[dataScale];

  const estimatedRam = splitDateTime ? scaleInfo.optimalRamMb : scaleInfo.unoptimizedRamMb;
  const estimatedQuerySpeed = useAggregations ? Math.round(scaleInfo.estDaxMs * 0.25) : scaleInfo.estDaxMs;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 10 LAB</span>
              <span>·</span>
              <span>ENTERPRISE ARCHITECTURE & VERTIPAQ</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Koneksi & Optimasi Big Data (10k, 100k, 1M+ Baris)
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pelajari cara mengolah jutaan baris data di Power BI tanpa memperlambat laporan. Pahami mekanisme mesin VertiPaq, eliminasi kolom kardinalitas tinggi, Query Folding, dan Composite Model.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              Skala Aktif: {scaleInfo.rows.toLocaleString('id-ID')} Baris
            </span>
          </div>
        </div>

        {/* Scale Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 mr-2 font-medium">Pilih Volume Dataset Uji:</span>
          
          <button
            onClick={() => setDataScale('10k')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              dataScale === '10k'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            10.000 Baris (Menengah)
          </button>

          <button
            onClick={() => setDataScale('100k')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              dataScale === '100k'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            100.000 Baris (Besar)
          </button>

          <button
            onClick={() => setDataScale('1m')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              dataScale === '1m'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1.000.000 Baris (Enterprise Scale)
          </button>
        </div>
      </div>

      {/* Main Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Architecture Switches (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-white font-display pb-3 border-b border-slate-800">
              Konfigurasi Optimasi Model Data
            </h2>

            {/* Toggle 1: Split DateTime */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Pisahkan Kolom DateTime:</span>
                <button
                  onClick={() => setSplitDateTime(!splitDateTime)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    splitDateTime 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'bg-red-950/40 text-red-300 border border-red-500/40'
                  }`}
                >
                  {splitDateTime ? 'ON (Date + Time Terpisah)' : 'OFF (Gabung DateTime Mentah)'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Memisahkan tanggal dan jam mengurangi kardinalitas unik dari jutaan kombinasi detik menjadi hanya 365 hari + 1.440 menit, menghemat hingga 85% RAM!
              </p>
            </div>

            {/* Toggle 2: Aggregations Table */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Tabel Agregasi (Composite):</span>
                <button
                  onClick={() => setUseAggregations(!useAggregations)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    useAggregations 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {useAggregations ? 'AKTIF (Fast Cache)' : 'NONAKTIF (Full DirectQuery)'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Menyimpan ringkasan bulanan di RAM Import, sehingga 90% kueri dijawab instan tanpa menyentuh database server.
              </p>
            </div>

            {/* Toggle 3: Query Folding */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Status Query Folding:</span>
                <button
                  onClick={() => setQueryFoldingEnabled(!queryFoldingEnabled)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    queryFoldingEnabled 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
                      : 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {queryFoldingEnabled ? 'FOLDING TERJAGA (SQL Pushdown)' : 'TERPUTUS (Client-side Eval)'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Power Query menerjemahkan langkah filter langsung ke server database SQL.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Simulated Performance Diagnostics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Simulasi Diagnostics Performance Analyzer
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Model VertiPaq Metrics
              </span>
            </div>

            {/* Metric Comparison Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Ukuran Data Mentah</span>
                <span className="text-base font-bold text-slate-200 font-mono">{scaleInfo.rawSizeMb} MB</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Estimasi RAM VertiPaq</span>
                <span className={`text-base font-bold font-mono ${splitDateTime ? 'text-cyan-300' : 'text-red-400'}`}>
                  {estimatedRam.toFixed(1)} MB
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block mb-0.5">Waktu Render DAX</span>
                <span className="text-base font-bold text-emerald-300 font-mono">{estimatedQuerySpeed} ms</span>
              </div>
            </div>

            {/* Compression Gauge Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Rasio Kompresi Kolom VertiPaq:</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {splitDateTime ? '16.8x Pemadatan' : '2.0x (Kardinalitas Tinggi!)'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    splitDateTime ? 'bg-gradient-to-r from-cyan-500 to-indigo-500' : 'bg-red-500'
                  }`}
                  style={{ width: splitDateTime ? '90%' : '20%' }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                {splitDateTime 
                  ? 'Efisiensi prima: Dictionary Encoding memampatkan baris data ke bitstream ringkas.' 
                  : 'Peringatan: Kolom Timestamp yang belum dipecah menghambat efisiensi memori.'}
              </span>
            </div>

            {/* 4 Golden Rules for Big Data */}
            <div className="space-y-2 text-xs pt-1">
              <span className="font-bold text-white block font-display">
                4 Aturan Emas Arsitektur Big Data di Power BI:
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                <li><strong className="text-slate-100">Hapus Kolom yang Tidak Perlu:</strong> Jangan impor kolom ID teknis atau catatan log yang tidak muncul di visual.</li>
                <li><strong className="text-slate-100">Gunakan Incremental Refresh:</strong> Jangan memuat ulang data transaksi 5 tahun lalu setiap hari; hanya segarkan partisi 10 hari terakhir.</li>
                <li><strong className="text-slate-100">Pertahankan Query Folding:</strong> Pastikan filter tanggal dan merge dieksekusi di database server SQL sebelum data sampai ke laptop.</li>
                <li><strong className="text-slate-100">Manfaatkan Aggregations:</strong> Sediakan tabel agregasi harian/bulanan agar pengguna mendapatkan visual instan.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
