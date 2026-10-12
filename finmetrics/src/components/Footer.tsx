import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenGlossary: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenGlossary }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <span className="text-lg font-bold text-white tracking-tight">
              FinMetrics<span className="text-sky-500 font-semibold">Lab</span>
            </span>
            <p className="text-slate-400 leading-relaxed text-xs">
              Platform interaktif pembelajaran fundamental keuangan korporasi, analisis rasio, 
              dan audit forensik data bisnis untuk analis dan investor.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Laporan Keuangan
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('income')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Laporan Laba Rugi & EBIT
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('balance')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Neraca & Modal Kerja
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('cashflow')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Laporan Arus Kas & FCF
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Analisis & Studi Kasus
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('ratios')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Komparasi Perusahaan A vs B
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Simulator Rumus Finansial
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('quiz')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kuis Uji Kompetensi
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Referensi Pembelajaran
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenGlossary}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Glosarium 30+ Istilah Keuangan
                </button>
              </li>
              <li>
                <span className="text-slate-500">Standar Pelaporan Akuntansi PSAK / IFRS</span>
              </li>
              <li>
                <span className="text-slate-500">Financial Analyst Curriculum</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FinMetrics Lab. Materi edukasi analisis keuangan interaktif.
          </div>
          <div className="flex items-center gap-4">
            <span>Privasi & Keamanan Data</span>
            <span aria-hidden="true">·</span>
            <span>Bebas Akses Edukatif</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
