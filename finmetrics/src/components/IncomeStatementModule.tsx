import React, { useState } from 'react';
import { incomeStatementSeries } from '../data/financialData';
import { TrendingUp, HelpCircle, RefreshCw } from 'lucide-react';

export const IncomeStatementModule: React.FC = () => {
  // Interactive Sandbox state
  const [revenue, setRevenue] = useState<number>(800.1);
  const [cogs, setCogs] = useState<number>(508.2);
  const [opex, setOpex] = useState<number>(231.29);
  const [depreciation, setDepreciation] = useState<number>(73.09);
  const [assetGain, setAssetGain] = useState<number>(44.29);
  const [interestExpense, setInterestExpense] = useState<number>(10.0);
  const [taxRate, setTaxRate] = useState<number>(25); // in %

  // Selected year for historical inspector
  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(0);

  // Computed values for sandbox
  const grossProfit = revenue - cogs;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  const operatingIncome = grossProfit - opex; // EBIT from core operations
  const operatingMargin = revenue > 0 ? (operatingIncome / revenue) * 100 : 0;

  const ebitda = operatingIncome + depreciation;
  const ebitdaMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;

  const ebt = operatingIncome + assetGain - interestExpense;
  const tax = ebt > 0 ? (ebt * (taxRate / 100)) : 0;
  const netIncome = ebt - tax;
  const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;

  // Active year in real dataset
  const activeHistorical = incomeStatementSeries[selectedYearIdx];

  const resetSandboxToRealData = () => {
    setRevenue(800.1);
    setCogs(508.2);
    setOpex(231.29);
    setDepreciation(73.09);
    setAssetGain(44.29);
    setInterestExpense(10.0);
    setTaxRate(25);
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
          <span>Modul 01</span>
          <span aria-hidden="true">·</span>
          <span>Analisis Laba Rugi (Income Statement)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Struktur Pendapatan, Beban, dan Anatomi 3 Jenis Laba
        </h2>
        <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          Laporan Laba Rugi menunjukkan kinerja operasional selama periode tertentu. 
          Pahami perbedaan vital antara <strong>Laba Kotor</strong> (efisiensi produk), 
          <strong>Laba Operasi/EBIT</strong> (kinerja bisnis inti), dan <strong>Laba Bersih</strong> (hasil akhir setelah bunga dan pajak).
        </p>
      </div>

      {/* Concept Comparison: 3 Kategori Laba */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Tingkat 1 · Biaya Produk</div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">Laba Kotor (Gross Profit)</h3>
          <div className="font-mono text-xs text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-md mb-3">
            Laba Kotor = Pendapatan − HPP
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mengukur sisa uang penjualan setelah membayar bahan baku dan upah langsung pabrik (COGS). Menggambarkan daya saing harga dan efisiensi manufaktur.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Tingkat 2 · Efisiensi Operasional</div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">Laba Operasi (EBIT)</h3>
          <div className="font-mono text-xs text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-md mb-3">
            EBIT = Laba Kotor − Beban Operasi
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menilai hasil bisnis murni setelah dikurangi biaya operasional (gaji, sewa, pemasaran, R&D). Tidak terdistorsi oleh bunga bank atau perbedaan tarif pajak.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Tingkat 3 · Hasil Akhir</div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">Laba Bersih (Net Profit)</h3>
          <div className="font-mono text-xs text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-md mb-3">
            Laba Bersih = EBT − Pajak
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Keuntungan final yang menjadi hak pemegang saham. Menjadi dasar perhitungan EPS dan sumber dividen tunai serta saldo laba ditahan di neraca.
          </p>
        </div>
      </div>

      {/* Interactive Simulator: Waterfall & Dynamic Sliders */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Simulator Dinamis Waterfall Laba Rugi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Geser parameter di bawah untuk mensimulasikan dampak perubahan HPP, beban operasional, dan pos penjualan aset secara real-time.
            </p>
          </div>
          <button
            onClick={resetSandboxToRealData}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset ke Data Asli (800,1)</span>
          </button>
        </div>

        {/* 2-Zone Layout: Interactive Stage + Control Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Waterfall Canvas (Stage) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              {/* Step 1: Revenue */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1">
                  <span>1. Total Pendapatan (Top Line)</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">{revenue.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full transition-all duration-300" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Step 2: COGS */}
              <div className="p-3.5 bg-rose-50/50 rounded-lg border border-rose-100">
                <div className="flex justify-between items-center text-xs font-medium text-rose-700 mb-1">
                  <span>2. Dikurangi: Biaya Pendapatan (HPP / COGS)</span>
                  <span className="font-mono tabular-nums font-semibold">−{cogs.toFixed(2)}</span>
                </div>
                <div className="w-full bg-rose-200/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (cogs / (revenue || 1)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Step 3: Gross Profit */}
              <div className={`p-3.5 rounded-lg border ${grossProfit >= 0 ? 'bg-sky-50/60 border-sky-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className={grossProfit >= 0 ? 'text-sky-900' : 'text-red-900'}>
                    = Laba Kotor (Gross Profit)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-sm font-bold">
                      {grossProfit.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-600">
                      (Margin: {grossMargin.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {grossMargin >= 30
                    ? 'Margin kotor kuat (>30%), memiliki penetapan harga produk yang sehat.'
                    : grossMargin >= 0
                    ? 'Margin kotor tipis, rentan terhadap kenaikan harga bahan baku.'
                    : 'RED FLAG: Margin kotor negatif! Biaya produksi melebihi omset penjualan.'}
                </p>
              </div>

              {/* Step 4: Operating Expenses */}
              <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-100">
                <div className="flex justify-between items-center text-xs font-medium text-amber-800 mb-1">
                  <span>3. Dikurangi: Beban Operasional (R&D, SG&A)</span>
                  <span className="font-mono tabular-nums font-semibold">−{opex.toFixed(2)}</span>
                </div>
                <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (opex / (revenue || 1)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Step 5: Operating Income (EBIT) */}
              <div className={`p-3.5 rounded-lg border ${operatingIncome >= 0 ? 'bg-slate-50 border-slate-300' : 'bg-rose-50 border-rose-300'}`}>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className={operatingIncome >= 0 ? 'text-slate-900' : 'text-rose-900'}>
                    = Laba Operasi (EBIT)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-sm font-bold">
                      {operatingIncome.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-600">
                      (OPM: {operatingMargin.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>EBITDA: <strong className="font-mono text-slate-700">{ebitda.toFixed(2)}</strong> (Margin: {ebitdaMargin.toFixed(2)}%)</span>
                  <span>Depresiasi: {depreciation.toFixed(2)}</span>
                </div>
              </div>

              {/* Step 6: Non-Operating / Asset Gain / Interest */}
              {(assetGain > 0 || interestExpense > 0) && (
                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 text-xs">
                  <div className="flex justify-between items-center text-purple-900 mb-0.5 font-medium">
                    <span>4. Pos Non-Operasional & Penjualan Aset</span>
                    <span className="font-mono tabular-nums font-semibold">
                      +{assetGain.toFixed(2)} (Jual Aset) − {interestExpense.toFixed(2)} (Bunga)
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700">
                    {assetGain > 0 && 'Catatan Analis: Laba penjualan aset adalah pos satu kali (non-recurring), bukan dari bisnis harian.'}
                  </p>
                </div>
              )}

              {/* Step 7: Final Net Income */}
              <div className={`p-4 rounded-xl border ${netIncome >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-bold ${netIncome >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                    = Laba Bersih (Net Income / Bottom Line)
                  </span>
                  <div className="text-right">
                    <span className={`text-lg font-bold font-mono tabular-nums ${netIncome >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {netIncome.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-medium ml-2 text-slate-600">
                      (NPM: {netMargin.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200/60 flex justify-between">
                  <span>Pajak Penghasilan: {tax.toFixed(2)} ({taxRate}%)</span>
                  <span>EBT: {ebt.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Deck (Sliders & Real-time inputs) */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kontrol Parameter Simulasi
            </h4>

            {/* Slider 1: Revenue */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Total Pendapatan:</span>
                <span className="font-mono font-semibold text-slate-900">{revenue.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="5"
                value={revenue}
                onChange={(e) => setRevenue(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Slider 2: COGS */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Biaya Pendapatan (HPP):</span>
                <span className="font-mono font-semibold text-rose-700">{cogs.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="900"
                step="5"
                value={cogs}
                onChange={(e) => setCogs(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Slider 3: Opex */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Beban Operasional:</span>
                <span className="font-mono font-semibold text-amber-700">{opex.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="5"
                value={opex}
                onChange={(e) => setOpex(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Slider 4: Gain on Sale of Assets */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Laba Penjualan Aset:</span>
                <span className="font-mono font-semibold text-purple-700">+{assetGain.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={assetGain}
                onChange={(e) => setAssetGain(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Slider 5: Tax Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Tarif Pajak (%):</span>
                <span className="font-mono font-semibold text-slate-900">{taxRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                <span>Pelajaran Kritis Data Analyst</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Jika Laba Operasi negatif tetapi Laba Bersih positif (seperti Tahun 4 dalam data riil), periksa pos penjualan aset! Jangan langsung simpulkan bisnis berkinerja unggul tanpa mengecek asal-usul kasnya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real Multi-Year Dataset Inspector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Dataset Historis 5 Tahun Riil
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data laporan keuangan riil dari studi kasus: Pendapatan melonjak dari 319,90 menjadi 800,10 (+150%).
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {incomeStatementSeries.map((item, idx) => (
              <button
                key={item.year}
                onClick={() => setSelectedYearIdx(idx)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedYearIdx === idx
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.year.split(' ')[0]} {item.year.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Year Spotlight Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <div className="text-xs text-slate-500">Pendapatan ({activeHistorical.year})</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{activeHistorical.revenue.toFixed(2)}</div>
            <div className="text-[11px] text-sky-600 mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{selectedYearIdx === 0 ? '+75% YoY' : 'Periode Historis'}</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Margin Laba Kotor</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{activeHistorical.grossMargin.toFixed(2)}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Laba Kotor: {activeHistorical.grossProfit.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Laba Operasi (EBIT)</div>
            <div className={`text-lg font-bold font-mono mt-0.5 ${activeHistorical.ebit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {activeHistorical.ebit.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Margin: {activeHistorical.operatingMargin.toFixed(2)}%
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Laba Bersih & EPS</div>
            <div className={`text-lg font-bold font-mono mt-0.5 ${activeHistorical.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {activeHistorical.netIncome.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              EPS: Rp{activeHistorical.eps.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Full Comprehensive Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Pos Laba Rugi</th>
                {incomeStatementSeries.map((s) => (
                  <th key={s.year} className="py-3 px-4 font-semibold font-mono text-right">
                    {s.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr className="hover:bg-slate-50/60">
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">Total Pendapatan</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className="py-2.5 px-4 text-right tabular-nums font-semibold text-slate-900">
                    {s.revenue.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/60 text-slate-600">
                <td className="py-2.5 px-4 font-sans">Biaya Pendapatan (HPP)</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className="py-2.5 px-4 text-right tabular-nums">
                    {s.costOfRevenue.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="bg-sky-50/30 font-medium">
                <td className="py-2.5 px-4 font-sans text-sky-900 font-semibold">Laba Kotor</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className="py-2.5 px-4 text-right tabular-nums text-sky-800 font-bold">
                    {s.grossProfit.toFixed(2)} ({s.grossMargin.toFixed(1)}%)
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/60 text-slate-600">
                <td className="py-2.5 px-4 font-sans">Beban Operasional Total</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className="py-2.5 px-4 text-right tabular-nums">
                    {s.operatingExpenses.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-2.5 px-4 font-sans font-medium text-slate-900">Laba Operasi / EBIT</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className={`py-2.5 px-4 text-right tabular-nums font-bold ${s.ebit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {s.ebit.toFixed(2)} ({s.operatingMargin.toFixed(1)}%)
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/60 text-slate-600">
                <td className="py-2.5 px-4 font-sans">EBITDA</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className={`py-2.5 px-4 text-right tabular-nums ${s.ebitda >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                    {s.ebitda.toFixed(2)} ({s.ebitdaMargin.toFixed(1)}%)
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/60 text-slate-600">
                <td className="py-2.5 px-4 font-sans">Laba Penjualan Aset</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className="py-2.5 px-4 text-right tabular-nums text-purple-700">
                    {s.gainOnSaleAssets ? `+${s.gainOnSaleAssets.toFixed(2)}` : '—'}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-100/70 font-semibold">
                <td className="py-3 px-4 font-sans text-slate-900">Laba Bersih (Net Income)</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className={`py-3 px-4 text-right tabular-nums ${s.netIncome >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}`}>
                    {s.netIncome.toFixed(2)} ({s.netMargin.toFixed(1)}%)
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/60 text-slate-700">
                <td className="py-2.5 px-4 font-sans">EPS (Laba per Saham)</td>
                {incomeStatementSeries.map((s) => (
                  <td key={s.year} className={`py-2.5 px-4 text-right tabular-nums ${s.eps >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                    Rp{s.eps.toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
