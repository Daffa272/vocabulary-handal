import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IncomeStatementModule } from './components/IncomeStatementModule';
import { BalanceSheetModule } from './components/BalanceSheetModule';
import { CashFlowModule } from './components/CashFlowModule';
import { RatioComparisonModule } from './components/RatioComparisonModule';
import { CalculatorModule } from './components/CalculatorModule';
import { QuizModule } from './components/QuizModule';
import { GlossaryModal } from './components/GlossaryModal';
import { Footer } from './components/Footer';
import {
  BarChart3,
  Scale,
  Layers,
  Target,
  Calculator,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const modules = [
    {
      id: 'income',
      title: 'Laporan Laba Rugi (Income Statement)',
      subtitle: 'Waterfall Margin, EBIT, EBITDA, & Laba Bersih',
      icon: BarChart3,
      badge: 'Modul 01',
      description:
        'Pelajari bagaimana pendapatan 800,10 terurai menjadi laba kotor, operasi, pos penjualan aset 44,29, hingga laba bersih dan dividen.',
    },
    {
      id: 'balance',
      title: 'Neraca Keuangan (Balance Sheet)',
      subtitle: 'Persamaan Aset = Kewajiban + Ekuitas',
      icon: Scale,
      badge: 'Modul 02',
      description:
        'Pahami struktur modal kerja dengan kas 722,66, rasio kas 1,94x, uji solvabilitas DER 13,42%, dan komposisi ekuitas 1.416,83.',
    },
    {
      id: 'cashflow',
      title: 'Laporan Arus Kas (Cash Flow)',
      subtitle: '3 Aliran Kas & Free Cash Flow (FCF)',
      icon: Layers,
      badge: 'Modul 03',
      description:
        'Mengapa perusahaan laba bisa krisis kas? Eksplorasi Arus Kas Operasi (CFO), Belanja Modal (CapEx), dan siklus hidup korporasi.',
    },
    {
      id: 'ratios',
      title: 'Rasio Keuangan & Kasus Perusahaan A vs B',
      subtitle: 'Audit Forensik Red Flags & DSO 264 Hari',
      icon: Target,
      badge: 'Modul 04',
      description:
        'Komparasi langsung 23 metrik keuangan. Mengapa margin kotor Perusahaan A minus (-5,78%) tetapi laba bersihnya 78%? Bongkar rahasianya di sini.',
    },
    {
      id: 'calculator',
      title: 'Laboratorium Kalkulator Finansial',
      subtitle: 'Hitung Cepat 12 Formula Esensial',
      icon: Calculator,
      badge: 'Modul 05',
      description:
        'Masukkan angka apa pun untuk mengevaluasi GPM, OPM, NPM, Current Ratio, Cash Ratio, DAR, DER, FCF, P/E, dan Dividend Yield.',
    },
    {
      id: 'quiz',
      title: 'Evaluasi & Kuis Pemahaman',
      subtitle: '10 Soal Berbobot dengan Pembahasan Lengkap',
      icon: Award,
      badge: 'Modul 06',
      description:
        'Uji kemampuan analisis finansial Anda dengan kuis interaktif berbobot serta penjelasan mendalam per butir soal.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-zone Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      <main className="flex-1">
        {/* Overview Landing Tab */}
        {activeTab === 'overview' && (
          <div>
            <Hero onSelectModule={(tab) => setActiveTab(tab)} />

            {/* Interactive Module Grid Showcase */}
            <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
                    <span>Struktur Silabus</span>
                    <span aria-hidden="true">·</span>
                    <span>6 Modul Terintegrasi</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Modul Pembelajaran & Simulator Interaktif
                  </h2>
                  <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
                    Pilih modul di bawah untuk menjelajahi materi interaktif, grafik dinamis, tabel komparasi, dan simulasi kasus riil.
                  </p>
                </div>

                <button
                  onClick={() => setIsGlossaryOpen(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer self-start md:self-auto"
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Buka Glosarium Rumus</span>
                </button>
              </div>

              {/* Grid of Interactive Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveTab(m.id)}
                      className="text-left bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-sky-50 text-slate-700 group-hover:text-sky-700 flex items-center justify-center transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-400 font-mono">
                            {m.badge}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-1">
                          {m.title}
                        </h3>
                        <div className="text-xs font-medium text-slate-500 mb-3">
                          {m.subtitle}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700 group-hover:text-sky-800">
                        <span>Buka Simulator Modul</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Interactive Summary Teaser Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="text-xs font-semibold text-sky-400">
                    Siap Menguji Kemampuan Analis Keuangan?
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    10 Butir Kuis Evaluasi Berdasarkan Laporan Riil
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Uji pemahaman Anda mengenai perbedaan laba akuntansi vs kas riil, rumus cepat rasio lancar, dan mendeteksi anomali laba satu kali.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-md shrink-0"
                >
                  Mulai Kuis Sekarang
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Dedicated Module Content */}
        {activeTab !== 'overview' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Beranda
              </button>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-slate-900">
                {modules.find((m) => m.id === activeTab)?.title || 'Modul'}
              </span>
            </div>

            {/* Active Component */}
            {activeTab === 'income' && <IncomeStatementModule />}
            {activeTab === 'balance' && <BalanceSheetModule />}
            {activeTab === 'cashflow' && <CashFlowModule />}
            {activeTab === 'ratios' && <RatioComparisonModule />}
            {activeTab === 'calculator' && <CalculatorModule />}
            {activeTab === 'quiz' && <QuizModule />}

            {/* Pagination between modules */}
            <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer font-medium"
              >
                ← Kembali ke Ikhtisar Kurikulum
              </button>

              <div className="flex items-center gap-2">
                {activeTab !== 'quiz' ? (
                  <button
                    onClick={() => {
                      const order = ['income', 'balance', 'cashflow', 'ratios', 'calculator', 'quiz'];
                      const cur = order.indexOf(activeTab);
                      if (cur !== -1 && cur < order.length - 1) {
                        setActiveTab(order[cur + 1]);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer font-semibold shadow-xs"
                  >
                    <span>Lanjut ke Modul Berikutnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('income');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors cursor-pointer font-semibold"
                  >
                    Ulangi Modul 1 (Laba Rugi)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Financial Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Editorial Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />
    </div>
  );
}
