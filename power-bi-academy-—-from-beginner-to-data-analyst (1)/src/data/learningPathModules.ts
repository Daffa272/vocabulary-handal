import { LearningModule } from '../types';

export const learningModules: LearningModule[] = [
  {
    id: 1,
    title: "Level 1 — Fundamentals: Dari Data Mentah ke Business Intelligence",
    subtitle: "Pahami ekosistem Power BI, peran BI, dan antarmuka Power BI Desktop",
    level: "Beginner",
    estTime: "45 Menit",
    keySkills: ["Business Intelligence", "Power BI Ecosystem", "Report vs Dashboard", "PBI Desktop Views", "File .PBIX"],
    description: "Membangun fondasi pemahaman tentang konsep Business Intelligence modern, perbedaan signifikan antara Microsoft Excel dan Power BI, serta navigasi antarmuka Power BI Desktop.",
    interactiveLabLink: "learning-path",
    content: {
      overview: "Business Intelligence (BI) adalah proses mengubah data mentah perusahaan menjadi wawasan analitis (insights) yang mendorong keputusan bisnis berbasis data. Power BI adalah platform analitik terpadu dari Microsoft yang mencakup aplikasi desktop lokal, layanan cloud kolaboratif, dan aplikasi mobile.",
      objectives: [
        "Memahami definisi dan urgensi Business Intelligence dalam dunia kerja.",
        "Mengetahui arsitektur Power BI Desktop, Power BI Service, dan Power BI Mobile.",
        "Membedakan fungsi Excel, Power Query, Power Pivot, dan Power BI secara gamblang.",
        "Membedakan istilah Report, Dashboard, Semantic Model, dan Dataset.",
        "Menguasai antarmuka Power BI Desktop: Report View, Table View, Model View, dan Data Tools."
      ],
      sections: [
        {
          title: "1. Apa itu Business Intelligence (BI)?",
          description: "Di era modern, perusahaan mengumpulkan jutaan data transaksi setiap hari dalam berbagai format. Tanpa BI, data ini tersimpan dalam spreadsheet terpisah (data silos) yang lambat, rentan salah formula, dan sulit dikonsolidasikan. BI mengotomatisasi pipeline dari ekstraksi data, pembersihan, pemodelan relasi, kalkulasi analitis, hingga visualisasi interaktif.",
          details: [
            "Descriptive Analytics: Apa yang terjadi di masa lalu? (Contoh: Penjualan kuartal lalu).",
            "Diagnostic Analytics: Mengapa hal itu terjadi? (Contoh: Mengapa margin wilayah Sumatera turun 12%?).",
            "Predictive & Prescriptive: Tren apa yang berpotensi terjadi dan tindakan apa yang harus diambil?"
          ]
        },
        {
          title: "2. Ekosistem Power BI: Desktop, Service, & Mobile",
          description: "Power BI bukan sekadar satu software, melainkan ekosistem terintegrasi:",
          table: {
            headers: ["Komponen", "Lingkungan Kerja", "Fungsi Utama", "Pengguna Utama"],
            rows: [
              ["Power BI Desktop", "Aplikasi Windows (Gratis)", "Koneksi data, transformasi Power Query, perancangan model relasi, penulisan DAX, pembuatan Report", "Data Analyst, BI Developer"],
              ["Power BI Service", "Cloud / Web SaaS (app.powerbi.com)", "Penerbitan report, pembuatan Dashboard lintas-laporan, scheduled refresh, kolaborasi tim, Row-Level Security (RLS)", "Bisnis User, Tim Manajemen, Viewer"],
              ["Power BI Mobile", "iOS, Android, Windows Tablet", "Melihat laporan interaktif, menerima notifikasi data alert, anotasi visual di tablet/smartphone", "Eksekutif, Field Manager"]
            ]
          }
        },
        {
          title: "3. Perbedaan Excel, Power Query, Power Pivot, dan Power BI",
          description: "Banyak pemula menganggap Power BI adalah pengganti Excel. Kenyataannya, keduanya saling melengkapi:",
          table: {
            headers: ["Fitur / Kriteria", "Microsoft Excel", "Power Query & Power Pivot", "Power BI"],
            rows: [
              ["Kapasitas Baris", "Maksimal 1.048.576 baris per sheet", "Dapat memuat puluhan juta baris dalam data model", "Dioptimalkan untuk puluhan juta baris via VertiPaq engine"],
              ["Interaktivitas Visual", "Grafik terpisah; slicer terbatas pada Pivot Table", "Bekerja di backend Excel untuk pemodelan data", "Interaktif menyeluruh; klik satu grafik otomatis memfilter visual lain"],
              ["Data Modeling", "VLOOKUP/XLOOKUP manual yang memperlambat file", "Star Schema relasi 1-to-many antar tabel", "Pemodelan relasional penuh kelas enterprise"],
              ["Penyegaran Data", "Perlu copy-paste atau refresh manual berulang", "Refresh otomatis jika query dikonfigurasi", "Scheduled refresh cloud otomatis tanpa membuka file"]
            ]
          }
        },
        {
          title: "4. Terminologi Kritis: Report vs Dashboard vs Semantic Model",
          description: "Dalam ekosistem Power BI, istilah ini memiliki arti spesifik dan tidak boleh tertukar:",
          details: [
            "Semantic Model (dulu disebut Dataset): Kumpulan data, struktur tabel, relasi, hierarki, dan formula DAX measures yang siap dianalisis.",
            "Report: Laporan multi-halaman yang dibuat di Desktop atau Service berbasis satu Semantic Model, berisi visual interaktif mendalam.",
            "Dashboard: Kanvas satu halaman (single-page canvas) yang HANYA ada di Power BI Service, dibuat dengan menyematkan (pinning) visual dari berbagai Report berbeda untuk pemantauan tingkat eksekutif."
          ]
        },
        {
          title: "5. Menguasai Interface Power BI Desktop & Format .PBIX",
          description: "Saat membuka file .pbix di Power BI Desktop, terdapat tiga tampilan utama di sisi kiri:",
          details: [
            "Report View (Ikon Grafik): Kanvas utama tempat meletakkan chart, slicer, kartu KPI, dan mengatur tata letak presentasi visual.",
            "Table View (Ikon Tabel): Menampilkan preview baris data mentah per tabel, membuat calculated columns, dan memeriksa format data.",
            "Model View (Ikon Diagram Relasi): Menampilkan diagram Star Schema, relasi antartabel (1-to-many), filter direction, dan pengelolaan relasi aktif/inaktif.",
            "File .PBIX: Berisi definisi kueri Power Query (bahasa M), semantic data model (VertiPaq compressed), formula DAX, dan desain halaman visual."
          ]
        }
      ]
    }
  },
  {
    id: 2,
    title: "Level 2 — Data Connection: Menghubungkan Berbagai Sumber Data",
    subtitle: "Koneksi ke Excel, CSV, SQL, Web API, Cloud Data Warehouse & Pemilihan Connection Mode",
    level: "Beginner",
    estTime: "60 Menit",
    keySkills: ["Import vs DirectQuery", "SQL Connection", "Folder Ingestion", "Composite Model", "Cloud Refresh"],
    description: "Panduan teknis menghubungkan Power BI ke 10 sumber data populer, perbandingan mendalam metode penyimpanan (Storage Modes), dan strategi refresh data perusahaan.",
    interactiveLabLink: "connection-lab",
    content: {
      overview: "Power BI mendukung lebih dari 150 konektor data asli (native connectors). Memilih metode koneksi yang tepat menentukan apakah laporan Anda cepat dan responsif atau lambat dan membebani server database.",
      objectives: [
        "Memahami 4 metode koneksi: Import, DirectQuery, Composite Model, dan Live Connection.",
        "Mengetahui cara menghubungkan 10 jenis sumber data berbeda secara berurutan.",
        "Memahami faktor penentu arsitektur: ukuran data, performa server, keamanan, dan lisensi.",
        "Mengatasi kendala umum kredensial, firewall, dan scheduled refresh."
      ],
      sections: [
        {
          title: "1. Perbandingan Metode Koneksi (Storage Modes)",
          description: "Berikut adalah perbandingan mendalam empat metode penyimpanan di Power BI:",
          table: {
            headers: ["Metode", "Cara Kerja", "Cocok Digunakan Ketika", "Keterbatasan"],
            rows: [
              ["Import", "Data disalin & dikompresi ke memori internal Power BI (VertiPaq)", "Analisis interaktif cepat, dataset hingga puluhan juta baris, dukungan DAX penuh", "Perlu kapasitas RAM memadai; data harus di-refresh berkala"],
              ["DirectQuery", "Kueri dijalankan langsung ke database saat visual dirender", "Data berukuran ratusan juta/miliar baris, atau regulasi melarang data keluar dari server", "Performa visual tergantung kecepatan database; beberapa fungsi DAX dibatasi"],
              ["Composite Model", "Memadukan tabel Import dan tabel DirectQuery dalam satu model", "Memerlukan tabel transaksi raksasa (DirectQuery) dipadu tabel referensi cepat (Import)", "Perancangan model lebih kompleks; harus berhati-hati dengan performa cross-source"],
              ["Live Connection", "Koneksi langsung ke semantic model yang sudah ada di Analysis Services / Fabric", "Organisasi telah memiliki Single Source of Truth Semantic Model yang dikelola tim BI", "Tidak bisa membuat tabel baru atau mengubah relasi di file laporan anak"]
            ]
          }
        },
        {
          title: "2. Cara Kerja Refresh Data",
          description: "Refresh data di Power BI Desktop vs Power BI Service:",
          details: [
            "Di Power BI Desktop: Mengklik tombol Refresh akan mengeksekusi ulang seluruh Applied Steps di Power Query dan menarik data terbaru ke memori RAM lokal komputer.",
            "Di Power BI Service: File cloud (OneDrive/SharePoint) dapat di-refresh langsung tanpa gateway. Namun untuk database lokal di kantor (on-premises SQL), wajib menginstal On-premises Data Gateway.",
            "Scheduled Refresh: Pengguna lisensi Power BI Pro dapat menjadwalkan hingga 8 kali refresh per hari, sedangkan kapasitas Premium/Fabric mendukung hingga 48 kali refresh per hari."
          ]
        }
      ]
    }
  },
  {
    id: 3,
    title: "Level 3 — Excel to Power BI: Standar Praktik Industri",
    subtitle: "Workflow resmi mengubah spreadsheet berantakan menjadi dashboard dinamis",
    level: "Beginner",
    estTime: "50 Menit",
    keySkills: ["Excel Tables (Ctrl+T)", "Navigator Dialog", "Load vs Transform Data", "Troubleshooting 8 Skenario"],
    description: "Langkah demi langkah menghubungkan file Excel Sales_Data.xlsx, mengubah range menjadi structured table, memilih tabel via Navigator, membersihkan data di Power Query, serta panduan mengatasi 8 kendala refresh paling umum.",
    interactiveLabLink: "connection-lab",
    content: {
      overview: "Mayoritas analis memulai perjalanan BI mereka dari file Microsoft Excel. Memahami cara menghubungkan Excel secara benar mencegah file laporan rusak di masa mendatang.",
      objectives: [
        "Mempraktikkan format Excel Table (Ctrl+T) sebelum impor ke Power BI.",
        "Menavigasi dialog Navigator dan memahami kapan memilih 'Load' vs 'Transform Data'.",
        "Menghindari jebakan file path lokal saat kolaborasi tim.",
        "Mengatasi 8 pesan error umum saat refresh Excel di Power BI."
      ],
      sections: [
        {
          title: "1. Golden Rule: Jadikan Data Excel sebagai 'Excel Table' (Ctrl+T)",
          description: "Jangan biarkan data di Excel hanya berupa range sel biasa! Selalu seleksi data di Excel lalu tekan Ctrl + T dan beri nama tabel (misal: 'tbl_Sales', 'tbl_Products').",
          details: [
            "Alasan 1: Jika mengimpor Sheet, Power BI dapat membaca baris kosong di bagian bawah atau kolom tambahan yang tidak disengaja.",
            "Alasan 2: Excel Table otomatis membesar saat baris baru ditambahkan ke bawah tanpa mengubah nama objek tabel.",
            "Alasan 3: Di dialog Navigator Power BI, ikon tabel bergaris biru menunjukkan Excel Table resmi, sedangkan ikon sheet menunjukkan seluruh lembar kerja."
          ]
        },
        {
          title: "2. Alur 7 Langkah Menghubungkan Excel",
          description: "Langkah terstruktur dari file lokal hingga visualisasi:",
          details: [
            "Langkah 1: Siapkan file Sales_Data.xlsx dengan tabel Sales, Products, Customers, dan Calendar.",
            "Langkah 2: Buka Power BI Desktop → Klik Home → Get Data → Excel Workbook.",
            "Langkah 3: Pilih file, dialog Navigator akan muncul menampilkan daftar tabel.",
            "Langkah 4: Centang tabel yang dibutuhkan. JANGAN langsung klik 'Load'! Selalu klik 'Transform Data' untuk membuka Power Query Editor.",
            "Langkah 5: Periksa tipe data di Power Query, buang baris kosong, pastikan format tanggal valid.",
            "Langkah 6: Klik Close & Apply di pojok kiri atas Power Query.",
            "Langkah 7: Buka Model View untuk memastikan relasi antartabel terbentuk dengan benar."
          ]
        },
        {
          title: "3. Panduan Troubleshooting Refresh Excel",
          description: "Tabel penanganan 8 error paling sering dihadapi:",
          table: {
            headers: ["Skenario Masalah", "Gejala Error", "Akar Penyebab", "Solusi Langkah Demi Langkah"],
            rows: [
              ["Nama Kolom Berubah", "The column '[OldName]' of the table wasn't found", "Seseorang mengedit header di Excel dari 'Harga' menjadi 'Harga Jual'", "Buka Power Query → cari Applied Step yang memanggil nama lama → ubah kodenya atau ubah kembali nama kolom di Excel"],
              ["File Dipindahkan / Ganti Nama", "Could not find a part of the path...", "File Excel dipindah folder atau namanya diubah", "Klik Home → Transform Data → Data Source Settings → Change Source → arahkan ke lokasi file baru"],
              ["Tipe Data Campuran", "Nilai sel menjadi error merah di Power Query", "Kolom angka kemasukan teks seperti 'N/A' atau 'Gratis'", "Ganti nilai 'N/A' menjadi 0 atau Replace Errors dengan null sebelum ubah ke Whole Number"],
              ["Baris Duplikat Muncul", "Kardinalitas 1-to-many berubah menjadi many-to-many", "Tabel dimensi Customers memiliki ID yang terulang", "Di Power Query, klik kanan kolom CustomerID → Remove Duplicates"],
              ["Format Tanggal Salah", "Bulan dan tanggal tertukar (MM/DD vs DD/MM)", "Pengaturan regional sistem Windows berbeda (US vs ID)", "Ubah tipe data menggunakan 'Using Locale...' → pilih English (US) atau Indonesian"],
              ["Kredensial Gagal", "Access to the resource is forbidden", "Password akun Microsoft berubah untuk file di SharePoint/OneDrive", "Buka Data Source Settings → Edit Permissions → Sign In ulang"],
              ["Refresh Berhasil Tapi Data Tidak Nambah", "Row count tidak bertambah setelah refresh", "Data baru di Excel diketik di luar batas range Excel Table", "Buka Excel, periksa apakah tabel memanjang ke bawah (tarik sudut kanan bawah tabel) lalu simpan ulang"],
              ["Formula Terlalu Berat", "Evaluation ran out of memory", "Terlalu banyak Calculated Column kompleks dibanding Measures", "Pindahkan kalkulasi baris ke Power Query atau gunakan DAX Measures"]
            ]
          }
        }
      ]
    }
  },
  {
    id: 4,
    title: "Level 4 — Power Query & Data Cleaning: Seni Rekayasa Data",
    subtitle: "Kuasai teknik ETL: membersihkan missing value, unpivot, kustom kolom, dan Applied Steps",
    level: "Beginner",
    estTime: "75 Menit",
    keySkills: ["Applied Steps", "Data Type Casting", "Split & Merge", "Unpivot Columns", "M Code Basics", "Conditional Columns"],
    description: "Laboratorium pembersihan data interaktif. Pelajari cara mengubah data mentah yang kotor menjadi tabel analitik yang rapi (tidy data) menggunakan mesin Power Query dan bahasa M.",
    interactiveLabLink: "power-query-lab",
    content: {
      overview: "Hingga 80% waktu seorang data analyst dihabiskan untuk membersihkan dan menyiapkan data. Power Query adalah mesin ETL (Extract, Transform, Load) canggih yang mencatat setiap tindakan pembersihan Anda sebagai Applied Steps yang dapat diulang otomatis setiap kali data di-refresh.",
      objectives: [
        "Memahami konsep Tidy Data: setiap variabel adalah kolom, setiap observasi adalah baris.",
        "Menguasai teknik pembersihan: Remove Duplicates, Handle Null, Replace Values, Split/Merge.",
        "Memahami fungsi revolusioner Unpivot Columns untuk laporan bergaya cross-tab.",
        "Mengenal urutan Applied Steps dan cara membaca formula bahasa M (M-Formula)."
      ],
      sections: [
        {
          title: "1. Konsep Tidy Data vs Cross-Tab Excel",
          description: "Spreadsheet konvensional sering kali dibuat agar mudah dibaca manusia (kolom Bulan Januari, Februari, Maret membentang ke kanan). Namun format ini adalah mimpi buruk untuk Business Intelligence. Power Query memerlukan format Tidy Data di mana hanya ada satu kolom 'Bulan' dan satu kolom 'Nilai'. Operasi untuk mengubah format lebar ke format panjang ini disebut Unpivot Columns.",
          details: [
            "Data Lebar (Spreadsheet): Kolom Product | Jan | Feb | Mar (sulit dibuat time-intelligence)",
            "Data Rapi (Tidy Data): Kolom Product | Month | Sales (sangat mudah difilter, diagregasi, dan dihitung dengan DAX)"
          ]
        },
        {
          title: "2. Mengenal Applied Steps & Bahasa M",
          description: "Setiap klik tombol di Power Query menghasilkan sebuah ekspresi dalam bahasa M (Mashup Language). Urutan langkah di panel Applied Steps dieksekusi dari atas ke bawah secara berurutan:",
          codeSnippet: {
            language: "powerquery-m",
            code: `let
    Source = Excel.Workbook(File.Contents("C:\\Data\\Sales.xlsx"), null, true),
    Sales_Table = Source{[Item="Sales",Kind="Table"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(Sales_Table,{{"OrderID", type text}, {"Date", type date}, {"Amount", Currency.Type}}),
    #"Filtered Rows" = Table.SelectRows(#"Changed Type", each [Amount] > 0),
    #"Removed Duplicates" = Table.Distinct(#"Filtered Rows", {"OrderID"})
in
    #"Removed Duplicates"`,
            explanation: "Setiap langkah mengambil output dari langkah sebelumnya (misal: 'Filtered Rows' mengambil '#\"Changed Type\"') dan mengembalikan tabel baru."
          }
        }
      ]
    }
  },
  {
    id: 5,
    title: "Level 5 — Data Modeling: Star Schema & Desain Hubungan Antartabel",
    subtitle: "Rancang model relasional performa tinggi: Fact, Dimension, Star Schema, dan Filter Propagation",
    level: "Intermediate",
    estTime: "70 Menit",
    keySkills: ["Star Schema", "Fact vs Dimension", "Primary Key & Foreign Key", "One-to-Many (1:*)", "Cross Filter Direction", "Calendar Table"],
    description: "Pelajari prinsip arsitektur data modeling kelas industri. Pahami mengapa Star Schema jauh lebih unggul dibandingkan satu tabel lebar raksasa (flat table), serta bagaimana filter mengalir antartabel.",
    interactiveLabLink: "modeling-lab",
    content: {
      overview: "Model data adalah fondasi dari seluruh laporan Power BI. Menulis DAX di atas model data yang buruk ibarat membangun gedung pencakar langit di atas tanah labil: hasil kalkulasi akan salah dan performa report menjadi lambat.",
      objectives: [
        "Membedakan Fact Table (transaksi) dan Dimension Table (entitas referensi).",
        "Merancang arsitektur Star Schema yang optimal untuk VertiPaq engine.",
        "Mengelola Primary Key dan Foreign Key untuk membentuk relasi One-to-Many (1:*).",
        "Memahami filter direction (Single vs Both) dan bahaya penggunaan bi-directional filter sembarangan.",
        "Membangun Date/Calendar Table wajib untuk time intelligence."
      ],
      sections: [
        {
          title: "1. Fact Table vs Dimension Table",
          description: "Dalam perancangan Star Schema:",
          details: [
            "Fact Table (Tabel Fakta): Berisi data transaksi bernilai numerik yang terjadi berulang kali (kuantitas, nilai penjualan, biaya, diskon). Ciri khas: memiliki banyak baris, sering bertambah, memiliki Foreign Key ke tabel dimensi (contoh: FactSales, FactTransactions).",
            "Dimension Table (Tabel Dimensi): Berisi atribut referensi yang menjawab pertanyaan 'Siapa, Di mana, Kapan, Apa' (nama pelanggan, kategori produk, nama kota). Ciri khas: memiliki kolom Primary Key dengan nilai unik (contoh: DimCustomer, DimProduct, DimRegion, DimCalendar)."
          ]
        },
        {
          title: "2. Star Schema vs Flat Table vs Snowflake Schema",
          description: "Mengapa para arsitek Power BI selalu merekomendasikan Star Schema?",
          details: [
            "Flat Table (Satu tabel raksasa): Kolom nama produk, kategori, alamat pelanggan diulang di setiap baris transaksi. Menghabiskan RAM, meningkatkan kardinalitas, dan memperlambat kompresi VertiPaq.",
            "Star Schema: Tabel fakta di tengah, dikelilingi tabel dimensi yang terhubung langsung melalui relasi 1-to-many. Struktur ini memaksimalkan kecepatan engine DAX dan menghasilkan penulisan measure yang intuitif.",
            "Snowflake Schema: Tabel dimensi dipecah lagi ke sub-dimensi (misal: DimProduct → DimSubCategory → DimCategory). Meskipun normalisasi ini baik di SQL transaksional, di Power BI hal ini menambah jumlah relasi dan memperlambat evaluasi DAX."
          ]
        },
        {
          title: "3. Filter Propagation & Filter Direction",
          description: "Secara default, relasi Power BI menggunakan Single Direction (filter mengalir dari sisi '1' di tabel dimensi ke sisi '*' di tabel fakta):",
          details: [
            "Ketika pengguna memilih 'Kategori: Technology' pada slicer DimProduct, filter mengalir otomatis ke FactSales dan membatasi baris transaksi ke produk teknologi.",
            "Namun filter dari FactSales TIDAK mengalir kembali ke DimCustomer kecuali diatur bi-directional ('Both').",
            "Peringatan Praktik Terbaik: Hindari mengaktifkan 'Both' direction secara default karena dapat menimbulkan ambiguitas jalur kueri, circular dependency, dan penurunan performa drastis."
          ]
        }
      ]
    }
  },
  {
    id: 6,
    title: "Level 6 — DAX Formula Lab: Logika Kalkulasi Analitis",
    subtitle: "Kuasai Data Analysis Expressions: Aggregation, CALCULATE, Time Intelligence, dan Konteks Filter",
    level: "Intermediate",
    estTime: "90 Menit",
    keySkills: ["SUM & DIVIDE", "CALCULATE", "FILTER & ALL", "Iterator SUMX", "Filter Context vs Row Context", "Time Intelligence"],
    description: "Laboratorium interaktif menulis dan menguji formula DAX pada dataset hidup. Pahami perbedaan mendasar Row Context dan Filter Context, serta fungsi CALCULATE yang menjadi jantung analisis Power BI.",
    interactiveLabLink: "dax-lab",
    content: {
      overview: "DAX (Data Analysis Expressions) adalah bahasa formula fungsional Power BI. Walaupun sintaksnya mirip formula Excel, cara kerja DAX fundamental berbeda karena DAX beroperasi di atas konteks evaluasi (Evaluation Contexts).",
      objectives: [
        "Memahami perbedaan Calculated Column (disimpan di baris tabel) vs Measure (dihitung on-the-fly saat visual dirender).",
        "Menguasai fungsi agregasi dasar: SUM, AVERAGE, COUNTROWS, DISTINCTCOUNT, DIVIDE aman.",
        "Menguasai fungsi CALCULATE untuk memodifikasi atau menimpa Filter Context.",
        "Memahami fungsi iterator seperti SUMX, AVERAGEX untuk kalkulasi baris demi baris.",
        "Mengimplementasikan fungsi time intelligence: DATEADD, TOTALYTD, SAMEPERIODLASTYEAR."
      ],
      sections: [
        {
          title: "1. Calculated Column vs Measure: Kapan Menggunakan Mana?",
          description: "Aturan emas analis Power BI:",
          table: {
            headers: ["Kriteria", "Calculated Column", "DAX Measure"],
            rows: [
              ["Tempat Penyimpanan", "Tersimpan permanen di RAM dalam file .pbix", "Tidak memakan kapasitas penyimpanan; dihitung dinamis"],
              ["Kapan Dievaluasi", "Saat data di-refresh di desktop", "Saat pengguna berinteraksi dengan visual / filter"],
              ["Konteks Asli", "Row Context (mengevaluasi nilai di baris yang sama)", "Filter Context (mengevaluasi subset baris yang aktif)"],
              ["Kapan Digunakan", "Saat nilai ingin dijadikan Slicer, Axis grafik, atau Legend", "Untuk semua nilai angka agregat: Total Penjualan, Margin %, Rata-rata"]
            ]
          }
        },
        {
          title: "2. Anatomi CALCULATE: Raja Segala Fungsi DAX",
          description: "CALCULATE adalah satu-satunya fungsi DAX yang mampu memodifikasi filter context saat ini:",
          codeSnippet: {
            language: "dax",
            code: `Sales Technology = 
CALCULATE(
    SUM(Sales[SalesAmount]),
    Products[Category] = "Technology"
)`,
            explanation: "CALCULATE mengevaluasi ekspresi SUM(Sales[SalesAmount]) setelah menambahkan filter Products[Category] = 'Technology' ke dalam filter context visual."
          }
        }
      ]
    }
  },
  {
    id: 7,
    title: "Level 7 — Data Visualization: Memilih Visual yang Tepat",
    subtitle: "Katalog 14 visual standar Power BI, tujuan bisnis, pemilihan kolom, dan jebakan desain",
    level: "Intermediate",
    estTime: "60 Menit",
    keySkills: ["Chart Selection", "KPI Cards", "Decomposition Tree", "Waterfall Chart", "Scatter & Box Plot", "Design Best Practices"],
    description: "Pelajari cara memilih jenis visualisasi data yang tepat berdasarkan pertanyaan bisnis, jumlah variabel, dan karakteristik distribusi data.",
    interactiveLabLink: "visualization-lab",
    content: {
      overview: "Visualisasi data bukan tentang membuat grafik yang terlihat ramai atau penuh warna, melainkan mengomunikasikan wawasan bisnis secepat dan sejelas mungkin kepada audiens pengambil keputusan.",
      objectives: [
        "Mengetahui 14 jenis visual standar dan pertanyaan bisnis yang mampu dijawab masing-masing.",
        "Memahami struktur kolom data yang dibutuhkan untuk setiap chart.",
        "Menerapkan prinsip visual storytelling dan anti-slop design.",
        "Menghindari jebakan visualisasi umum: Pie chart berlebihan, 3D chart, dan sumbu ganda yang membingungkan."
      ],
      sections: [
        {
          title: "1. Panduan Memilih Chart Berdasarkan Tujuan",
          description: "Matriks pemilihan visualisasi cepat:",
          details: [
            "Membandingkan Nilai Kategori: Bar Chart (kategori teks panjang) atau Column Chart (kategori sedikit/waktu).",
            "Menganalisis Tren Sepanjang Waktu: Line Chart atau Area Chart kontinu.",
            "Melihat Komposisi Parsial: Donut Chart (maksimal 3-4 kategori) atau Treemap (kategori banyak/hierarkis).",
            "Mengamati Hubungan 2 Variabel Numerik: Scatter Plot (misal: Diskon vs Keuntungan).",
            "Melihat Perubahan dari Nilai Awal ke Akhir: Waterfall Chart (misal: Laba Kotor dikurangi biaya hingga Laba Bersih).",
            "Menelusuri Akar Masalah (Root Cause Analysis): Decomposition Tree."
          ]
        }
      ]
    }
  },
  {
    id: 8,
    title: "Level 8 — Data Interpretation Engine: Membaca Makna di Balik Angka",
    subtitle: "Kerangka terstruktur 5 tahap: Observasi, Bukti Statistik, Makna Bisnis, Investigasi Lanjutan & Batasan",
    level: "Intermediate",
    estTime: "65 Menit",
    keySkills: ["Statistical Reasoning", "Anomaly Detection", "Root Cause Analysis", "Correlation vs Causation", "Caveats & Limits"],
    description: "Fitur unggulan platform. Jangan hanya berhenti di grafik visual, kuasai kemampuan menyusun analisis bisnis berbasis bukti statistik aktual menggunakan kerangka evaluasi objektif.",
    interactiveLabLink: "interpretation-lab",
    content: {
      overview: "Grafik tanpa narasi hanya menghasilkan kebingungan. Di dunia korporat, Data Analyst dihargai bukan karena kemampuan menggambar chart, melainkan kemampuannya menginterpretasikan pola, menjelaskan implikasi bisnis, dan menyarankan tindakan perbaikan.",
      objectives: [
        "Menerapkan kerangka interpretasi 5 langkah: A. Observasi, B. Bukti Statistik, C. Makna Bisnis, D. Investigasi Lanjutan, E. Batasan Data.",
        "Membedakan korelasi (dua variabel bergerak bersama) dengan kausalitas (sebab-akibat).",
        "Mendeteksi dan menganalisis kategori dengan profit margin negatif secara objektif."
      ],
      sections: [
        {
          title: "1. Kerangka 5 Langkah Analis Data Profesional",
          description: "Gunakan urutan ini setiap kali menyajikan temuan dashboard:",
          details: [
            "A. What do we observe?: Deskripsikan apa yang terlihat pada grafik tanpa spekulasi (contoh: Penjualan kategori Furniture turun 18% di Q2).",
            "B. Statistical evidence: Sertakan angka riil pendukung (contoh: Penjualan Q1 Rp 120M vs Q2 Rp 98M, selisih -Rp 22M, median margin -4.2%).",
            "C. What does it mean?: Terjemahkan ke konteks bisnis (contoh: Diskon besar yang diberikan pada produk Meja tidak meningkatkan volume penjualan yang cukup untuk menutup biaya pokok).",
            "D. What should we investigate next?: Tentukan aksi verifikasi berikutnya (contoh: Audit biaya logistik ke luar pulau Jawa dan struktur diskon sales reps).",
            "E. Limitations: Akui keterbatasan data (contoh: Data belum mencatat data retur pelanggan yang diajukan di luar sistem)."
          ]
        }
      ]
    }
  },
  {
    id: 9,
    title: "Level 9 — Memahami Pola Distribusi Data: Histogram & Statistik Deskriptif",
    subtitle: "Kenali bentuk distribusi: Normal, Skewed Kanan/Kiri, Bimodal, Outliers IQR, dan Efek Bin Slider",
    level: "Advanced",
    estTime: "75 Menit",
    keySkills: ["Histogram & Binning", "Normal Distribution", "Right/Left Skewness", "IQR Outlier Detection", "Box Plot Math"],
    description: "Kupas tuntas distribusi data numerik dalam analitik bisnis. Pelajari perbedaan mean vs median saat terjadi skewness, cara mengidentifikasi outlier menggunakan aturan 1.5x IQR, dan dampak pemilihan jumlah bin histogram.",
    interactiveLabLink: "distribution-lab",
    content: {
      overview: "Rata-rata (mean) sering kali menyesatkan jika data memiliki skewness atau outlier ekstrem. Analis yang handal selalu memeriksa bentuk distribusi data sebelum mengambil kesimpulan bisnis.",
      objectives: [
        "Memahami 6 pola distribusi utama: Normal, Right-Skewed, Left-Skewed, Uniform, Bimodal, dan Pola Outliers.",
        "Mengetahui hubungan Mean, Median, dan Skewness dalam data bisnis.",
        "Menghitung pagar kuartil IQR (Q1 - 1.5*IQR dan Q3 + 1.5*IQR) untuk mendeteksi outlier.",
        "Bereksperimen dengan slider bin histogram dan mengamati perubahan visual."
      ],
      sections: [
        {
          title: "1. Mengapa Rata-Rata Sering Menipu?",
          description: "Contoh nyata: Jika ada 9 staf dengan gaji Rp 5.000.000 dan 1 direktur dengan gaji Rp 105.000.000, maka rata-rata gaji adalah Rp 15.000.000. Angka Rp 15.000.000 ini sama sekali tidak mencerminkan realitas mayoritas staf! Pada data yang menceng ke kanan (right-skewed), nilai Median (Rp 5.000.000) adalah ukuran tendensi sentral yang jauh lebih jujur.",
          details: [
            "Distribusi Normal: Simetris lonceng. Mean ≈ Median.",
            "Right-Skewed: Ekor panjang ke kanan akibat nilai-nilai sangat tinggi. Mean > Median.",
            "Left-Skewed: Ekor panjang ke kiri akibat nilai-nilai sangat rendah/negatif. Mean < Median.",
            "Bimodal: Memiliki dua puncak. Mengindikasikan adanya dua segmen pelanggan atau wilayah yang berbeda bercampur dalam satu dataset."
          ]
        }
      ]
    }
  },
  {
    id: 10,
    title: "Level 10 — Menghubungkan Data Besar: 10k, 100k, hingga 1M+ Baris",
    subtitle: "Arsitektur VertiPaq, Star Schema, Query Folding, Cardinality, dan Incremental Refresh",
    level: "Advanced",
    estTime: "80 Menit",
    keySkills: ["VertiPaq Engine", "High Cardinality Columns", "Query Folding", "Incremental Refresh", "Performance Analyzer"],
    description: "Pelajari strategi arsitektur saat menangani dataset skala enterprise. Kuasai mekanisme kompresi columnar database, eliminasi kolom tidak perlu, optimasi kardinalitas, dan teknik partisi data historis.",
    interactiveLabLink: "big-data-lab",
    content: {
      overview: "Power BI bukan sekadar spreadsheet pembaca tabel. Mesin internalnya, VertiPaq, adalah columnar in-memory database berkecepatan tinggi yang mampu memadatkan puluhan juta baris ke dalam beberapa ratus megabyte RAM jika model dirancang dengan benar.",
      objectives: [
        "Memahami cara kerja columnar storage vs row-based storage.",
        "Mengurangi kardinalitas kolom untuk meminimalkan konsumsi RAM.",
        "Memahami prinsip Query Folding di Power Query agar kalkulasi diproses di database server.",
        "Merancang kebijakan Incremental Refresh untuk memperbarui hanya baris data terbaru.",
        "Menggunakan Performance Analyzer untuk mengidentifikasi visual atau measure yang lambat."
      ],
      sections: [
        {
          title: "1. Rahasia Mesin VertiPaq: Columnar Compression",
          description: "Database relasional tradisional (SQL Server, PostgreSQL) menyimpan data baris demi baris (Row-based). Namun VertiPaq menyimpan data per kolom (Columnar).",
          details: [
            "Kardinalitas Kolom: Jumlah nilai unik dalam suatu kolom. Semakin sedikit nilai unik (misal kolom Status: 'Selesai', 'Pending', 'Batal' hanya 3 nilai unik), semakin tinggi rasio kompresi VertiPaq (bisa mencapai 10x-20x pemadatan).",
            "Kolom Bahaya: Kolom tanggal jam gabungan (YYYY-MM-DD HH:MM:SS) atau nomor resi unik jutaan baris memiliki kardinalitas sangat tinggi yang membebani memori.",
            "Praktik Terbaik: Selalu pisahkan kolom Date dan Time menjadi dua kolom terpisah di Power Query untuk mereduksi kardinalitas hingga 90%!"
          ]
        },
        {
          title: "2. Apa itu Query Folding?",
          description: "Query Folding adalah kemampuan Power Query untuk menerjemahkan Applied Steps Anda menjadi satu kueri SQL asli (native SQL query) dan mengirimkannya ke database sumber. Dengan demikian, server database yang kuat yang melakukan pemfilteran dan agregasi, bukan laptop analis.",
          details: [
            "Langkah yang mendukung folding: Filter baris, pilih kolom, group by, merge queries dengan sumber sejenis.",
            "Langkah yang memutus folding: Menulis formula custom kompleks, menambahkan kolom indeks lokal, merujuk file Excel lokal di tengah kueri SQL."
          ]
        }
      ]
    }
  },
  {
    id: 11,
    title: "Level 11 — Dashboard Studio: Merancang Laporan Interaktif Lengkap",
    subtitle: "Praktik membangun dashboard eksekutif: KPI, Slicer dinamis, Cross-filtering & Drill-down",
    level: "Advanced",
    estTime: "90 Menit",
    keySkills: ["Executive KPIs", "Slicers & Cross-filtering", "Monthly Trends", "Regional Analysis", "Period Comparison"],
    description: "Studio perancangan laporan interaktif. Bangun dashboard performa penjualan end-to-end yang dilengkapi filter tanggal, wilayah, kategori, perbandingan periode, serta penjelasan insight otomatis.",
    interactiveLabLink: "dashboard-studio",
    content: {
      overview: "Dashboard yang baik memberikan jawaban atas pertanyaan bisnis dalam hitungan detik. Informasi paling penting diletakkan di pojok kiri atas mengikuti pola membaca mata manusia (Z-pattern / F-pattern).",
      objectives: [
        "Membangun kartu KPI terpadu: Total Penjualan, Total Laba, Profit Margin %, Total Pesanan.",
        "Menghubungkan slicer dinamis untuk memfilter seluruh visual secara instan.",
        "Membuat visual tren bulanan, kontribusi kategori, dan profitabilitas wilayah.",
        "Menyediakan penjelasan insight otomatis berbasis filter yang sedang aktif."
      ],
      sections: [
        {
          title: "1. Tata Letak Dashboard Standar Industri",
          description: "Struktur layout laporan yang ideal:",
          details: [
            "Header Bar: Judul laporan yang jelas, filter tanggal/periode global, dan tombol reset filter.",
            "Zona KPI Utama (Top Row): 4-5 kartu metrik terpenting (Total Sales, Total Profit, Profit Margin, Total Orders).",
            "Zona Visual Utama (Middle): Grafik tren sepanjang waktu (Line Chart) berdampingan dengan perbandingan kategori (Bar Chart).",
            "Zona Analisis Mendalam (Bottom): Pemetaan wilayah, tabel peringkat produk teratas, dan breakdown segmen pelanggan."
          ]
        }
      ]
    }
  },
  {
    id: 12,
    title: "Level 12 — Power BI Service & Deployment: Publikasi & Kolaborasi Tim",
    subtitle: "Workspace, Scheduled Refresh, On-Premises Gateway, Row-Level Security (RLS) & Lisensi",
    level: "Advanced",
    estTime: "60 Menit",
    keySkills: ["Publish to Service", "Workspaces & Roles", "On-Premises Data Gateway", "Row-Level Security (RLS)", "Pro vs Fabric Licensing"],
    description: "Pelajari siklus hidup deployment laporan ke lingkungan cloud enterprise. Pahami pengelolaan hak akses workspace, arsitektur gateway lokal, konfigurasi keamanan baris (RLS), dan perbedaan opsi lisensi Microsoft.",
    interactiveLabLink: "docs",
    content: {
      overview: "Membuat laporan di Power BI Desktop hanyalah separuh perjalanan. Nilai bisnis sejati muncul saat laporan dipublikasikan ke Power BI Service agar dapat diakses oleh puluhan hingga ribuan karyawan secara aman dan terotomatisasi.",
      objectives: [
        "Mempublikasikan file .pbix ke Workspace Power BI Service.",
        "Memahami 4 peran Workspace: Admin, Member, Contributor, dan Viewer.",
        "Mengonfigurasi On-premises Data Gateway untuk menjadwalkan refresh database lokal.",
        "Menerapkan Row-Level Security (RLS) agar manajer wilayah hanya melihat data wilayahnya sendiri.",
        "Memahami perbedaan lisensi Power BI Free, Pro, Premium Per User (PPU), dan Microsoft Fabric Capacity."
      ],
      sections: [
        {
          title: "1. Peran dalam Power BI Workspace",
          description: "Manajemen hak akses kolaboratif:",
          table: {
            headers: ["Peran (Role)", "Dapat Mengedit Report", "Dapat Publish Data", "Dapat Atur Izin Tim", "Cocok Untuk"],
            rows: [
              ["Admin", "Ya", "Ya", "Ya (kelola workspace)", "Lead BI, Sistem Administrator"],
              ["Member", "Ya", "Ya", "Tidak (hanya undang viewer)", "Senior BI Developer"],
              ["Contributor", "Ya", "Ya", "Tidak", "Junior Analyst, Content Creator"],
              ["Viewer", "Tidak (hanya melihat)", "Tidak", "Tidak", "Manajemen, Karyawan Bisnis"]
            ]
          }
        },
        {
          title: "2. Arsitektur On-Premises Data Gateway",
          description: "Ketika laporan Power BI Anda di cloud perlu mengambil data dari server SQL lokal di kantor:",
          details: [
            "Gateway bertindak sebagai jembatan komunikasi aman yang diinstal pada mesin server di jaringan lokal kantor.",
            "Gateway membuat koneksi outbound terenkripsi ke Azure Service Bus Cloud; tidak memerlukan pembukaan port inbound di firewall kantor.",
            "Mendukung Standard Mode (melayani banyak pengguna dan scheduled refresh) dan Personal Mode (hanya untuk satu pengguna)."
          ]
        },
        {
          title: "3. Row-Level Security (RLS) untuk Keamanan Data",
          description: "RLS membatasi akses baris data untuk pengguna tertentu berdasarkan role DAX mereka:",
          codeSnippet: {
            language: "dax",
            code: `[Region] = USERPRINCIPALNAME()
-- atau role regional tetap:
[Region] = "Jawa"`,
            explanation: "Dengan satu laporan terpusat, Manajer Wilayah Jawa yang login hanya akan melihat data transaksi Jawa, sedangkan Manajer Sumatera hanya melihat data Sumatera."
          }
        },
        {
          title: "4. Peringatan Keamanan 'Publish to Web'",
          description: "Fitur 'Publish to Web (Public)' membuat URL publik yang dapat diakses oleh siapa saja di internet tanpa login dan tanpa perlindungan sandi! JANGAN PERNAH menggunakan fitur ini untuk data rahasia perusahaan, data keuangan, atau data pribadi karyawan."
        }
      ]
    }
  }
];
