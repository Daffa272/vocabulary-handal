import { VisualCatalogItem } from '../types';

export const visualCatalogList: VisualCatalogItem[] = [
  {
    id: 'kpi_card',
    name: 'Card / KPI (Kartu Indikator Utama)',
    category: 'KPI',
    iconName: 'CreditCard',
    businessQuestions: [
      'Berapa total penjualan perusahaan tahun ini?',
      'Apakah rasio profit margin kita mencapai target 20%?',
      'Berapa jumlah total tiket komplain pelanggan yang belum selesai?'
    ],
    requiredColumns: [
      '1 Kolom Numerik atau 1 Measure DAX (misal: [Total Sales], [Profit Margin])',
      'Opsional untuk KPI Card baru: Target Goal dan Trend Axis (misal: Tanggal Bulan).'
    ],
    buildSteps: [
      'Klik ikon "Card (new)" atau "KPI" pada panel Visualizations.',
      'Tarik measure [Total Sales] ke bagian "Data / Metric".',
      'Pada panel Format, atur Display Units (misal: Millions atau Billions) dan atur Callout Value font size.',
      'Tambahkan kartu label deskriptif di bagian bawah angka.'
    ],
    whyChoose: 'Eksekutif dan manajer membutuhkan angka penting dalam pandangan pertama (under 3 seconds) tanpa harus membaca sumbu grafik.',
    howToRead: 'Fokus pada angka besar (Callout Value). Jika ada indikator KPI, warna hijau/merah menunjukkan deviasi terhadap target.',
    patternsToWatch: [
      'Angka tiba-tiba bernilai BLANK (terjadi jika filter menghasilkan subset tanpa data).',
      'Format angka terlalu panjang jika tidak menggunakan Display Units yang rapi.'
    ],
    commonPitfalls: [
      'Meletakkan 15 kartu KPI sekaligus di bagian atas dashboard sehingga audiens kewalahan (information overload). Batasi 4-6 KPI terpenting.',
      'Menggunakan label ambigu seperti hanya "Penjualan" tanpa periode (seharusnya "YTD Sales 2024").'
    ]
  },
  {
    id: 'bar_chart',
    name: 'Bar Chart (Horizontal Bar)',
    category: 'Comparison',
    iconName: 'BarChartHorizontal',
    businessQuestions: [
      'Produk mana yang menyumbang pendapatan terbesar?',
      'Cabang mana yang memiliki waktu pelayanan paling lama?',
      'Kategori mana yang memiliki variasi SKU terbanyak?'
    ],
    requiredColumns: [
      'Y-Axis: 1 Kolom Kategori Teks (misal: Nama Produk, Kota, Departemen)',
      'X-Axis: 1 Measure Numerik (misal: [Total Sales])'
    ],
    buildSteps: [
      'Pilih "Clustered Bar Chart".',
      'Tarik Products[ProductName] ke field Y-axis.',
      'Tarik measure [Total Sales] ke field X-axis.',
      'Urutkan (Sort Axis) secara descending berdasarkan Total Sales.'
    ],
    whyChoose: 'Sangat ideal ketika label nama kategori cukup panjang (misal: nama cabang atau nama produk), karena teks terbaca mendatar dari kiri ke kanan tanpa miring.',
    howToRead: 'Bandingkan panjang batang secara horizontal. Batang terpanjang berada di posisi paling atas jika diurutkan descending.',
    patternsToWatch: [
      'Pola 80/20 (Prinsip Pareto): Beberapa kategori teratas mendominasi mayoritas total nilai.',
      'Perbedaan tipis antarkategori yang membutuhkan data label eksplisit.'
    ],
    commonPitfalls: [
      'Mengurutkan berdasarkan abjad bukan berdasarkan nilai metrik, sehingga sulit mengidentifikasi top performer dengan cepat.',
      'Memotong sumbu dasar X (baseline) tidak dari angka 0, yang dapat mendistorsi persepsi proporsi.'
    ]
  },
  {
    id: 'column_chart',
    name: 'Column Chart (Vertical Column)',
    category: 'Comparison',
    iconName: 'BarChart3',
    businessQuestions: [
      'Bagaimana perbandingan penjualan antar 4 kuartal tahun ini?',
      'Wilayah geografis mana yang memiliki volume pesanan tertinggi?'
    ],
    requiredColumns: [
      'X-Axis: Kolom Kategori diskrit atau Waktu berurutan (misal: Kuartal, Kategori)',
      'Y-Axis: Measure Nilai Numerik (misal: [Total Sales])'
    ],
    buildSteps: [
      'Pilih "Clustered Column Chart".',
      'Tarik DimCalendar[Quarter] ke X-axis.',
      'Tarik [Total Sales] ke Y-axis.',
      'Format warna batang agar serasi dengan palet brand laporan.'
    ],
    whyChoose: 'Standar emas untuk membandingkan jumlah kategori yang sedikit (di bawah 7 kategori) atau tahapan waktu diskrit (bulan, kuartal).',
    howToRead: 'Tinggi batang secara vertikal menggambarkan besaran nilai.',
    patternsToWatch: [
      'Fluktuasi bertahap dari kiri ke kanan.',
      'Kesenjangan mencolok antara satu kategori dengan kategori lainnya.'
    ],
    commonPitfalls: [
      'Menampilkan 30 kategori berbeda pada Column Chart sehingga label teks di sumbu X miring 45 derajat dan tidak terbaca. Jika kategori banyak, gunakan Bar Chart horizontal!'
    ]
  },
  {
    id: 'line_chart',
    name: 'Line Chart (Grafik Garis Tren)',
    category: 'Trend',
    iconName: 'TrendingUp',
    businessQuestions: [
      'Bagaimana tren omzet harian atau bulanan selama 3 tahun terakhir?',
      'Apakah ada pola musiman (seasonality) di bulan Desember setiap tahun?',
      'Apakah tren margin profit menunjukkan kecenderungan naik atau turun?'
    ],
    requiredColumns: [
      'X-Axis: Kolom Tanggal Kontinu (Date dari tabel Calendar / Date Table)',
      'Y-Axis: 1 atau lebih Measure Numerik (misal: [Total Sales], [Sales LY])',
      'Opsional Legend: Kategori pembanding (misal: Category).'
    ],
    buildSteps: [
      'Pilih "Line Chart".',
      'Tarik Date dari DimCalendar ke X-axis.',
      'Tarik [Total Sales] ke Y-axis.',
      'Tambahkan Garis Tren (Trend Line) melalui panel Analytics jika diperlukan.'
    ],
    whyChoose: 'Mata manusia secara alami mengikuti kontinuitas garis untuk mendeteksi arah tren (naik, turun, mendatar) dan titik balik (turning points).',
    howToRead: 'Sumbu horizontal mewakili waktu yang bergerak maju. Kemiringan garis menunjukkan laju perubahan (akselerasi kenaikan atau penurunan).',
    patternsToWatch: [
      'Lonjakan musiman (Seasonality peaks).',
      'Penurunan tajam tiba-tiba (dips) yang mengindikasikan libur panjang atau gangguan sistem.'
    ],
    commonPitfalls: [
      'Menggunakan tipe data teks untuk tanggal di sumbu X, yang menyebabkan urutan bulan menjadi berantakan (misal: April, Agustus, Desember berdasarkan abjad). Wajib gunakan Date Table!'
    ]
  },
  {
    id: 'stacked_chart',
    name: 'Stacked Column / Bar (Grafik Batang Bertumpuk)',
    category: 'Composition',
    iconName: 'Layers',
    businessQuestions: [
      'Bagaimana komposisi penjualan per kategori produk di masing-masing wilayah?',
      'Berapa kontribusi pelanggan Korporat vs Konsumen dalam total omzet setiap kuartal?'
    ],
    requiredColumns: [
      'X-Axis: Dimensi Utama (misal: Region)',
      'Y-Axis: Measure Nilai (misal: [Total Sales])',
      'Legend: Dimensi Pembagi Komposisi (misal: CustomerSegment)'
    ],
    buildSteps: [
      'Pilih "Stacked Column Chart".',
      'Tarik Region ke X-axis, Total Sales ke Y-axis, dan CustomerSegment ke Legend.',
      'Aktifkan Data Labels untuk melihat nilai setiap segmen tumpukan.'
    ],
    whyChoose: 'Memungkinkan melihat total nilai keseluruhan sekaligus memecah kontribusi sub-kelompok di dalam satu batang.',
    howToRead: 'Tinggi keseluruhan batang menunjukkan total nilai gabungan. Setiap segmen warna menunjukkan proporsi segmen tersebut.',
    patternsToWatch: [
      'Perubahan dominasi segmen tertentu di wilayah yang berbeda.',
      'Segmen yang konsisten kecil di semua kategori.'
    ],
    commonPitfalls: [
      'Sangat sulit membandingkan nilai segmen yang berada di posisi tengah tumpukan karena tidak memiliki garis dasar (baseline) yang rata. Jika perbandingan segmen tengah sangat krusial, gunakan 100% Stacked Chart atau Clustered Column.'
    ]
  },
  {
    id: 'donut_chart',
    name: 'Donut / Pie Chart (Grafik Donat)',
    category: 'Composition',
    iconName: 'PieChart',
    businessQuestions: [
      'Berapa proporsi pangsa pasar antara kategori Teknologi, Kantor, dan Furnitur?',
      'Berapa rasio transaksi pelanggan baru vs pelanggan lama?'
    ],
    requiredColumns: [
      'Legend: Kolom Kategori (maksimal 2-4 kategori)',
      'Values: Measure Nilai Numerik (misal: [Total Sales])'
    ],
    buildSteps: [
      'Pilih "Donut Chart".',
      'Tarik Category ke Legend dan [Total Sales] ke Values.',
      'Atur Detail Labels agar menampilkan "Category, percent of total".'
    ],
    whyChoose: 'Donut chart memiliki ruang kosong di tengah yang lebih elegan dan mudah dibaca dibanding Pie chart tradisional, cocok untuk melihat bagian dari keseluruhan (part-to-whole) dengan kategori sangat sedikit.',
    howToRead: 'Ukuran busur lingkaran mewakili persentase kontribusi terhadap 100%.',
    patternsToWatch: [
      'Apakah satu kategori menguasai lebih dari separuh (50%) lingkaran.',
      'Keseimbangan proporsi antar segmen.'
    ],
    commonPitfalls: [
      'Menggunakan Donut Chart untuk lebih dari 5 kategori! Donut chart dengan belasan irisan kecil terlihat seperti roda warna yang mustahil dibandingkan dengan akurat.'
    ]
  },
  {
    id: 'scatter_plot',
    name: 'Scatter Plot (Diagram Pencar)',
    category: 'Distribution',
    iconName: 'Scatter',
    businessQuestions: [
      'Apakah produk dengan diskon tinggi benar-benar menghasilkan volume penjualan yang lebih besar?',
      'Bagaimana korelasi antara biaya pemasaran dan pendapatan yang dihasilkan tiap cabang?',
      'Produk mana yang menjadi outlier (penjualan tinggi namun rugi besar)?'
    ],
    requiredColumns: [
      'X-Axis: Measure Numerik 1 (misal: [Average Discount])',
      'Y-Axis: Measure Numerik 2 (misal: [Total Profit])',
      'Values / Details: Dimensi perincian titik (misal: Product atau Customer)',
      'Opsional Size: Measure besaran gelembung (misal: [Total Sales]).'
    ],
    buildSteps: [
      'Pilih "Scatter Chart".',
      'Tarik [Average Discount] ke X-axis dan [Total Profit] ke Y-axis.',
      'Tarik Products[ProductName] ke Values/Details.',
      'Tambahkan garis kuadran rata-rata (Average Line pada X dan Y) via panel Analytics.'
    ],
    whyChoose: 'Satu-satunya visual standar yang dirancang untuk menguji korelasi dan distribusi hubungan antara dua variabel numerik kontinu.',
    howToRead: 'Setiap titik mewakili satu item/produk. Posisi kiri-kanan menunjukkan variabel X, posisi atas-bawah menunjukkan variabel Y.',
    patternsToWatch: [
      'Korelasi Positif: Titik-titik membentuk pola miring ke kanan atas.',
      'Korelasi Negatif: Titik-titik miring ke kanan bawah.',
      'Outlier terisolasi di pojok kanan bawah (diskon tinggi, profit sangat minus).'
    ],
    commonPitfalls: [
      'Menyimpulkan hubungan sebab-akibat (causation) semata-mata karena korelasi tampak kuat. Diskon tinggi dan penjualan tinggi mungkin sama-sama dipengaruhi oleh faktor musiman liburan.'
    ]
  },
  {
    id: 'histogram',
    name: 'Histogram (Distribusi Frekuensi)',
    category: 'Distribution',
    iconName: 'BarChart2',
    businessQuestions: [
      'Berapa rentang nilai transaksi belanja yang paling sering terjadi?',
      'Bagaimana distribusi umur pelanggan atau masa kerja karyawan?',
      'Apakah transaksi berkumpul di nilai kecil atau tersebar merata?'
    ],
    requiredColumns: [
      'Rentang Kelompok (Binning): Kolom Numerik yang dikelompokkan menjadi Bins di Power BI (Group by Bins)',
      'Values: COUNT atau COUNTROWS dari transaksi.'
    ],
    buildSteps: [
      'Di panel Data, klik kanan kolom Sales[SalesAmount] → New Group.',
      'Pilih Group type: "Bin", tentukan Bin size (misal: Rp 5.000.000).',
      'Buat Column Chart dengan memasukkan grup bin tersebut ke X-axis dan Count of OrderID ke Y-axis.'
    ],
    whyChoose: 'Memungkinkan analis melihat bentuk sebaran (distribusi) data populasi, bukan hanya nilai agregat ringkasannya.',
    howToRead: 'Sumbu X adalah rentang interval (bin), sumbu Y adalah jumlah frekuensi kejadian.',
    patternsToWatch: [
      'Puncak modus tunggal (Unimodal) atau ganda (Bimodal).',
      'Kemencengan ke kanan (Right-skewed) yang khas pada data pendapatan transaksi.'
    ],
    commonPitfalls: [
      'Memilih ukuran bin yang terlalu lebar (semua data masuk ke 2 batang) atau terlalu sempit (setiap nilai punya batang sendiri seperti sisir).'
    ]
  },
  {
    id: 'box_plot',
    name: 'Box Plot (Kuartil & Deteksi Outlier)',
    category: 'Distribution',
    iconName: 'Box',
    businessQuestions: [
      'Berapa nilai median, kuartil bawah (Q1), dan kuartil atas (Q3) dari waktu pengiriman?',
      'Apakah ada pesanan dengan waktu proses yang luar biasa lambat (outliers)?',
      'Bagaimana perbandingan sebaran gaji antar divisi perusahaan?'
    ],
    requiredColumns: [
      'Category Axis: Kolom Kategori (misal: Wilayah atau Departemen)',
      'Value: Nilai numerik granular transaksi individu.'
    ],
    buildSteps: [
      'Gunakan custom visual terverifikasi (misal: Box and Whisker chart by MAQ Software) atau bangun via matriks kuartil DAX.',
      'Masukkan Kategori ke Axis dan kolom transaksi ke Sampling Value.'
    ],
    whyChoose: 'Standar ilmiah statistik deskriptif untuk merangkum 5 angka ringkasan (Minimum, Q1, Median, Q3, Maximum) dan secara objektif menandai titik pencilan (outlier) di luar pagar 1.5x IQR.',
    howToRead: 'Garis di dalam kotak adalah Median. Lebar kotak adalah Interquartile Range (IQR = Q3 - Q1). Titik di luar kumis adalah outlier.',
    patternsToWatch: [
      'Kotak yang asimetris menunjukkan kemiringan distribusi.',
      'Titik outlier di atas kumis atas.'
    ],
    commonPitfalls: [
      'Mengira garis tengah kotak adalah Mean (itu adalah Median!). Nilai Mean biasanya ditandai dengan simbol titik atau silang tersendiri.'
    ]
  },
  {
    id: 'matrix',
    name: 'Matrix (Tabel Silang Berlapis)',
    category: 'Comparison',
    iconName: 'Grid',
    businessQuestions: [
      'Berapa rincian penjualan per kategori untuk setiap kuartal dan bulan?',
      'Bagaimana laporan laba rugi berlapis (Hierarchical P&L) cabang?'
    ],
    requiredColumns: [
      'Rows: Hierarki Kategori (misal: Category → SubCategory → Product)',
      'Columns: Dimensi Waktu (misal: Year → Quarter)',
      'Values: Satu atau lebih Measure DAX ([Sales], [Profit], [Margin %])'
    ],
    buildSteps: [
      'Pilih visual "Matrix".',
      'Tarik hierarki baris ke Rows dan dimensi waktu ke Columns.',
      'Tarik measures ke Values.',
      'Aktifkan Conditional Formatting (Data Bars atau Background Color scales).'
    ],
    whyChoose: 'Sangat disukai oleh tim akuntansi dan manajemen keuangan yang terbiasa dengan Pivot Table di Excel, mendukung ekspansi bertingkat (+ / -).',
    howToRead: 'Membaca perpotongan sel antara baris hierarki dan kolom periode.',
    patternsToWatch: [
      'Sel dengan formatting warna merah (indikator margin negatif atau deviasi target).',
      'Subtotal dan Grand Total konsisten.'
    ],
    commonPitfalls: [
      'Memuat terlalu banyak baris detail tanpa filter awal, yang menyebabkan visual memakan waktu lama saat melakukan query VertiPaq.'
    ]
  },
  {
    id: 'waterfall_chart',
    name: 'Waterfall Chart (Grafik Jembatan Selisih)',
    category: 'Trend',
    iconName: 'GitCommit',
    businessQuestions: [
      'Faktor apa saja yang menyebabkan laba bersih naik dari Rp 500M di Q1 menjadi Rp 650M di Q2?',
      'Bagaimana rincian pendapatan dikurangi potongan diskon, COGS, dan biaya operasional menghasilkan Laba Bersih?'
    ],
    requiredColumns: [
      'Category: Urutan waktu (Bulan/Kuartal) atau Elemen Biaya/Kategori',
      'Y-Axis: Measure Perubahan Nilai (+ atau -).'
    ],
    buildSteps: [
      'Pilih "Waterfall Chart".',
      'Tarik DimCalendar[Month] ke Category.',
      'Tarik [Profit Variance] ke Y-axis.',
      'Atur warna: Hijau untuk kenaikan, Merah untuk penurunan, Biru untuk total saldo akhir.'
    ],
    whyChoose: 'Sangat efektif menjelaskan "jembatan cerita" bagaimana suatu nilai awal bermutasi menjadi nilai akhir melalui serangkaian penambahan positif dan pengurangan negatif.',
    howToRead: 'Batang mengambang pertama adalah saldo awal. Batang hijau menaikkan saldo, batang merah menurunkan saldo, dan batang terakhir yang bertumpu di lantai dasar adalah saldo akhir.',
    patternsToWatch: [
      'Faktor pengurang terbesar yang mengikis keuntungan bisnis.',
      'Kontributor pendorong positif utama.'
    ],
    commonPitfalls: [
      'Menampilkan data tanpa urutan kronologis atau urutan akun yang logis.'
    ]
  },
  {
    id: 'decomposition_tree',
    name: 'Decomposition Tree (Pohon Dekomposisi)',
    category: 'Advanced',
    iconName: 'GitFork',
    businessQuestions: [
      'Wilayah, produk, dan segmen mana yang paling bertanggung jawab atas penurunan margin profit perusahaan?',
      'Di cabang mana efisiensi operasional paling buruk?'
    ],
    requiredColumns: [
      'Analyze: Measure Numerik utama yang ingin ditelusuri (misal: [Total Sales] atau [Profit Margin])',
      'Explain By: Kumpulan dimensi kandidat penyebab (misal: Region, Category, CustomerSegment, ShipMode).'
    ],
    buildSteps: [
      'Pilih visual "Decomposition Tree".',
      'Tarik [Profit Margin] ke field Analyze.',
      'Tarik Region, Category, Segment ke field Explain By.',
      'Pengguna dapat mengklik tombol "+" pada visual untuk memilih pemecahan manual atau pemecahan otomatis berdasarkan High Value / Low Value.'
    ],
    whyChoose: 'Fitur AI visual interaktif terbaik untuk Root Cause Analysis dan penelusuran masalah secara fleksibel dan ad-hoc.',
    howToRead: 'Pohon bercabang dari kiri ke kanan. Membaca cabang memberikan gambaran kontribusi faktor step-by-step.',
    patternsToWatch: [
      'Cabang dengan nilai negatif ekstrem yang tersembunyi di level sub-kategori.',
      'Perbedaan proporsi ketika cabang dipecah berdasarkan dimensi lain.'
    ],
    commonPitfalls: [
      'Memasukkan dimensi dengan ratusan ribu kategori unik (kardinalitas tinggi) yang membuat pohon terlalu rumit untuk dijelajahi pengguna biasa.'
    ]
  },
  {
    id: 'map_visual',
    name: 'Map / Filled Map (Peta Geografis)',
    category: 'Advanced',
    iconName: 'MapPin',
    businessQuestions: [
      'Kota atau provinsi mana di Indonesia yang memiliki konsentrasi transaksi terbesar?',
      'Bagaimana penetrasi pasar di luar pulau Jawa?'
    ],
    requiredColumns: [
      'Location: Kolom Nama Provinsi, Nama Kota, atau Kode Pos (Data Category diset "State or Province" / "City")',
      'Bubble Size: Measure Nilai (misal: [Total Sales])'
    ],
    buildSteps: [
      'Pastikan di Table View kolom Provinsi diatur Data Category-nya ke "State or Province".',
      'Pilih "Azure Map" atau "Shape Map".',
      'Tarik Region/Provinsi ke Location dan [Total Sales] ke Bubble Size.'
    ],
    whyChoose: 'Memberikan konteks spasial instan untuk mengidentifikasi kluster geografis dan kesenjangan regional.',
    howToRead: 'Ukuran lingkaran bubble di atas peta sebanding dengan volume penjualan di lokasi tersebut.',
    patternsToWatch: [
      'Sentralisasi penjualan di wilayah ibukota vs wilayah kepulauan.',
      'Peluang ekspansi di kota tier-2.'
    ],
    commonPitfalls: [
      'Ketidakcocokan nama lokasi (geocoding mismatch), misal nama kota di Indonesia tertukar dengan nama kota serupa di negara lain jika tidak dilengkapi kolom Negara "Indonesia".'
    ]
  },
  {
    id: 'slicer',
    name: 'Slicer (Filter Interaktif Laporan)',
    category: 'KPI',
    iconName: 'Filter',
    businessQuestions: [
      'Bagaimana kinerja dashboard jika saya hanya ingin melihat tahun 2024?',
      'Bagaimana perbandingan metrik jika difilter khusus untuk segmen B2B Corporate?'
    ],
    requiredColumns: [
      'Field: Kolom Dimensi Kategori atau Kolom Tanggal (misal: DimCalendar[Year], Products[Category])'
    ],
    buildSteps: [
      'Pilih visual "Slicer".',
      'Tarik DimCalendar[Year] atau DimProduct[Category] ke Field.',
      'Ubah tipe slicer di format: Dropdown, Vertical List, Tile, atau Between (rentang slider tanggal).'
    ],
    whyChoose: 'Memberikan kendali interaktif kepada audiens laporan untuk menyaring seluruh halaman dashboard tanpa harus membuka panel filter teknis di samping.',
    howToRead: 'Item yang terpilih (highlighted) adalah kondisi filter yang sedang memengaruhi seluruh visual di halaman.',
    patternsToWatch: [
      'Memastikan interaksi filter (Edit Interactions) bekerja sesuai skenario yang diinginkan.'
    ],
    commonPitfalls: [
      'Meletakkan terlalu banyak slicer di atas kanvas sehingga memakan separuh ruang visual laporan.',
      'Memilih single-select secara tidak sengaja ketika pengguna membutuhkan filter multi-kategori.'
    ]
  }
];
