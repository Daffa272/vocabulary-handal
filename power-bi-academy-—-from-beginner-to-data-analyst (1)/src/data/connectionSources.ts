import { ConnectionSource } from '../types';

export const connectionSources: ConnectionSource[] = [
  {
    id: 'excel',
    name: 'Microsoft Excel (.xlsx, .xlsm)',
    category: 'File',
    icon: 'FileSpreadsheet',
    whenToUse: 'Data awal bisnis, laporan mingguan tim operasional, atau target anggaran tahunan.',
    preparation: [
      'Ubah data menjadi Excel Table resmi dengan menekan Ctrl + T di Excel.',
      'Beri nama tabel di Name Box (contoh: tbl_Sales, tbl_Products).',
      'Hindari baris total otomatis (Total Row) di bagian bawah tabel.',
      'Pastikan header kolom hanya 1 baris tanpa merged cells (sel tergabung).'
    ],
    stepByStep: [
      'Buka Power BI Desktop → Home Ribbon → Get Data → Excel Workbook.',
      'Arahkan ke file Excel Anda di komputer atau network drive.',
      'Pada jendela Navigator, pilih tabel dengan ikon bertanda biru (bukan sheet).',
      'Pilih tombol "Transform Data" untuk membuka Power Query Editor.',
      'Periksa tipe data setiap kolom, lalu klik "Close & Apply".'
    ],
    credentials: 'File lokal menggunakan izin akun Windows pengguna; file jaringan memerlukan izin baca (Read) pada folder folder share.',
    pros: [
      'Sangat mudah disiapkan tanpa infrastruktur server.',
      'Mendukung tipe data kompleks, formula, dan komentar.'
    ],
    limitations: [
      'Tidak cocok untuk multi-user concurrent write.',
      'Path file lokal sulit di-refresh jika laporan dipublikasikan ke Power BI Service.'
    ],
    supportedModes: ['Import'],
    refreshMechanism: 'Desktop: refresh membaca file langsung. Service: memerlukan On-Premises Data Gateway kecuali file disimpan di SharePoint/OneDrive.',
    troubleshootingTips: [
      { issue: 'The key didn\'t match any rows in the table', resolution: 'Nama sheet atau nama Excel Table telah diganti atau dihapus di file Excel asli.' },
      { issue: 'Evaluation ran out of memory', resolution: 'File Excel memuat terlalu banyak formula lambat atau baris kosong yang tidak disengaja di bagian paling bawah.' }
    ]
  },
  {
    id: 'csv',
    name: 'CSV & TXT File',
    category: 'File',
    icon: 'FileText',
    whenToUse: 'Ekspor data mentah dari sistem ERP/CRM, file log transaksi, atau dataset open-source.',
    preparation: [
      'Periksa karakter pemisah (delimiter: koma, titik koma, atau tab).',
      'Pastikan encoding file menggunakan UTF-8 untuk menghindari karakter rusak.',
      'Pastikan tidak ada baris header ganda atau catatan kaki sistem.'
    ],
    stepByStep: [
      'Klik Get Data → Text/CSV.',
      'Pilih file, Power BI akan menampilkan dialog preview pendeteksian delimiter.',
      'Pilih "Delimiter: Comma" atau "Semicolon" sesuai format file Anda.',
      'Tentukan Data Type Detection: "Based on first 200 rows".',
      'Klik "Transform Data" untuk memeriksa kolom numerik dan tanggal.'
    ],
    credentials: 'Izin akses file sistem Windows lokal atau network share.',
    pros: [
      'Format data paling universal dan ringan.',
      'Waktu parsing sangat cepat dibanding workbook Excel.'
    ],
    limitations: [
      'Tidak menyimpan informasi tipe data; semua dibaca sebagai teks mentah.',
      'Tidak mendukung multi-table dalam satu file.'
    ],
    supportedModes: ['Import'],
    refreshMechanism: 'Membaca ulang file dari path yang ditentukan saat tombol Refresh diklik.',
    troubleshootingTips: [
      { issue: 'Semua kolom tergabung dalam satu kolom panjang', resolution: 'Delimiter salah terdeteksi. Ubah delimiter dari Comma menjadi Semicolon di Power Query.' }
    ]
  },
  {
    id: 'folder',
    name: 'Folder (Multi-File Consolidation)',
    category: 'File',
    icon: 'FolderArchive',
    whenToUse: 'Ketika Anda menerima file laporan berformat identik secara rutin (misal: Sales_Jan.csv, Sales_Feb.csv, dst).',
    preparation: [
      'Pastikan semua file di dalam folder memiliki struktur nama kolom dan tipe data yang persis sama.',
      'Hapus file draft, backup sementara, atau file format lain dari folder tersebut.'
    ],
    stepByStep: [
      'Klik Get Data → More... → Folder → Connect.',
      'Masukkan path folder (contoh: C:\\Monthly_Reports).',
      'Klik tombol "Combine & Transform Data".',
      'Pilih Sample File (biasanya First File) sebagai cetak biru transformasi.',
      'Power Query akan otomatis membuat fungsi perulangan (Helper Queries) untuk menggabungkan semua file.'
    ],
    credentials: 'Izin sistem operasi untuk membaca isi folder.',
    pros: [
      'Sangat hemat waktu; jika ada file bulan baru cukup ditaruh ke folder lalu refresh!',
      'Otomatis menambahkan kolom "Source.Name" sebagai penanda asal file.'
    ],
    limitations: [
      'Jika ada 1 file saja yang header kolomnya typo, seluruh proses refresh akan gagal.',
      'Kombinasi ribuan file kecil dapat memakan waktu lama saat evaluasi.'
    ],
    supportedModes: ['Import'],
    refreshMechanism: 'Memindai seluruh file yang ada di folder pada saat eksekusi refresh.',
    troubleshootingTips: [
      { issue: 'Column [X] of the table wasn\'t found in Sample File', resolution: 'Satu file baru memiliki nama kolom yang berbeda. Buka file tersebut dan samakan nama kolomnya.' }
    ]
  },
  {
    id: 'sql_server',
    name: 'Microsoft SQL Server',
    category: 'Database',
    icon: 'Database',
    whenToUse: 'Sistem transaksional perusahaan, core banking, data mart relasional internal.',
    preparation: [
      'Dapatkan nama Server, Port, dan nama Database dari Database Administrator (DBA).',
      'Pastikan port 1433 tidak diblokir oleh firewall kantor.',
      'Siapkan akun login SQL Server atau Windows Authentication.'
    ],
    stepByStep: [
      'Klik Get Data → SQL Server Database.',
      'Masukkan nama Server (misal: srv-db-prod.corp.id) dan Database (opsional).',
      'Pilih Data Connectivity Mode: "Import" atau "DirectQuery".',
      'Pada Advanced Options, Anda dapat memasukkan kueri SQL kustom jika diperlukan.',
      'Pilih tabel/view di jendela Navigator lalu klik "Transform Data".'
    ],
    credentials: 'Windows Authentication, Database Credentials (User/Password), atau Microsoft Entra ID.',
    pros: [
      'Mendukung penuh Query Folding (kueri dieksekusi di database server).',
      'Mendukung mode DirectQuery untuk data berukuran raksasa tanpa mendownload data.'
    ],
    limitations: [
      'DirectQuery dapat membebani CPU server database jika laporan diakses banyak pengguna.',
      'Membutuhkan On-Premises Data Gateway untuk scheduled refresh di cloud.'
    ],
    supportedModes: ['Import', 'DirectQuery', 'Composite'],
    refreshMechanism: 'Import: Menarik data via TCP/IP. DirectQuery: Mengirim SQL kueri dinamis saat visual dibuka.',
    troubleshootingTips: [
      { issue: 'A network-related or instance-specific error occurred', resolution: 'Cek apakah firewall memblokir port 1433 atau VPN kantor belum terhubung.' }
    ]
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL Database',
    category: 'Database',
    icon: 'DatabaseZap',
    whenToUse: 'Aplikasi web modern, database open-source, analitik operasional cloud (AWS RDS / GCP Cloud SQL).',
    preparation: [
      'Pastikan Npgsql .NET Data Provider terinstal jika menggunakan versi Power BI lama.',
      'Izinkan alamat IP komputer/Gateway di Security Groups PostgreSQL.',
      'Dapatkan port (default: 5432) dan nama database.'
    ],
    stepByStep: [
      'Klik Get Data → PostgreSQL database.',
      'Ketik Server dan Database name.',
      'Pilih Import atau DirectQuery.',
      'Pilih skema (misal: "public") dan tabel yang ditargetkan.',
      'Lakukan validasi tipe data di Power Query.'
    ],
    credentials: 'Database Authentication (Username & Password) dengan opsi SSL.',
    pros: [
      'Kinerja sangat stabil untuk agregasi data transaksional.',
      'Konektor native didukung secara resmi oleh Microsoft.'
    ],
    limitations: [
      'Tipe data JSON/JSONB memerlukan parsing kolom kustom di Power Query.',
      'DirectQuery memerlukan optimasi indeks pada kolom yang sering difilter.'
    ],
    supportedModes: ['Import', 'DirectQuery', 'Composite'],
    refreshMechanism: 'Mengeksekusi SQL query terhadap PostgreSQL cluster.',
    troubleshootingTips: [
      { issue: 'An error occurred while reading from the connection: EOF', resolution: 'Koneksi SSL terputus atau timeout. Tingkatkan Command Timeout di opsi lanjutan.' }
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL Database',
    category: 'Database',
    icon: 'Server',
    whenToUse: 'E-commerce platform (WooCommerce, Magento), aplikasi backend CMS, sistem operasional web.',
    preparation: [
      'Wajib menginstal MySQL Connector/NET (.NET driver) di komputer Windows jika diminta.',
      'Buka akses port 3306 pada firewall server database.'
    ],
    stepByStep: [
      'Klik Get Data → MySQL Database.',
      'Masukkan alamat host server dan nama database.',
      'Pilih metode penyimpanan (Import / DirectQuery).',
      'Pilih tabel transaksi dan tabel master di Navigator.'
    ],
    credentials: 'User & Password database MySQL.',
    pros: [
      'Sangat populer dan digunakan di jutaan sistem bisnis global.',
      'Dukungan penuh untuk filter dan group-by via query folding.'
    ],
    limitations: [
      'Performa DirectQuery pada tabel tanpa indexing yang tepat akan lambat.'
    ],
    supportedModes: ['Import', 'DirectQuery', 'Composite'],
    refreshMechanism: 'Menarik data melalui driver ADO.NET MySQL.',
    troubleshootingTips: [
      { issue: 'This connector requires one or more additional components', resolution: 'Instal MySQL Connector NET versi x64 resmi dari situs Oracle MySQL.' }
    ]
  },
  {
    id: 'bigquery',
    name: 'Google BigQuery',
    category: 'Enterprise',
    icon: 'Cloud',
    whenToUse: 'Perusahaan modern dengan Big Data ratusan gigabyte hingga petabyte di ekosistem Google Cloud.',
    preparation: [
      'Akun Google Cloud Platform (GCP) dengan izin BigQuery Data Viewer & Job User.',
      'Tahu Google Cloud Project ID dan Dataset ID.'
    ],
    stepByStep: [
      'Klik Get Data → Google BigQuery.',
      'Pilih metode autentikasi Organisasi atau Akun Google.',
      'Masuk dengan browser (OAuth popup).',
      'Jelajahi hierarki Project ID → Dataset → Tables / Views.',
      'Pilih mode DirectQuery untuk volume raksasa atau Import untuk data agregasi.'
    ],
    credentials: 'Google OAuth 2.0 / Service Account Key.',
    pros: [
      'Mampu memproses miliaran baris dalam hitungan detik di sisi BigQuery.',
      'Kapasitas penyimpanan nyaris tanpa batas.'
    ],
    limitations: [
      'DirectQuery dapat meningkatkan tagihan query GCP jika dashboard memiliki visual yang boros komputasi.',
      'Refresh terjadwal di Service memerlukan konfigurasi cloud credentials.'
    ],
    supportedModes: ['Import', 'DirectQuery', 'Composite'],
    refreshMechanism: 'Mengirim SQL Dialect BigQuery via Google Cloud APIs.',
    troubleshootingTips: [
      { issue: 'Quota exceeded for query execution', resolution: 'Query melebihi batas kuota harian GCP. Gunakan tabel agregasi atau beralih ke Import mode terjadwal.' }
    ]
  },
  {
    id: 'sharepoint',
    name: 'SharePoint & OneDrive for Business',
    category: 'Cloud / Web',
    icon: 'Share2',
    whenToUse: 'File Excel atau CSV yang dikerjakan secara kolaboratif oleh banyak anggota tim di cloud.',
    preparation: [
      'Salin URL folder SharePoint atau URL situs utama (jangan salin URL file langsung dengan token query string).',
      'Pastikan akun Microsoft Anda memiliki izin akses pada pustaka dokumen.'
    ],
    stepByStep: [
      'Klik Get Data → SharePoint Folder (atau Web connector untuk direct link OneDrive).',
      'Tempelkan URL Root Site SharePoint (contoh: https://perusahaan.sharepoint.com/sites/Keuangan).',
      'Pilih autentikasi "Microsoft Account" dan klik Sign In.',
      'Di Power Query, filter kolom "Folder Path" dan "Name" menuju file Anda, lalu klik ikon "Binary".'
    ],
    credentials: 'Microsoft Entra ID (Organizational Account).',
    pros: [
      'TIDAK MEMERLUKAN GATEWAY untuk scheduled refresh di Power BI Service!',
      'File otomatis tersimpan di cloud dengan version history Microsoft 365.'
    ],
    limitations: [
      'Kecepatan download file dipengaruhi oleh latensi jaringan internet.'
    ],
    supportedModes: ['Import'],
    refreshMechanism: 'Cloud-to-Cloud Refresh langsung antar server Microsoft.',
    troubleshootingTips: [
      { issue: 'The specified URL is not valid', resolution: 'Pastikan Anda hanya memasukkan root URL situs, bukan path lengkap file .xlsx.' }
    ]
  },
  {
    id: 'web_api',
    name: 'REST API & Web Endpoint',
    category: 'Cloud / Web',
    icon: 'Globe',
    whenToUse: 'Menarik data kurs mata uang harian, data cuaca, webhook CRM modern, atau API internal.',
    preparation: [
      'Dokumentasi API, API Endpoint URL, API Key, atau Header Token.',
      'Pahami apakah API menggunakan pagination (pembagian halaman).'
    ],
    stepByStep: [
      'Klik Get Data → Web.',
      'Pilih Basic (untuk URL publik) atau Advanced (untuk menambahkan Headers, API Keys, Authorization Bearer).',
      'Klik OK, Power BI akan menerima respons payload JSON.',
      'Gunakan fungsi "Into Table" dan "Expand Records" di Power Query untuk memecah array JSON menjadi kolom.'
    ],
    credentials: 'Anonymous, API Key, Basic, atau Windows Auth.',
    pros: [
      'Menyediakan data real-time dari layanan eksternal manapun di internet.',
      'Sangat fleksibel diintegrasikan dengan sistem apa pun.'
    ],
    limitations: [
      'API dinamis sering memicu peringatan formula firewall Power Query.',
      'Scheduled refresh di Power BI Service tidak mendukung Web.Contents dengan URL yang sepenuhnya dinamis tanpa RelativePath.'
    ],
    supportedModes: ['Import'],
    refreshMechanism: 'Mengirim HTTP GET request ke endpoint saat refresh.',
    troubleshootingTips: [
      { issue: 'Formula.Firewall: Query references other queries or steps', resolution: 'Gunakan parameter RelativePath pada Web.Contents untuk menghindari pembatasan keamanan privacy level.' }
    ]
  },
  {
    id: 'dwh_fabric',
    name: 'Cloud Data Warehouse & Microsoft Fabric',
    category: 'Enterprise',
    icon: 'Layers',
    whenToUse: 'Arsitektur data modern enterprise: Snowflake, Amazon Redshift, Azure Synapse, Microsoft Fabric Lakehouse.',
    preparation: [
      'Endpoint serverless DWH, nama database/warehouse, dan role yang memiliki izin baca.',
      'Konfigurasi IP Whitelisting jika DWH berada di balik private virtual network (VNet).'
    ],
    stepByStep: [
      'Pilih konektor spesifik (misal: Snowflake, Amazon Redshift, atau Fabric Lakehouse).',
      'Masukkan Server dan Warehouse/Database.',
      'Pilih mode Import, DirectQuery, atau Direct Lake (khusus Fabric).',
      'Pilih objek tabel dari schema analitik.'
    ],
    credentials: 'OAuth 2.0, SAML SSO, Database User, atau Entra ID.',
    pros: [
      'Dirancang khusus untuk beban analitik kelas enterprise (OLAP).',
      'Teknologi Direct Lake (di Fabric) mampu membaca jutaan baris seketika tanpa perlu proses import duplikat!'
    ],
    limitations: [
      'Biaya komputasi cloud DWH harus dipantau agar tidak terjadi pemborosan kueri.'
    ],
    supportedModes: ['Import', 'DirectQuery', 'Composite'],
    refreshMechanism: 'Koneksi terenkripsi berkecepatan tinggi langsung ke clustered computing engine DWH.',
    troubleshootingTips: [
      { issue: 'Session timeout during large data extract', resolution: 'Pecah ekstraksi data menjadi batch atau gunakan Incremental Refresh di Power BI.' }
    ]
  }
];
