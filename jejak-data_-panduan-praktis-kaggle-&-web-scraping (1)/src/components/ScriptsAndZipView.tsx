import React, { useState } from 'react';
import { SCRIPT_FILES } from '../data/scriptsData';
import { Terminal, Download, Copy, Check, FileCode, FolderArchive, Play, Info } from 'lucide-react';

interface ScriptsAndZipViewProps {
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
  onOpenWindowsGuide: () => void;
}

export const ScriptsAndZipView: React.FC<ScriptsAndZipViewProps> = ({
  onDownloadZip,
  isDownloadingZip,
  onOpenWindowsGuide
}) => {
  const [activeFilename, setActiveFilename] = useState<string>('01_baca_csv.py');
  const [copied, setCopied] = useState<boolean>(false);

  const currentFile = SCRIPT_FILES.find((f) => f.filename === activeFilename) || SCRIPT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Big Download ZIP Action Box */}
      <div className="bg-[#0f1d2d] text-white border border-stone-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <FolderArchive className="w-4 h-4" />
              <span>Paket Lengkap Siap Jalankan di Windows</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Arsip jejak-data-ambil-data.zip
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Berisi seluruh skrip Python bertingkat (01 hingga 05), requirements.txt, contoh CSV, dokumentasi README.md, dan file otomatis <strong>JALANKAN.bat</strong> yang bisa langsung diklik dua kali di Windows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onOpenWindowsGuide}
              className="px-4 py-2.5 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded transition-colors text-center cursor-pointer"
            >
              Baca Panduan Windows
            </button>

            <button
              onClick={onDownloadZip}
              disabled={isDownloadingZip}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded transition-all shadow cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingZip ? 'Mengemas File ZIP...' : 'Unduh File ZIP (.zip)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: File List Selector */}
        <div className="lg:col-span-4 bg-white border border-stone-300 rounded-lg p-4 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold block">
              Daftar File Paket Latihan
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              Urutan skrip dari sangat mudah ke praktik penuh
            </span>
          </div>

          <div className="space-y-1">
            {SCRIPT_FILES.map((f) => {
              const isActive = f.filename === activeFilename;
              return (
                <button
                  key={f.filename}
                  onClick={() => setActiveFilename(f.filename)}
                  className={`w-full text-left p-2.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-amber-100 border border-amber-400 text-amber-950 font-bold'
                      : 'hover:bg-stone-100 text-stone-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-800' : 'text-stone-400'}`} />
                    <span className="font-mono truncate">{f.filename}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono opacity-60 ml-2">
                    {f.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Terminal Reminder */}
          <div className="pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1.5 font-sans">
            <strong className="block text-stone-900 font-mono text-[11px]">Cara Jalankan di Windows:</strong>
            <p className="text-[11px]">
              1. Buka <code>cmd</code> lalu arahkan ke folder:
            </p>
            <pre className="bg-stone-100 p-2 rounded text-[11px] font-mono text-stone-800 overflow-x-auto">
              cd latihan
            </pre>
            <p className="text-[11px]">
              2. Pasang library:
            </p>
            <pre className="bg-stone-100 p-2 rounded text-[11px] font-mono text-stone-800 overflow-x-auto">
              pip install -r requirements.txt
            </pre>
            <p className="text-[11px]">
              3. Jalankan skrip yang aktif:
            </p>
            <pre className="bg-stone-100 p-2 rounded text-[11px] font-mono text-amber-900 font-bold overflow-x-auto">
              python {activeFilename.endsWith('.py') ? activeFilename : '01_baca_csv.py'}
            </pre>
          </div>
        </div>

        {/* RIGHT: File Content Viewer */}
        <div className="lg:col-span-8 bg-[#101725] border border-stone-800 rounded-lg shadow-sm overflow-hidden text-stone-200 flex flex-col">
          {/* File Toolbar */}
          <div className="bg-[#0b101a] px-4 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-stone-300">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="font-bold">{currentFile.filename}</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 font-sans">
                {currentFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Isi'}</span>
              </button>

              <button
                onClick={handleDownloadSingleFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File Ini</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 max-h-[600px] overflow-y-auto">
            <pre className="font-mono text-xs leading-relaxed text-sky-200/90 whitespace-pre overflow-x-auto">
              {currentFile.code}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
