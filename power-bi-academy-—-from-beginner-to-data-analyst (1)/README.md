# Power BI Academy — From Beginner to Data Analyst

Platform pembelajaran interaktif berbasis web untuk membantu pemula hingga profesional menguasai Microsoft Power BI dari nol hingga tingkat lanjut. Website ini menyajikan kurikulum 12 level, 8 laboratorium interaktif, 4 proyek portofolio industri, studio dashboard penjualan, mesin interpretasi statistik, kuis evaluasi, dan glosarium istilah data analytics.

---

## 🚀 Fitur Utama Platform

1. **Learning Path (12 Level Edukasi):**
   - **Level 1 — Fundamentals:** Konsep BI, PBI Desktop vs Service vs Mobile, perbandingan Excel & Power BI, struktur .PBIX.
   - **Level 2 — Data Connection:** 10 konektor data populer, perbandingan Storage Mode (Import, DirectQuery, Composite, Live Connection), mekanisme refresh.
   - **Level 3 — Excel to Power BI:** Workflow resmi import file Excel `Sales_Data.xlsx`, Excel Table (Ctrl+T), Navigator, panduan troubleshooting 8 error refresh umum.
   - **Level 4 — Power Query & Cleaning:** Simulasi ETL interaktif, penanganan duplikat, null/missing value, tipe data, Unpivot Columns, Applied Steps, dan bahasa M.
   - **Level 5 — Data Modeling:** Arsitektur Star Schema (Fact vs Dimension), relasi One-to-Many (1:*), Primary Key & Foreign Key, simulasi aliran filter (Filter Propagation).
   - **Level 6 — DAX Formula Lab:** Editor interaktif fungsi DAX (SUM, AVERAGE, COUNT, DISTINCTCOUNT, DIVIDE aman, CALCULATE, FILTER, SUMX, ALL) dan perbedaan Row Context vs Filter Context.
   - **Level 7 — Data Visualization:** Katalog 14 jenis grafik standar Power BI, pertanyaan bisnis yang dijawab, struktur kolom, dan jebakan desain.
   - **Level 8 — Data Interpretation Engine:** Kerangka interpretasi 5 langkah: Observasi, Bukti Statistik, Makna Bisnis, Investigasi Lanjutan, dan Batasan Data.
   - **Level 9 — Pola Distribusi Data:** Histogram interaktif dengan bin slider (5-25 bin), evaluasi Mean vs Median, Skewness, dan deteksi Outlier menggunakan pagar 1.5x IQR.
   - **Level 10 — Menghubungkan Big Data (10k, 100k, 1M+ Baris):** Arsitektur in-memory VertiPaq, pemecahan kolom DateTime untuk mereduksi RAM hingga 85%, Query Folding SQL, dan Incremental Refresh.
   - **Level 11 — Dashboard Studio:** Simulasi kanvas dashboard eksekutif lengkap dengan kartu KPI, tren bulanan, slicer wilayah/kategori, tabel peringkat produk, dan insight otomatis.
   - **Level 12 — Deployment & Service:** Workspace roles, On-Premises Data Gateway, Row-Level Security (RLS), dan opsi lisensi Microsoft.

2. **Laboratorium Interaktif (Interactive Labs):**
   - Data Connection Lab (Simulator Wizard & Storage Modes)
   - Power Query & Data Cleaning Lab (Dirty data live transforms)
   - Data Modeling Lab (Interactive Star Schema canvas)
   - DAX Formula Lab (Live evaluator terhadap 30 transaksi aktual)
   - Data Interpretation Lab (Mesin bukti statistik 5 tahap)
   - Distribution Lab (Histogram dinamis, IQR outlier detector)
   - Big Data & Optimization Lab (Simulasi VertiPaq memory footprint)
   - Dashboard Studio (Executive dynamic dashboard)

3. **Studi Kasus Portofolio (4 Proyek Nyata):**
   - Project 1: Sales Performance & Profitability Analysis
   - Project 2: Financial Performance & Variance Dashboard
   - Project 3: HR Workforce Analytics & Attrition Diagnostic
   - Project 4: Enterprise Big Data Pipeline (SQL to Power BI)
   *Setiap proyek dilengkapi dataset CSV yang dapat diunduh, kamus data, instruksi langkah demi langkah, formula DAX, dan rubrik penilaian.*

4. **Kuis & Glosarium:**
   - 9 soal evaluasi menyeluruh mencakup seluruh modul dengan pembahasan jawaban terperinci.
   - 25+ istilah penting Power BI dan Data Analytics.

---

## 💻 Panduan Instalasi & Menjalankan di Windows dengan VS Code

