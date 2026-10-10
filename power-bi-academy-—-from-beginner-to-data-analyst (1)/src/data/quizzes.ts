import { QuizQuestion } from '../types';

export const quizQuestionsList: QuizQuestion[] = [
  {
    id: 1,
    category: 'Data Connection',
    question: 'Perusahaan Anda memiliki data historis transaksi 500 juta baris di Google BigQuery yang terus bertambah setiap menit. Manajemen membutuhkan laporan yang menampilkan data detik ini juga (real-time). Metode koneksi apa yang paling tepat?',
    options: [
      {
        id: 'A',
        text: 'Import Mode dengan refresh setiap 1 menit',
        isCorrect: false,
        explanation: 'Salah. Power BI Pro hanya mendukung maksimal 8x refresh per hari (Premium 48x), tidak bisa refresh setiap menit. Mengimpor 500 juta baris juga akan memakan kuota RAM yang luar biasa besar.'
      },
      {
        id: 'B',
        text: 'DirectQuery Mode',
        isCorrect: true,
        explanation: 'Benar! DirectQuery tidak mengimpor data ke memori Power BI, melainkan mengirimkan kueri SQL langsung ke BigQuery saat visual dibuka, memungkinkan pelaporan near-real-time tanpa membebani RAM lokal.'
      },
      {
        id: 'C',
        text: 'Live Connection ke file Excel lokal',
        isCorrect: false,
        explanation: 'Salah. Live Connection hanya bisa digunakan ke semantic model Analysis Services atau Power BI Service, bukan ke file Excel atau langsung ke BigQuery.'
      },
      {
        id: 'D',
        text: 'Ekspor harian ke file CSV di folder lokal',
        isCorrect: false,
        explanation: 'Salah. Format CSV lokal tidak mendukung data real-time dan kapasitas file CSV tidak efisien untuk 500 juta baris.'
      }
    ]
  },
  {
    id: 2,
    category: 'Power Query',
    question: 'Tabel spreadsheet keuangan memiliki kolom bertuliskan: "Jan 2024", "Feb 2024", "Mar 2024" yang membentang mendatar ke kanan dengan nilai penjualan di bawahnya. Operasi Power Query apa yang harus dilakukan agar data menjadi "Tidy Data" yang optimal?',
    options: [
      {
        id: 'A',
        text: 'Transpose Table',
        isCorrect: false,
        explanation: 'Salah. Transpose hanya memutar baris menjadi kolom secara umum, tetapi tidak mengubah struktur atribut berulang menjadi pasangan atribut-nilai analitik.'
      },
      {
        id: 'B',
        text: 'Unpivot Columns (Pilih kolom identitas lalu pilih "Unpivot Other Columns")',
        isCorrect: true,
        explanation: 'Benar! Unpivot Columns mengubah format data lebar (cross-tab) menjadi data panjang (tabular), menghasilkan satu kolom "Bulan" dan satu kolom "Nilai Penjualan" yang ramah untuk DAX time-intelligence.'
      },
      {
        id: 'C',
        text: 'Split Column by Delimiter',
        isCorrect: false,
        explanation: 'Salah. Split column digunakan untuk memecah teks dalam satu sel (misal: "Nama Depan_Nama Belakang"), bukan untuk mengubah orientasi struktur matriks tabel.'
      },
      {
        id: 'D',
        text: 'Merge Queries',
        isCorrect: false,
        explanation: 'Salah. Merge Queries setara dengan operasi JOIN di SQL antardua tabel yang berbeda.'
      }
    ]
  },
  {
    id: 3,
    category: 'Data Modeling',
    question: 'Mengapa arsitektur Star Schema sangat direkomendasikan dibandingkan menggabungkan semua informasi ke dalam satu tabel datar raksasa (Flat Table)?',
    options: [
      {
        id: 'A',
        text: 'Karena Star Schema mengurangi kardinalitas kolom, memaksimalkan kompresi VertiPaq engine, dan membuat formula DAX lebih sederhana dan cepat',
        isCorrect: true,
        explanation: 'Benar! Memisahkan tabel fakta dari tabel dimensi mengurangi duplikasi teks berulang, memungkinkan mesin columnar VertiPaq bekerja dengan kompresi maksimal dan memproses kueri hingga puluhan kali lebih cepat.'
      },
      {
        id: 'B',
        text: 'Karena Power BI tidak bisa membaca file jika hanya terdiri dari 1 tabel datar',
        isCorrect: false,
        explanation: 'Salah. Power BI tetap bisa membaca tabel datar tunggal, namun performanya akan sangat lambat ketika volume data membesar.'
      },
      {
        id: 'C',
        text: 'Karena Star Schema otomatis menghasilkan grafik 3D di Report View',
        isCorrect: false,
        explanation: 'Salah. Star Schema adalah konsep arsitektur relasional data di backend, bukan fitur visualisasi 3D.'
      },
      {
        id: 'D',
        text: 'Karena Star Schema mengharuskan seluruh tabel memiliki jumlah baris yang sama',
        isCorrect: false,
        explanation: 'Salah. Tabel dimensi biasanya hanya memiliki ratusan atau ribuan baris, sedangkan tabel fakta memiliki jutaan baris.'
      }
    ]
  },
  {
    id: 4,
    category: 'DAX',
    question: 'Seorang analis menulis formula margin berikut: `Margin = [Total Profit] / [Total Sales]`. Apa potensi bahaya dari penulisan formula tersebut di dashboard produksi?',
    options: [
      {
        id: 'A',
        text: 'Formula tersebut ilegal dan Power BI akan menolak menyimpannya',
        isCorrect: false,
        explanation: 'Salah. Sintaks operator garis miring (/) valid secara tata bahasa DAX, namun sangat berbahaya saat runtime.'
      },
      {
        id: 'B',
        text: 'Jika ada filter yang menghasilkan Total Sales = 0, visual kartu KPI akan menampilkan error atau "NaN" (Division by Zero). Seharusnya gunakan DIVIDE([Total Profit], [Total Sales], 0)',
        isCorrect: true,
        explanation: 'Benar! Fungsi DIVIDE() dirancang khusus dengan built-in safe division yang otomatis mengembalikan 0 atau BLANK jika penyebut bernilai nol atau kosong, menjaga stabilitas tampilan laporan eksekutif.'
      },
      {
        id: 'C',
        text: 'Operator pembagian di DAX hanya bisa membagi angka bulat',
        isCorrect: false,
        explanation: 'Salah. DAX mendukung pembagian bilangan desimal.'
      },
      {
        id: 'D',
        text: 'Hasil perhitungannya akan otomatis dikalikan 100 tanpa format persen',
        isCorrect: false,
        explanation: 'Salah. Format persen diatur melalui format string di ribbon modeling, bukan ditentukan oleh operator /.'
      }
    ]
  },
  {
    id: 5,
    category: 'DAX',
    question: 'Apa peran utama fungsi CALCULATE dalam ekspresi DAX?',
    options: [
      {
        id: 'A',
        text: 'Hanya untuk melakukan penjumlahan aritmatika antar kolom di tabel yang sama',
        isCorrect: false,
        explanation: 'Salah. Untuk penjumlahan kolom biasa digunakan fungsi SUM atau SUMX.'
      },
      {
        id: 'B',
        text: 'Memodifikasi, menambah, atau menimpa konteks filter (Filter Context) yang aktif saat mengevaluasi suatu ekspresi analitik',
        isCorrect: true,
        explanation: 'Benar! CALCULATE adalah fungsi paling sakti di DAX karena mampu mengubah Filter Context dan memicu Context Transition dari Row Context ke Filter Context.'
      },
      {
        id: 'C',
        text: 'Mengubah format tanggal menjadi teks bahasa Indonesia',
        isCorrect: false,
        explanation: 'Salah. Untuk memformat teks tanggal digunakan fungsi FORMAT().'
      },
      {
        id: 'D',
        text: 'Menghapus baris data yang bernilai duplikat secara permanen di database',
        isCorrect: false,
        explanation: 'Salah. DAX tidak pernah memodifikasi data mentah di database sumber; DAX hanya mengevaluasi kueri analitik di memori.'
      }
    ]
  },
  {
    id: 6,
    category: 'Visualization',
    question: 'Anda ingin menampilkan perbandingan penjualan untuk 35 nama produk yang memiliki nama panjang. Jenis grafik apa yang paling sesuai dan ergonomis?',
    options: [
      {
        id: 'A',
        text: 'Donut Chart dengan 35 irisan warna',
        isCorrect: false,
        explanation: 'Salah. Donut Chart dengan 35 irisan adalah pelanggaran fatal visualisasi data karena irisannya tidak akan bisa dibedakan dan label saling bertumpuk.'
      },
      {
        id: 'B',
        text: 'Horizontal Bar Chart yang diurutkan descending berdasarkan total penjualan',
        isCorrect: true,
        explanation: 'Benar! Batang mendatar (Horizontal Bar Chart) memberikan ruang luas untuk nama produk yang panjang sehingga terbaca dari kiri ke kanan secara alami tanpa harus memiringkan leher audiens.'
      },
      {
        id: 'C',
        text: 'Vertical Column Chart dengan sudut teks 90 derajat',
        isCorrect: false,
        explanation: 'Salah. Membaca 35 teks vertikal yang berhimpitan di sumbu X sangat melelahkan mata dan melanggar prinsip kejelasan laporan bisnis.'
      },
      {
        id: 'D',
        text: 'Pie Chart 3D dengan efek bayangan',
        isCorrect: false,
        explanation: 'Salah. Grafik 3D mendistorsi proporsi sudut dan dilarang dalam standar visualisasi profesional.'
      }
    ]
  },
  {
    id: 7,
    category: 'Distribution',
    question: 'Dalam audit gaji karyawan, nilai Mean (rata-rata) adalah Rp 22.000.000, sedangkan Median adalah Rp 7.500.000. Apa arti statistik dan implikasi bisnis dari temuan ini?',
    options: [
      {
        id: 'A',
        text: 'Distribusi data berdistribusi normal simetris sempurna',
        isCorrect: false,
        explanation: 'Salah. Pada distribusi normal, nilai Mean dan Median akan hampir sama persis (Mean ≈ Median).'
      },
      {
        id: 'B',
        text: 'Data berdistribusi Right-Skewed (menceng ke kanan) karena segelintir eksekutif bergaji sangat tinggi menarik nilai Mean ke atas. Median (Rp 7.5M) adalah angka yang lebih representatif untuk mayoritas staf.',
        isCorrect: true,
        explanation: 'Benar! Disparitas ekstrem di mana Mean jauh lebih besar daripada Median menunjukkan adanya ekor pencilan nilai tinggi (right skew). Melaporkan Mean Rp 22M ke publik dapat memberikan kesan keliru tentang standar gaji mayoritas karyawan.'
      },
      {
        id: 'C',
        text: 'Perhitungan rumus Median di Power BI mengalami error sistem',
        isCorrect: false,
        explanation: 'Salah. Perbedaan mean dan median adalah fenomena statistik alami pada data pendapatan/gaji.'
      },
      {
        id: 'D',
        text: 'Seluruh karyawan bergaji antara Rp 7.500.000 hingga Rp 22.000.000',
        isCorrect: false,
        explanation: 'Salah. Mean dan median bukan batas rentang minimum dan maksimum.'
      }
    ]
  },
  {
    id: 8,
    category: 'Big Data',
    question: 'Tabel transaksi Anda berukuran 10 juta baris dan memuat kolom gabungan waktu `TransactionTimestamp` (contoh: "2024-03-15 14:32:05.123"). Mengapa kolom ini sangat memboroskan RAM di Power BI dan bagaimana cara mengatasinya?',
    options: [
      {
        id: 'A',
        text: 'Karena VertiPaq tidak bisa membaca angka detik sama sekali',
        isCorrect: false,
        explanation: 'Salah. VertiPaq bisa membaca format detik, namun masalah utamanya adalah efisiensi pemampatan memori.'
      },
      {
        id: 'B',
        text: 'Kolom tersebut memiliki kardinalitas (nilai unik) sangat tinggi sehingga VertiPaq gagal melakukan kompresi kamus. Solusinya adalah memecah kolom menjadi 1 kolom Date dan 1 kolom Time terpisah di Power Query.',
        isCorrect: true,
        explanation: 'Benar! Kolom tanggal-jam hingga detik memiliki jutaan nilai unik (kardinalitas tinggi). Memisahkannya menjadi Date (hanya ~365 nilai per tahun) dan Time (hanya ~1.440 menit per hari) memangkas penggunaan RAM hingga 80-90%!'
      },
      {
        id: 'C',
        text: 'Solusinya adalah mengubah nama kolom menjadi huruf kapital',
        isCorrect: false,
        explanation: 'Salah. Mengubah kapitalisasi nama kolom tidak memengaruhi pemakaian memori database.'
      },
      {
        id: 'D',
        text: 'Menghapus seluruh tabel karena Power BI hanya sanggup menampung maksimal 500 ribu baris',
        isCorrect: false,
        explanation: 'Salah. Power BI sanggup memproses puluhan juta baris dengan arsitektur VertiPaq yang teroptimasi.'
      }
    ]
  },
  {
    id: 9,
    category: 'Deployment',
    question: 'Apa risiko terbesar dari menggunakan fitur "Publish to Web (Public)" di Power BI Service?',
    options: [
      {
        id: 'A',
        text: 'Laporan tidak bisa dibuka di perangkat smartphone Android',
        isCorrect: false,
        explanation: 'Salah. Laporan publish to web tetap responsif di smartphone.'
      },
      {
        id: 'B',
        text: 'Laporan dan seluruh baris data di dalamnya menjadi dapat diakses oleh siapa saja di internet publik tanpa perlu login atau password, berpotensi membocorkan rahasia perusahaan.',
        isCorrect: true,
        explanation: 'Benar! "Publish to Web" ditujukan untuk berita publik atau blog terbuka. Fitur ini menonaktifkan seluruh mekanisme autentikasi dan Row-Level Security (RLS). Jangan pernah menggunakannya untuk data internal perusahaan!'
      },
      {
        id: 'C',
        text: 'Power BI Desktop Anda akan otomatis ter-uninstall dari komputer',
        isCorrect: false,
        explanation: 'Salah. Aplikasi desktop tidak terpengaruh oleh penerbitan web.'
      },
      {
        id: 'D',
        text: 'Semua grafik akan otomatis berubah menjadi warna hitam putih',
        isCorrect: false,
        explanation: 'Salah. Pewarnaan visual tidak berubah saat dipublikasikan ke web.'
      }
    ]
  }
];
