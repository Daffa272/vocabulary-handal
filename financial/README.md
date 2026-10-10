# Financial Analysis Lab

**Interactive Financial Intelligence & Corporate Finance Platform**

Financial Analysis Lab adalah platform web analisis keuangan korporat interaktif berstandar profesional yang dirancang untuk menganalisis performa perusahaan, menghitung rasio keuangan dinamis, memproyeksikan laporan keuangan 5 tahun, melakukan simulasi skenario, valuasi intrinsik DCF, serta menghasilkan interpretasi otomatis deterministik.

---

## Fitur Utama

1. **Admin Portal & Data Input Hub (Website Admin)**:
   - Antarmuka entri data keuangan lengkap dan terpisah untuk operator/admin keuangan.
   - Form input Income Statement (Revenue, COGS, OpEx breakdown, Bunga, Pajak) dengan kalkulasi otomatis laba kotor, EBIT, dan laba bersih secara real-time.
   - Form input Balance Sheet dengan **Live Equilibrium Checker** (memeriksa persamaan $Assets = Liabilities + Equity$ secara seketika dan tombol *Auto-Balance Ekuitas*).
   - Form input Cash Flow (aktivitas operasi, belanja modal CapEx, dividen, saldo awal & saldo akhir kas).
   - Penambahan periode keuangan baru (misal: FY 2026, Q1 2026, dll.) dan kloning data.
   - Tombol instan **"Buka Visualisasi"** untuk beralih seketika ke dashboard analitik.
2. **Financial Overview Dashboard**: 14 KPI utama (Revenue, Gross Profit, EBIT, Net Income, OCF, Assets, Liabilities, Equity, Current Ratio, D/E Ratio, dsb.) dengan tren multi-periode, perbandingan absolut & persentase, serta filter FX (USD, IDR, EUR, GBP).
3. **Financial Statements (3-Statement Linked Model)**:
   - Income Statement
   - Balance Sheet (lengkap dengan validasi persamaan neraca: $Assets = Liabilities + Equity$ dan toleransi pembulatan yang dapat diatur)
   - Cash Flow Statement (rekonsiliasi terintegrasi dengan saldo kas neraca)
   - Analisis Common-Size vertikal (% omzet/% aset) dan horizontal (YoY %).
4. **Financial Ratio Calculator**: 5 dimensi rasio (Likuiditas, Profitabilitas, Solvabilitas, Efisiensi/Perputaran, dan Arus Kas) dengan transparansi formula, penanganan pembagian nol, dan pilihan definisi utang (Total Liabilitas vs Interest-Bearing Debt).
5. **Profitability Analysis**: Analisis margin, tren Revenue vs COGS, elastisitas biaya, diagram waterfall laba kotor ke laba bersih, serta kontribusi segmen produk dan unit bisnis.
6. **Liquidity & Solvency Diagnostics**: Pemantauan bantalan likuiditas jangka pendek (*Short-Term Liquidity Gap*), tren D/E, dan cakupan beban bunga (*Interest Coverage*).
7. **Cash Flow Dynamics & Quality of Earnings**: Analisis 3 pilar arus kas (Operasi, Investasi, Pendanaan), konversi laba akrual terhadap kas, dan tren *Free Cash Flow*.
8. **Working Capital & Cash Conversion Cycle (CCC)**: Analisis siklus perputaran kas ($CCC = DSO + DIO - DPO$) dan penjelasan trade-off likuiditas vs risiko *stockout*.
9. **Budget vs Actual Variance Analysis**: Analisis varians anggaran vs realisasi dengan logika otomatis *Favorable* vs *Unfavorable* berdasarkan tipe akun (pendapatan vs beban), filter departemen, dan pencarian akun.
10. **Forecast & Scenario Planning**: Model proyeksi 5 tahun interaktif dengan slider asumsi (Pertumbuhan Penjualan, Margin Kotor, Biaya Operasional, CapEx, DSO, Pajak) dan 3 skenario (*Base Case*, *Optimistic*, *Pessimistic*).
11. **Company Valuation Lab**: Valuasi intrinsik *Discounted Cash Flow* (DCF) dengan Gordon Growth Model, matriks sensitivitas 2 dimensi WACC vs Terminal Growth, serta kelipatan komparatif (P/E, EV/EBITDA, EV/Sales).
12. **Data Import & Mapping**: Pengunggah file CSV dan Excel (.xlsx) dengan deteksi worksheet, pemetaan kolom/akun interaktif, validasi data otomatis, serta unduhan template standar.
13. **Financial Interpretation Lab**: Sistem penalaran finansial berbasis aturan (*deterministic rule-based engine*) dengan kerangka 6 pilar terstruktur: *Key Finding*, *Evidence*, *Interpretation*, *Potential Risk*, *Recommended Investigation*, dan *Limitations*.
14. **Executive Reporting & Export**: Ekspor spreadsheet model keuangan lengkap ke format Excel (.xlsx), CSV, dan laporan memo eksekutif *print-friendly* (siap cetak/simpan PDF).
15. **Interactive Learning Center**: 11 modul edukasi keuangan korporat lengkap dengan rumus, *sandbox playground* interaktif untuk simulasi langsung, dan kuis uji pemahaman mandiri dengan pembahasan.

