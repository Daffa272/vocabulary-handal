# Jejak Data: Panduan Praktis Kaggle & Web Scraping untuk Pemula

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
venv\Scripts\activate
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
   `C:\Users\<NamaUserAnda>\.kaggle\kaggle.json`

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
