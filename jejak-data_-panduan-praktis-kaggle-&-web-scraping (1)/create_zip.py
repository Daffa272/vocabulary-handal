import os
import zipfile
import shutil

# Root destination
zip_filename = "jejak-data-ambil-data.zip"
temp_dir = "jejak-data-ambil-data"

if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)

os.makedirs(os.path.join(temp_dir, "css"), exist_ok=True)
os.makedirs(os.path.join(temp_dir, "js"), exist_ok=True)
os.makedirs(os.path.join(temp_dir, "latihan"), exist_ok=True)

# 1. README.md
readme_content = """# Jejak Data: Panduan Praktis Kaggle & Web Scraping untuk Pemula

Selamat datang di paket pembelajaran hands-on **Jejak Data**. Paket ini dirancang khusus untuk pemula yang ingin belajar cara mengambil data dari internet menggunakan Python di sistem operasi **Windows**.

---

## 📂 Struktur Isi Paket

```
jejak-data-ambil-data/
├── index.html              <- Website pembelajaran utama (buka langsung di browser)
├── css/
│   └── style.css           <- Gaya tampilan responsif & modern
├── js/
│   ├── modul1.js           <- Skrip interaksi modul 1
│   ├── modul2.js           <- Skrip interaksi modul 2
│   ├── modul3.js           <- Skrip interaksi modul 3
│   ├── modul4.js           <- Skrip interaksi modul 4
│   ├── modul5.js           <- Skrip interaksi modul 5
│   ├── modul6.js           <- Skrip interaksi modul 6
│   └── app.js              <- Pengendali navigasi tab
├── latihan/                <- Kumpulan skrip Python bertingkat
│   ├── 01_baca_csv.py             <- Latihan 1: Buka & periksa CSV dengan Pandas
│   ├── 02_kaggle_api.py           <- Latihan 2: Unduh dataset Kaggle otomatis
│   ├── 03_scrape_satu_halaman.py  <- Latihan 3: Scrape quotes dengan requests + bs4
│   ├── 04_scrape_banyak_halaman.py<- Latihan 4: Pagination & delay time.sleep
│   ├── 05_simpan_ke_csv.py        <- Latihan 5: Scraping penuh & simpan ke CSV
│   ├── contoh_buku.csv            <- Data latihan awal
│   └── requirements.txt           <- Daftar library yang dibutuhkan
├── JALANKAN.bat            <- Pintasan otomatis untuk menjalankan website di Windows
└── README.md               <- Panduan ini
```

---

## 🚀 Cara Membuka Website Pembelajaran

Anda memiliki 2 cara mudah:
1. **Cara Tercepat:** Klik dua kali pada file `index.html`. Halaman akan langsung terbuka di browser Anda (Chrome, Edge, Firefox) tanpa butuh koneksi internet!
2. **Cara Otomatis (Direkomendasikan):** Klik dua kali pada `JALANKAN.bat`. Skrip ini akan mendeteksi apakah Python tersedia, menjalankan server lokal ringan, dan membuka browser secara otomatis.

---

## 💻 Panduan Menjalankan Kode Python di Windows

### Langkah 1: Memasang Python di Windows
1. Unduh installer resmi dari https://www.python.org/downloads/.
2. **PENTING (Sering Terlewatkan):** Saat jendela installer muncul, **CENTANG** kotak bertuliskan:
   `☑ Add python.exe to PATH`
3. Klik **Install Now**, tunggu hingga selesai, lalu klik **Close**.

### Langkah 2: Membuka Terminal / Command Prompt
1. Tekan tombol `Windows + R` di keyboard, ketik `cmd`, lalu tekan **Enter**.
2. Masuk ke folder latihan ini, contoh:
   ```cmd
   cd latihan
   ```

### Langkah 3: Membuat Lingkungan Virtual (Virtual Environment - Rekomendasi)
```cmd
python -m venv venv
venv\\Scripts\\activate
```
*(Jika aktif, akan muncul tanda `(venv)` di awal baris terminal Anda).*

### Langkah 4: Memasang Library yang Dibutuhkan
```cmd
pip install -r requirements.txt
```

### Langkah 5: Menjalankan Skrip Latihan
Jalankan satu per satu sesuai nomor urut:
```cmd
python 01_baca_csv.py
python 02_kaggle_api.py
python 03_scrape_satu_halaman.py
python 04_scrape_banyak_halaman.py
python 05_simpan_ke_csv.py
```

---

## 🔑 Cara Menyiapkan Kaggle API Token

Agar bisa mengunduh jutaan dataset gratis secara otomatis lewat skrip Python:
1. Buat akun gratis di https://www.kaggle.com.
2. Klik foto profil Anda di pojok kanan atas -> pilih **Settings**.
3. Gulir ke bawah hingga bagian **API**.
4. Klik tombol **Create New Token**. Sebuah file bernama `kaggle.json` akan terunduh.
5. Pindahkan file tersebut ke folder rahasia pengguna Windows Anda:
   `C:\\Users\\<NamaUserAnda>\\.kaggle\\kaggle.json`

---

## 🛠️ Bagian "Kalau Error": Solusi Masalah Umum

### 1. Pesan: `'python' is not recognized as an internal or external command`
- **Penyebab:** Kotak "Add Python to PATH" belum dicentang saat instalasi Python.
- **Solusi:** Jalankan kembali installer Python, pilih opsi **Modify**, lalu pastikan opsi **Add Python to environment variables** tercentang.

### 2. Pesan: `ModuleNotFoundError: No module named 'requests'` atau `'bs4'`
- **Penyebab:** Pustaka belum terpasang di Python yang sedang aktif.
- **Solusi:** `pip install requests beautifulsoup4 pandas kagglehub`

### 3. Pesan: `403 Forbidden` saat mengakses web atau Kaggle
- **Penyebab Web Scraping:** Server menolak permintaan bot karena tidak menyertakan User-Agent yang ramah.
- **Solusi Web:** Tambahkan header `User-Agent` seperti pada contoh skrip 03 & 04.

### 4. Pesan: `UnicodeDecodeError: 'charmap' codec can't decode byte ...`
- **Penyebab:** Windows terkadang memakai encoding lokal default (cp1252).
- **Solusi:** Selalu tambahkan argumen `encoding='utf-8'` pada fungsi `pd.read_csv()`. Jika masih gagal, gunakan `encoding='latin1'`.
"""

