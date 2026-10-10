import React from 'react';
import { 
  X, 
  Terminal, 
  FolderTree, 
  Monitor, 
  CheckCircle2, 
  BookOpen, 
  Copy,
  ExternalLink
} from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0B0F19] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Panduan Instalasi & Arsitektur Proyek (Windows & VS Code)
              </h2>
              <span className="text-xs text-slate-400">
                Langkah menjalankan Power BI Academy secara lokal di komputer Anda
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Section 1: Cara Menjalankan di Windows dengan VS Code */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>1. Langkah Instalasi di Windows Menggunakan Visual Studio Code</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="space-y-1">
                <strong className="text-cyan-300 block">Prasyarat:</strong>
                <p className="text-slate-400 text-[11px]">
                  Pastikan komputer Windows Anda telah terinstal <strong>Node.js (versi 18 LTS atau 20+)</strong> dan <strong>Visual Studio Code</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 font-mono text-[11px] block">Perintah Terminal (Command Prompt / PowerShell di VS Code):</span>
                <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
{`# 1. Buka folder proyek di VS Code
code .

# 2. Buka Terminal terintegrasi (Ctrl + \`)
# 3. Instal semua dependensi proyek
npm install

# 4. Jalankan development server lokal
npm run dev

# 5. Buka browser di http://localhost:3000`}
                </pre>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-mono text-[11px] block">Perintah Build untuk Produksi:</span>
                <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
{`# Kompilasi aplikasi untuk deployment
npm run build`}
                </pre>
              </div>
            </div>
          </div>

          {/* Section 2: Struktur Folder Proyek */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              <span>2. Struktur Folder & Modularitas Kode</span>
            </h3>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`├── src/
│   ├── components/
│   │   ├── labs/                   # Laboratorium Interaktif
│   │   │   ├── DataConnectionLab.tsx    # Level 2 & 3: 10 Konektor & Storage Modes
│   │   │   ├── PowerQueryLab.tsx        # Level 4: ETL, Applied Steps, Bahasa M
│   │   │   ├── DataModelingLab.tsx      # Level 5: Star Schema, Filter Propagation
│   │   │   ├── DaxFormulaLab.tsx        # Level 6: Editor & Evaluator Measure DAX
│   │   │   ├── DataInterpretationLab.tsx# Level 8: Mesin Interpretasi 5 Tahap
│   │   │   ├── DistributionLab.tsx      # Level 9: Histogram, Skewness, Outlier IQR
│   │   │   ├── BigDataLab.tsx           # Level 10: Optimasi 1M Baris, VertiPaq
│   │   │   └── DashboardStudio.tsx      # Level 11: Kanvas Dashboard Eksekutif
│   │   ├── modules/                # Halaman Konten & Evaluasi
│   │   │   ├── DashboardHome.tsx        # Ringkasan Progres & Quick Launch
│   │   │   ├── LearningPathView.tsx     # Silabus Lengkap 12 Level
│   │   │   ├── VisualizationCatalogView.tsx # Level 7: 14 Katalog Chart
│   │   │   ├── CaseStudiesView.tsx      # 4 Proyek Portofolio Siap Pakai
│   │   │   ├── QuizView.tsx             # Kuis & Evaluasi 8 Topik
│   │   │   ├── GlossaryView.tsx         # Kamus Istilah Power BI
│   │   │   └── ReadmeModal.tsx          # Panduan Dokumentasi Ini
│   │   ├── Navbar.tsx              # Top Bar Standar 3-Zone
│   │   └── Sidebar.tsx             # Navigasi Menu & Progres
│   ├── data/                       # Dataset Sintetis & Silabus
│   │   ├── mockDatasets.ts         # Sales_Data, DirtyData, CSV Exporter
│   │   ├── learningPathModules.ts  # Konten Edukasi 12 Level
│   │   ├── connectionSources.ts    # 10 Panduan Sumber Data
│   │   ├── daxFunctions.ts         # Katalog & Evaluator DAX
│   │   ├── visualCatalog.ts        # Spesifikasi 14 Visualisasi
│   │   ├── distributionData.ts     # Data Distribusi Statistik
│   │   ├── caseStudies.ts          # 4 Studi Kasus Portofolio
│   │   ├── quizzes.ts              # Bank Soal & Pembahasan
│   │   └── glossary.ts             # Kamus Istilah
│   ├── utils/
│   │   └── statistics.ts           # Mean, Median, StdDev, IQR, Skewness, Interpretasi
│   ├── types/
│   │   └── index.ts                # TypeScript Interfaces
│   ├── App.tsx                     # State Management & Tab Routing
│   ├── index.css                   # Tailwind v4 Styles & Typography
│   └── main.tsx                    # Entry Point React 19
├── metadata.json                   # Metadata Proyek
├── package.json                    # Dependensi Proyek
└── README.md                       # Dokumentasi Resmi Markdown`}
            </pre>
          </div>

          {/* Section 3: Catatan Lingkungan Simulasi vs Power BI Desktop Asli */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
            <span className="font-semibold text-cyan-300 block">
              Catatan Lingkungan Simulasi:
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Website ini merupakan simulasi interaktif berbasis peramban (browser) yang mengeksekusi perhitungan statistik dan DAX secara nyata di memori lokal. Seluruh fitur latihan dirancang untuk mempermudah pemahaman konsep sebelum Anda mempraktikkannya langsung di aplikasi resmi <strong>Power BI Desktop</strong> di Windows.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/40 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
