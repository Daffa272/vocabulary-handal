import React, { useState } from 'react';
import { NavTab, SalesRecord } from '../../types';
import { rawSalesDataset, downloadCsv } from '../../data/mockDatasets';
import { learningModules } from '../../data/learningPathModules';
import { 
  Play, 
  Map, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Database, 
  Filter, 
  Boxes, 
  FunctionSquare, 
  FileSearch, 
  PieChart,
  HardDrive,
  Clock,
  Search
} from 'lucide-react';

interface DashboardHomeProps {
  completedModules: number[];
  quizAnswersCount: number;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  completedModules,
  quizAnswersCount,
  onNavigate
}) => {
  const [tableSearch, setTableSearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const totalModules = learningModules.length;
  const progressPercent = Math.round((completedModules.length / totalModules) * 100);

  // Filtered dataset for preview
  const filteredPreview = rawSalesDataset.filter(r => {
    const matchCat = selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter;
    const matchSearch = r.product.toLowerCase().includes(tableSearch.toLowerCase()) ||
                        r.customerName.toLowerCase().includes(tableSearch.toLowerCase()) ||
                        r.orderId.toLowerCase().includes(tableSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>PLATFORM PEMBELAJARAN INTERAKTIF</span>
            <span>·</span>
            <span>MICROSOFT POWER BI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display leading-tight">
            Kuasai Microsoft Power BI dari Dasar hingga Data Analyst Andal
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Pelajari alur kerja lengkap analitik data: <strong>Connect Data → Clean Data (Power Query) → Model Data (Star Schema) → DAX Measures → Data Visualization → Interpretation Engine → Power BI Service Deployment</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('learning-path')}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg flex items-center gap-2 shadow-sm shadow-cyan-500/20 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Lanjutkan Learning Path</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard-studio')}
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg flex items-center gap-2 transition-all"
            >
              <PieChart className="w-3.5 h-3.5 text-cyan-400" />
              <span>Buka Studio Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Kurikulum Selesai */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">PROGRES KURIKULUM</span>
            <Map className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono text-cyan-300">
            {progressPercent}%
          </div>
          <div className="text-[11px] text-slate-400">
            {completedModules.length} dari {totalModules} Level Selesai
          </div>
        </div>

        {/* Stat 2: Laboratorium Interaktif */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">LABORATORIUM AKTIF</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono text-indigo-300">
            8 Lab
          </div>
          <div className="text-[11px] text-slate-400">
            Power Query, Star Schema, DAX, Big Data
          </div>
        </div>

        {/* Stat 3: Studi Kasus Portofolio */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">PROYEK PORTOFOLIO</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono text-emerald-300">
            4 Kasus
          </div>
          <div className="text-[11px] text-slate-400">
            Sales, Finance, HR, SQL Big Data
          </div>
        </div>

        {/* Stat 4: Evaluasi & Kuis */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">KUIS TERJAWAB</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono text-purple-300">
            {quizAnswersCount} / 9 Soal
          </div>
          <div className="text-[11px] text-slate-400">
            Uji Kompetensi Analis Siap Kerja
          </div>
        </div>
      </div>

      {/* Quick Launchpad to 6 Essential Labs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display">
            Laboratorium Interaktif Unggulan
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Eksperimen Tanpa Batas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Power Query */}
          <div 
            onClick={() => onNavigate('power-query-lab')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-cyan-400 border border-indigo-800/60 group-hover:scale-105 transition-transform">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Power Query & Data Cleaning Lab
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hapus duplikat, tangani missing value, unpivot tabel cross-tab, dan amati Applied Steps bahasa M secara langsung.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <span>Buka Laboratorium</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Data Modeling */}
          <div 
            onClick={() => onNavigate('modeling-lab')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-800/60 group-hover:scale-105 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Data Modeling & Star Schema
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Simulasi relasi One-to-Many antartabel Fact & Dimension. Uji bagaimana filter mengalir (Filter Propagation) ke tabel fakta.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <span>Buka Laboratorium</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: DAX Formula Lab */}
          <div 
            onClick={() => onNavigate('dax-lab')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-purple-400 border border-indigo-800/60 group-hover:scale-105 transition-transform">
              <FunctionSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                DAX Formula Lab & Evaluator
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Editor interaktif untuk CALCULATE, DIVIDE, SUMX, FILTER, ALL. Bedakan Row Context vs Filter Context dengan hasil riil.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <span>Buka Laboratorium</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Interpretation Engine */}
          <div 
            onClick={() => onNavigate('interpretation-lab')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-emerald-400 border border-indigo-800/60 group-hover:scale-105 transition-transform">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Data Interpretation Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Fitur unggulan: Mengubah angka grafik menjadi laporan analisis terstruktur 5 tahap (Observasi, Bukti Statistik, Makna Bisnis).
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <span>Buka Laboratorium</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Big Data Architecture */}
          <div 
            onClick={() => onNavigate('big-data-lab')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-amber-400 border border-indigo-800/60 group-hover:scale-105 transition-transform">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Big Data & VertiPaq Lab (1M Baris)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pelajari columnar compression, pemecahan DateTime untuk menghemat RAM hingga 85%, dan demonstrasi Query Folding SQL.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <span>Buka Laboratorium</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Dashboard Studio */}
          <div 
            onClick={() => onNavigate('dashboard-studio')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-cyan-400 border border-indigo-800/60 group-hover:scale-105 transition-transform">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Studio Dashboard Penjualan
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Kanvas dashboard dinamis dengan 4 KPI cards, grafik tren bulanan, slicer wilayah/kategori, dan simulasi drill-down.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <span>Buka Laboratorium</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Dataset & Practice Table (Interactive Data Explorer) */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Eksplorasi Dataset Latihan Penjualan (Sales_Data.csv)
            </h2>
            <span className="text-xs text-slate-400">
              {filteredPreview.length} Transaksi Ditampilkan · Tipe Kolom Lengkap
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCsv('Sales_Data_Full.csv', rawSalesDataset)}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Latihan</span>
            </button>
          </div>
        </div>

        {/* Filters and search for preview table */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {['All', 'Technology', 'Office Supplies', 'Furniture'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedCategoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Cari ID, Produk, Pelanggan..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 font-mono">
              <tr>
                <th className="p-2.5 border-b border-slate-800">Order ID</th>
                <th className="p-2.5 border-b border-slate-800">Tanggal</th>
                <th className="p-2.5 border-b border-slate-800">Pelanggan</th>
                <th className="p-2.5 border-b border-slate-800">Wilayah</th>
                <th className="p-2.5 border-b border-slate-800">Kategori</th>
                <th className="p-2.5 border-b border-slate-800">Produk</th>
                <th className="p-2.5 border-b border-slate-800 text-right">Kuantitas</th>
                <th className="p-2.5 border-b border-slate-800 text-right">Total Penjualan</th>
                <th className="p-2.5 border-b border-slate-800 text-right">Laba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredPreview.slice(0, 8).map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-mono text-cyan-300">{r.orderId}</td>
                  <td className="p-2.5 font-mono text-[11px]">{r.orderDate}</td>
                  <td className="p-2.5">{r.customerName}</td>
                  <td className="p-2.5 text-slate-400 font-mono text-[11px]">{r.region}</td>
                  <td className="p-2.5 text-slate-400">{r.category}</td>
                  <td className="p-2.5 font-medium text-slate-100">{r.product}</td>
                  <td className="p-2.5 text-right font-mono">{r.quantity}</td>
                  <td className="p-2.5 text-right font-mono text-cyan-300 font-semibold">
                    Rp {r.salesAmount.toLocaleString('id-ID')}
                  </td>
                  <td className={`p-2.5 text-right font-mono ${r.profit < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    Rp {r.profit.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
