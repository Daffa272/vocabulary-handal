import { CaseStudy } from '../types';

export const caseStudiesList: CaseStudy[] = [
  {
    id: 'project-sales',
    title: 'Project 1 — Sales Performance & Profitability Analysis',
    domain: 'Sales',
    difficulty: 'Beginner',
    businessProblem: 'Manajemen PT Retail Nusantara mengalami pertumbuhan omzet 15% pada tahun 2024, namun laba bersih justru turun drastis. Direktur Penjualan membutuhkan dashboard eksekutif untuk mengidentifikasi produk dan wilayah mana yang mengalami kebocoran profit, memonitor margin per kategori, dan mengevaluasi efektivitas diskon.',
    datasetName: 'Sales_Performance_2024.csv',
    datasetFile: 'Sales_Data',
    dataDictionary: [
      { field: 'OrderID', type: 'Text (String)', desc: 'Nomor unik transaksi pesanan', sample: 'ORD-2024-1001' },
      { field: 'OrderDate', type: 'Date', desc: 'Tanggal transaksi terjadi', sample: '2024-01-15' },
      { field: 'CustomerName', type: 'Text', desc: 'Nama pelanggan atau perusahaan B2B', sample: 'PT Nusantara Prima' },
      { field: 'Segment', type: 'Text', desc: 'Segmen pembeli: Consumer, Corporate, Home Office', sample: 'Corporate' },
      { field: 'Region', type: 'Text', desc: 'Wilayah geografis penjualan di Indonesia', sample: 'Jawa' },
      { field: 'Category', type: 'Text', desc: 'Kategori produk utama (Technology, Furniture, Office Supplies)', sample: 'Technology' },
      { field: 'SalesAmount', type: 'Currency (Decimal)', desc: 'Total pendapatan kotor dalam Rupiah', sample: '92500000' },
      { field: 'Profit', type: 'Currency (Decimal)', desc: 'Laba bersih transaksi setelah dipotong COGS', sample: '21500000' },
      { field: 'Discount', type: 'Percentage (Decimal)', desc: 'Persentase diskon yang diberikan (0.0 - 1.0)', sample: '0.05' }
    ],
    instructions: [
      'Unduh dataset Sales_Performance_2024.csv melalui tombol di bawah.',
      'Buka Power BI Desktop, hubungkan file CSV via Get Data → Text/CSV.',
      'Gunakan Power Query untuk memvalidasi tipe data SalesAmount dan Profit menjadi Fixed Decimal (Currency).',
      'Buat tabel Date menggunakan formula DAX CALENDARAUTO().',
      'Hubungkan Date Table ke Sales[OrderDate] dengan relasi 1-to-many.',
      'Buat 5 DAX Measures utama untuk menghitung KPI.',
      'Rancang kanvas dashboard dengan kartu KPI, tren bulanan, dan matriks wilayah.',
      'Tuliskan kesimpulan rekomendasi bisnis pada laporan eksekutif.'
    ],
    powerQuerySteps: [
      'Promote Headers: Pastikan baris pertama terbaca sebagai nama kolom resmi.',
      'Change Type: Ubah OrderDate ke Date, SalesAmount ke Currency, dan Discount ke Percentage.',
      'Replace Errors: Pastikan tidak ada sel berstatus error pada kolom kuantitas dan harga.',
      'Close & Apply: Muat data ke semantic model internal.'
    ],
    daxMeasures: [
      { name: 'Total Sales', formula: 'SUM(Sales[SalesAmount])', desc: 'Total omzet penjualan' },
      { name: 'Total Profit', formula: 'SUM(Sales[Profit])', desc: 'Total laba bersih' },
      { name: 'Profit Margin %', formula: 'DIVIDE([Total Profit], [Total Sales], 0)', desc: 'Rasio persentase margin keuntungan' },
      { name: 'Total Orders', formula: 'DISTINCTCOUNT(Sales[OrderID])', desc: 'Jumlah volume pesanan unik' },
      { name: 'Sales MoM Growth %', formula: 'VAR CurrentMonth = [Total Sales] VAR PrevMonth = CALCULATE([Total Sales], DATEADD(\'Calendar\'[Date], -1, MONTH)) RETURN DIVIDE(CurrentMonth - PrevMonth, PrevMonth, 0)', desc: 'Pertumbuhan omzet bulan ke bulan' }
    ],
    recommendedVisuals: [
      '4 KPI Cards di bagian header (Sales, Profit, Margin %, Orders)',
      'Line Chart: Monthly Sales vs Profit Trend',
      'Horizontal Bar Chart: Sales & Profit by Product Category',
      'Donut Chart: Sales Contribution by Customer Segment',
      'Matrix Table: Region by Category dengan conditional formatting warna margin'
    ],
    expectedInsights: [
      'Kategori Furniture memiliki volume penjualan yang lumayan namun margin profit sangat tipis atau bahkan minus pada produk Meja Konferensi karena diskon di atas 15%.',
      'Wilayah Jawa menyumbang lebih dari 60% total penjualan, namun pertumbuhan tercepat berada di Kalimantan dan Sulawesi.',
      'Segmen Corporate memiliki Average Order Value (AOV) 5x lebih tinggi dibandingkan Consumer biasa.'
    ],
    rubric: [
      { criterion: 'Data Cleaning & Types', weight: '20%', target: 'Tipe data tepat, format tanggal benar, tidak ada duplikat atau null yang mengganggu' },
      { criterion: 'Data Modeling & Relasi', weight: '25%', target: 'Model Star Schema terbentuk rapi dengan Date Table terpisah, relasi 1:* single direction' },
      { criterion: 'Ketepatan Formula DAX', weight: '25%', target: 'Menggunakan DIVIDE aman, penamaan measure jelas, time intelligence bekerja dinamis' },
      { criterion: 'Desain & User Experience', weight: '20%', target: 'Hierarki visual teratur, kontras warna profesional, tidak ada grafik yang menyesatkan' },
      { criterion: 'Interpretasi Bisnis', weight: '10%', target: 'Menyajikan rekomendasi pemangkasan diskon pada produk merugi' }
    ]
  },
  {
    id: 'project-finance',
    title: 'Project 2 — Financial Performance & Variance Dashboard',
    domain: 'Finance',
    difficulty: 'Intermediate',
    businessProblem: 'Chief Financial Officer (CFO) membutuhkan laporan real-time untuk membandingkan Anggaran Biaya Operasional (Budget) vs Realisasi Aktual (Actual Expenditure) per departemen. Terdapat kekhawatiran biaya Cloud Infrastructure dan Logistik membengkak melebihi alokasi tahunan.',
    datasetName: 'Finance_Budget_Actual_2024.csv',
    datasetFile: 'Finance_Data',
    dataDictionary: [
      { field: 'Period', type: 'Text (Quarter)', desc: 'Periode kuartal tahun buku', sample: '2024-Q1' },
      { field: 'Department', type: 'Text', desc: 'Departemen internal (Marketing, Engineering, Operations)', sample: 'Engineering' },
      { field: 'Category', type: 'Text', desc: 'Kategori pengeluaran anggaran', sample: 'Cloud Infrastructure' },
      { field: 'Budget', type: 'Currency (Decimal)', desc: 'Alokasi anggaran yang disetujui (Rupiah)', sample: '250000000' },
      { field: 'Actual', type: 'Currency (Decimal)', desc: 'Realisasi biaya yang dibayarkan (Rupiah)', sample: '278000000' },
      { field: 'Variance', type: 'Currency (Decimal)', desc: 'Selisih Budget - Actual (Positif: Hemat, Negatif: Over-budget)', sample: '-28000000' }
    ],
    instructions: [
      'Impor dataset Finance_Budget_Actual_2024.csv ke Power BI.',
      'Gunakan Power Query untuk memastikan konsistensi nama departemen.',
      'Buat DAX Measure untuk Variance dan Variance Percentage %.',
      'Gunakan Waterfall Chart untuk memperlihatkan bagaimana defisit departemen Engineering menurunkan sisa anggaran perusahaan.',
      'Tambahkan conditional formatting: Hijau untuk hemat, Merah untuk over-budget.'
    ],
    powerQuerySteps: [
      'Trim & Clean: Bersihkan spasi kosong pada nama Departemen dan Kategori.',
      'Split Column: Pisahkan kolom Period menjadi Year dan Quarter jika diperlukan analisis tahunan.',
      'Data Validation: Verifikasi kolom Budget dan Actual tidak bernilai negatif.'
    ],
    daxMeasures: [
      { name: 'Total Budget', formula: 'SUM(Finance[Budget])', desc: 'Total anggaran yang dialokasikan' },
      { name: 'Total Actual', formula: 'SUM(Finance[Actual])', desc: 'Total realisasi belanja aktual' },
      { name: 'Budget Variance', formula: '[Total Budget] - [Total Actual]', desc: 'Selisih rupiah budget terhadap aktual' },
      { name: 'Variance %', formula: 'DIVIDE([Budget Variance], [Total Budget], 0)', desc: 'Persentase penghematan atau pembengkakan' }
    ],
    recommendedVisuals: [
      'Gauge atau Bullet Chart: Realisasi belanja terhadap pagu anggaran',
      'Waterfall Chart: Bridge breakdown selisih anggaran per departemen',
      'Clustered Bar Chart: Budget vs Actual berdampingan per kategori biaya',
      'Matrix Table: Departemen → Kategori dengan status indikator warna merah/hijau'
    ],
    expectedInsights: [
      'Departemen Engineering mengalami over-budget sebesar Rp 43.000.000 akibat lonjakan biaya server Cloud Infrastructure di Q1 dan Q3.',
      'Departemen Marketing berhasil berhemat sebesar Rp 5.500.000 di Q1 dengan mengalihkan anggaran ke digital ads bertarget tinggi.',
      'Secara keseluruhan perusahaan masih berada dalam batas toleransi aman deviasi anggaran 3%.'
    ],
    rubric: [
      { criterion: 'Validasi Angka Keuangan', weight: '30%', target: 'Angka variance dan persentase akurat hingga ke sen' },
      { criterion: 'Penggunaan Visual Waterfall', weight: '25%', target: 'Menjelaskan jembatan pergerakan budget secara logis' },
      { criterion: 'Pewarnaan Semantik Akuntansi', weight: '25%', target: 'Merah untuk pengeluaran di atas budget, hijau untuk efisiensi' },
      { criterion: 'Kejelasan Hierarki Kategori', weight: '20%', target: 'Navigasi drill-down antar tingkat biaya lancar' }
    ]
  },
  {
    id: 'project-hr',
    title: 'Project 3 — HR Workforce Analytics & Attrition Diagnostic',
    domain: 'HR',
    difficulty: 'Intermediate',
    businessProblem: 'Head of People & Culture menghadapi kenaikan angka turnover karyawan (attrition) hingga 25% dalam 12 bulan terakhir. Perusahaan membutuhkan dashboard diagnostik untuk menemukan penyebab utama: apakah terkait gaji, beban kerja, kepemimpinan tim, atau masa kerja (tenure).',
    datasetName: 'HR_Employee_Attrition_2024.csv',
    datasetFile: 'HR_Data',
    dataDictionary: [
      { field: 'EmpID', type: 'Text', desc: 'Nomor induk karyawan', sample: 'HR-001' },
      { field: 'Name', type: 'Text', desc: 'Nama lengkap karyawan', sample: 'Anisa Rahma' },
      { field: 'Department', type: 'Text', desc: 'Divisi kerja (Sales, Tech, HR, Operations, Finance)', sample: 'Sales' },
      { field: 'JobRole', type: 'Text', desc: 'Jabatan fungsional', sample: 'Account Executive' },
      { field: 'Performance', type: 'Rating (1-5)', desc: 'Nilai evaluasi kinerja tahunan', sample: '4' },
      { field: 'MonthlySalary', type: 'Currency', desc: 'Gaji pokok bulanan dalam Rupiah', sample: '12500000' },
      { field: 'Attrition', type: 'Boolean / Text', desc: 'Status apakah karyawan mengundurkan diri (True/False)', sample: 'False' },
      { field: 'TenureYears', type: 'Decimal', desc: 'Lama bekerja di perusahaan dalam tahun', sample: '3.2' },
      { field: 'AbsentDays', type: 'Integer', desc: 'Jumlah hari absensi tanpa keterangan setahun', sample: '4' }
    ],
    instructions: [
      'Muat dataset ke Power Query dan ubah Attrition menjadi nilai biner 1 (Resign) dan 0 (Aktif).',
      'Buat DAX Measure Attrition Rate % = DIVIDE(Total Resigned, Total Headcount, 0).',
      'Analisis hubungan antara masa kerja (tenure) dengan tingkat pengunduran diri.',
      'Gunakan Decomposition Tree untuk menelusuri divisi dengan angka turnover tertinggi.'
    ],
    powerQuerySteps: [
      'Conditional Column: Buat kolom AttritionFlag = if [Attrition] = true then 1 else 0.',
      'Group By / Binning: Kelompokkan TenureYears menjadi kelompok masa kerja (< 1 tahun, 1-3 tahun, 3-5 tahun, > 5 tahun).'
    ],
    daxMeasures: [
      { name: 'Total Headcount', formula: 'COUNTROWS(HR)', desc: 'Jumlah total seluruh karyawan' },
      { name: 'Total Attrition', formula: 'CALCULATE(COUNTROWS(HR), HR[Attrition] = TRUE)', desc: 'Jumlah karyawan yang mengundurkan diri' },
      { name: 'Attrition Rate %', formula: 'DIVIDE([Total Attrition], [Total Headcount], 0)', desc: 'Tingkat persentase turnover karyawan' },
      { name: 'Average Salary', formula: 'AVERAGE(HR[MonthlySalary])', desc: 'Gaji rata-rata seluruh staf' }
    ],
    recommendedVisuals: [
      'KPI Cards: Total Headcount, Resigned Staff, Attrition Rate %, Avg Absent Days',
      'Decomposition Tree: Menelusuri Attrition Rate berdasarkan Divisi → Jabatan → Tenure',
      'Scatter Plot: Gaji Bulanan vs Hari Absensi dengan titik warna status Attrition',
      'Bar Chart: Attrition Rate per Kelompok Masa Kerja (Tenure Group)'
    ],
    expectedInsights: [
      'Karyawan dengan masa kerja di bawah 1.5 tahun memiliki tingkat attrition tertinggi (mencapai 60%), menandakan masalah pada proses orientasi kerja (onboarding) atau ekspektasi peran.',
      'Divisi Sales dan Operasional memiliki angka absensi tertinggi sebelum karyawan memutuskan resign.',
      'Karyawan berkinerja tinggi (Rating 4-5) dengan gaji di bawah rata-rata pasar rentan dibajak oleh kompetitor.'
    ],
    rubric: [
      { criterion: 'Formulasi Tingkat Attrition', weight: '25%', target: 'Kalkulasi headcount awal vs akhir akurat' },
      { criterion: 'Penerapan Decomposition Tree', weight: '25%', target: 'Mampu menelusuri akar masalah per departemen' },
      { criterion: 'Analisis Korelasi Absensi & Gaji', weight: '25%', target: 'Menemukan pola early-warning karyawan berisiko resign' },
      { criterion: 'Rekomendasi Kebijakan HR', weight: '25%', target: 'Usulan perbaikan program retensi tahun pertama' }
    ]
  },
  {
    id: 'project-bigdata',
    title: 'Project 4 — Enterprise Big Data Pipeline: SQL to Power BI',
    domain: 'Enterprise Big Data',
    difficulty: 'Advanced',
    businessProblem: 'Bank digital nasional memiliki tabel transaksi kartu debit dengan volume lebih dari 50 juta baris per bulan di data warehouse SQL. Dashboard laporan eksekutif memakan waktu 45 detik untuk terbuka dan sering kehabisan memori. Tim BI ditugaskan mendesain ulang arsitektur pipeline, menerapkan Aggregation Tables, Query Folding, dan DirectQuery Composite Model agar dashboard terbuka di bawah 2 detik.',
    datasetName: 'Enterprise_BigData_Architecture.csv',
    datasetFile: 'Sales_Data',
    dataDictionary: [
      { field: 'TransactionID', type: 'BigInt', desc: 'ID unik transaksi di SQL database', sample: '984710293847' },
      { field: 'Timestamp', type: 'DateTime', desc: 'Waktu transaksi hingga milidetik', sample: '2024-05-18 14:22:01.402' },
      { field: 'MerchantCategory', type: 'Text', desc: 'Kategori pedagang (MCC)', sample: 'Groceries' },
      { field: 'TerminalType', type: 'Text', desc: 'Kanal transaksi: EDC, Online PG, ATM', sample: 'EDC' },
      { field: 'Amount', type: 'Decimal', desc: 'Nominal transaksi transaksi', sample: '450000.00' },
      { field: 'Status', type: 'Text', desc: 'Status penyelesaian transaksi', sample: 'SUCCESS' }
    ],
    instructions: [
      'Rancang arsitektur Composite Model: Tabel Transaksi Detail menggunakan DirectQuery ke SQL, sementara Tabel Dimensi dan Agregasi Bulanan menggunakan mode Import.',
      'Pastikan seluruh langkah Power Query mempertahankan Query Folding (View Native Query aktif).',
      'Pisahkan kolom Timestamp menjadi Date (Key) dan Time untuk mereduksi kardinalitas memori.',
      'Konfigurasikan Aggregation Table pada Power BI Model View untuk mengalihkan kueri tingkat ringkasan ke tabel Import yang cepat.',
      'Uji performa dengan Performance Analyzer untuk memverifikasi eksekusi visual di bawah 500ms.'
    ],
    powerQuerySteps: [
      'Eliminate High-Cardinality Columns: Buang kolom nomor kartu mentah, ID sesi sementara, dan log teknis.',
      'Split DateTime: Pisahkan kolom Timestamp menjadi Date dan Time.',
      'Query Folding Check: Klik kanan langkah terakhir di Applied Steps → pilih "View Native Query" untuk memastikan folding bekerja.'
    ],
    daxMeasures: [
      { name: 'Total Volume Trx', formula: 'COUNTROWS(FactTransactions)', desc: 'Menghitung total baris transaksi di model agregat' },
      { name: 'Total Trx Amount', formula: 'SUM(FactTransactions[Amount])', desc: 'Total nominal transaksi' },
      { name: 'Average Ticket Size', formula: 'DIVIDE([Total Trx Amount], [Total Volume Trx], 0)', desc: 'Rata-rata nominal per transaksi' }
    ],
    recommendedVisuals: [
      'Executive KPI Cards (berjalan di atas tabel Import Agregasi instan)',
      'Time Series Line Chart: Volume transaksi per hari dengan kemampuan drill-down ke detail',
      'Matrix Breakdown kanal transaksi vs status',
      'Performance Analyzer Waterfall Chart log bukti optimasi'
    ],
    expectedInsights: [
      'Dengan menggunakan Composite Model + Aggregations, 95% kueri pengguna dijawab langsung dari RAM Import tanpa menyentuh server SQL, memangkas waktu tunggu dari 45 detik menjadi 0.8 detik!',
      'Penghapusan kolom ber-kardinalitas tinggi menghemat lebih dari 80% alokasi RAM server Power BI.',
      'Server database SQL terbebas dari beban kueri redundan di jam kerja sibuk.'
    ],
    rubric: [
      { criterion: 'Arsitektur Composite Model', weight: '30%', target: 'Penggabungan mode DirectQuery dan Import bekerja harmonis' },
      { criterion: 'Optimasi Kardinalitas & Memori', weight: '25%', target: 'Menghilangkan kolom boros memori dan memecah DateTime' },
      { criterion: 'Verifikasi Query Folding', weight: '25%', target: 'Semua filter dieksekusi di database server' },
      { criterion: 'Konfigurasi Aggregations', weight: '20%', target: 'Mapping tabel agregasi di Model View terkonfigurasi tepat' }
    ]
  }
];
