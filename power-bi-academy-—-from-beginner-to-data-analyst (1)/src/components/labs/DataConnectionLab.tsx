import React, { useState } from 'react';
import { connectionSources } from '../../data/connectionSources';
import { ConnectionSource } from '../../types';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  Lock, 
  Zap,
  ArrowRight,
  Server,
  Cloud,
  FileSpreadsheet,
  HelpCircle,
  FileText
} from 'lucide-react';

export const DataConnectionLab: React.FC = () => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('excel');
  const [activeTab, setActiveTab] = useState<'guide' | 'simulator' | 'comparison' | 'troubleshooting'>('simulator');
  const [simStep, setSimStep] = useState<number>(1);
  const [simMode, setSimMode] = useState<'Import' | 'DirectQuery'>('Import');
  const [simServerName, setSimServerName] = useState<string>('db-production.corp.internal');
  const [simDbName, setSimDbName] = useState<string>('SalesAnalytics_DW');
  const [simIsConnected, setSimIsConnected] = useState<boolean>(false);

  const selectedSource = connectionSources.find(s => s.id === selectedSourceId) || connectionSources[0];

  const handleSimulateConnect = () => {
    setSimIsConnected(true);
    setSimStep(3);
  };

  const handleResetSimulator = () => {
    setSimStep(1);
    setSimIsConnected(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 2 & 3 LAB</span>
              <span>·</span>
              <span>10 DATA CONNECTORS</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Data Connection Lab
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pelajari arsitektur menghubungkan Power BI ke berbagai sumber data (Excel, SQL, Cloud BigQuery, Web API), pemilihan Storage Mode yang tepat, dan strategi refresh data perusahaan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              Mode Aktif: {simMode}
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'simulator'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Simulasi Wizard Koneksi
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'guide'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Panduan Lengkap 10 Sumber Data
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'comparison'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Matriks Perbandingan Storage Mode
          </button>
          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'troubleshooting'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Troubleshooting Error Refresh
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Source Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-3">
                1. Pilih Sumber Data
              </h2>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {connectionSources.map(src => {
                  const isSelected = selectedSourceId === src.id;
                  return (
                    <button
                      key={src.id}
                      onClick={() => {
                        setSelectedSourceId(src.id);
                        handleResetSimulator();
                      }}
                      className={`w-full p-2.5 rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-800/40 border border-slate-800 hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Database className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="font-medium truncate">{src.name}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 font-mono">
                        {src.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2.5">
              <div className="text-slate-400 font-medium">Spesifikasi Konektor:</div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Mode Penyimpanan</span>
                <span className="text-cyan-400 font-mono">{selectedSource.supportedModes.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Metode Refresh</span>
                <span className="text-slate-300 truncate max-w-[180px]" title={selectedSource.refreshMechanism}>
                  {selectedSource.refreshMechanism}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Tipe Kredensial</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[180px]">
                  {selectedSource.credentials.split(';')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Simulator Sandbox */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span className="text-sm font-bold text-white font-display">
                    Simulasi Power BI Navigator & Connection Wizard
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>Tahap {simStep} dari 3</span>
                  <button 
                    onClick={handleResetSimulator}
                    className="text-cyan-400 hover:underline ml-2"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Step 1: Configuration */}
              {simStep === 1 && (
                <div className="space-y-5">
                  <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-cyan-300 block mb-1">Kapan Menggunakan {selectedSource.name}?</strong>
                    {selectedSource.whenToUse}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Alamat Server / Path Sumber Data
                      </label>
                      <input
                        type="text"
                        value={simServerName}
                        onChange={(e) => setSimServerName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
                        placeholder="Contoh: srv-sql-dw.company.com atau C:\Data\Sales.xlsx"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Nama Database / Sheet / Dataset
                      </label>
                      <input
                        type="text"
                        value={simDbName}
                        onChange={(e) => setSimDbName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
                        placeholder="Contoh: DB_Financials"
                      />
                    </div>

                    {/* Mode Choice */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Pilih Data Connectivity Mode:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label 
                          onClick={() => setSimMode('Import')}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                            simMode === 'Import' 
                              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200' 
                              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-semibold text-white mb-1 flex items-center justify-between">
                            <span>Import Mode</span>
                            <span className="text-[10px] text-cyan-400 font-mono">Direkomendasikan</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            Menyalin data ke memori VertiPaq. Analitik sangat cepat, mendukung seluruh formula DAX.
                          </p>
                        </label>

                        <label 
                          onClick={() => setSimMode('DirectQuery')}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                            simMode === 'DirectQuery' 
                              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200' 
                              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-semibold text-white mb-1 flex items-center justify-between">
                            <span>DirectQuery</span>
                            <span className="text-[10px] text-indigo-400 font-mono">Big Data / Raksasa</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            Data tetap di server sumber. Kueri dijalankan on-the-fly saat visual dibuka.
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => setSimStep(2)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <span>Lanjut: Autentikasi Kredensial</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Authentication */}
              {simStep === 2 && (
                <div className="space-y-5">
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                      <Lock className="w-4 h-4" />
                      <span>Dialog Autentikasi Power BI Desktop</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Sumber data <span className="text-white font-mono">{simServerName}</span> memerlukan izin akses. Pilih metode otorisasi yang diizinkan oleh administrator sistem:
                    </p>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-slate-700/60 cursor-pointer text-xs text-slate-200">
                        <input type="radio" name="auth_type" defaultChecked className="accent-cyan-500" />
                        <span>Database Authentication (Username & Password Terenkripsi)</span>
                      </label>
                      <label className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-slate-700/60 cursor-pointer text-xs text-slate-200">
                        <input type="radio" name="auth_type" className="accent-cyan-500" />
                        <span>Organizational Account (Microsoft Entra ID / Single Sign-On SSO)</span>
                      </label>
                      <label className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-slate-700/60 cursor-pointer text-xs text-slate-200">
                        <input type="radio" name="auth_type" className="accent-cyan-500" />
                        <span>Windows Authentication (Akun Pengguna Domain Komputer Aktif)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => setSimStep(1)}
                      className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSimulateConnect}
                      className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg flex items-center gap-2 shadow-sm transition-all"
                    >
                      <Server className="w-3.5 h-3.5" />
                      <span>Hubungkan & Buka Navigator</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Navigator & Transform Choice */}
              {simStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-lg">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Koneksi Berhasil! Objek data ditemukan pada {simDbName}.</span>
                  </div>

                  {/* Mock Navigator Table */}
                  <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
                    <div className="bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 border-b border-slate-800 flex items-center justify-between">
                      <span>Jendela Navigator Power BI</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Daftar Tabel Terdeteksi</span>
                    </div>
                    <div className="divide-y divide-slate-800 text-xs">
                      <div className="p-3 flex items-center justify-between bg-cyan-950/20">
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                          <input type="checkbox" defaultChecked className="accent-cyan-500" />
                          <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                          <span>FactSales (Tabel Transaksi Penjualan)</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">30 Baris Terdeteksi</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                          <input type="checkbox" defaultChecked className="accent-cyan-500" />
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span>DimProducts (Katalog Master Produk)</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">10 Baris Unik</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                          <input type="checkbox" defaultChecked className="accent-cyan-500" />
                          <FileText className="w-4 h-4 text-indigo-400" />
                          <span>DimCustomers (Data Pelanggan)</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">25 Pelanggan</span>
                      </div>
                    </div>
                  </div>

                  {/* Golden Rule Callout */}
                  <div className="p-3.5 rounded-lg bg-amber-950/25 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5">Golden Rule Analis Power BI:</strong>
                    Jangan langsung klik tombol <strong>"Load"</strong>! Selalu pilih <strong>"Transform Data"</strong> untuk memeriksa tipe data, membuang spasi liar, dan memvalidasi format tanggal di Power Query sebelum data masuk ke model.
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleResetSimulator}
                      className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Uji Sumber Lain
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => alert("Simulasi: Dalam Power BI Desktop asli, tombol 'Load' langsung memuat data ke RAM tanpa pemeriksaan Power Query (kurang disarankan).")}
                        className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Load (Muat Langsung)
                      </button>
                      <button
                        onClick={() => alert("Bagus! Anda memilih 'Transform Data'. Di modul berikutnya (Level 4), kita akan membersihkan data di Power Query Lab.")}
                        className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-600/30"
                      >
                        Transform Data (Buka Power Query)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guide Tab */}
      {activeTab === 'guide' && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white font-display">
              Panduan Detail Sumber Data: {selectedSource.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kategori: {selectedSource.category} · Mode yang Didukung: {selectedSource.supportedModes.join(', ')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Step by step */}
            <div className="space-y-3">
              <div className="font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Langkah-Langkah Koneksi Resmi:
              </div>
              <ol className="space-y-2 list-decimal list-inside text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedSource.stepByStep.map((step, sIdx) => (
                  <li key={sIdx} className="pl-1">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Preparation & Credentials */}
            <div className="space-y-3">
              <div className="font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                Persiapan & Autentikasi:
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-slate-300">
                <div>
                  <span className="text-slate-400 block font-medium mb-1">Syarat Sebelum Koneksi:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {selectedSource.preparation.map((prep, pIdx) => (
                      <li key={pIdx}>{prep}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block font-medium mb-0.5">Otorisasi & Kredensial:</span>
                  <p className="text-slate-300 font-mono text-[11px]">{selectedSource.credentials}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-white font-display">
            Matriks Lengkap Perbandingan Storage Modes Power BI
          </h2>
          <p className="text-xs text-slate-400">
            Pemilihan metode bukan hanya ditentukan oleh ukuran data, tetapi juga performa server database, kebutuhan real-time, infrastruktur jaringan, dan izin lisensi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 text-slate-300 font-mono">
                <tr>
                  <th className="p-3 border-b border-slate-800">Metode</th>
                  <th className="p-3 border-b border-slate-800">Cara Kerja Teknis</th>
                  <th className="p-3 border-b border-slate-800">Kapan Paling Cocok</th>
                  <th className="p-3 border-b border-slate-800">Keterbatasan & Risiko</th>
                  <th className="p-3 border-b border-slate-800">Dukungan DAX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-cyan-400">Import Mode</td>
                  <td className="p-3">Data diekstrak dan dipadatkan ke memori RAM lokal/cloud oleh mesin VertiPaq.</td>
                  <td className="p-3">Analisis interaktif cepat, ukuran dataset di bawah batas memori lisensi, perlu semua fitur DAX.</td>
                  <td className="p-3">Data tidak real-time (harus refresh berkala), memakan kuota RAM.</td>
                  <td className="p-3 text-emerald-400 font-mono">100% Penuh</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-indigo-400">DirectQuery</td>
                  <td className="p-3">Tidak ada data disimpan di Power BI; visual mengirimkan kueri SQL dinamis ke database sumber.</td>
                  <td className="p-3">Data sangat masif (ratusan juta baris), kepatuhan regulasi melarang data keluar, perlu data real-time.</td>
                  <td className="p-3">Performa report bergantung pada kecepatan server SQL; beberapa fungsi DAX time-intelligence dibatasi.</td>
                  <td className="p-3 text-amber-400 font-mono">Terbatas</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-purple-400">Composite Model</td>
                  <td className="p-3">Menggabungkan tabel Import berkecepatan tinggi dengan tabel DirectQuery dalam satu model data.</td>
                  <td className="p-3">Memerlukan tabel master cepat (Import) dipadu tabel transaksi historis raksasa (DirectQuery).</td>
                  <td className="p-3">Desain relasi lebih kompleks; risiko performa jika filter antar-sumber tidak teroptimasi.</td>
                  <td className="p-3 text-cyan-400 font-mono">Hibrida</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-emerald-400">Live Connection</td>
                  <td className="p-3">Terhubung langsung ke Semantic Model terpusat di Analysis Services atau Power BI Service.</td>
                  <td className="p-3">Organisasi telah memiliki Single Source of Truth Semantic Model yang dikelola tim BI terpusat.</td>
                  <td className="p-3">Tidak bisa membuat tabel atau mengubah relasi di laporan anak; murni membuat visual.</td>
                  <td className="p-3 text-emerald-400 font-mono">Penuh (Report Level)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Troubleshooting Tab */}
      {activeTab === 'troubleshooting' && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-display">
              Panduan Troubleshooting Error Koneksi & Refresh Terjadwal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {selectedSource.troubleshootingTips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-red-400 font-mono font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Gejala: {tip.issue}</span>
                </div>
                <div className="text-slate-300 leading-relaxed pl-4 border-l border-slate-800">
                  <span className="text-slate-400 font-medium block mb-0.5">Solusi Tepat:</span>
                  {tip.resolution}
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-amber-400 font-mono font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Gejala: On-premises gateway is offline or unreachable</span>
              </div>
              <div className="text-slate-300 leading-relaxed pl-4 border-l border-slate-800">
                <span className="text-slate-400 font-medium block mb-0.5">Solusi Tepat:</span>
                Pastikan komputer server gateway menyala dan layanan Windows "On-premises data gateway service" berjalan. Periksa apakah akun Microsoft Service memiliki izin administrator pada cluster gateway.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-amber-400 font-mono font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Gejala: Credentials are invalid or expired</span>
              </div>
              <div className="text-slate-300 leading-relaxed pl-4 border-l border-slate-800">
                <span className="text-slate-400 font-medium block mb-0.5">Solusi Tepat:</span>
                Buka Power BI Desktop → File → Options and settings → Data source settings → pilih sumber data terkait → Edit Permissions → masukkan kembali kata sandi atau lakukan OAuth Sign-In ulang.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
