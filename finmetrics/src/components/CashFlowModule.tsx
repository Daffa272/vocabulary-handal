import React, { useState } from 'react';
import { Layers, ArrowDownRight, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const CashFlowModule: React.FC = () => {
  // Simulator inputs
  const [cfo, setCfo] = useState<number>(150); // Operating Cash Flow
  const [capex, setCapex] = useState<number>(50); // Capital Expenditures
  const [otherCfi, setOtherCfi] = useState<number>(10); // Other investments (usually negative or positive)
  const [cff, setCff] = useState<number>(-20); // Financing Cash Flow (dividends, debt payment)

  // Presets based on company lifecycle
  const applyLifecyclePreset = (preset: 'startup' | 'growth' | 'mature' | 'distressed') => {
    switch (preset) {
      case 'startup':
        setCfo(-80);
        setCapex(60);
        setOtherCfi(0);
        setCff(180); // Funded by external equity/debt
        break;
      case 'growth':
        setCfo(120);
        setCapex(150); // High aggressive CapEx
        setOtherCfi(-20);
        setCff(60);
        break;
      case 'mature':
        setCfo(280);
        setCapex(50); // Maintenance CapEx
        setOtherCfi(-10);
        setCff(-150); // Large dividends & debt repayment
        break;
      case 'distressed':
        setCfo(-60);
        setCapex(10);
        setOtherCfi(70); // Desperation asset sell-off
        setCff(-40); // Paying overdue debt
        break;
    }
  };

  const totalCfi = -(capex) + otherCfi;
  const netChangeInCash = cfo + totalCfi + cff;
  const fcf = cfo - capex;

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
          <span>Modul 03</span>
          <span aria-hidden="true">·</span>
          <span>Laporan Arus Kas (Cash Flow Statement)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          3 Pipa Aliran Kas & Menghitung Free Cash Flow (FCF)
        </h2>
        <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          Pepatah legendaris Wall Street mengatakan: <em>"Revenue is vanity, profit is sanity, but cash is reality."</em> 
          Laporan Arus Kas mencatat aliran riil uang masuk dan keluar. Perusahaan dapat membukukan laba akuntansi 
          di atas kertas, namun bangkrut jika kehabisan kas operasional.
        </p>
      </div>

      {/* 3 Cash Flow Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CFO */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Pipa 1 · Bisnis Inti</span>
              <span className="font-mono text-emerald-700 font-semibold">CFO</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Arus Kas Operasi</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Uang tunai murni dari pelanggan dikurangi pembayaran ke pemasok, gaji karyawan, dan beban operasional.
            </p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
            <strong>Indikator Sehat:</strong> CFO harus positif dan melampaui Laba Bersih secara berkesinambungan.
          </div>
        </div>

        {/* CFI */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Pipa 2 · Investasi Masa Depan</span>
              <span className="font-mono text-sky-700 font-semibold">CFI</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Arus Kas Investasi</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Pengeluaran untuk membeli mesin, pabrik, gedung (CapEx), atau penerimaan dari pelepasan aset lama.
            </p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
            <strong>Catatan Analis:</strong> CFI negatif adalah wajar dan seringkali baik bagi perusahaan yang sedang ekspansi.
          </div>
        </div>

        {/* CFF */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Pipa 3 · Struktur Modal</span>
              <span className="font-mono text-purple-700 font-semibold">CFF</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Arus Kas Pembiayaan</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Mencakup penerbitan saham baru, penarikan pinjaman bank, pembayaran cicilan pokok utang, dan pembagian dividen tunai.
            </p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
            <strong>Catatan Analis:</strong> CFF negatif menunjukkan perusahaan melunasi utang atau memberi dividen ke pemegang saham.
          </div>
        </div>
      </div>

      {/* Interactive Cash Flow & FCF Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Simulator Dinamis 3 Pipa & Free Cash Flow (FCF)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih fase siklus hidup bisnis atau atur nilai manual untuk mengamati perilaku kas riil.
            </p>
          </div>

          {/* Lifecycle Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => applyLifecyclePreset('startup')}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white/60 rounded-md transition-colors cursor-pointer"
            >
              Fase Startup
            </button>
            <button
              onClick={() => applyLifecyclePreset('growth')}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white/60 rounded-md transition-colors cursor-pointer"
            >
              Fase Ekspansi
            </button>
            <button
              onClick={() => applyLifecyclePreset('mature')}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white/60 rounded-md transition-colors cursor-pointer"
            >
              Fase Dewasa (Cash Cow)
            </button>
            <button
              onClick={() => applyLifecyclePreset('distressed')}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white/60 rounded-md transition-colors cursor-pointer"
            >
              Fase Distress
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Parameter Aliran Arus Kas
            </h4>

            {/* CFO Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Kas Operasi (CFO):</span>
                <span className={`font-mono font-bold ${cfo >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {cfo >= 0 ? `+${cfo}` : cfo} juta
                </span>
              </div>
              <input
                type="range"
                min="-150"
                max="400"
                step="5"
                value={cfo}
                onChange={(e) => setCfo(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* CapEx Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Belanja Modal (CapEx):</span>
                <span className="font-mono font-bold text-rose-700">−{capex} juta</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={capex}
                onChange={(e) => setCapex(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Other CFI */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Penjualan Aset / Investasi Lain (CFI):</span>
                <span className={`font-mono font-bold ${otherCfi >= 0 ? 'text-sky-700' : 'text-slate-800'}`}>
                  {otherCfi >= 0 ? `+${otherCfi}` : otherCfi} juta
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={otherCfi}
                onChange={(e) => setOtherCfi(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* CFF Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Arus Kas Pembiayaan (CFF):</span>
                <span className={`font-mono font-bold ${cff >= 0 ? 'text-purple-700' : 'text-slate-800'}`}>
                  {cff >= 0 ? `+${cff}` : cff} juta
                </span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                step="5"
                value={cff}
                onChange={(e) => setCff(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results: FCF & Net Change */}
          <div className="lg:col-span-6 space-y-4">
            {/* Free Cash Flow Spotlight */}
            <div className={`p-5 rounded-xl border ${fcf >= 0 ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Free Cash Flow (FCF)
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    FCF = Kas Operasi ({cfo}) − CapEx ({capex})
                  </div>
                </div>
                <div className={`text-2xl font-bold font-mono tabular-nums ${fcf >= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {fcf >= 0 ? `+${fcf.toFixed(2)}` : fcf.toFixed(2)} juta
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                {fcf >= 0 ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>FCF Positif:</strong> Perusahaan menghasilkan kas surplus setelah mendanai kebutuhan belanja modal. Kas ini bebas digunakan untuk membagikan dividen tunai, melunasi utang, atau akuisisi.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>FCF Negatif:</strong> Belanja modal melampaui kas operasional. Jika perusahaan dalam fase ekspansi cepat (growth), ini wajar; namun jika dalam bisnis matang, defisit FCF dapat memaksa penarikan utang baru.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Net Change in Cash */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                <span>Perubahan Kas Bersih (Net Change in Cash)</span>
                <span className={`font-mono text-base font-bold ${netChangeInCash >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {netChangeInCash >= 0 ? `+${netChangeInCash.toFixed(2)}` : netChangeInCash.toFixed(2)} juta
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-lg border border-slate-200 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Operasi (CFO)</span>
                  <span className={cfo >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                    {cfo >= 0 ? `+${cfo}` : cfo}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Investasi (CFI)</span>
                  <span className={totalCfi >= 0 ? 'text-sky-700 font-semibold' : 'text-rose-700 font-semibold'}>
                    {totalCfi >= 0 ? `+${totalCfi}` : totalCfi}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Pembiayaan (CFF)</span>
                  <span className={cff >= 0 ? 'text-purple-700 font-semibold' : 'text-slate-700 font-semibold'}>
                    {cff >= 0 ? `+${cff}` : cff}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {netChangeInCash >= 0
                  ? 'Saldo kas di rekening bank bertambah pada akhir periode ini.'
                  : 'Saldo kas di rekening bank berkurang pada akhir periode ini.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