---

## Cara Menghubungkan Website Admin ke Website Visualisasi

Terdapat 3 cara arsitektur untuk menghubungkan data dari Website Admin ke Website Visualisasi:

### 1. Metode Shared State & LocalStorage (Sudah Aktif Otomatis)
Dalam platform ini, Website Admin dan Website Visualisasi telah terhubung secara **real-time**:
- Saat Anda memasukkan angka di **Admin Portal (Buka Admin Input Data)** dan menekan **"Simpan Perubahan ke Dashboard"**, data langsung disimpan ke *reactive application state* dan *browser LocalStorage*.
- Beralih ke **Website Visualisasi (Buka Visualisasi)**: Seluruh 14 halaman analisis, grafik, rasio, neraca, dan DCF valuasi langsung otomatis ter-update mengikuti angka yang baru Anda input tanpa perlu reload.

### 2. Metode Arsitektur Produksi (Dua Domain/Website Terpisah via REST API & Database)
Jika Website Admin di-hosting secara independen (misal: `admin.perusahaan.com`) dan Website Visualisasi di `dashboard.perusahaan.com`:
1. **Backend Database Terpusat**: Gunakan database PostgreSQL, MySQL, atau Cloud Firestore/Supabase.
2. **REST API Endpoint**:
   - `POST /api/v1/financial-reports`: Digunakan Website Admin untuk mengirim data laporan keuangan baru setelah validasi neraca seimbang.
   - `GET /api/v1/financial-reports/:companyId`: Digunakan Website Visualisasi untuk mengambil data keuangan terbaru saat halaman dimuat.
3. **Webhook / WebSockets (Opsional)**: Mengirim sinyal `REPORT_UPDATED` agar browser pengguna visualisasi langsung melakukan live-refresh seketika saat admin menekan tombol simpan.

### 3. Metode Paket File JSON / Excel (Tanpa Perlu Setup Server Backend)
- Di Website Admin, gunakan fitur **"Export Database JSON"** pada tab sinkronisasi untuk mengunduh berkas data terstruktur.
- Di Website Visualisasi, buka menu **Data Import & Mapping** lalu unggah file tersebut untuk memuat seluruh data entitas secara instan.

---

## Panduan Instalasi di Lingkungan Windows

### Prasyarat
- **Node.js** versi 18 atau lebih baru (disarankan LTS versi 20+). Dapat diunduh di [nodejs.org](https://nodejs.org/).
- **Git** untuk Windows (opsional jika mendownload file zip).
- Terminal PowerShell atau Command Prompt (CMD).

### Langkah-Langkah Menjalankan di Windows:

1. **Buka Terminal PowerShell / CMD**
   Tekan tombol `Windows + R`, ketik `powershell` atau `cmd`, lalu tekan `Enter`.

2. **Masuk ke Direktori Proyek**
   ```powershell
   cd C:\path\ke\financial-analysis-lab
   ```

3. **Instal Dependensi NPM**
   Jalankan perintah berikut:
   ```powershell
   npm install
   ```

4. **Jalankan Development Server**
   ```powershell
   npm run dev
   ```

5. **Akses Aplikasi di Browser**
   Buka browser (Google Chrome, Microsoft Edge, atau Firefox) dan akses alamat:
   ```
   http://localhost:3000
   ```

6. **Membangun Versi Produksi (Production Build)**
   Untuk mengompilasi aplikasi siap produksi:
   ```powershell
   npm run build
   npm run preview
   ```

---

## Integritas Finansial & Keamanan
- Tidak ada data fiktif yang disembunyikan; data bawaan diberi label eksplisit sebagai **Synthetic Model**.
- Seluruh formula keuangan dapat diverifikasi secara transparan pada antarmuka.
- Tidak menyimpan kredensial atau API key di sisi klien.
