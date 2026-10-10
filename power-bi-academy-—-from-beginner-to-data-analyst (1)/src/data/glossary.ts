import { GlossaryItem } from '../types';

export const glossaryItemsList: GlossaryItem[] = [
  {
    term: 'Business Intelligence (BI)',
    category: 'Core BI',
    definition: 'Strategi, teknologi, dan arsitektur pengolahan data mentah menjadi wawasan analitis yang dapat ditindaklanjuti (actionable insights) untuk mendukung pengambilan keputusan bisnis yang tepat.',
    relatedTerms: ['Data Analytics', 'Reporting', 'Dashboard', 'Semantic Model']
  },
  {
    term: 'Power BI Desktop',
    category: 'Core BI',
    definition: 'Aplikasi desktop Windows gratis untuk pengembang BI yang digunakan untuk menyambungkan sumber data, mentransformasikan data di Power Query, membangun model data relasional, menulis formula DAX, dan merancang laporan visual interaktif.',
    relatedTerms: ['Power BI Service', 'PBIX', 'Power Query']
  },
  {
    term: 'Power BI Service',
    category: 'Architecture',
    definition: 'Layanan Software-as-a-Service (SaaS) berbasis cloud Microsoft (app.powerbi.com) untuk memublikasikan laporan, membuat dasbor lintas-laporan, mengelola scheduled refresh, menerapkan Row-Level Security, dan berkolaborasi tim via Workspace.',
    relatedTerms: ['Workspace', 'Scheduled Refresh', 'Gateway', 'RLS']
  },
  {
    term: 'Semantic Model (Dataset)',
    category: 'Architecture',
    definition: 'Kumpulan struktur tabel, kolom terkompresi, relasi antar-tabel, hierarki, dan kumpulan formula DAX measures yang siap dieksplorasi oleh laporan analitis.',
    relatedTerms: ['VertiPaq', 'Star Schema', 'Measures']
  },
  {
    term: 'PBIX File',
    category: 'Core BI',
    definition: 'Format file arsip biner standar Power BI Desktop yang membungkus kueri Power Query (M code), model data in-memory VertiPaq, formula DAX, dan desain halaman visual.',
    relatedTerms: ['Power BI Desktop', 'Model View']
  },
  {
    term: 'Import Mode',
    category: 'Architecture',
    definition: 'Metode penyimpanan data di mana seluruh data dari sumber diekstraksi, disalin, dan dikompresi ke dalam memori RAM komputer/cloud menggunakan mesin VertiPaq.',
    relatedTerms: ['DirectQuery', 'VertiPaq', 'Storage Mode']
  },
  {
    term: 'DirectQuery Mode',
    category: 'Architecture',
    definition: 'Metode koneksi di mana Power BI tidak mengimpor data ke memori, melainkan menerjemahkan interaksi pengguna di visual menjadi kueri SQL/native langsung ke database sumber saat runtime.',
    relatedTerms: ['Import Mode', 'Composite Model', 'Big Data']
  },
  {
    term: 'Composite Model',
    category: 'Architecture',
    definition: 'Arsitektur model data hibrida yang memungkinkan satu Semantic Model menggabungkan tabel-tabel mode Import berkecepatan tinggi dengan tabel-tabel mode DirectQuery berukuran raksasa.',
    relatedTerms: ['DirectQuery', 'Import Mode', 'Aggregations']
  },
  {
    term: 'Power Query',
    category: 'Power Query',
    definition: 'Mesin ETL (Extract, Transform, Load) visual dan fungsional terintegrasi di Power BI dan Excel untuk menghubungkan, membersihkan, menyaring, dan membentuk data mentah sebelum dimuat ke model.',
    exampleOrFormula: 'let Source = Excel.Workbook(...) in Source',
    relatedTerms: ['Applied Steps', 'M Language', 'Query Folding']
  },
  {
    term: 'Applied Steps',
    category: 'Power Query',
    definition: 'Panel riwayat langkah berurutan di sisi kanan Power Query Editor yang mencatat setiap transformasi data secara otomatis dan dapat dieksekusi ulang secara deterministik saat refresh data.',
    relatedTerms: ['Power Query', 'M Language']
  },
  {
    term: 'Query Folding',
    category: 'Power Query',
    definition: 'Kemampuan cerdas Power Query untuk menerjemahkan langkah-langkah transformasi data grafis menjadi satu kueri SQL asli (native query) dan mengeksekusinya di server database sumber.',
    relatedTerms: ['Power Query', 'SQL Server', 'Performance']
  },
  {
    term: 'Unpivot Columns',
    category: 'Power Query',
    definition: 'Operasi transformasi data penting untuk mengubah tabel berorientasi lebar (cross-tab / spreadsheet) menjadi tabel tabular vertikal (tidy data) yang memiliki kolom atribut dan nilai terpisah.',
    relatedTerms: ['Power Query', 'Tidy Data', 'Pivot']
  },
  {
    term: 'Star Schema',
    category: 'Modeling',
    definition: 'Pola desain model data relasional optimal untuk analitik, di mana satu atau lebih Fact Table transaksi dikelilingi dan dihubungkan secara langsung ke beberapa Dimension Table melalui relasi 1-to-many.',
    relatedTerms: ['Fact Table', 'Dimension Table', 'Snowflake Schema']
  },
  {
    term: 'Fact Table',
    category: 'Modeling',
    definition: 'Tabel yang menyimpan data metrik kuantitatif dan catatan transaksi kejadian bisnis (seperti nilai penjualan, jumlah barang, biaya), biasanya memiliki banyak baris dan foreign keys.',
    relatedTerms: ['Star Schema', 'Dimension Table', 'Foreign Key']
  },
  {
    term: 'Dimension Table',
    category: 'Modeling',
    definition: 'Tabel referensi yang menyimpan atribut deskriptif untuk menjawab pertanyaan Who, What, Where, When (seperti data pelanggan, produk, wilayah, dan kalender tanggal).',
    relatedTerms: ['Fact Table', 'Primary Key', 'Filter Context']
  },
  {
    term: 'Cardinality (Kardinalitas)',
    category: 'Modeling',
    definition: 'Derajat keunikan nilai dalam suatu kolom atau hubungan antartabel (1-to-Many, Many-to-1, Many-to-Many). Kolom dengan kardinalitas tinggi memuat sangat banyak nilai yang berbeda-beda.',
    relatedTerms: ['VertiPaq', 'Primary Key', 'One-to-Many']
  },
  {
    term: 'Filter Context (Konteks Filter)',
    category: 'DAX',
    definition: 'Himpunan kondisi penyaringan yang aktif diterapkan pada model data saat suatu ekspresi DAX dievaluasi, berasal dari baris/kolom visual, slicer, panel filter, atau fungsi CALCULATE.',
    relatedTerms: ['Row Context', 'CALCULATE', 'DAX Measure']
  },
  {
    term: 'Row Context (Konteks Baris)',
    category: 'DAX',
    definition: 'Konteks saat Power BI mengetahui baris spesifik mana yang sedang diproses dalam tabel, otomatis ada pada Calculated Column atau saat menggunakan fungsi iterator (X-Functions seperti SUMX).',
    relatedTerms: ['Filter Context', 'Calculated Column', 'SUMX', 'Context Transition']
  },
  {
    term: 'CALCULATE',
    category: 'DAX',
    definition: 'Fungsi terpenting dalam DAX yang mengevaluasi ekspresi analitik dalam konteks filter baru yang dimodifikasi, ditambahkan, atau dilepaskan sesuai argumen filternya.',
    exampleOrFormula: 'CALCULATE([Total Sales], Products[Category] = "Technology")',
    relatedTerms: ['Filter Context', 'FILTER', 'ALL', 'Context Transition']
  },
  {
    term: 'DIVIDE',
    category: 'DAX',
    definition: 'Fungsi pembagian aman di DAX yang otomatis menangani error pembagian dengan angka nol (Division by Zero) dengan mengembalikan BLANK atau nilai alternatif yang ditentukan.',
    exampleOrFormula: 'DIVIDE([Total Profit], [Total Sales], 0)',
    relatedTerms: ['DAX Measure', 'Profit Margin']
  },
  {
    term: 'SUMX',
    category: 'DAX',
    definition: 'Fungsi iterator yang menelusuri tabel baris demi baris dalam row context, menghitung ekspresi matematika di setiap baris, lalu menjumlahkan seluruh hasil akhirnya.',
    exampleOrFormula: 'SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    relatedTerms: ['Row Context', 'Iterator', 'SUM']
  },
  {
    term: 'ALL / REMOVEFILTERS',
    category: 'DAX',
    definition: 'Fungsi DAX yang menghapus seluruh filter context yang aktif pada kolom atau tabel tertentu, esensial untuk menghitung total keseluruhan dan rasio persentase kontribusi (Share of Total).',
    exampleOrFormula: 'CALCULATE([Total Sales], ALL(Sales))',
    relatedTerms: ['CALCULATE', 'Filter Context']
  },
  {
    term: 'VertiPaq Engine',
    category: 'Architecture',
    definition: 'Mesin database in-memory columnar berkecepatan tinggi di dalam Power BI dan SQL Server Analysis Services yang mengompresi data tabel hingga 10x-20x melalui dictionary encoding dan run-length encoding.',
    relatedTerms: ['Import Mode', 'Cardinality', 'Compression']
  },
  {
    term: 'On-Premises Data Gateway',
    category: 'Architecture',
    definition: 'Aplikasi jembatan komunikasi jaringan terenkripsi yang diinstal pada server lokal perusahaan agar Power BI Service di cloud dapat menyegarkan data dari database lokal (on-premise SQL/Excel).',
    relatedTerms: ['Power BI Service', 'Scheduled Refresh', 'Firewall']
  },
  {
    term: 'Row-Level Security (RLS)',
    category: 'Architecture',
    definition: 'Fitur keamanan data di Power BI yang membatasi baris data mana saja yang dapat dilihat oleh pengguna tertentu berdasarkan role dan aturan filter DAX yang ditentukan.',
    exampleOrFormula: '[Region] = USERPRINCIPALNAME()',
    relatedTerms: ['Power BI Service', 'Security', 'Roles']
  },
  {
    term: 'Incremental Refresh',
    category: 'Architecture',
    definition: 'Strategi pembaruan data pintar yang hanya memproses dan memuat baris data yang baru berubah dalam periode terkini (misal: 10 hari terakhir), tanpa perlu memuat ulang data historis tahun-tahun sebelumnya.',
    relatedTerms: ['VertiPaq', 'Big Data', 'Scheduled Refresh']
  },
  {
    term: 'Performance Analyzer',
    category: 'Architecture',
    definition: 'Panel instrumen diagnostik di Power BI Desktop untuk mengukur waktu eksekusi setiap visual di kanvas, terbagi menjadi DAX Query time, Visual Display time, dan Other internal overhead.',
    relatedTerms: ['DAX', 'Optimization', 'VertiPaq']
  }
];
