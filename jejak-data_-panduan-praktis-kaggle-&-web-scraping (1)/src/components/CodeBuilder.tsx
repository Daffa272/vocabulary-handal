import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Sparkles, BookOpen, Clock, FileSpreadsheet } from 'lucide-react';

export const CodeBuilder: React.FC = () => {
  const [sourceType, setSourceType] = useState<'books' | 'quotes' | 'kaggle'>('books');
  const [pageCount, setPageCount] = useState<number>(3);
  const [delaySeconds, setDelaySeconds] = useState<number>(2);
  const [outputFormat, setOutputFormat] = useState<'csv' | 'json' | 'print'>('csv');
  const [outputFilename, setOutputFilename] = useState<string>('hasil_koleksi_data');
  const [includeRating, setIncludeRating] = useState<boolean>(true);
  const [includeStock, setIncludeStock] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Generate python script dynamically
  const generatePythonScript = (): string => {
    if (sourceType === 'kaggle') {
      return `"""
Pengunduh Dataset Otomatis Kaggle
Dibuat dengan Jejak Data Code Builder
============================================================
"""
import os
import sys

# 1. Pastikan library kagglehub terpasang
try:
    import kagglehub
    import pandas as pd
except ModuleNotFoundError as e:
    print(f"❌ Pustaka belum lengkap: {e}")
    print("👉 Pasang dengan: pip install kagglehub pandas")
    sys.exit(1)

def main():
    print("🚀 Mengunduh dataset dari Kaggle...")
    # Masukkan slug dataset yang Anda inginkan dari Kaggle (contoh: zynicide/wine-reviews)
    dataset_slug = "zynicide/wine-reviews"
    
    try:
        # kagglehub otomatis mencari kaggle.json di C:\\Users\\<Nama>\\.kaggle\\
        folder_path = kagglehub.dataset_download(dataset_slug)
        print(f" Dataset berhasil diunduh ke: {folder_path}")
        
        # Cari file CSV di dalam folder yang diunduh
        files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]
        if files:
            file_pertama = os.path.join(folder_path, files[0])
            print(f" Membaca file pertama: {files[0]} ...")
            df = pd.read_csv(file_pertama)
            print("\\n--- 5 Baris Pertama Data ---")
            print(df.head())
        else:
            print(f"Daftar file di folder: {os.listdir(folder_path)}")
            
    except Exception as err:
        print(f"❌ Terjadi kesalahan: {err}")
        print("💡 Pastikan file kaggle.json sudah ada di C:\\\\Users\\\\<NamaUser>\\\\.kaggle\\\\kaggle.json")

if __name__ == "__main__":
    main()
`;
    }

    if (sourceType === 'quotes') {
      return `"""
Scraper Quotes to Scrape Multi-Halaman
Dibuat dengan Jejak Data Code Builder
============================================================
"""
import sys
import time
import requests
from bs4 import BeautifulSoup

${outputFormat === 'csv' ? 'import pandas as pd\n' : ''}${outputFormat === 'json' ? 'import json\n' : ''}
def scrape_quotes():
    base_url = "http://quotes.toscrape.com/page/{}/"
    headers = {
        "User-Agent": "EksplorasiDataPemula/1.0 (Pembelajaran Santun; Windows 10)"
    }
    
    hasil_kutipan = []
    total_halaman = ${pageCount}
    jeda_waktu = ${delaySeconds}

    print(f"Memulai scraping {total_halaman} halaman kutipan...")

    for hal in range(1, total_halaman + 1):
        target_url = base_url.format(hal)
        print(f"\\n Mengambil Halaman {hal}: {target_url}")

        try:
            resp = requests.get(target_url, headers=headers, timeout=10)
            if resp.status_code == 404:
                print(f"   ℹ️ Halaman {hal} tidak ditemukan. Mengakhiri loop.")
                break
            resp.raise_for_status()
        except Exception as e:
            print(f"   ❌ Gagal memuat halaman: {e}")
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        kotak_quotes = soup.select("div.quote")

        for item in kotak_quotes:
            teks = item.select_one("span.text").get_text(strip=True)
            penulis = item.select_one("small.author").get_text(strip=True)
            tags = [t.get_text(strip=True) for t in item.select("div.tags a.tag")]

            hasil_kutipan.append({
                "halaman": hal,
                "penulis": penulis,
                "kutipan": teks,
                "tags": ", ".join(tags)
            })

        print(f"    Berhasil mengekstrak {len(kotak_quotes)} kutipan dari halaman ini.")

        if hal < total_halaman:
            print(f"⏳ Memberi jeda {jeda_waktu} detik (Etika Rate Limiting)...")
            time.sleep(jeda_waktu)

    print(f"\\n🎉 Total seluruh data terkumpul: {len(hasil_kutipan)} kutipan.")

    ${
      outputFormat === 'csv'
        ? `# Simpan hasil ke CSV dengan Pandas
    df = pd.DataFrame(hasil_kutipan)
    nama_file = "${outputFilename}.csv"
    df.to_csv(nama_file, index=False, encoding="utf-8")
    print(f" Data berhasil disimpan ke: {nama_file}")
    print(df.head())`
        : outputFormat === 'json'
        ? `# Simpan hasil ke file JSON
    nama_file = "${outputFilename}.json"
    with open(nama_file, "w", encoding="utf-8") as f:
        json.dump(hasil_kutipan, f, ensure_ascii=False, indent=2)
    print(f" Data berhasil disimpan ke: {nama_file}")`
        : `# Tampilkan 5 contoh pertama ke terminal
    for i, q in enumerate(hasil_kutipan[:5], 1):
        print(f"{i}. {q['penulis']}: \\"{q['kutipan'][:50]}...\\"")`
    }

if __name__ == "__main__":
    scrape_quotes()
`;
    }

    // Default: Books to scrape
    return `"""
Scraper Books to Scrape Multi-Halaman
Dibuat dengan Jejak Data Code Builder
============================================================
Target: http://books.toscrape.com/
"""
import sys
import time
import requests
from bs4 import BeautifulSoup

${outputFormat === 'csv' ? 'import pandas as pd\n' : ''}${outputFormat === 'json' ? 'import json\n' : ''}
# Peta rating kata ke angka
RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}

def ambil_rating(pod):
    tag = pod.select_one("p.star-rating")
    if not tag:
        return 0
    for cls in tag.get("class", []):
        if cls in RATING_MAP:
            return RATING_MAP[cls]
    return 0

def scrape_katalog_buku():
    base_url = "http://books.toscrape.com/catalogue/page-{}.html"
    headers = {
        "User-Agent": "PraktekScraperPemula/1.0 (Edukasi Data)"
    }

    koleksi_buku = []
    jumlah_halaman = ${pageCount}
    jeda_antar_halaman = ${delaySeconds}

    print(f"Mulai scraping {jumlah_halaman} halaman katalog buku...")

    for hal in range(1, jumlah_halaman + 1):
        url = base_url.format(hal)
        print(f"\\n Menjelajah Halaman {hal}: {url}")

        try:
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 404:
                print("   ℹ️ Halaman 404 tercapai, selesai.")
                break
            resp.raise_for_status()
        except Exception as e:
            print(f"   ❌ Gagal: {e}")
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        daftar_pod = soup.select("article.product_pod")

        for pod in daftar_pod:
            # Judul lengkap
            tag_link = pod.select_one("h3 a")
            judul = tag_link["title"] if (tag_link and "title" in tag_link.attrs) else (tag_link.get_text() if tag_link else "N/A")

            # Harga numerik
            tag_harga = pod.select_one("p.price_color")
            harga_teks = tag_harga.get_text(strip=True).replace("£", "") if tag_harga else "0.0"
            try:
                harga_angka = float(harga_teks)
            except ValueError:
                harga_angka = 0.0

            item = {
                "halaman": hal,
                "judul": judul,
                "harga_gbp": harga_angka,
            }

            ${includeRating ? `item["rating_bintang"] = ambil_rating(pod)\n` : ''}
            ${includeStock ? `item["ketersediaan"] = "In stock" in pod.select_one("p.instock").get_text()\n` : ''}

            koleksi_buku.append(item)

        print(f"    Terekstrak {len(daftar_pod)} buku dari halaman {hal}.")

        if hal < jumlah_halaman:
            print(f"⏳ Jeda santun {jeda_antar_halaman} detik...")
            time.sleep(jeda_antar_halaman)

    print(f"\\n Total buku terkumpul: {len(koleksi_buku)} buku.")

    ${
      outputFormat === 'csv'
        ? `# Simpan hasil ke file CSV dengan Pandas
    df = pd.DataFrame(koleksi_buku)
    nama_file = "${outputFilename}.csv"
    df.to_csv(nama_file, index=False, encoding="utf-8")
    print(f" Disimpan ke: {nama_file}")
    print("\\nRingkasan 5 buku pertama:")
    print(df.head())`
        : outputFormat === 'json'
        ? `# Simpan ke file JSON
    nama_file = "${outputFilename}.json"
    with open(nama_file, "w", encoding="utf-8") as f:
        json.dump(koleksi_buku, f, ensure_ascii=False, indent=2)
    print(f" Disimpan ke: {nama_file}")`
        : `# Tampilkan ke konsol
    for b in koleksi_buku[:5]:
        print(f"- {b['judul']} -> £{b['harga_gbp']}")`
    }

if __name__ == "__main__":
    scrape_katalog_buku()
`;
  };

  const currentCode = generatePythonScript();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outputFilename}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Perakit Kode Otomatis (Code Builder)</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Rancang Skrip Python Anda Sendiri
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Pilih target sumber data, tentukan kedalaman halaman, jeda rate limiting, dan format penyimpanan.
              Skrip Python utuh yang bersih dan ber-komentar bahasa Indonesia akan tersusun otomatis secara instan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Options on Left, Code Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Configurator Controls */}
        <div className="lg:col-span-5 bg-white border border-stone-300 rounded-lg p-5 shadow-sm space-y-5">
          
          {/* 1. Target Data Source */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
              1. Pilih Sumber Data
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSourceType('books')}
                className={`p-2.5 rounded border text-left text-xs transition-all cursor-pointer ${
                  sourceType === 'books'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-semibold text-stone-900">Books to Scrape (Katalog Buku)</div>
                <div className="text-[11px] text-stone-500">books.toscrape.com · Statis & Ramah Pemula</div>
              </button>

              <button
                onClick={() => setSourceType('quotes')}
                className={`p-2.5 rounded border text-left text-xs transition-all cursor-pointer ${
                  sourceType === 'quotes'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-semibold text-stone-900">Quotes to Scrape (Kutipan Tokoh)</div>
                <div className="text-[11px] text-stone-500">quotes.toscrape.com · Teks & Tag Penulis</div>
              </button>

              <button
                onClick={() => setSourceType('kaggle')}
                className={`p-2.5 rounded border text-left text-xs transition-all cursor-pointer ${
                  sourceType === 'kaggle'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-semibold text-stone-900">Kaggle API & kagglehub</div>
                <div className="text-[11px] text-stone-500">Dataset resmi terstruktur · Otomatis lewat token</div>
              </button>
            </div>
          </div>

          {/* Conditional Options for Scraping */}
          {sourceType !== 'kaggle' && (
            <>
              {/* 2. Page Count (Pagination) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2 flex items-center justify-between">
                  <span>2. Jumlah Halaman (Pagination)</span>
                  <span className="text-amber-700 font-bold">{pageCount} Halaman</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPageCount(num)}
                      className={`py-2 px-3 text-xs font-mono rounded border transition-colors cursor-pointer ${
                        pageCount === num
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {num === 1 ? '1 Hal (Cepat)' : `${num} Halaman`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Rate Limiting Delay */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>3. Jeda Sopan (time.sleep)</span>
                  </span>
                  <span className="text-amber-700 font-bold">{delaySeconds} Detik</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setDelaySeconds(sec)}
                      className={`py-2 px-3 text-xs font-mono rounded border transition-colors cursor-pointer ${
                        delaySeconds === sec
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {sec} Detik {sec === 2 ? '(Ideal)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Column Fields (only for books) */}
              {sourceType === 'books' && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
                    4. Bidang Tambahan
                  </label>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includeRating}
                        onChange={(e) => setIncludeRating(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Konversi Rating Bintang ke Angka (1-5)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includeStock}
                        onChange={(e) => setIncludeStock(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Periksa Status Ketersediaan Stok</span>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 5. Output Format */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
              {sourceType === 'kaggle' ? '2' : '5'}. Format Penyimpanan Data
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setOutputFormat('csv')}
                className={`py-2 px-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  outputFormat === 'csv'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                CSV (Pandas)
              </button>
              <button
                onClick={() => setOutputFormat('json')}
                className={`py-2 px-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  outputFormat === 'json'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                File JSON
              </button>
              <button
                onClick={() => setOutputFormat('print')}
                className={`py-2 px-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  outputFormat === 'print'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Cetak Terminal
              </button>
            </div>
          </div>

          {/* 6. Output Filename */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1.5">
              Nama File Simpanan
            </label>
            <div className="flex items-center bg-stone-50 border border-stone-300 rounded px-3 py-1.5 text-xs font-mono">
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-stone-900"
              />
              <span className="text-stone-500 font-bold">.{outputFormat === 'print' ? 'py' : outputFormat}</span>
            </div>
          </div>

        </div>

        {/* RIGHT: Live Generated Python Code Panel */}
        <div className="lg:col-span-7 bg-[#101725] border border-stone-800 rounded-lg shadow-sm overflow-hidden text-stone-200 flex flex-col">
          {/* Header Bar */}
          <div className="bg-[#0b101a] px-4 py-3 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-stone-300">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>{outputFilename}.py</span>
              <span className="text-stone-500">· Python 3.x</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors cursor-pointer font-medium"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>

              <button
                onClick={handleDownloadPy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .py</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 max-h-[550px] overflow-y-auto">
            <pre className="font-mono text-xs leading-relaxed text-sky-200/90 whitespace-pre overflow-x-auto">
              {currentCode}
            </pre>
          </div>

          {/* Quick Terminal Guide Footer */}
          <div className="bg-[#0b101a] px-4 py-3 border-t border-stone-800 text-[11px] font-mono text-stone-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>Perintah jalan di Windows:</span>
            <code className="text-amber-300 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
              python {outputFilename}.py
            </code>
          </div>
        </div>

      </div>
    </div>
  );
};