with open(os.path.join(temp_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme_content)

# 2. JALANKAN.bat (CRLF)
bat_content = """@echo off
chcp 65001 >nul
title Jejak Data - Panduan Kaggle & Web Scraping

echo ==========================================================
echo        JEJAK DATA: PANDUAN KAGGLE & WEB SCRAPING
echo ==========================================================
echo Memeriksa instalasi Python di komputer Anda...
echo.

where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python terdeteksi!
    echo Membuka website melalui server lokal Python di port 8000...
    echo Tekan CTRL+C di jendela ini jika ingin menghentikan server.
    echo.
    start http://localhost:8000/
    python -m http.server 8000
) else (
    echo [INFO] Python tidak ditemukan di PATH sistem.
    echo Membuka website langsung di browser default Anda...
    echo.
    start index.html
)

pause
"""
# Ensure CRLF line endings
with open(os.path.join(temp_dir, "JALANKAN.bat"), "wb") as f:
    f.write(bat_content.replace("\r\n", "\n").replace("\n", "\r\n").encode("utf-8"))

# 3. latihan scripts
scripts = {
    "01_baca_csv.py": '''"""
01_baca_csv.py
==============================================================
Langkah Pertama: Membaca & Memeriksa File CSV Menggunakan Pandas
Tingkat Kesulitan: Sangat Mudah (Pemula)
==============================================================
"""
import sys
import os

try:
    import pandas as pd
except ModuleNotFoundError:
    print("❌ ERROR: Library 'pandas' belum terpasang.")
    print("👉 Solusi di terminal Windows: pip install pandas")
    sys.exit(1)

def main():
    print("=" * 60)
    print("  MEMBACA DATASET DENGAN PANDAS")
    print("=" * 60)

    nama_file = "contoh_buku.csv"

    if not os.path.exists(nama_file):
        print(f"❌ File '{nama_file}' tidak ditemukan di folder ini!")
        print("💡 Pastikan Anda menjalankan skrip dari folder 'latihan'.")
        return

    try:
        print(f" Membaca file: {nama_file} ...")
        df = pd.read_csv(nama_file, encoding='utf-8')
    except UnicodeDecodeError:
        print("⚠️ File memiliki encoding selain UTF-8, mencoba 'latin1'...")
        df = pd.read_csv(nama_file, encoding='latin1')
    except Exception as e:
        print(f"❌ Terjadi kesalahan saat membaca CSV: {e}")
        return

    print(" Berhasil memuat data!\\n")

    print("1. Lima Baris Pertama (df.head()):")
    print("-" * 50)
    print(df.head())
    print("\\n" + "=" * 50)

    jumlah_baris, jumlah_kolom = df.shape
    print(f"2. Dimensi Data: {jumlah_baris} baris dan {jumlah_kolom} kolom\\n")

    print("3. Ringkasan Struktur & Tipe Data (df.info()):")
    print("-" * 50)
    df.info()
    print("\\n" + "=" * 50)

    print("4. Ringkasan Statistik Angka (df.describe()):")
    print("-" * 50)
    print(df.describe())
    print("\\n" + "=" * 50)

    if 'kategori' in df.columns:
        print("5. Distribusi Buku per Kategori:")
        print(df['kategori'].value_counts())

    print("\\n🎉 Selesai! Anda sudah berhasil membuka dan menganalisis dasar data CSV di Python.")

if __name__ == "__main__":
    main()
''',
    "02_kaggle_api.py": '''"""
02_kaggle_api.py
==============================================================
Mengunduh Dataset dari Kaggle Lewat Python (Kaggle API & kagglehub)
Tingkat Kesulitan: Mudah
Lokasi Token di Windows: C:\\Users\\<NamaUserAnda>\\.kaggle\\kaggle.json
==============================================================
"""
import os
import sys

def cek_kredensial_kaggle():
    home_dir = os.path.expanduser("~")
    kaggle_dir = os.path.join(home_dir, ".kaggle")
    kaggle_json = os.path.join(kaggle_dir, "kaggle.json")
    
    print(f"🔎 Memeriksa file token di: {kaggle_json}")
    if os.path.exists(kaggle_json):
        print(" Token 'kaggle.json' ditemukan!\\n")
        return True
    else:
        print("⚠️ File 'kaggle.json' BELUM ditemukan di folder pengguna Anda.")
        print("📌 Panduan Singkat:")
        print("   1. Buka kaggle.com -> Login -> Klik foto profil -> Settings")
        print("   2. Scroll ke bagian 'API' -> Klik tombol 'Create New Token'")
        print("   3. File 'kaggle.json' akan terunduh otomatis.")
        print(f"   4. Buat folder '{kaggle_dir}' dan pindahkan file tersebut ke sana.\\n")
        return False

def download_via_kagglehub():
    try:
        import kagglehub
    except ModuleNotFoundError:
        print("⚠️ Library 'kagglehub' belum terpasang.")
        print("👉 Jalankan: pip install kagglehub\\n")
        return

    print("🚀 Mengunduh dataset contoh menggunakan library kagglehub...")
    print("Contoh dataset: 'zynicide/wine-reviews'")
    
    try:
        path = kagglehub.dataset_download("zynicide/wine-reviews")
        print(f" Dataset berhasil diunduh ke folder lokal:")
        print(f"   📁 {path}")
        files = os.listdir(path)
        print(f"   📄 File yang tersedia: {files[:5]}")
    except Exception as e:
        print(f"❌ Gagal mengunduh dengan kagglehub: {e}")

def main():
    print("=" * 60)
    print("  PENGAMBILAN DATA VIA KAGGLE API")
    print("=" * 60)

    token_ada = cek_kredensial_kaggle()
    if token_ada:
        download_via_kagglehub()
    else:
        print("Perintah alternatif via terminal Windows:")
        print("  kaggle datasets download -d zynicide/wine-reviews --unzip")

if __name__ == "__main__":
    main()
''',
    "03_scrape_satu_halaman.py": '''"""
03_scrape_satu_halaman.py
==============================================================
Scraping Halaman Pertama: Mengambil Kutipan & Penulis
Target: http://quotes.toscrape.com/ (Situs resmi untuk latihan)
Library: requests, beautifulsoup4
==============================================================
"""
import sys
import requests
from bs4 import BeautifulSoup

def main():
    print("=" * 60)
    print("  SCRAPING DASAR: SATU HALAMAN QUOTES")
    print("=" * 60)

    url = "http://quotes.toscrape.com/"
    headers = {
        "User-Agent": "LatihanPemulaScraper/1.0 (Pendidikan Pembelajaran Data; Windows)"
    }

    print(f"1. Mengirim permintaan HTTP GET ke: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Terjadi kesalahan: {e}")
        return

    print("2. Parsing teks HTML dengan BeautifulSoup...")
    soup = BeautifulSoup(response.text, "html.parser")
    elemen_quotes = soup.select("div.quote")
    print(f"   Ditemukan {len(elemen_quotes)} elemen kutipan di halaman ini!\\n")

    for index, item in enumerate(elemen_quotes, start=1):
        tag_teks = item.select_one("span.text")
        teks_kutipan = tag_teks.get_text(strip=True) if tag_teks else "Tidak ada teks"

        tag_penulis = item.select_one("small.author")
        nama_penulis = tag_penulis.get_text(strip=True) if tag_penulis else "Anonim"

        print(f"[{index}] {nama_penulis}: {teks_kutipan[:60]}...")

    print("-" * 60)
    print(" Ekstraksi selesai dengan sukses!")

if __name__ == "__main__":
    main()
''',
    "04_scrape_banyak_halaman.py": '''"""
04_scrape_banyak_halaman.py
==============================================================
Scraping Banyak Halaman (Pagination) dengan Sopan (Rate Limiting)
Target: http://books.toscrape.com/
==============================================================
"""
import time
import requests
from bs4 import BeautifulSoup

def scrape_halaman(nomor_halaman):
    url = f"http://books.toscrape.com/catalogue/page-{nomor_halaman}.html"
    headers = {"User-Agent": "LatihanMultiPage/1.0"}

    print(f"🔍 Mengambil Halaman {nomor_halaman}: {url}")
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 404:
            print(f"   ℹ️ Halaman {nomor_halaman} tidak ditemukan (404). Akhir halaman.")
            return []
        resp.raise_for_status()
    except Exception as e:
        print(f"   ❌ Gagal: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    pods = soup.select("article.product_pod")

    daftar = []
    for pod in pods:
        link = pod.select_one("h3 a")
        judul = link["title"] if (link and "title" in link.attrs) else link.get_text()
        harga = pod.select_one("p.price_color").get_text(strip=True)
        daftar.append({"halaman": nomor_halaman, "judul": judul, "harga": harga})

    print(f"    Berhasil mengambil {len(daftar)} buku.")
    return daftar

def main():
    print("=" * 60)
    print("  SCRAPING MULTI-HALAMAN (PAGINATION)")
    print("=" * 60)

    total_data = []
    maks_halaman = 3
    jeda_detik = 2

    for hal in range(1, maks_halaman + 1):
        buku = scrape_halaman(hal)
        if not buku:
            break
        total_data.extend(buku)

        if hal < maks_halaman:
            print(f"⏳ Jeda sopan {jeda_detik} detik...")
            time.sleep(jeda_detik)

    print(f"\\n Selesai: Mengambil total {len(total_data)} buku dari {maks_halaman} halaman.")

if __name__ == "__main__":
    main()
''',
    "05_simpan_ke_csv.py": '''"""
05_simpan_ke_csv.py
==============================================================
Alur Penuh: Scraping Data -> Pembersihan Ringan -> Simpan ke CSV
Target: http://books.toscrape.com/
==============================================================
"""
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd

RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}

def bersihkan_harga(teks):
    return float(teks.replace("£", "").replace("$", "").strip())

def main():
    print("=" * 60)
    print("  SCRAPING LENGKAP & SIMPAN KE FILE CSV")
    print("=" * 60)

    url = "http://books.toscrape.com/catalogue/page-1.html"
    headers = {"User-Agent": "PenyimpanDataCSV/1.0"}

    print(f"1. Mengambil: {url} ...")
    resp = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(resp.text, "html.parser")
    pods = soup.select("article.product_pod")

    daftar_buku = []
    for pod in pods:
        link = pod.select_one("h3 a")
        judul = link["title"] if (link and "title" in link.attrs) else link.get_text()
        harga = bersihkan_harga(pod.select_one("p.price_color").get_text(strip=True))

        tag_rating = pod.select_one("p.star-rating")
        rating = 0
        if tag_rating:
            for c in tag_rating.get("class", []):
                if c in RATING_MAP:
                    rating = RATING_MAP[c]

        stok_teks = pod.select_one("p.instock.availability").get_text(strip=True)

        daftar_buku.append({
            "judul": judul,
            "harga_gbp": harga,
            "rating_bintang": rating,
            "tersedia": "In stock" in stok_teks
        })

    print(f"2. Mengonversi {len(daftar_buku)} buku ke DataFrame...")
    df = pd.DataFrame(daftar_buku)

    nama_file = "hasil_scrape_buku.csv"
    print(f"3. Menyimpan ke '{nama_file}'...")
    df.to_csv(nama_file, index=False, encoding="utf-8")

    print(f" BERHASIL! File tersimpan di: {os.path.abspath(nama_file)}")
    print(df.head())

if __name__ == "__main__":
    main()
''',
    "requirements.txt": """requests>=2.31.0
beautifulsoup4>=4.12.0
pandas>=2.0.0
kagglehub>=0.2.0
""",
    "contoh_buku.csv": """id,judul,kategori,harga_gbp,rating_bintang,tersedia,stok
1,"A Light in the Attic",Poetry,51.77,3,True,22
2,"Tipping the Velvet",Historical Fiction,53.74,1,True,20
3,"Soumission",Fiction,50.10,1,True,20
4,"Sharp Objects",Mystery,47.82,4,True,20
5,"Sapiens: A Brief History of Humankind",History,54.23,5,True,20
6,"The Requiem Red",Young Adult,22.65,1,True,19
7,"The Dirty Little Secrets of Getting Your Dream Job",Business,33.34,4,True,19
8,"The Coming Woman",Historical Fiction,17.93,3,True,19
9,"The Boys in the Boat",History,22.60,4,True,19
10,"The Black Maria",Poetry,52.15,1,True,19
"""
}

for name, content in scripts.items():
    with open(os.path.join(temp_dir, "latihan", name), "w", encoding="utf-8") as f:
        f.write(content)

# 4. css/style.css
css_content = """/* Jejak Data - Lembar Gaya Standar */
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
"""
with open(os.path.join(temp_dir, "css", "style.css"), "w", encoding="utf-8") as f:
    f.write(css_content)

# 5. js/ module files
js_modules = {
    "modul1.js": '// Modul 1: Peta Data\nconsole.log("Modul 1 dimuat");\n',
    "modul2.js": '// Modul 2: Kaggle & Pandas\nconsole.log("Modul 2 dimuat");\n',
    "modul3.js": '// Modul 3: Dasar HTML\nconsole.log("Modul 3 dimuat");\n',
    "modul4.js": '// Modul 4: Scraping Python\nconsole.log("Modul 4 dimuat");\n',
    "modul5.js": '// Modul 5: Kasus Sulit\nconsole.log("Modul 5 dimuat");\n',
    "modul6.js": '// Modul 6: Etika & Hukum\nconsole.log("Modul 6 dimuat");\n',
    "app.js": """document.addEventListener("DOMContentLoaded", function() {
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
"""
}
for name, content in js_modules.items():
    with open(os.path.join(temp_dir, "js", name), "w", encoding="utf-8") as f:
        f.write(content)

# 6. index.html
html_content = """<!DOCTYPE html>
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
</html>"""
with open(os.path.join(temp_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(html_content)

# 7. Create ZIP
with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, _, files in os.walk(temp_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, temp_dir)
            zipf.write(full_path, rel_path)

print(f"✅ Arsip {zip_filename} berhasil dibuat!")
