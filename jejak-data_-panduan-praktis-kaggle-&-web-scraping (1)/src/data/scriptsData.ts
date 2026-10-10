export interface ScriptFile {
  filename: string;
  description: string;
  category: 'python' | 'config' | 'guide';
  code: string;
}

export const SCRIPT_FILES: ScriptFile[] = [
  {
    filename: '01_baca_csv.py',
    description: 'Membaca file CSV dengan pandas, memeriksa struktur kolom, tipe data, dan statistik dasar.',
    category: 'python',
    code: `"""
01_baca_csv.py
==============================================================
Langkah Pertama: Membaca & Memeriksa File CSV Menggunakan Pandas
Tingkat Kesulitan: Sangat Mudah (Pemula)

Apa itu Pandas?
Pandas adalah library Python paling populer untuk mengolah data tabel (seperti Excel).
Data tabel di pandas disebut "DataFrame".
==============================================================
"""

import sys
import os

# Cek apakah pandas sudah terpasang
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

    # Nama file CSV yang akan dibaca
    nama_file = "contoh_buku.csv"

    # Periksa keberadaan file sebelum membaca (mencegah FileNotFoundError)
    if not os.path.exists(nama_file):
        print(f"❌ File '{nama_file}' tidak ditemukan di folder ini!")
        print("💡 Pastikan Anda menjalankan skrip dari folder 'latihan'.")
        print("   Atau jalankan skrip '05_simpan_ke_csv.py' terlebih dahulu untuk membuat file ini.")
        return

    try:
        # pd.read_csv membaca file teks comma-separated values menjadi DataFrame
        print(f" Membaca file: {nama_file} ...")
        df = pd.read_csv(nama_file, encoding='utf-8')
        
    except UnicodeDecodeError:
        print("⚠️ File memiliki encoding selain UTF-8, mencoba 'latin1'...")
        df = pd.read_csv(nama_file, encoding='latin1')
    except Exception as e:
        print(f"❌ Terjadi kesalahan saat membaca CSV: {e}")
        return

    print(" Berhasil memuat data!\n")

    # 1. Menampilkan 5 baris pertama (head)
    print("1. Lima Baris Pertama (df.head()):")
    print("-" * 50)
    print(df.head())
    print("\n" + "=" * 50)

    # 2. Dimensi dataset (jumlah baris dan kolom)
    jumlah_baris, jumlah_kolom = df.shape
    print(f"2. Dimensi Data: {jumlah_baris} baris dan {jumlah_kolom} kolom\n")

    # 3. Informasi kolom dan tipe data (info)
    print("3. Ringkasan Struktur & Tipe Data (df.info()):")
    print("-" * 50)
    df.info()
    print("\n" + "=" * 50)

    # 4. Statistik dasar kolom angka (describe)
    print("4. Ringkasan Statistik Angka (df.describe()):")
    print("-" * 50)
    print(df.describe())
    print("\n" + "=" * 50)

    # 5. Menghitung nilai unik dalam kolom kategori (jika ada)
    if 'kategori' in df.columns:
        print("5. Distribusi Buku per Kategori:")
        print(df['kategori'].value_counts())

    print("\n🎉 Selesai! Anda sudah berhasil membuka dan menganalisis dasar data CSV di Python.")

if __name__ == "__main__":
    main()
`
  },
  {
    filename: '02_kaggle_api.py',
    description: 'Mengunduh dataset dari Kaggle secara otomatis menggunakan Kaggle API atau library kagglehub.',
    category: 'python',
    code: `"""
02_kaggle_api.py
==============================================================
Mengunduh Dataset dari Kaggle Lewat Python (Kaggle API & kagglehub)
Tingkat Kesulitan: Mudah

Catatan Penting untuk Windows:
File kredensial 'kaggle.json' harus diletakkan di:
C:\\Users\\<NamaUserAnda>\\.kaggle\\kaggle.json
==============================================================
"""

import os
import sys

def cek_kredensial_kaggle():
    """Memeriksa apakah kaggle.json sudah ada di direktori pengguna Windows."""
    home_dir = os.path.expanduser("~")
    kaggle_dir = os.path.join(home_dir, ".kaggle")
    kaggle_json = os.path.join(kaggle_dir, "kaggle.json")
    
    print(f"🔎 Memeriksa file token di: {kaggle_json}")
    if os.path.exists(kaggle_json):
        print(" Token 'kaggle.json' ditemukan!\n")
        return True
    else:
        print("⚠️ File 'kaggle.json' BELUM ditemukan di folder pengguna Anda.")
        print("📌 Panduan Singkat:")
        print("   1. Buka kaggle.com -> Login -> Klik foto profil -> Settings")
        print("   2. Scroll ke bagian 'API' -> Klik tombol 'Create New Token'")
        print("   3. File 'kaggle.json' akan terunduh otomatis.")
        print(f"   4. Buat folder '{kaggle_dir}' (bila belum ada) dan pindahkan file tersebut ke sana.")
        print("   5. Jalankan kembali skrip ini.\n")
        return False

def download_via_kagglehub():
    """Mengunduh menggunakan library resmi terbaru 'kagglehub' (paling mudah)."""
    try:
        import kagglehub
    except ModuleNotFoundError:
        print("⚠️ Library 'kagglehub' belum terpasang.")
        print("👉 Jalankan: pip install kagglehub\n")
        return

    print("🚀 Mengunduh dataset contoh menggunakan library kagglehub...")
    print("Contoh dataset: 'zynicide/wine-reviews'")
    
    try:
        # Download versi terbaru dari dataset
        path = kagglehub.dataset_download("zynicide/wine-reviews")
        print(f" Dataset berhasil diunduh ke folder lokal:")
        print(f"   📁 {path}")
        
        # Tampilkan daftar file di dalam folder tersebut
        files = os.listdir(path)
        print(f"   📄 File yang tersedia: {files[:5]}")
    except Exception as e:
        print(f"❌ Gagal mengunduh dengan kagglehub: {e}")

def download_via_kaggle_cli():
    """Alternatif: Menjalankan perintah Kaggle CLI dari Python."""
    print("\n--- Alternatif: Mengunduh via Kaggle CLI ---")
    print("Perintah yang bisa Anda jalankan langsung di Terminal / Command Prompt:")
    print("  kaggle datasets download -d zynicide/wine-reviews --unzip")
    print("Opsi '--unzip' otomatis mengekstrak file ZIP menjadi file CSV langsung!")

def main():
    print("=" * 60)
    print("  PENGAMBILAN DATA VIA KAGGLE API")
    print("=" * 60)

    token_ada = cek_kredensial_kaggle()
    
    if token_ada:
        download_via_kagglehub()
    else:
        print("💡 Demonstrasi alternatif simulasi...")
        download_via_kaggle_cli()

if __name__ == "__main__":
    main()
`
  },
  {
    filename: '03_scrape_satu_halaman.py',
    description: 'Scraping halaman web tunggal yang legal (quotes.toscrape.com) menggunakan requests & BeautifulSoup.',
    category: 'python',
    code: `"""
03_scrape_satu_halaman.py
==============================================================
Scraping Halaman Pertama: Mengambil Kutipan & Penulis
Target: http://quotes.toscrape.com/ (Situs resmi untuk latihan scraping)
Library: requests, beautifulsoup4
Tingkat Kesulitan: Dasar
==============================================================
"""

import sys
import time

try:
    import requests
    from bs4 import BeautifulSoup
except ModuleNotFoundError as e:
    print(f"❌ Library belum lengkap: {e}")
    print("👉 Solusi di terminal Windows: pip install requests beautifulsoup4")
    sys.exit(1)

def main():
    print("=" * 60)
    print("  SCRAPING DASAR: SATU HALAMAN QUOTES")
    print("=" * 60)

    # URL target latihan legal
    url = "http://quotes.toscrape.com/"

    # Headers sopan: menyertakan User-Agent agar server tahu siapa yang berkunjung
    headers = {
        "User-Agent": "LatihanPemulaScraper/1.0 (Pendidikan Pembelajaran Data; Windows 10)"
    }

    print(f"1. Mengirim permintaan HTTP GET ke: {url}")
    try:
        # Melakukan HTTP request dengan batas waktu (timeout) 10 detik
        response = requests.get(url, headers=headers, timeout=10)
        
        # Periksa status code (200 berarti sukses)
        print(f"   Status Code Respons: {response.status_code}")
        response.raise_for_status() # Menimbulkan error jika status 4xx atau 5xx
        
    except requests.exceptions.Timeout:
        print("❌ Permintaan waktu habis (Timeout). Coba periksa koneksi internet.")
        return
    except requests.exceptions.RequestException as err:
        print(f"❌ Terjadi kesalahan saat memuat web: {err}")
        return

    print("2. Melakukan parsing teks HTML dengan BeautifulSoup...")
    # Mengubah teks HTML mentah menjadi pohon objek Python (DOM Tree)
    soup = BeautifulSoup(response.text, "html.parser")

    # Menemukan semua kartu kutipan: <div class="quote">
    elemen_quotes = soup.select("div.quote")
    print(f"   Ditemukan {len(elemen_quotes)} elemen kutipan di halaman ini!\n")

    hasil_data = []

    print("3. Mengekstraksi data teks dari setiap elemen:")
    print("-" * 60)

    for index, item in enumerate(elemen_quotes, start=1):
        # Ambil teks kutipan: <span class="text">
        tag_teks = item.select_one("span.text")
        teks_kutipan = tag_teks.get_text(strip=True) if tag_teks else "Tidak ada teks"

        # Ambil nama penulis: <small class="author">
        tag_penulis = item.select_one("small.author")
        nama_penulis = tag_penulis.get_text(strip=True) if tag_penulis else "Anonim"

        # Ambil daftar tag: <a class="tag">
        tags = [t.get_text(strip=True) for t in item.select("div.tags a.tag")]
        tag_gabung = ", ".join(tags)

        print(f"[{index}] {nama_penulis}: {teks_kutipan[:60]}... (Tags: {tag_gabung})")

        hasil_data.append({
            "penulis": nama_penulis,
            "kutipan": teks_kutipan,
            "tags": tag_gabung
        })

    print("-" * 60)
    print(f" Ekstraksi berhasil! Total {len(hasil_data)} kutipan siap diolah.")

if __name__ == "__main__":
    main()
`
  },
  {
    filename: '04_scrape_banyak_halaman.py',
    description: 'Scraping beberapa halaman (Pagination) dengan loop, delay time.sleep() yang sopan, dan penanganan batas halaman.',
    category: 'python',
    code: `"""
04_scrape_banyak_halaman.py
==============================================================
Scraping Banyak Halaman (Pagination) dengan Sopan (Rate Limiting)
Target: http://books.toscrape.com/ (Katalog Buku Latihan)
Tingkat Kesulitan: Menengah

Konsep Utama:
1. Looping nomor halaman (page 1, 2, 3...)
2. Memberi jeda (time.sleep) antar permintaan agar server tidak terbebani
3. Mengecek apakah halaman berikutnya masih ada
==============================================================
"""

import sys
import time

try:
    import requests
    from bs4 import BeautifulSoup
except ModuleNotFoundError as e:
    print(f"❌ Library belum terpasang: {e}")
    print("👉 Solusi: pip install requests beautifulsoup4")
    sys.exit(1)

def scrape_halaman_buku(nomor_halaman):
    """Fungsi pembantu untuk mengambil data buku dari satu nomor halaman tertentu."""
    url = f"http://books.toscrape.com/catalogue/page-{nomor_halaman}.html"
    headers = {
        "User-Agent": "LatihanScraperMultiPage/1.0 (Belajar-Data-Python)"
    }
    
    print(f"🔍 Mengambil Halaman {nomor_halaman}: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        # Jika halaman tidak ditemukan (404), berarti sudah mencapai batas akhir buku
        if response.status_code == 404:
            print(f"   ℹ️ Halaman {nomor_halaman} tidak ditemukan (404). Akhir halaman tercapai.")
            return []
            
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Gagal memuat halaman {nomor_halaman}: {e}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    produk_list = soup.select("article.product_pod")

    daftar_buku = []
    for p in produk_list:
        # Judul lengkap ada di atribut 'title' pada tag <a>
        tag_link = p.select_one("h3 a")
        judul = tag_link["title"] if (tag_link and "title" in tag_link.attrs) else tag_link.get_text()

        # Harga buku
        tag_harga = p.select_one("p.price_color")
        harga = tag_harga.get_text(strip=True) if tag_harga else "N/A"

        # Ketersediaan stok
        tag_stok = p.select_one("p.instock.availability")
        stok = tag_stok.get_text(strip=True) if tag_stok else "N/A"

        daftar_buku.append({
            "halaman": nomor_halaman,
            "judul": judul,
            "harga": harga,
            "stok": stok
        })

    print(f"    Berhasil mengambil {len(daftar_buku)} buku dari halaman {nomor_halaman}.")
    return daftar_buku

def main():
    print("=" * 60)
    print("  SCRAPING MULTI-HALAMAN (PAGINATION) BUKU")
    print("=" * 60)

    total_data = []
    maksimal_halaman = 3 # Latihan mengambil 3 halaman pertama
    jeda_detik = 2 # Sopan santun: jeda 2 detik antar request

    for hal in range(1, maksimal_halaman + 1):
        buku_halaman = scrape_halaman_buku(hal)
        
        if not buku_halaman:
            # Berhenti jika halaman kosong atau 404
            break
            
        total_data.extend(buku_halaman)

        # Jangan berikan jeda setelah halaman terakhir selesai
        if hal < maksimal_halaman:
            print(f"⏳ Istirahat {jeda_detik} detik agar tidak membebani server...")
            time.sleep(jeda_detik)

    print("\n" + "=" * 60)
    print(f" Ringkasan Selesai: Mengambil total {len(total_data)} buku dari {maksimal_halaman} halaman.")
    print("=" * 60)
    
    # Cetak 3 contoh pertama
    for i, b in enumerate(total_data[:3], 1):
        print(f"{i}. [Hal {b['halaman']}] {b['judul'][:35]}... -> {b['harga']} ({b['stok']})")

if __name__ == "__main__":
    main()
`
  },
  {
    filename: '05_simpan_ke_csv.py',
    description: 'Scraping lengkap buku dan menyimpan hasilnya secara rapi ke file CSV menggunakan pandas.',
    category: 'python',
    code: `"""
05_simpan_ke_csv.py
==============================================================
Alur Penuh: Scraping Data -> Pembersihan Ringan -> Simpan ke CSV
Target: http://books.toscrape.com/
Tingkat Kesulitan: Menengah - Praktik Nyata
==============================================================
"""

import sys
import os
import time

try:
    import requests
    from bs4 import BeautifulSoup
    import pandas as pd
except ModuleNotFoundError as e:
    print(f"❌ Library belum lengkap: {e}")
    print("👉 Pasang kebutuhan dengan: pip install requests beautifulsoup4 pandas")
    sys.exit(1)

# Peta konversi kata bintang rating ke angka numerik
RATING_MAP = {
    "One": 1,
    "Two": 2,
    "Three": 3,
    "Four": 4,
    "Five": 5
}

def bersihkan_harga(teks_harga):
    """Menghapus simbol mata uang seperti £ dan mengonversi ke float."""
    # Contoh teks: '£51.77' -> 51.77
    bersih = teks_harga.replace("£", "").replace("$", "").strip()
    try:
        return float(bersih)
    except ValueError:
        return 0.0

def ambil_rating_angka(tag_pod):
    """Mengambil rating dari class 'star-rating Three' -> 3."""
    tag_rating = tag_pod.select_one("p.star-rating")
    if not tag_rating:
        return 0
    classes = tag_rating.get("class", [])
    for c in classes:
        if c in RATING_MAP:
            return RATING_MAP[c]
    return 0

def main():
    print("=" * 60)
    print("  SCRAPING LENGKAP & SIMPAN KE FILE CSV")
    print("=" * 60)

    url = "http://books.toscrape.com/catalogue/page-1.html"
    headers = {"User-Agent": "PenyimpanDataCSV/1.0"}

    print(f"1. Mengambil data dari: {url} ...")
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        print(f"❌ Gagal mengambil halaman: {e}")
        return

    soup = BeautifulSoup(resp.text, "html.parser")
    pods = soup.select("article.product_pod")

    daftar_buku = []
    print(f"2. Memproses {len(pods)} buku...")

    for pod in pods:
        # 1. Judul
        tag_link = pod.select_one("h3 a")
        judul = tag_link["title"] if (tag_link and "title" in tag_link.attrs) else (tag_link.get_text() if tag_link else "Tanpa Judul")

        # 2. Harga
        tag_harga = pod.select_one("p.price_color")
        teks_harga = tag_harga.get_text(strip=True) if tag_harga else "£0"
        harga_angka = bersihkan_harga(teks_harga)

        # 3. Rating bintang
        rating = ambil_rating_angka(pod)

        # 4. Ketersediaan
        tag_stok = pod.select_one("p.instock.availability")
        stok_teks = tag_stok.get_text(strip=True) if tag_stok else "In stock"
        tersedia = "In stock" in stok_teks

        daftar_buku.append({
            "judul": judul,
            "harga_gbp": harga_angka,
            "rating_bintang": rating,
            "tersedia": tersedia
        })

    # Konversi list dictionary ke pandas DataFrame
    print("3. Mengubah data ke dalam Pandas DataFrame...")
    df = pd.DataFrame(daftar_buku)

    # Nama file keluaran
    nama_file_keluaran = "hasil_scrape_buku.csv"
    
    # Simpan ke CSV tanpa kolom index angka ganda
    print(f"4. Menyimpan ke '{nama_file_keluaran}'...")
    df.to_csv(nama_file_keluaran, index=False, encoding="utf-8")

    print("\n" + "=" * 60)
    print(f" BERHASIL! File '{nama_file_keluaran}' telah disimpan.")
    print(f" Lokasi file: {os.path.abspath(nama_file_keluaran)}")
    print(f"📊 Jumlah baris tersimpan: {len(df)}")
    print("=" * 60)
    print("\nBerikut 5 baris pertama data yang tersimpan:")
    print(df.head())

if __name__ == "__main__":
    main()
`
  },
  {
    filename: 'requirements.txt',
    description: 'Daftar pustaka Python yang diperlukan untuk menjalankan semua skrip.',
    category: 'config',
    code: `requests>=2.31.0
beautifulsoup4>=4.12.0
pandas>=2.0.0
kagglehub>=0.2.0
`
  },
  {
    filename: 'contoh_buku.csv',
    description: 'Dataset contoh awal untuk langsung mencoba skrip 01_baca_csv.py.',
    category: 'config',
    code: `id,judul,kategori,harga_gbp,rating_bintang,tersedia,stok
1,"A Light in the Attic",Poetry,51.77,3,True,22
2,"Tipping the Velvet",Historical Fiction,53.74,1,True,20
3,"Soumission",Fiction,50.10,1,True,20
4,"Sharp Objects",Mystery,47.82,4,True,20
5,"Sapiens: A Brief History of Humankind",History,54.23,5,True,20
6,"The Requiem Red",Young Adult,22.65,1,True,19
7,"The Dirty Little Secrets of Getting Your Dream Job",Business,33.34,4,True,19
8,"The Coming Woman: A Novel Based on the Life of the Infamous Feminist, Victoria Woodhull",Historical Fiction,17.93,3,True,19
9,"The Boys in the Boat: Nine Americans and Their Epic Quest for Gold at the 1936 Berlin Olympics",Default,22.60,4,True,19
10,"The Black Maria",Poetry,52.15,1,True,19
11,"Starving Hearts (Triangular Trade Trilogy, #1)",Default,13.99,2,True,19
12,"Shakespeare's Sonnets",Poetry,20.66,4,True,19
13,"Set Me Free",Young Adult,17.46,5,True,19
14,"Scott Pilgrim's Precious Little Life (Scott Pilgrim #1)",Sequential Art,52.29,5,True,19
15,"Rip it Up and Start Again",Music,35.02,5,True,19
`
  },
  {
    filename: 'JALANKAN.bat',
    description: 'Skrip pembuka otomatis satu klik untuk Windows (memakai local server jika python ada).',
    category: 'config',
    code: `@echo off
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
`
  },
  {
    filename: 'README.md',
    description: 'Dokumentasi panduan komprehensif menjalankan di Windows & pemecahan masalah.',
    category: 'guide',
    code: `# Jejak Data: Panduan Praktis Kaggle & Web Scraping untuk Pemula

Selamat datang di paket pembelajaran hands-on **Jejak Data**. Paket ini dirancang khusus untuk pemula yang ingin belajar cara mengambil data dari internet menggunakan Python di sistem operasi **Windows**.

---

## 📂 Struktur Isi Paket

\`\`\`
jejak-data-ambil-data/
├── index.html              <- Website pembelajaran utama (buka langsung di browser)
├── css/                    <- Gaya tampilan responsif & modern
├── js/                     <- Logika interaktif (simulator, kuis, code builder)
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
\`\`\`

---

## 🚀 Cara Membuka Website Pembelajaran

Anda memiliki 2 cara mudah:
1. **Cara Tercepat:** Klik dua kali pada file \`index.html\`. Halaman akan langsung terbuka di browser Anda (Chrome, Edge, Firefox) tanpa butuh koneksi internet!
2. **Cara Otomatis (Direkomendasikan):** Klik dua kali pada \`JALANKAN.bat\`. Skrip ini akan mendeteksi apakah Python tersedia, menjalankan server lokal ringan, dan membuka browser secara otomatis.

---

## 💻 Panduan Menjalankan Kode Python di Windows

### Langkah 1: Memasang Python di Windows
1. Unduh installer resmi dari [python.org/downloads](https://www.python.org/downloads/).
2. **PENTING (Sering Terlewatkan):** Saat jendela installer muncul, **CENTANG** kotak bertuliskan:
   \`☑ Add python.exe to PATH\`
3. Klik **Install Now**, tunggu hingga selesai, lalu klik **Close**.

### Langkah 2: Membuka Terminal / Command Prompt
1. Tekan tombol \`Windows + R\` di keyboard, ketik \`cmd\`, lalu tekan **Enter**.
2. Masuk ke folder latihan ini, contoh:
   \`\`\`cmd
   cd C:\\Users\\NamaAnda\\Downloads\\jejak-data-ambil-data\\latihan
   \`\`\`

### Langkah 3: Membuat Lingkungan Virtual (Virtual Environment - Rekomendasi)
Lingkungan virtual menjaga agar pustaka yang Anda pasang tidak bentrok dengan program lain:
\`\`\`cmd
python -m venv venv
venv\\Scripts\\activate
\`\`\`
*(Jika aktif, akan muncul tanda \`(venv)\` di awal baris terminal Anda).*

### Langkah 4: Memasang Library yang Dibutuhkan
Ketik perintah berikut untuk memasang requests, beautifulsoup4, pandas, dan kagglehub sekaligus:
\`\`\`cmd
pip install -r requirements.txt
\`\`\`

### Langkah 5: Menjalankan Skrip Latihan
Jalankan satu per satu sesuai nomor urut:
\`\`\`cmd
python 01_baca_csv.py
python 02_kaggle_api.py
python 03_scrape_satu_halaman.py
python 04_scrape_banyak_halaman.py
python 05_simpan_ke_csv.py
\`\`\`

---

## 🔑 Cara Menyiapkan Kaggle API Token

Agar bisa mengunduh jutaan dataset gratis secara otomatis lewat skrip Python:
1. Buat akun gratis di [kaggle.com](https://www.kaggle.com).
2. Klik foto profil Anda di pojok kanan atas -> pilih **Settings**.
3. Gulir ke bawah hingga bagian **API**.
4. Klik tombol **Create New Token**. Sebuah file bernama \`kaggle.json\` akan terunduh.
5. Pindahkan file tersebut ke folder rahasia pengguna Windows Anda:
   \`C:\\Users\\<NamaUserAnda>\\.kaggle\\kaggle.json\`
   *(Tips: Jika folder \`.kaggle\` belum ada, Anda bisa membuatnya sendiri di dalam folder akun Windows Anda).*

---

## 🛠️ Bagian "Kalau Error": Solusi Masalah Umum

### 1. Pesan: \`'python' is not recognized as an internal or external command\`
- **Penyebab:** Kotak "Add Python to PATH" belum dicentang saat instalasi Python.
- **Solusi:** Jalankan kembali installer Python, pilih opsi **Modify**, lalu pastikan opsi **Add Python to environment variables** tercentang. Atau cari "Environment Variables" di menu Start Windows dan tambahkan path folder Python ke variabel \`Path\`.

### 2. Pesan: \`ModuleNotFoundError: No module named 'requests'\` atau \`'bs4'\`
- **Penyebab:** Pustaka belum terpasang di Python yang sedang aktif.
- **Solusi:** Pastikan terminal mengarah ke folder yang tepat dan jalankan:
  \`\`\`cmd
  pip install requests beautifulsoup4 pandas kagglehub
  \`\`\`

### 3. Pesan: \`403 Forbidden\` saat mengakses web atau Kaggle
- **Penyebab Web Scraping:** Server menolak permintaan bot karena tidak menyertakan User-Agent yang ramah.
- **Solusi Web:** Tambahkan header \`User-Agent\` seperti pada contoh skrip 03 & 04.
- **Penyebab Kaggle:** File \`kaggle.json\` belum berada di lokasi yang tepat atau izin akses dataset tersebut membutuhkan persetujuan aturan kompetisi di situs Kaggle.

### 4. Pesan: \`UnicodeDecodeError: 'charmap' codec can't decode byte ...\`
- **Penyebab:** Windows terkadang memakai encoding lokal default (cp1252) saat membaca file berkarakter khusus.
- **Solusi:** Selalu tambahkan argumen \`encoding='utf-8'\` pada fungsi \`open()\` atau \`pd.read_csv()\`. Jika masih gagal, coba gunakan \`encoding='latin1'\`.

---

## ⚖️ Catatan Etika & Keamanan
- Semua skrip latihan di sini diarahkan ke situs resmi yang sengaja dibuat untuk latihan scraping (\`books.toscrape.com\` dan \`quotes.toscrape.com\`).
- Jangan pernah melakukan scraping terhadap data pribadi sensitif (KTP, nomor telepon, rekam medis) atau melanggar ketentuan layanan (Terms of Service) penyedia situs.
`
  }
];