### Prasyarat
- **Sistem Operasi:** Windows 10 atau Windows 11.
- **Node.js:** Versi 18 LTS atau 20+ ([Unduh Node.js Resmi](https://nodejs.org/)).
- **Editor:** Visual Studio Code ([Unduh VS Code](https://code.visualstudio.com/)).

### Langkah-Langkah Menjalankan Proyek

1. **Buka Proyek di Visual Studio Code:**
   Buka aplikasi VS Code, lalu klik **File → Open Folder...** dan pilih folder proyek ini.

2. **Buka Terminal Terintegrasi:**
   Tekan kombinasi tombol `Ctrl + \`` (backtick) atau klik menu **Terminal → New Terminal**.

3. **Instal Dependensi:**
   Jalankan perintah berikut di terminal:
   ```bash
   npm install
   ```

4. **Jalankan Development Server:**
   Jalankan perintah berikut:
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi:**
   Buka peramban (Google Chrome, Microsoft Edge) dan kunjungi URL lokal:
   ```
   http://localhost:3000
   ```

6. **Build untuk Produksi (Opsional):**
   Untuk mengompilasi kode menjadi build produksi yang siap di-deploy:
   ```bash
   npm run build
   ```

---

## 📁 Struktur Folder Proyek

```
├── src/
│   ├── components/
│   │   ├── labs/                        # 8 Laboratorium Interaktif
│   │   │   ├── DataConnectionLab.tsx    # Level 2 & 3: Sumber Data & Storage Mode
│   │   │   ├── PowerQueryLab.tsx        # Level 4: ETL & Bahasa M
│   │   │   ├── DataModelingLab.tsx      # Level 5: Star Schema & Filter Propagation
│   │   │   ├── DaxFormulaLab.tsx        # Level 6: Editor & Evaluator Measure DAX
│   │   │   ├── DataInterpretationLab.tsx# Level 8: Mesin Interpretasi 5 Tahap
│   │   │   ├── DistributionLab.tsx      # Level 9: Histogram, Skewness, Outlier IQR
│   │   │   ├── BigDataLab.tsx           # Level 10: Optimasi 1M Baris & VertiPaq
│   │   │   └── DashboardStudio.tsx      # Level 11: Kanvas Dashboard Eksekutif
│   │   ├── modules/                     # Halaman Silabus, Kasus, Kuis, Glosarium
│   │   │   ├── DashboardHome.tsx        # Ringkasan Progres & Quick Launch
│   │   │   ├── LearningPathView.tsx     # Silabus Lengkap 12 Level
│   │   │   ├── VisualizationCatalogView.tsx # Level 7: 14 Katalog Visualisasi
│   │   │   ├── CaseStudiesView.tsx      # 4 Proyek Portofolio Siap Pakai
│   │   │   ├── QuizView.tsx             # Kuis & Evaluasi 8 Topik
│   │   │   ├── GlossaryView.tsx         # Kamus Istilah Power BI
│   │   │   └── ReadmeModal.tsx          # Modal Panduan & Setup
│   │   ├── Navbar.tsx                   # Top Navigation Bar (Top Bar Contract)
│   │   └── Sidebar.tsx                  # Navigasi Menu & Progres Belajar
│   ├── data/                            # Dataset Sintetis & Data Kurikulum
│   │   ├── mockDatasets.ts              # Sales_Data, DirtyData, CSV Exporter
│   │   ├── learningPathModules.ts       # Konten Edukasi 12 Level
│   │   ├── connectionSources.ts         # 10 Panduan Sumber Data
│   │   ├── daxFunctions.ts              # Katalog & Evaluator DAX
│   │   ├── visualCatalog.ts             # 14 Katalog Visualisasi
│   │   ├── distributionData.ts          # Data Distribusi Statistik
│   │   ├── caseStudies.ts               # 4 Studi Kasus Portofolio
│   │   ├── quizzes.ts                   # Bank Soal & Pembahasan
│   │   └── glossary.ts                  # Kamus Istilah
│   ├── utils/
│   │   └── statistics.ts                # Rumus Statistik: Mean, Median, IQR, Skewness
│   ├── types/
│   │   └── index.ts                     # Definisi Tipe TypeScript
│   ├── App.tsx                          # Komponen Utama & Routing Tab
│   ├── index.css                        # Tailwind CSS v4 & Typography
│   └── main.tsx                         # Entry Point React 19
├── metadata.json                        # Metadata Proyek AI Studio
├── package.json                         # Konfigurasi Dependensi NPM
└── README.md                            # Panduan Resmi Proyek
```

---

## 🛠️ Teknologi yang Digunakan
- **Frontend Framework:** React 19 & TypeScript
- **Bundler & Dev Server:** Vite 8 (Port 3000)
- **Styling & Design System:** Tailwind CSS v4 (Tema Dark Navy, Cyan, Purple)
- **Icons:** Lucide React
- **Penyimpanan Lokal:** Browser LocalStorage untuk riwayat progres dan kuis
