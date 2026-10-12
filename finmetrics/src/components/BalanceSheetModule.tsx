import React, { useState } from 'react';
import { sampleBalanceSheet } from '../data/financialData';
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const BalanceSheetModule: React.FC = () => {
  // Interactive Simulation State
  const [cash, setCash] = useState<number>(722.66);
  const [receivables, setReceivables] = useState<number>(112.34);
  const [inventory, setInventory] = useState<number>(75.0);
  const [netPPE, setNetPPE] = useState<number>(295.7);
  const [otherNonCurrent, setOtherNonCurrent] = useState<number>(537.13); // investments + intangibles

  const [currentLiabilities, setCurrentLiabilities] = useState<number>(372.04);
  const [longTermDebt, setLongTermDebt] = useState<number>(88.96);

  // Computations
  const totalCurrentAssets = cash + receivables + inventory + 15.0; // 15 prepaid
  const totalAssets = totalCurrentAssets + netPPE + otherNonCurrent;

  const totalLiabilities = currentLiabilities + longTermDebt;
  const equity = Math.max(0, totalAssets - totalLiabilities); // Balancing equity

  const totalDebtFunded = 80.0 + longTermDebt + 21.13; // sample interest bearing debt ~190

  // Financial ratios
  const currentRatio = currentLiabilities > 0 ? totalCurrentAssets / currentLiabilities : 0;
  const cashRatio = currentLiabilities > 0 ? cash / currentLiabilities : 0;
  const dar = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  const der = equity > 0 ? (totalDebtFunded / equity) * 100 : 0;
  const equityRatio = totalAssets > 0 ? (equity / totalAssets) * 100 : 0;

  const resetToOfficial = () => {
    setCash(722.66);
    setReceivables(112.34);
    setInventory(75.0);
    setNetPPE(295.7);
    setOtherNonCurrent(537.13);
    setCurrentLiabilities(372.04);
    setLongTermDebt(88.96);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
          <span>Modul 02</span>
          <span aria-hidden="true">·</span>
          <span>Neraca Keuangan (Balance Sheet)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Posisi Keuangan & Persamaan Dasar: Aset = Kewajiban + Ekuitas
        </h2>
        <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          Berbeda dari laporan laba rugi yang mengukur periode waktu, neraca adalah potret posisi aset, kewajiban, 
          dan modal pemilik pada satu titik waktu tertentu. Pahami bagaimana aset lancar mendanai operasional dan 
          bagaimana struktur utang melindungi perusahaan dari risiko gagal bayar.
        </p>
      </div>

      {/* Visual Equilibrium Equation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Pemeriksaan Keseimbangan Akuntansi (Balance Check)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Data Resmi Studi Kasus: Total Aset = 1.877,83 | Kewajiban = 461,00 | Ekuitas = 1.416,83
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Persamaan Terverifikasi Seimbang</span>
          </div>
        </div>

        {/* Visual Dual-Side Balance Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Side: Assets */}
          <div className="p-5 bg-sky-50/50 rounded-xl border border-sky-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">Sisi Kiri · Total Aset</span>
                <span className="font-mono text-xl font-bold text-sky-950 tabular-nums">1.877,83</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Seluruh sumber daya ekonomi yang dimiliki perusahaan dan diharapkan memberi manfaat di masa depan.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-white rounded-md border border-sky-100">
                  <span className="font-medium text-slate-700">Aset Lancar (Kas 722,66 + Piutang + Stok)</span>
                  <span className="font-mono font-semibold text-slate-900">1.045,00 (55,7%)</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-md border border-sky-100">
                  <span className="font-medium text-slate-700">Aset Tidak Lancar (PP&E Bersih 295,70 + Investasi)</span>
                  <span className="font-mono font-semibold text-slate-900">832,83 (44,3%)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-sky-200 text-[11px] text-sky-900 flex justify-between">
              <span>Gross PP&E: 2.035,69</span>
              <span>Akum. Depresiasi: −1.739,99</span>
            </div>
          </div>

          {/* Right Side: Liabilities + Equity */}
          <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Sisi Kanan · Kewajiban + Ekuitas</span>
                <span className="font-mono text-xl font-bold text-emerald-950 tabular-nums">1.877,83</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Sumber pendanaan seluruh aset: kewajiban pihak ketiga dan hak residual pemilik modal.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-white rounded-md border border-rose-100">
                  <span className="font-medium text-slate-700">Total Kewajiban (Lancar 372,04 + Jangka Panjang)</span>
                  <span className="font-mono font-semibold text-rose-700">461,00 (24,5%)</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-md border border-emerald-100">
                  <span className="font-medium text-slate-700">Total Ekuitas (Saham Biasa + APIC + Saldo Laba 41,3)</span>
                  <span className="font-mono font-semibold text-emerald-700">1.416,83 (75,5%)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] text-emerald-900 flex justify-between">
              <span>Total Utang Berbunga: 190,09</span>
              <span>Modal Disetor + APIC: 1.566,85</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Key Balance Sheet Financial Ratios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Ratio 1: Cash Ratio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Rasio Kas (Cash Ratio)</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">1,94 kali</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sangat Likuid</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            Kas & setara kas 722,66 menutupi hampir 2x lipat kewajiban lancar (372,04).
          </p>
        </div>

        {/* Ratio 2: Current Ratio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Rasio Lancar (Current)</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">2,81 kali</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cakupan Sangat Aman</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            Aset lancar 1.045 cukup untuk membayar kewajiban jangka pendek tanpa menjual aset tetap.
          </p>
        </div>

        {/* Ratio 3: DAR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Debt to Assets (DAR)</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">24,55%</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Leverage Rendah
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            Hanya 24,55% aset didanai kewajiban total (kreditur & pemasok).
          </p>
        </div>

        {/* Ratio 4: DER */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Debt to Equity (DER)</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">13,42%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Solvabilitas Prima
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            Total utang berbunga 190,09 sangat kecil dibanding modal ekuitas 1.416,83.
          </p>
        </div>

        {/* Ratio 5: Equity Ratio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Rasio Ekuitas</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">75,45%</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Didominasi Modal Sendiri
          </div>
          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5">
            3 per 4 aset perusahaan dimiliki oleh pemegang saham tanpa beban bunga.
          </p>
        </div>
      </div>

      {/* Interactive Working Capital & Solvency Sandbox */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Lab Interaktif Modal Kerja & Uji Ketahanan Neraca
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Coba simulasi jika kas perusahaan menipis atau kewajiban lancar membengkak untuk melihat dampaknya ke rasio likuiditas.
            </p>
          </div>
          <button
            onClick={resetToOfficial}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Reset ke Posisi Resmi
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Uji Skenario Neraca
            </h4>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Kas & Setara Kas:</span>
                <span className="font-mono font-bold text-sky-700">{cash.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={cash}
                onChange={(e) => setCash(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Piutang Usaha:</span>
                <span className="font-mono font-bold text-slate-800">{receivables.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="5"
                value={receivables}
                onChange={(e) => setReceivables(parseFloat(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Kewajiban Lancar (Utang Jangka Pendek):</span>
                <span className="font-mono font-bold text-rose-700">{currentLiabilities.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="10"
                value={currentLiabilities}
                onChange={(e) => setCurrentLiabilities(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Utang Jangka Panjang:</span>
                <span className="font-mono font-bold text-slate-800">{longTermDebt.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="5"
                value={longTermDebt}
                onChange={(e) => setLongTermDebt(parseFloat(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time Dynamic Gauge Results */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                <span>Rasio Lancar Hasil Simulasi</span>
                <span className={`font-mono text-base font-bold ${currentRatio >= 1.5 ? 'text-emerald-700' : currentRatio >= 1.0 ? 'text-amber-700' : 'text-rose-700'}`}>
                  {currentRatio.toFixed(2)} kali
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    currentRatio >= 1.5 ? 'bg-emerald-500' : currentRatio >= 1.0 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (currentRatio / 3) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {currentRatio >= 1.5
                  ? 'Kondisi Likuiditas Prima: Perusahaan mampu membayar seluruh utang jatuh tempo dengan mudah.'
                  : currentRatio >= 1.0
                  ? 'Kondisi Waspada: Aset lancar mencukupi namun memiliki margin pengaman yang sempit jika piutang terlambat bayar.'
                  : 'BAHAYA LIKUIDITAS: Utang lancar lebih besar daripada aset lancar (Defisit Modal Kerja).'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                <span>Rasio Kas (Cash Ratio) Hasil Simulasi</span>
                <span className={`font-mono text-base font-bold ${cashRatio >= 0.5 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {cashRatio.toFixed(2)} kali
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${cashRatio >= 0.5 ? 'bg-sky-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, (cashRatio / 2) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Menunjukkan Rp{cashRatio.toFixed(2)} uang kas murni yang langsung tersedia untuk setiap Rp1 kewajiban jangka pendek.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 block">Total Aset Simulasi:</span>
                <span className="font-mono text-sm font-bold text-slate-900">{totalAssets.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Kewajiban:</span>
                <span className="font-mono text-sm font-bold text-rose-700">{totalLiabilities.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ekuitas Penyeimbang:</span>
                <span className="font-mono text-sm font-bold text-emerald-700">{equity.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
