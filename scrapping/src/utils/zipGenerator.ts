import JSZip from 'jszip';
import { SCRIPT_FILES } from '../data/scriptsData';

export async function generateAndDownloadZip(): Promise<void> {
  const zip = new JSZip();

  // 1. Root files: README.md and JALANKAN.bat (CRLF line endings)
  const readme = SCRIPT_FILES.find((f) => f.filename === 'README.md')?.code || '';
  const bat = (SCRIPT_FILES.find((f) => f.filename === 'JALANKAN.bat')?.code || '').replace(/\r?\n/g, '\r\n');

  zip.file('README.md', readme);
  zip.file('JALANKAN.bat', bat);

  // 2. Folder latihan/
  const latihanFolder = zip.folder('latihan');
  if (latihanFolder) {
    for (const file of SCRIPT_FILES) {
      if (file.filename !== 'README.md' && file.filename !== 'JALANKAN.bat') {
        latihanFolder.file(file.filename, file.code);
      }
    }
  }

  // 3. CSS Folder
  const cssFolder = zip.folder('css');
  if (cssFolder) {
    cssFolder.file('style.css', `/* Jejak Data - Lembar Gaya Standar */
:root {
  --bg: #f8f8f6;
  --surface: #ffffff;
  --ink: #1a1e24;
  --muted: #57606a;
  --border: #d0d7de;
  --primary: #0d1b2a;
  --accent: #b45309;
  --accent-light: #fef3c7;
  --emerald: #0f766e;
  --code-bg: #101725;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.6;
}
header {
  background: var(--primary);
  color: #fff;
  padding: 24px 20px;
  border-bottom: 3px solid var(--accent);
}
.header-inner { max-width: 1040px; margin: 0 auto; }
.kicker { font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 6px; }
h1 { font-size: 26px; font-weight: 700; }
.subtitle { color: #cbd5e1; font-size: 14px; margin-top: 4px; }
.container { max-width: 1040px; margin: 0 auto; padding: 24px 20px; }
.notice { background: var(--accent-light); border-left: 4px solid var(--accent); padding: 12px 16px; border-radius: 0 4px 4px 0; margin-bottom: 24px; font-size: 13px; color: #78350f; }
.nav-tabs { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 24px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
.tab-btn { padding: 8px 16px; font-size: 13px; font-weight: 600; border: 1px solid var(--border); background: var(--surface); color: var(--ink); border-radius: 6px; cursor: pointer; white-space: nowrap; }
.tab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.tab-content { display: none; }
.tab-content.active { display: block; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
.card h2 { font-size: 18px; color: var(--primary); margin-bottom: 10px; }
.card p { font-size: 14px; color: var(--ink); margin-bottom: 12px; }
.code-box { background: var(--code-bg); color: #bae6fd; padding: 14px; border-radius: 6px; font-family: "Consolas", monospace; font-size: 12px; overflow-x: auto; margin: 12px 0; line-height: 1.5; }
.btn { display: inline-block; padding: 8px 16px; background: var(--accent); color: #fff; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; cursor: pointer; border: none; }
.btn:hover { opacity: 0.9; }
footer { text-align: center; padding: 32px 20px; color: var(--muted); font-size: 12px; border-top: 1px solid var(--border); margin-top: 40px; }
`);
  }

  // 4. JS Folder (one script per module + simulator)
  const jsFolder = zip.folder('js');
  if (jsFolder) {
    jsFolder.file('modul1.js', `// Modul 1: Peta Sumber Data (Kaggle vs API vs Scraping)
console.log("Modul 1 dimuat: Peta Data");
`);
    jsFolder.file('modul2.js', `// Modul 2: Kaggle Langkah demi Langkah & Pandas
console.log("Modul 2 dimuat: Kaggle & Pandas");
`);
    jsFolder.file('modul3.js', `// Modul 3: Dasar HTML & Inspect Element
console.log("Modul 3 dimuat: Dasar HTML");
`);
    jsFolder.file('modul4.js', `// Modul 4: Scraping dengan requests & BeautifulSoup
console.log("Modul 4 dimuat: requests & bs4");
`);
    jsFolder.file('modul5.js', `// Modul 5: Pagination, JavaScript SPA & Error Handling
console.log("Modul 5 dimuat: Kasus Sulit & Error Handling");
`);
    jsFolder.file('modul6.js', `// Modul 6: Etika, robots.txt & UU PDP
console.log("Modul 6 dimuat: Etika & Hukum");
`);
    jsFolder.file('app.js', `// Inisialisasi navigasi tab dan interaksi website offline
document.addEventListener("DOMContentLoaded", function() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      const target = this.dataset.target;
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add("active");
    });
  });
});
`);
  }

  // 5. Root index.html
  const staticIndexHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jejak Data: Panduan Kaggle & Web Scraping (Offline)</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="kicker">Catatan Ekspedisi Data · Panduan Mandiri</div>
      <h1>Jejak Data: Kaggle & Web Scraping untuk Pemula</h1>
      <p class="subtitle">Panduan langsung, skrip siap pakai Python di Windows, dan prinsip etika data digital.</p>
    </div>
  </header>

  <main class="container">
    <div class="notice">
      <strong>📁 Paket Latihan Lokal:</strong> Seluruh skrip Python siap pakai telah tersedia di folder <code>latihan/</code> di dalam arsip ini. Anda dapat menjalankannya di Command Prompt Windows setelah memasang dependensi dari <code>requirements.txt</code>.
    </div>

    <!-- Navigation Tabs -->
    <nav class="nav-tabs">
      <button class="tab-btn active" data-target="tab-ringkasan">Ringkasan 6 Modul</button>
      <button class="tab-btn" data-target="tab-windows">Panduan Windows</button>
      <button class="tab-btn" data-target="tab-latihan">Daftar Skrip Latihan</button>
      <button class="tab-btn" data-target="tab-etika">Checklist Etika & UU PDP</button>
    </nav>

    <!-- Content 1: 6 Modul Ringkasan -->
    <section id="tab-ringkasan" class="tab-content active">
      <div class="card">
        <h2>Modul 1: Peta Data — Dari Mana Data Berasal</h2>
        <p>Bandingkan 3 jalur perolehan data: Kaggle (dataset siap pakai), API Resmi (terstruktur & legal), dan Web Scraping (pilihan terakhir). Utamakan selalu Kaggle & API resmi sebelum scraping.</p>
        <div class="code-box">Hierarki Rekayasa: Dataset Kaggle &rarr; API Resmi &rarr; Web Scraping Mandiri</div>
      </div>

      <div class="card">
        <h2>Modul 2: Kaggle Langkah demi Langkah & Pandas</h2>
        <p>Membuat akun di kaggle.com, mengunduh token <code>kaggle.json</code> dan meletakkannya di <code>C:\\Users\\&lt;Nama&gt;\\.kaggle\\kaggle.json</code>. Membuka file CSV dengan Pandas menggunakan <code>df.head()</code>, <code>df.info()</code>, dan <code>df.describe()</code>.</p>
        <div class="code-box">import kagglehub&#10;path = kagglehub.dataset_download("zynicide/wine-reviews")&#10;&#10;import pandas as pd&#10;df = pd.read_csv("contoh_buku.csv")&#10;print(df.head())</div>
      </div>

      <div class="card">
        <h2>Modul 3: Dasar HTML untuk Web Scraping</h2>
        <p>Memahami struktur tag, atribut (seperti <code>title</code> untuk teks lengkap), class, dan id. Menggunakan Inspect Element (F12 di browser) dan merumuskan CSS selector yang tepat.</p>
        <div class="code-box">soup.select("article.product_pod h3 a")&#10;tag["title"] # Mengambil atribut judul tersembunyi</div>
      </div>

      <div class="card">
        <h2>Modul 4: Scraping dengan requests & BeautifulSoup</h2>
        <p>Alur kerja 4 langkah: Kirim HTTP GET &rarr; Periksa status_code 200 &rarr; Parsing teks dengan BeautifulSoup &rarr; Simpan data ke CSV. Berjalan terhadap situs latihan legal: <code>books.toscrape.com</code> dan <code>quotes.toscrape.com</code>.</p>
        <div class="code-box">response = requests.get(url, headers={"User-Agent": "LatihanPemula/1.0"})&#10;soup = BeautifulSoup(response.text, "html.parser")</div>
      </div>

      <div class="card">
        <h2>Modul 5: Kasus Sulit, Pagination & Status Codes</h2>
        <p>Scraping multi-halaman dengan <code>time.sleep(2)</code>, memahami keterbatasan requests pada situs berbasis JavaScript (SPA/React), serta penanganan status code 200, 404, 403 (Forbidden), dan 429 (Too Many Requests).</p>
        <div class="code-box">if response.status_code == 404: break # Batas akhir pagination&#10;time.sleep(2) # Santun kepada server target</div>
      </div>

      <div class="card">
        <h2>Modul 6: Etika, robots.txt & UU PDP di Indonesia</h2>
        <p>Membaca aturan <code>robots.txt</code>, Terms of Service, prinsip UU Perlindungan Data Pribadi No. 27/2022 (larangan mengumpulkan data pribadi sensitif), dan prinsip sopan santun digital.</p>
        <div class="code-box">User-agent: *&#10;Disallow: /admin/&#10;Crawl-delay: 3</div>
      </div>
    </section>

    <!-- Content 2: Panduan Windows -->
    <section id="tab-windows" class="tab-content">
      <div class="card">
        <h2>Langkah Menjalankan Kode di Komputer Windows</h2>
        <ol style="padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li><strong>Pasang Python:</strong> Unduh dari python.org/downloads. Saat menginstal, <strong>CENTANG: "Add python.exe to PATH"</strong>.</li>
          <li><strong>Buka Terminal:</strong> Tekan <code>Win + R</code>, ketik <code>cmd</code>, tekan Enter.</li>
          <li><strong>Masuk ke Folder Latihan:</strong> Masuk ke folder skrip dengan perintah:
            <div class="code-box">cd latihan</div>
          </li>
          <li><strong>Pasang Library yang Dibutuhkan:</strong>
            <div class="code-box">pip install -r requirements.txt</div>
          </li>
          <li><strong>Jalankan Skrip:</strong>
            <div class="code-box">python 01_baca_csv.py&#10;python 03_scrape_satu_halaman.py&#10;python 05_simpan_ke_csv.py</div>
          </li>
        </ol>
      </div>

      <div class="card">
        <h2>Solusi Masalah Umum di Windows</h2>
        <p><strong>Pesan: 'python' is not recognized:</strong> Centang opsi PATH belum aktif. Jalankan ulang installer Python dan pilih Modify &rarr; Add Python to environment variables.</p>
        <p><strong>Pesan: 403 Forbidden:</strong> Tambahkan header <code>User-Agent</code> yang ramah pada pemanggilan requests.get().</p>
        <p><strong>Pesan: UnicodeDecodeError:</strong> Gunakan <code>pd.read_csv("file.csv", encoding="utf-8")</code> atau <code>encoding="latin1"</code>.</p>
      </div>
    </section>

    <!-- Content 3: Daftar Skrip Latihan -->
    <section id="tab-latihan" class="tab-content">
      <div class="card">
        <h2>5 Skrip Python Bertingkat di Folder <code>latihan/</code></h2>
        <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li><code>01_baca_csv.py</code>: Membaca file CSV dengan pandas, mengecek head(), info(), dan describe().</li>
          <li><code>02_kaggle_api.py</code>: Mengunduh dataset via Kagglehub atau Kaggle CLI dengan verifikasi kredensial.</li>
          <li><code>03_scrape_satu_halaman.py</code>: Mengambil kutipan dari quotes.toscrape.com satu halaman dengan requests + BeautifulSoup.</li>
          <li><code>04_scrape_banyak_halaman.py</code>: Scraping 3 halaman pagination dengan loop, URL format, dan delay time.sleep(2).</li>
          <li><code>05_simpan_ke_csv.py</code>: Mengambil judul, harga, dan rating buku lalu menyimpannya ke hasil_scrape_buku.csv.</li>
        </ul>
      </div>
    </section>

    <!-- Content 4: Etika -->
    <section id="tab-etika" class="tab-content">
      <div class="card">
        <h2>Checklist Sopan Santun Praktisi Data</h2>
        <p>1. Apakah data memuat data pribadi sensitif (KTP, nomor HP, email pribadi, rekam medis)? <strong>DILARANG KERAS.</strong></p>
        <p>2. Apakah jalur URL dilarang dalam file <code>robots.txt</code>? <strong>Patuhi larangan Disallow.</strong></p>
        <p>3. Apakah scraper Anda menyertakan jeda waktu (time.sleep)? <strong>Wajib minimal 1-2 detik.</strong></p>
        <p>4. Apakah situs sudah menyediakan API resmi atau dataset Kaggle? <strong>Utamakan API resmi.</strong></p>
      </div>
    </section>
  </main>

  <footer>
    <p>Jejak Data · Panduan Pembelajaran Mandiri untuk Pemula Indonesia · 2026</p>
  </footer>

  <script src="js/modul1.js"></script>
  <script src="js/modul2.js"></script>
  <script src="js/modul3.js"></script>
  <script src="js/modul4.js"></script>
  <script src="js/modul5.js"></script>
  <script src="js/modul6.js"></script>
  <script src="js/app.js"></script>
</body>
</html>`;

  zip.file('index.html', staticIndexHtml);

  // 6. Generate the Blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = 'jejak-data-ambil-data.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

