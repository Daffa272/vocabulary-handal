import React, { useState } from 'react';
import { MOCK_REQUEST_PRESETS } from '../data/simulatorData';
import { MockRequestPreset } from '../types';
import { Send, Clock, CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Copy, Check, FileText } from 'lucide-react';

export const RequestSimulator: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('books-ok');
  const [includeUserAgent, setIncludeUserAgent] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'diagnosis' | 'headers' | 'body'>('diagnosis');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<MockRequestPreset>(MOCK_REQUEST_PRESETS[0]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleSendRequest = () => {
    setIsLoading(true);
    const targetPreset = MOCK_REQUEST_PRESETS.find((p) => p.id === selectedPresetId) || MOCK_REQUEST_PRESETS[0];

    setTimeout(() => {
      // If user is testing 403 site and has custom friendly user-agent enabled, show how it overcomes the bot barrier
      if (selectedPresetId === 'block-403' && includeUserAgent) {
        setCurrentResponse({
          ...targetPreset,
          statusCode: 200,
          statusText: 'OK (Bypass dengan User-Agent Sopan)',
          description: 'Berhasil diakses karena Anda menyertakan identitas User-Agent yang ramah!',
          responseBody: `<!DOCTYPE html>\n<html>\n<head><title>Katalog Terbuka</title></head>\n<body>\n  <h1>Selamat Datang</h1>\n  <p>Permintaan Anda diterima karena menyertakan identitas browser wajar.</p>\n</body>\n</html>`,
          diagnosis: 'Server mengizinkan akses karena header User-Agent tidak lagi menggunakan "python-requests" bawaan!',
          remedy: 'Kunci sukses: Selalu gunakan header User-Agent: headers={"User-Agent": "LatihanPemula/1.0"}.'
        });
      } else {
        setCurrentResponse(targetPreset);
      }
      setIsLoading(false);
    }, 450);
  };

  const getStatusBadge = (code: number) => {
    if (code === 200) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-mono text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>200 OK</span>
        </span>
      );
    }
    if (code === 404) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded font-mono text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>404 Not Found</span>
        </span>
      );
    }
    if (code === 403) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded font-mono text-xs font-bold">
          <XCircle className="w-3.5 h-3.5" />
          <span>403 Forbidden</span>
        </span>
      );
    }
    if (code === 429) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded font-mono text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>429 Too Many Requests</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-stone-100 text-stone-800 border border-stone-300 rounded font-mono text-xs font-bold">
        {code}
      </span>
    );
  };

  const pythonSnippet = `import requests

url = "${currentResponse.url}"
headers = {
    "User-Agent": "${includeUserAgent ? 'LatihanScrapingPemula/1.0' : 'python-requests/2.31.0'}"
}

try:
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Status Code: {response.status_code}")
    
    # Penanganan status code yang benar:
    if response.status_code == 200:
        print(" Sukses! Dokumen siap diparsing dengan BeautifulSoup.")
    elif response.status_code == 404:
        print(" Halaman tidak ada (mungkin sudah halaman terakhir pagination).")
    elif response.status_code == 403:
        print(" Ditolak! Periksa header User-Agent atau izin situs.")
    elif response.status_code == 429:
        print(" Terlalu cepat! Berikan time.sleep() lebih lama.")
        
    response.raise_for_status()

except requests.exceptions.HTTPError as err:
    print(f"Pengecualian HTTP: {err}")
except Exception as e:
    print(f"Kesalahan jaringan: {e}")`;

  const copyPython = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">
              <Send className="w-3.5 h-3.5" />
              <span>Laboratorium Interaktif HTTP Client & Response Inspector</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Simulator Request & Response Jaringan
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Pahami apa yang terjadi ketika Python memanggil <code>requests.get(url)</code>.
              Pilih berbagai skenario respons web nyata (sukses 200, hilang 404, blokir bot 403, atau rate-limit 429) dan pelajari cara menanganinya di kode Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Main Request Configurator */}
      <div className="bg-white border border-stone-300 rounded-lg p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
            Pilih Skenario Permintaan (URL Latihan)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {MOCK_REQUEST_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                  }}
                  className={`text-left p-3 rounded border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-medium mb-1">
                    <span className="truncate">{preset.name}</span>
                    <span className="text-[10px] text-stone-500 font-bold ml-1">
                      {preset.statusCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* URL Bar & Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center bg-stone-50 border border-stone-300 rounded overflow-hidden">
            <span className="px-3 py-2 bg-stone-200 font-mono text-xs font-bold text-stone-700 border-r border-stone-300">
              GET
            </span>
            <input
              type="text"
              readOnly
              value={MOCK_REQUEST_PRESETS.find((p) => p.id === selectedPresetId)?.url || ''}
              className="flex-1 px-3 py-2 font-mono text-xs text-stone-800 bg-transparent focus:outline-none"
            />
          </div>

          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded transition-colors cursor-pointer disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Mengirim HTTP GET...' : 'Kirim Permintaan (Request)'}</span>
          </button>
        </div>

        {/* Request Options: User-Agent header switch */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeUserAgent}
              onChange={(e) => setIncludeUserAgent(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <span>Sertakan Header <code>User-Agent</code> Sopan (Rekomendasi Utama)</span>
          </label>
          <span className="text-[11px] font-mono text-stone-400">Metode: HTTP/1.1 GET</span>
        </div>
      </div>

      {/* Response Display Box */}
      <div className="bg-white border border-stone-300 rounded-lg shadow-sm overflow-hidden">
        {/* Response Top Bar */}
        <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-stone-700">Hasil Respons Server:</span>
            {getStatusBadge(currentResponse.statusCode)}
            <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{currentResponse.latencyMs} ms</span>
            </span>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('diagnosis')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeSubTab === 'diagnosis' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Diagnosis & Solusi
            </button>
            <button
              onClick={() => setActiveSubTab('headers')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeSubTab === 'headers' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Headers ({Object.keys(currentResponse.headers).length})
            </button>
            <button
              onClick={() => setActiveSubTab('body')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeSubTab === 'body' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Isi Body
            </button>
          </div>
        </div>

        {/* Response Content Panels */}
        <div className="p-5">
          {activeSubTab === 'diagnosis' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                  Apa yang Terjadi di Balik Layar?
                </h4>
                <p className="text-sm text-stone-800 leading-relaxed font-sans">
                  {currentResponse.diagnosis}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-800 mb-1">
                  Solusi Praktis di Kode Python Anda:
                </h4>
                <p className="text-sm text-amber-950 font-medium leading-relaxed font-sans">
                  👉 {currentResponse.remedy}
                </p>
              </div>

              {/* Practical Python Handling Code */}
              <div className="bg-[#101725] rounded-lg p-4 text-stone-200 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 font-mono text-[11px] text-stone-400">
                  <span>Implementasi Error Handling di Python</span>
                  <button
                    onClick={copyPython}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[12px] text-sky-200/90 leading-relaxed overflow-x-auto whitespace-pre">
                  {pythonSnippet}
                </pre>
              </div>
            </div>
          )}

          {activeSubTab === 'headers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 font-mono text-[11px] text-stone-600">
                    <th className="py-2.5 px-3 w-1/3">Nama Header</th>
                    <th className="py-2.5 px-3">Nilai Header</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-stone-800">
                  {Object.entries(currentResponse.headers).map(([k, v]) => (
                    <tr key={k} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-semibold text-stone-600">{k}</td>
                      <td className="py-2.5 px-3 text-stone-900 bg-stone-50/40">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSubTab === 'body' && (
            <div className="bg-[#121824] rounded-lg p-4 text-stone-200 text-xs font-mono max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-[11px] text-stone-400">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  <span>response.text (Mentah)</span>
                </span>
                <span>{currentResponse.responseBody.length} karakter</span>
              </div>
              <pre className="text-emerald-300 text-[11px] leading-relaxed whitespace-pre overflow-x-auto">
                {currentResponse.responseBody}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
