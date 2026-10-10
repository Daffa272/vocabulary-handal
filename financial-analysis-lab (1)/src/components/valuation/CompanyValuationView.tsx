import React, { useState, useMemo } from 'react';
import { Calculator, AlertTriangle, Layers, Info, CheckCircle, Table } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { generateForecastProjections } from '../../services/forecastEngine';
import { calculateDCFValuation } from '../../services/valuationEngine';
import { formatFinancialNumber } from '../../services/calculationEngine';

export const CompanyValuationView: React.FC = () => {
  const {
    activePeriod,
    scenarioAssumptions,
    activeCompany,
    valuationInputs,
    setValuationInputs,
    currency,
  } = useFinancial();

  const [valuationMethod, setValuationMethod] = useState<'dcf' | 'multiples'>('dcf');

  // WACC & Terminal Growth sliders
  const { waccPercent, terminalGrowthPercent, sharesOutstanding } = valuationInputs;

  // 5-year FCF from Base Case forecast
  const baseProjections = useMemo(
    () => generateForecastProjections(activePeriod, scenarioAssumptions.base, 5),
    [activePeriod, scenarioAssumptions.base]
  );

  const forecastFCFs = useMemo(
    () => baseProjections.map((p) => ({ year: p.year, fcf: p.freeCashFlow })),
    [baseProjections]
  );

  const curCash = activePeriod.balanceSheet.cashAndEquivalents;
  const curDebt = activePeriod.balanceSheet.shortTermDebt + activePeriod.balanceSheet.longTermDebt;

  // Compute DCF result
  const dcfResult = useMemo(
    () =>
      calculateDCFValuation(
        forecastFCFs,
        waccPercent,
        terminalGrowthPercent,
        curCash,
        curDebt,
        sharesOutstanding || activeCompany.sharesOutstanding
      ),
    [forecastFCFs, waccPercent, terminalGrowthPercent, curCash, curDebt, sharesOutstanding, activeCompany]
  );

  // Market Multiples Data
  const multiples = [
    {
      metric: 'Price to Earnings (P/E)',
      ratio: activeCompany.currentStockPrice > 0 && activePeriod.incomeStatement.netIncome > 0
        ? ((activeCompany.currentStockPrice * (sharesOutstanding || activeCompany.sharesOutstanding)) / activePeriod.incomeStatement.netIncome).toFixed(1) + 'x'
        : '—',
      peerMedian: '18.5x',
      description: 'Kapitalisasi pasar terhadap laba bersih tahunan',
    },
    {
      metric: 'Enterprise Value to EBITDA (EV/EBITDA)',
      ratio: dcfResult.enterpriseValue > 0 && activePeriod.incomeStatement.operatingIncome > 0
        ? (dcfResult.enterpriseValue / (activePeriod.incomeStatement.operatingIncome + activePeriod.incomeStatement.operatingExpenses.depreciation)).toFixed(1) + 'x'
        : '—',
      peerMedian: '10.2x',
      description: 'Nilai total operasi terhadap arus kas operasional kotor',
    },
    {
      metric: 'Enterprise Value to Sales (EV/Sales)',
      ratio: dcfResult.enterpriseValue > 0 && activePeriod.incomeStatement.revenue > 0
        ? (dcfResult.enterpriseValue / activePeriod.incomeStatement.revenue).toFixed(2) + 'x'
        : '—',
      peerMedian: '1.40x',
      description: 'Valuasi nilai perusahaan dibanding omzet penjualan',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            Company Valuation Lab (DCF & Multiples)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model penilaian intrinsik Discounted Cash Flow (Gordon Growth) dengan tabel sensitivitas 2 dimensi WACC vs Terminal Growth.
          </p>
        </div>

        {/* Method Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setValuationMethod('dcf')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              valuationMethod === 'dcf'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DCF Valuation
          </button>
          <button
            onClick={() => setValuationMethod('multiples')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              valuationMethod === 'multiples'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Comparable Multiples
          </button>
        </div>
      </div>

      {valuationMethod === 'dcf' ? (
        <>
          {/* DCF Parameters Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Parameter Valuasi DCF</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Slider 1: WACC */}
              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Discount Rate / WACC</span>
                  <span className="font-mono text-cyan-300 font-bold">{waccPercent.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="16.0"
                  step="0.1"
                  value={waccPercent}
                  onChange={(e) =>
                    setValuationInputs((prev) => ({ ...prev, waccPercent: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Biaya modal rata-rata tertimbang (Cost of Capital)</span>
              </div>

              {/* Slider 2: Terminal Growth Rate */}
              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Terminal Growth Rate (g)</span>
                  <span className="font-mono text-cyan-300 font-bold">{terminalGrowthPercent.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={terminalGrowthPercent}
                  onChange={(e) =>
                    setValuationInputs((prev) => ({ ...prev, terminalGrowthPercent: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Pertumbuhan abadi jangka panjang (&lt; GDP riil)</span>
              </div>

              {/* Input 3: Shares Outstanding */}
              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Jumlah Saham Beredar</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {(sharesOutstanding / 1_000_000).toFixed(1)} Juta
                  </span>
                </div>
                <input
                  type="number"
                  value={sharesOutstanding}
                  onChange={(e) =>
                    setValuationInputs((prev) => ({ ...prev, sharesOutstanding: parseInt(e.target.value) || 1 }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100 font-mono"
                  step="1000000"
                />
                <span className="text-[10px] text-slate-500 block">Total lembar saham beredar untuk nilai per lembar</span>
              </div>
            </div>

            {/* Validation warning if g >= WACC */}
            {!dcfResult.isValid && (
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Pelanggaran Asumsi Gordon Growth:</strong> {dcfResult.validationError}
                </div>
              </div>
            )}
          </div>

          {/* DCF Valuation Output Cards */}
          {dcfResult.isValid && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
                <div className="text-xs text-slate-400">PV of Forecast FCF (5-Yr)</div>
                <div className="text-xl font-bold font-mono text-white">
                  {formatFinancialNumber(dcfResult.sumPvFCF, currency, true)}
                </div>
                <p className="text-[11px] text-slate-500">Nilai sekarang arus kas tahun 1-5</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
                <div className="text-xs text-slate-400">PV of Terminal Value</div>
                <div className="text-xl font-bold font-mono text-cyan-300">
                  {formatFinancialNumber(dcfResult.pvTerminalValue, currency, true)}
                </div>
                <p className="text-[11px] text-slate-500">
                  Nilai horison tak hingga didiskonto
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
                <div className="text-xs text-slate-400">Enterprise Value (EV)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatFinancialNumber(dcfResult.enterpriseValue, currency, true)}
                </div>
                <p className="text-[11px] text-slate-500">Nilai total operasi (PV FCF + PV TV)</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1 bg-cyan-950/20 border-cyan-800/40">
                <div className="text-xs text-cyan-300 font-semibold">Implied Price per Share</div>
                <div className="text-2xl font-bold font-mono text-cyan-400">
                  {currency === 'IDR' ? 'Rp ' : '$'}
                  {dcfResult.impliedSharePrice?.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400">
                  Harga wajar teoritis per lembar saham
                </p>
              </div>
            </div>
          )}

          {/* 2D SENSITIVITY TABLE */}
          {dcfResult.isValid && dcfResult.sensitivityMatrix.grid.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Matriks Sensitivitas 2D: Implied Share Price
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">WACC (Baris) vs Terminal Growth (Kolom)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <th className="py-2.5 px-3 text-left font-semibold">WACC \ g</th>
                      {dcfResult.sensitivityMatrix.growthValues.map((gVal) => (
                        <th
                          key={gVal}
                          className={`py-2.5 px-3 font-mono font-medium ${
                            gVal === terminalGrowthPercent ? 'text-cyan-300 bg-cyan-950/30' : ''
                          }`}
                        >
                          {gVal}%
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono tabular-nums text-slate-200">
                    {dcfResult.sensitivityMatrix.grid.map((row, rowIdx) => {
                      const rowWacc = dcfResult.sensitivityMatrix.waccValues[rowIdx];
                      const isCurrentWacc = Math.abs(rowWacc - waccPercent) < 0.1;
                      return (
                        <tr key={rowWacc} className={isCurrentWacc ? 'bg-slate-950/60 font-semibold' : 'hover:bg-slate-800/30'}>
                          <td className={`py-2 px-3 text-left font-sans text-slate-400 ${isCurrentWacc ? 'text-cyan-300 font-bold' : ''}`}>
                            {rowWacc}%
                          </td>
                          {row.map((cell, cIdx) => {
                            const isCurrentCell =
                              isCurrentWacc && Math.abs(cell.growth - terminalGrowthPercent) < 0.1;
                            return (
                              <td
                                key={cIdx}
                                className={`py-2 px-3 ${
                                  isCurrentCell
                                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 rounded'
                                    : cell.sharePrice === null
                                    ? 'text-red-500'
                                    : 'text-slate-300'
                                }`}
                              >
                                {cell.sharePrice !== null
                                  ? `${currency === 'IDR' ? 'Rp ' : '$'}${cell.sharePrice}`
                                  : 'N/A'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Educational Guide: Enterprise Value vs Equity Value */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Perbedaan Enterprise Value vs Equity Value
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
              <p className="leading-relaxed">
                <strong className="text-slate-200">Enterprise Value (EV)</strong> adalah total nilai ekonomis dari operasional bisnis inti, independen terhadap pilihan struktur permodalan. EV mencerminkan berapa biaya yang dibutuhkan untuk membeli seluruh operasi perusahaan bebas utang.
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-200">Equity Value (Nilai Ekuitas)</strong> adalah nilai sisa yang menjadi hak mutlak pemegang saham biasa setelah dikurangi seluruh kewajiban utang bersih (Net Debt = Total Debt - Cash).
                Rumus: <em>Equity Value = Enterprise Value - (Total Debt - Cash)</em>.
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Comparable Multiples Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Kelipatan Valuasi Komparatif (Market Multiples)</h3>
          <p className="text-xs text-slate-400">
            Perbandingan valuasi relatif perusahaan terhadap benchmark median emiten industri sejenis ({activeCompany.industry}).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {multiples.map((m) => (
              <div key={m.metric} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">{m.metric}</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-cyan-400">{m.ratio}</span>
                  <span className="text-xs font-mono text-slate-500">Peer Median: {m.peerMedian}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Investment Disclaimer from Section 13 */}
      <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Disclaimer Edukasi Valuasi:</strong> Seluruh estimasi valuasi intrinsik DCF dan kelipatan pasar di atas disajikan semata-mata untuk tujuan analisis komparatif dan pendidikan finansial, bukan rekomendasi investasi, nasihat keuangan, atau target harga saham legal.
        </div>
      </div>
    </div>
  );
};
