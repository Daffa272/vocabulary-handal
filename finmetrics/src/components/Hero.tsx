import React from 'react';
import { ArrowRight, BarChart3, Scale, Layers, Target } from 'lucide-react';
import heroImage from '../assets/images/financial_analysis_hero_1791610718906.jpg';

interface HeroProps {
  onSelectModule: (module: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectModule }) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <span>Kurikulum Analis Finansial & Bisnis</span>
              <span aria-hidden="true">·</span>
              <span>Studi Kasus Riil</span>
              <span aria-hidden="true">·</span>
              <span>Simulator Interaktif</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Bedah Tuntas Laporan Keuangan & Rasio Perusahaan
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Kuasai cara membaca angka keuangan: dari aliran pendapatan hingga laba bersih, 
              keseimbangan neraca modal kerja, deteksi likuiditas arus kas, hingga membongkar 
              anomali rasio keuangan Perusahaan A vs Perusahaan B.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectModule('income')}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors cursor-pointer shadow-md"
              >
                <span>Mulai Simulasi Laba Rugi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectModule('ratios')}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <span>Studi Kasus Perusahaan A vs B</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src={heroImage}
                alt="Arsitektur Finansial dan Analisis Neraca Interaktif"
                className="w-full h-auto object-cover max-h-[380px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex items-center justify-between">
                <span>Model Neraca & Arus Kas Dinamis</span>
                <span className="font-mono tabular-nums text-sky-400">Aset = Kewajiban + Ekuitas</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Feature Matrix */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          <button
            onClick={() => onSelectModule('income')}
            className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Modul 1</span>
            </div>
            <h4 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
              Laporan Laba Rugi
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Waterfall Margin: Laba Kotor, Operasi, EBIT, EBITDA, hingga Laba Bersih & EPS.
            </p>
          </button>

          <button
            onClick={() => onSelectModule('balance')}
            className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Scale className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Modul 2</span>
            </div>
            <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
              Neraca Keuangan
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Keseimbangan Aset = Kewajiban + Ekuitas, rasio lancar, kas riil, dan uji solvabilitas.
            </p>
          </button>

          <button
            onClick={() => onSelectModule('cashflow')}
            className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Modul 3</span>
            </div>
            <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
              Laporan Arus Kas
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              3 pipa aliran kas (Operasi, Investasi, Pembiayaan) dan Free Cash Flow (FCF).
            </p>
          </button>

          <button
            onClick={() => onSelectModule('ratios')}
            className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Modul 4</span>
            </div>
            <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
              Rasio & Detective Mode
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Komparasi 23 indikator A vs B, audit DSO 264 hari, dan deteksi anomali laba.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
