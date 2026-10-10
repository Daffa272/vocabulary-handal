import React, { useState } from 'react';
import { X, Laptop, CheckCircle2, AlertTriangle, Key, Terminal, HelpCircle, Copy, Check } from 'lucide-react';

interface WindowsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WindowsGuideModal: React.FC<WindowsGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'install' | 'venv' | 'kaggle' | 'troubleshoot'>('install');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#0f1d2d] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">
                Panduan Menjalankan di Windows untuk Pemula
              </h3>
              <p className="text-xs text-stone-300 font-sans">
                Langkah demi langkah dari nol tanpa asumsi Anda sudah ahli terminal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-stone-100 px-6 py-2 border-b border-stone-200 flex items-center gap-1 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'install' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            1. Pasang Python & PATH
          </button>
          <button
            onClick={() => setActiveTab('venv')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'venv' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            2. Terminal & pip
          </button>
          <button
            onClick={() => setActiveTab('kaggle')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'kaggle' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            3. Token Kaggle API
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'troubleshoot' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            4. "Kalau Error" (Solusi)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
          
          {/* TAB 1: INSTALL PYTHON */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Langkah Paling Krusial:</strong> Saat membuka installer Python di Windows, Anda <em>WAJIB</em> mencentang kotak <code>☑ Add python.exe to PATH</code> di bagian paling bawah sebelum mengklik tombol "Install Now".
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">Langkah Memasang:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Unduh Python resmi dari website: <a href="https://www.python.org/downloads/" target="_blank" rel="noreferrer" className="text-sky-700 underline font-mono">python.org/downloads</a></li>
                  <li>Buka file installer yang terunduh (biasanya bernama <code>python-3.x.x-amd64.exe</code>).</li>
                  <li><strong>Centang:</strong> "Add python.exe to PATH".</li>
                  <li>Klik <strong>Install Now</strong> dan tunggu hingga selesai.</li>
                  <li>Klik <strong>Close</strong>.</li>
                </ol>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
                <span className="font-mono font-bold text-stone-900 block text-xs">Cara Cek Apakah Berhasil:</span>
                <p className="text-xs text-stone-600">Tekan tombol <code>Win + R</code> di keyboard, ketik <code>cmd</code>, tekan Enter. Lalu ketik:</p>
                <div className="bg-[#101725] text-amber-300 font-mono text-xs p-2.5 rounded flex items-center justify-between">
                  <span>python --version</span>
                  <button
                    onClick={() => copySnippet('python --version', 'pyver')}
                    className="text-stone-400 hover:text-white"
                  >
                    {copiedText === 'pyver' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">Jika muncul tulisan seperti <code>Python 3.12.x</code>, komputer Anda sudah siap!</p>
              </div>
            </div>
          )}

          {/* TAB 2: VENV & PIP */}
          {activeTab === 'venv' && (
            <div className="space-y-4">
              <p>
                Lingkungan virtual (Virtual Environment) menjaga library yang Anda pasang tetap rapi dan tidak bentrok dengan software lain di Windows.
              </p>

              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">Jalankan Perintah Ini di Command Prompt (cmd):</h4>

                <div className="space-y-1">
                  <span className="text-xs text-stone-600 font-mono">1. Masuk ke folder latihan yang sudah diekstrak:</span>
                  <div className="bg-[#101725] text-sky-200 font-mono text-xs p-2.5 rounded flex items-center justify-between">
                    <span>cd latihan</span>
                    <button onClick={() => copySnippet('cd latihan', 'cdlatihan')} className="text-stone-400 hover:text-white">
                      {copiedText === 'cdlatihan' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-stone-600 font-mono">2. Buat virtual environment (opsional namun sangat disarankan):</span>
                  <div className="bg-[#101725] text-sky-200 font-mono text-xs p-2.5 rounded flex items-center justify-between">
                    <span>python -m venv venv</span>
                    <button onClick={() => copySnippet('python -m venv venv', 'venv')} className="text-stone-400 hover:text-white">
                      {copiedText === 'venv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-stone-600 font-mono">3. Aktifkan virtual environment di Windows:</span>
                  <div className="bg-[#101725] text-sky-200 font-mono text-xs p-2.5 rounded flex items-center justify-between">
                    <span>venv\Scripts\activate</span>
                    <button onClick={() => copySnippet('venv\\Scripts\\activate', 'act')} className="text-stone-400 hover:text-white">
                      {copiedText === 'act' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-500 italic block">Akan muncul tanda <code>(venv)</code> di depan baris terminal.</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-stone-600 font-mono">4. Pasang semua pustaka yang dibutuhkan:</span>
                  <div className="bg-[#101725] text-sky-200 font-mono text-xs p-2.5 rounded flex items-center justify-between">
                    <span>pip install -r requirements.txt</span>
                    <button onClick={() => copySnippet('pip install -r requirements.txt', 'pipreq')} className="text-stone-400 hover:text-white">
                      {copiedText === 'pipreq' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KAGGLE TOKEN */}
          {activeTab === 'kaggle' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg text-sky-950 flex items-start gap-3">
                <Key className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  Token <code>kaggle.json</code> adalah kunci rahasia agar skrip Python Anda diizinkan mengunduh dataset dari Kaggle secara otomatis tanpa perlu login manual di browser.
                </div>
              </div>

              <ol className="list-decimal pl-5 space-y-2">
                <li>Buka situs <a href="https://www.kaggle.com" target="_blank" rel="noreferrer" className="text-sky-700 underline font-mono">kaggle.com</a> dan buat akun (gratis).</li>
                <li>Klik foto profil Anda di pojok kanan atas, lalu pilih menu <strong>Settings</strong>.</li>
                <li>Gulir ke bawah sampai menemukan bagian bertuliskan <strong>API</strong>.</li>
                <li>Klik tombol <strong>Create New Token</strong>. File bernama <code>kaggle.json</code> akan terunduh otomatis ke folder Downloads Anda.</li>
                <li>Pindahkan file tersebut ke folder rahasia pengguna Windows Anda:</li>
              </ol>

              <div className="bg-[#101725] text-amber-300 font-mono text-xs p-3 rounded space-y-1">
                <span className="text-stone-400 text-[11px] block">Lokasi Tujuan di Windows:</span>
                <div>C:\Users\&lt;NamaUserAnda&gt;\.kaggle\kaggle.json</div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
                <strong>Tips jika folder .kaggle belum ada:</strong> Buka Command Prompt dan ketik:
                <code className="block mt-1 font-mono text-stone-800 bg-stone-200 px-2 py-1 rounded">
                  mkdir %USERPROFILE%\.kaggle
                </code>
              </div>
            </div>
          )}

          {/* TAB 4: TROUBLESHOOTING */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <div className="border border-stone-200 rounded-lg p-3 space-y-1">
                <h5 className="font-mono font-bold text-rose-700 text-xs">
                  1. 'python' is not recognized as an internal or external command
                </h5>
                <p className="text-xs text-stone-600">
                  <strong>Penyebab:</strong> Opsi PATH belum dicentang saat instalasi Python.<br />
                  <strong>Solusi:</strong> Jalankan kembali installer Python yang Anda unduh, pilih <strong>Modify</strong>, dan pastikan centang opsi "Add Python to environment variables".
                </p>
              </div>

              <div className="border border-stone-200 rounded-lg p-3 space-y-1">
                <h5 className="font-mono font-bold text-rose-700 text-xs">
                  2. ModuleNotFoundError: No module named 'requests' atau 'bs4'
                </h5>
                <p className="text-xs text-stone-600">
                  <strong>Penyebab:</strong> Library belum terpasang di Python yang sedang aktif.<br />
                  <strong>Solusi:</strong> Jalankan perintah: <code>pip install requests beautifulsoup4 pandas kagglehub</code>
                </p>
              </div>

              <div className="border border-stone-200 rounded-lg p-3 space-y-1">
                <h5 className="font-mono font-bold text-rose-700 text-xs">
                  3. Error 403 Forbidden saat Scraping
                </h5>
                <p className="text-xs text-stone-600">
                  <strong>Penyebab:</strong> Server mendeteksi bot karena User-Agent bawaan Python.<br />
                  <strong>Solusi:</strong> Tambahkan header User-Agent: <code>{'headers={"User-Agent": "LatihanPemula/1.0"}'}</code> seperti pada skrip 03.
                </p>
              </div>

              <div className="border border-stone-200 rounded-lg p-3 space-y-1">
                <h5 className="font-mono font-bold text-rose-700 text-xs">
                  4. UnicodeDecodeError: 'charmap' codec can't decode...
                </h5>
                <p className="text-xs text-stone-600">
                  <strong>Penyebab:</strong> Windows default memakai encoding lokal saat membaca file bertanda khusus.<br />
                  <strong>Solusi:</strong> Selalu tambahkan argumen: <code>pd.read_csv("file.csv", encoding="utf-8")</code> atau coba <code>encoding="latin1"</code>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono">Disesuaikan untuk Windows 10 & 11</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
