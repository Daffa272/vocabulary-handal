import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export const CalculatorModule: React.FC = () => {
  const [selectedCalc, setSelectedCalc] = useState<string>('gpm');

  // Input states for different calculators
  // Margin
  const [rev, setRev] = useState<number>(800.1);
  const [cogs, setCogs] = useState<number>(508.2);
  const [opex, setOpex] = useState<number>(231.29);
  const [netProfit, setNetProfit] = useState<number>(41.26);

  // Liquidity
  const [ca, setCa] = useState<number>(1045);
  const [cl, setCl] = useState<number>(372.04);
  const [cash, setCash] = useState<number>(722.66);

  // Solvency
  const [totalDebt, setTotalDebt] = useState<number>(190.09);
  const [totalLiab, setTotalLiab] = useState<number>(461.0);
  const [totalAssets, setTotalAssets] = useState<number>(1877.83);
  const [totalEquity, setTotalEquity] = useState<number>(1416.83);

  // Efficiency
  const [recTurnover, setRecTurnover] = useState<number>(6.53);

  // Cash Flow
  const [cfo, setCfo] = useState<number>(150);
  const [capex, setCapex] = useState<number>(50);

  // Valuation
  const [stockPrice, setStockPrice] = useState<number>(5000);
  const [eps, setEps] = useState<number>(250);
  const [dps, setDps] = useState<number>(100);

  // Calculator list
  const calculators = [
    { id: 'gpm', label: 'Margin Laba (GPM, OPM, NPM)' },
    { id: 'liquidity', label: 'Rasio Likuiditas (Current & Cash)' },
    { id: 'solvency', label: 'Solvabilitas (DAR & DER)' },
    { id: 'efficiency', label: 'Hari Penagihan Piutang (DSO)' },
    { id: 'fcf', label: 'Arus Kas Bebas (FCF)' },
    { id: 'valuation', label: 'Valuasi & Dividen (P/E & Yield)' },
  ];

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
          <span>Modul 05</span>
          <span aria-hidden="true">·</span>
          <span>Kalkulator & Formula Finansial Interaktif</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Laboratorium Hitung Cepat Rasio Keuangan
        </h2>
        <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          Uji angka laporan keuangan perusahaan apa pun secara langsung. Dapatkan hasil instan beserta 
          tahapan perhitungan matematis, rumus resmi, dan batas acuan kesehatan finansial (benchmark).
        </p>
      </div>

      {/* Calculator Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {calculators.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCalc(c.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCalc === c.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Active Calculator Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8">
        {/* Calc 1: Margins */}
        {selectedCalc === 'gpm' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Input Data Laba Rugi</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Total Pendapatan (Revenue):</label>
                  <input
                    type="number"
                    value={rev}
                    onChange={(e) => setRev(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Harga Pokok Penjualan (HPP):</label>
                  <input
                    type="number"
                    value={cogs}
                    onChange={(e) => setCogs(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Beban Operasional:</label>
                  <input
                    type="number"
                    value={opex}
                    onChange={(e) => setOpex(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Laba Bersih Akhir:</label>
                  <input
                    type="number"
                    value={netProfit}
                    onChange={(e) => setNetProfit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hasil Margin Profitabilitas</h3>
              
              {/* Gross Margin */}
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Gross Profit Margin (GPM)</span>
                  <span className="font-mono text-base font-bold text-sky-700">
                    {rev > 0 ? (((rev - cogs) / rev) * 100).toFixed(2) : 0}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  ({rev} − {cogs}) ÷ {rev} × 100%
                </div>
              </div>

              {/* Operating Margin */}
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Operating Profit Margin (OPM)</span>
                  <span className="font-mono text-base font-bold text-emerald-700">
                    {rev > 0 ? (((rev - cogs - opex) / rev) * 100).toFixed(2) : 0}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  ({(rev - cogs).toFixed(2)} − {opex}) ÷ {rev} × 100%
                </div>
              </div>

              {/* Net Margin */}
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Net Profit Margin (NPM)</span>
                  <span className="font-mono text-base font-bold text-purple-700">
                    {rev > 0 ? ((netProfit / rev) * 100).toFixed(2) : 0}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  {netProfit} ÷ {rev} × 100%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calc 2: Liquidity */}
        {selectedCalc === 'liquidity' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Input Data Neraca Lancar</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Total Aset Lancar:</label>
                  <input
                    type="number"
                    value={ca}
                    onChange={(e) => setCa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Kas & Setara Kas:</label>
                  <input
                    type="number"
                    value={cash}
                    onChange={(e) => setCash(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Kewajiban Lancar (Jangka Pendek):</label>
                  <input
                    type="number"
                    value={cl}
                    onChange={(e) => setCl(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hasil Rasio Likuiditas</h3>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Current Ratio (Rasio Lancar)</span>
                  <span className="font-mono text-base font-bold text-sky-700">
                    {cl > 0 ? (ca / cl).toFixed(2) : 0} kali
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  {ca} ÷ {cl}
                </div>
                <p className="text-[11px] text-slate-600 mt-2 border-t border-slate-100 pt-1.5">
                  {(ca / (cl || 1)) >= 1.5
                    ? 'Kondisi Aman: Aset lancar memiliki bantalan lebih dari cukup.'
                    : (ca / (cl || 1)) >= 1.0
                    ? 'Kondisi Sedang: Mampu bayar utang, namun likuiditas pas-pasan.'
                    : 'Risiko Gagal Bayar: Kewajiban lancar melampaui aset lancar.'}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Cash Ratio (Rasio Kas)</span>
                  <span className="font-mono text-base font-bold text-emerald-700">
                    {cl > 0 ? (cash / cl).toFixed(2) : 0} kali
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  {cash} ÷ {cl}
                </div>
                <p className="text-[11px] text-slate-600 mt-2 border-t border-slate-100 pt-1.5">
                  Menilai kemampuan membayar utang langsung menggunakan uang kas di tangan tanpa menunggu penagihan piutang.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Calc 3: Solvency */}
        {selectedCalc === 'solvency' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Input Data Struktur Modal & Utang</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Total Utang Berbunga (Debt):</label>
                  <input
                    type="number"
                    value={totalDebt}
                    onChange={(e) => setTotalDebt(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Total Kewajiban (Total Liabilities):</label>
                  <input
                    type="number"
                    value={totalLiab}
                    onChange={(e) => setTotalLiab(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Total Aset:</label>
                  <input
                    type="number"
                    value={totalAssets}
                    onChange={(e) => setTotalAssets(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Total Ekuitas (Modal Sendiri):</label>
                  <input
                    type="number"
                    value={totalEquity}
                    onChange={(e) => setTotalEquity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hasil Rasio Solvabilitas</h3>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Debt to Equity Ratio (DER)</span>
                  <span className="font-mono text-base font-bold text-emerald-700">
                    {totalEquity > 0 ? ((totalDebt / totalEquity) * 100).toFixed(2) : 0}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  {totalDebt} ÷ {totalEquity} × 100%
                </div>
                <p className="text-[11px] text-slate-600 mt-2 border-t border-slate-100 pt-1.5">
                  DER &lt; 50% menunjukkan struktur modal sangat konservatif dengan risiko solvabilitas rendah.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Debt to Assets Ratio (DAR)</span>
                  <span className="font-mono text-base font-bold text-sky-700">
                    {totalAssets > 0 ? ((totalLiab / totalAssets) * 100).toFixed(2) : 0}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  {totalLiab} ÷ {totalAssets} × 100%
                </div>
                <p className="text-[11px] text-slate-600 mt-2 border-t border-slate-100 pt-1.5">
                  Proporsi aset yang dibiayai oleh kewajiban pihak ketiga.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Calc 4: Efficiency DSO */}
        {selectedCalc === 'efficiency' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Hitung Days Sales Outstanding (DSO)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                DSO mengukur rata-rata hari penagihan piutang dari pelanggan. Semakin kecil harinya, semakin cepat uang kas masuk ke rekening perusahaan.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Perputaran Piutang (Receivables Turnover):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={recTurnover}
                    onChange={(e) => setRecTurnover(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hasil Estimasi Waktu Penagihan</h3>

              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">DSO (Hari Penagihan Rata-rata)</span>
                  <span className={`font-mono text-xl font-bold ${recTurnover < 2 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {recTurnover > 0 ? Math.round(365 / recTurnover) : 0} Hari
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  365 hari ÷ {recTurnover}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {recTurnover >= 6 ? (
                    <span className="text-emerald-700 font-medium">
                      Penagihan Cepat (~{Math.round(365 / (recTurnover || 1))} hari): Sangat sehat, modal kerja berputar lancar seperti Perusahaan B.
                    </span>
                  ) : recTurnover >= 3 ? (
                    <span className="text-slate-700">
                      Penagihan Standar (~{Math.round(365 / (recTurnover || 1))} hari): Wajar untuk transaksi B2B umum.
                    </span>
                  ) : (
                    <span className="text-rose-700 font-medium">
                      RED FLAG: Penagihan Lambat Ekstrem (~{Math.round(365 / (recTurnover || 1))} hari). Kas terperangkap di tangan debitur seperti Perusahaan A (264 hari)!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calc 5: FCF */}
        {selectedCalc === 'fcf' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Hitung Free Cash Flow (FCF)</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Kas Operasi (Operating Cash Flow / CFO):</label>
                  <input
                    type="number"
                    value={cfo}
                    onChange={(e) => setCfo(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Belanja Modal (CapEx):</label>
                  <input
                    type="number"
                    value={capex}
                    onChange={(e) => setCapex(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hasil Kas Bebas Tersedia</h3>

              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Free Cash Flow (FCF)</span>
                  <span className={`font-mono text-xl font-bold ${cfo - capex >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {(cfo - capex).toFixed(2)} juta
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  {cfo} − {capex}
                </div>
                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  {cfo - capex >= 0
                    ? 'Tersedia surplus kas untuk pembagian dividen tunai tanpa perlu berutang baru.'
                    : 'Perusahaan mengalami defisit kas bebas karena investasi modal melampaui kas operasional.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Calc 6: Valuation */}
        {selectedCalc === 'valuation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Hitung P/E Ratio & Dividend Yield</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Harga Saham Pasar (Rp):</label>
                  <input
                    type="number"
                    value={stockPrice}
                    onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Laba Bersih per Saham (EPS):</label>
                  <input
                    type="number"
                    value={eps}
                    onChange={(e) => setEps(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Dividen per Saham (DPS):</label>
                  <input
                    type="number"
                    value={dps}
                    onChange={(e) => setDps(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hasil Valuasi & Return Saham</h3>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Price to Earnings (P/E)</span>
                  <span className="font-mono text-base font-bold text-sky-700">
                    {eps !== 0 ? (stockPrice / eps).toFixed(2) : 'N/A'} kali
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  Rp{stockPrice} ÷ Rp{eps}
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Dividend Yield (Imbal Hasil Dividen)</span>
                  <span className="font-mono text-base font-bold text-emerald-700">
                    {stockPrice > 0 ? ((dps / stockPrice) * 100).toFixed(2) : 0}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  (Rp{dps} ÷ Rp{stockPrice}) × 100%
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Dividend Payout Ratio</span>
                  <span className="font-mono text-base font-bold text-purple-700">
                    {eps > 0 ? ((dps / eps) * 100).toFixed(2) : 'N/A'}%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 mt-1">
                  (Rp{dps} ÷ Rp{eps}) × 100%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
