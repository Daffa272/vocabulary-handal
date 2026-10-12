import React, { useState } from 'react';
import { ratioComparisons } from '../data/financialData';
import { AlertTriangle, CheckCircle, Search, ShieldAlert, ArrowRight } from 'lucide-react';

export const RatioComparisonModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [auditMode, setAuditMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'Profitabilitas', label: 'Profitabilitas' },
    { id: 'Valuasi', label: 'Valuasi Pasar' },
    { id: 'Efisiensi', label: 'Efisiensi Operasional' },
    { id: 'Pertumbuhan', label: 'Pertumbuhan' },
    { id: 'Kekuatan Finansial', label: 'Kekuatan Finansial' },
    { id: 'Efektivitas', label: 'Efektivitas Manajemen' },
    { id: 'Per Saham', label: 'Data Per Saham' },
  ];

  const filteredRatios = ratioComparisons.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysisNote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 mb-1">
          <span>Modul 04</span>
          <span aria-hidden="true">·</span>
          <span>Studi Kasus & Audit Forensik Keuangan</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Studi Komparasi: Perusahaan A vs Perusahaan B
        </h2>
        <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          Jangan pernah menilai saham hanya dari satu angka! Di atas kertas, Perusahaan A memiliki margin laba bersih 78% 
          dan P/E tampak murah (23,29x). Namun setelah diaudit menyeluruh, operasionalnya berdarah rugi 
          dan piutangnya mandek 264 hari. Perusahaan B jauh lebih sehat secara fundamental.
        </p>
      </div>

      {/* Detective Mode Alert Banner */}
      <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Audit Forensik Laporan Keuangan (Red Flags Detector)
            </h4>
            <p className="text-xs text-amber-800 mt-0.5 max-w-2xl">
              Perusahaan A mengalami anomali serius: Margin kotor negatif (−5,78%) dan rugi operasi (−73,6%), 
              tetapi Margin Laba Bersih mencapai 78,06%. Ini menandakan laba bersih berasal dari pos penjualan aset non-rutin, bukan operasional sehat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setAuditMode(!auditMode)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
              auditMode
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {auditMode ? 'Audit Mode: AKTIF' : 'Audit Mode: NONAKTIF'}
          </button>
        </div>
      </div>

      {/* 4 Red Flags Breakdown for Perusahaan A */}
      {auditMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
              Red Flag 1 · Laba Semu
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">GPM -5,78% vs NPM 78,06%</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jual produk rugi langsung, tetapi laba bersih sangat tinggi. Laba didorong penjualan aset atau revaluasi satu kali.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
              Red Flag 2 · Piutang Macet
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">DSO ~264 Hari vs B 56 Hari</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pelanggan Perusahaan A membutuhkan waktu 9 bulan untuk membayar. Kas terperangkap di piutang pelanggan.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
              Red Flag 3 · Penjualan Anjlok
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">Sales MRQ −36,78% YoY</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Penjualan anjlok tajam, sementara belanja modal naik 84% membakar kas tanpa ada kenaikan omset riil.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">
              Red Flag 4 · Laba Per Saham
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">EPS Tahunan Minus (−1,58)</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Meskipun ROE TTM tercatat 14,58%, laba per lembar saham tahunan tetap minus Rp1,58 per lembar.
            </p>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Explorer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative shrink-0 w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari metrik / indikator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Head-to-Head Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold w-1/4">Indikator & Kode</th>
                <th className="py-3 px-4 font-semibold text-center w-1/6 bg-rose-50/40 text-rose-950">
                  Perusahaan A
                </th>
                <th className="py-3 px-4 font-semibold text-center w-1/6 bg-emerald-50/40 text-emerald-950">
                  Perusahaan B
                </th>
                <th className="py-3 px-4 font-semibold w-1/3">Analisis Kritis & Kesimpulan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRatios.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{item.metric}</div>
                    <div className="font-mono text-[11px] text-slate-500">{item.code} · {item.category}</div>
                  </td>

                  {/* Company A */}
                  <td className="py-3 px-4 text-center font-mono tabular-nums bg-rose-50/20">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-xs ${
                        item.verdict === 'investigate'
                          ? 'text-amber-800 bg-amber-100/60'
                          : String(item.companyA).includes('-')
                          ? 'text-rose-700'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.companyA}
                    </span>
                  </td>

                  {/* Company B */}
                  <td className="py-3 px-4 text-center font-mono tabular-nums bg-emerald-50/20">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-xs ${
                        item.verdict === 'B' ? 'text-emerald-800 bg-emerald-100/70' : 'text-slate-800'
                      }`}
                    >
                      {item.companyB}
                    </span>
                  </td>

                  {/* Analysis Note */}
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                    <div className="flex items-start gap-1.5">
                      {item.verdict === 'B' && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {item.verdict === 'investigate' && (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <span>{item.analysisNote}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7-Step Financial Analysis Framework */}
      <div className="bg-slate-900 text-white rounded-xl p-6 lg:p-8 space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
            Framework Profesional
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight">
            Urutan 7 Langkah Analisis Laporan Keuangan Rekomendasi
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ikuti hierarki urutan ini saat mengevaluasi laporan keuangan perusahaan agar tidak terjebak ilusi angka tunggal:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="font-mono text-sky-400 font-bold mb-1">Langkah 1</div>
            <div className="font-semibold text-white mb-1">1. Profitabilitas</div>
            <p className="text-slate-400">
              Apakah perusahaan mampu menghasilkan laba dari penjualannya? Cek konsistensi Gross Margin, OPM, dan NPM.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="font-mono text-sky-400 font-bold mb-1">Langkah 2</div>
            <div className="font-semibold text-white mb-1">2. Pertumbuhan (Growth)</div>
            <p className="text-slate-400">
              Apakah penjualan dan EPS bertumbuh konsisten secara tahunan dan jangka panjang 5 tahun?
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="font-mono text-sky-400 font-bold mb-1">Langkah 3</div>
            <div className="font-semibold text-white mb-1">3. Kualitas Arus Kas</div>
            <p className="text-slate-400">
              Apakah laba akuntansi didukung uang kas riil dari aktivitas operasi (CFO & Free Cash Flow)?
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="font-mono text-sky-400 font-bold mb-1">Langkah 4</div>
            <div className="font-semibold text-white mb-1">4. Kekuatan Finansial</div>
            <p className="text-slate-400">
              Apakah perusahaan sanggup melunasi utang lancar dan mengendalikan rasio leverage (DER/DAR)?
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="font-mono text-sky-400 font-bold mb-1">Langkah 5</div>
            <div className="font-semibold text-white mb-1">5. Efisiensi Aset & Piutang</div>
            <p className="text-slate-400">
              Seberapa cepat piutang tertagih (DSO) dan seberapa produktif perputaran aset serta stok?
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="font-mono text-sky-400 font-bold mb-1">Langkah 6</div>
            <div className="font-semibold text-white mb-1">6. Valuasi Saham</div>
            <p className="text-slate-400">
              Apakah harga pasar wajar (P/E, P/S, P/FCF) dibandingkan pertumbuhan dan risikonya?
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700 lg:col-span-2">
            <div className="font-mono text-sky-400 font-bold mb-1">Langkah 7</div>
            <div className="font-semibold text-white mb-1">7. Keberlanjutan Dividen</div>
            <p className="text-slate-400">
              Apakah pembayaran dividen didukung oleh arus kas bebas yang sehat dan payout ratio terkendali?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
