import { DistributionTypeInfo } from '../types';

export const distributionTypes: DistributionTypeInfo[] = [
  {
    id: 'normal',
    name: 'Normal Distribution (Distribusi Normal)',
    shapeDescription: 'Kurva simetris berbentuk lonceng seimbang di sekitar titik pusat. Ekor kiri dan kanan meluruh secara teratur.',
    meanVsMedian: 'Mean ≈ Median. Rata-rata dan nilai tengah berhimpit hampir sempurna.',
    sampleDatasetKey: 'normal',
    dataPoints: [
      68, 70, 72, 73, 74, 75, 75, 76, 76, 77, 77, 78, 78, 78, 79, 79, 79, 80, 80, 80,
      80, 81, 81, 81, 82, 82, 82, 83, 83, 84, 84, 85, 85, 86, 87, 88, 90, 92
    ],
    realWorldScenario: 'Waktu perakitan produk standar di pabrik manufaktur (dalam menit), tinggi badan orang dewasa, atau nilai ujian sertifikasi skala besar.',
    analysisStrategy: 'Gunakan Mean dan Standar Deviasi sebagai ukuran utama. Aturan empiris 68-95-99.7% berlaku di sini.',
    warningNote: 'Peringatan: Distribusi yang sekadar simetris belum tentu berdistribusi normal secara matematis tanpa uji normalitas formal (seperti Shapiro-Wilk).'
  },
  {
    id: 'right_skewed',
    name: 'Right-Skewed / Positively Skewed (Menceng ke Kanan)',
    shapeDescription: 'Konsentrasi frekuensi menumpuk di sisi kiri (nilai rendah), dengan ekor panjang memanjang ke arah kanan (nilai sangat tinggi).',
    meanVsMedian: 'Mean > Median. Nilai-nilai ekstrem tinggi menarik nilai rata-rata ke kanan atas.',
    sampleDatasetKey: 'right_skewed',
    dataPoints: [
      12, 14, 15, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 27, 28, 30, 32, 35, 38, 42,
      48, 55, 65, 80, 110, 145, 190, 260
    ],
    realWorldScenario: 'Pendapatan transaksi e-commerce, gaji karyawan korporasi, klaim asuransi kesehatan, atau harga rumah.',
    analysisStrategy: 'HINDARI menggunakan Mean sebagai representasi populasi! Gunakan MEDIAN dan IQR (Interquartile Range) untuk ukuran tendensi sentral yang tahan terhadap pencilan.',
    warningNote: 'Peringatan: Meskipun sering kali Mean > Median pada right-skew, ini bukan hukum mutlak untuk semua bentuk kurva multimodal.'
  },
  {
    id: 'left_skewed',
    name: 'Left-Skewed / Negatively Skewed (Menceng ke Kiri)',
    shapeDescription: 'Konsentrasi frekuensi menumpuk di sisi kanan (nilai tinggi), dengan ekor panjang memanjang ke arah kiri (nilai sangat rendah).',
    meanVsMedian: 'Mean < Median. Nilai-nilai ekstrem rendah menarik nilai rata-rata ke bawah.',
    sampleDatasetKey: 'left_skewed',
    dataPoints: [
      15, 30, 45, 58, 65, 72, 78, 82, 85, 88, 90, 91, 92, 93, 94, 95, 95, 96, 96, 97,
      97, 98, 98, 99, 99, 100, 100, 100
    ],
    realWorldScenario: 'Tingkat kepuasan layanan pelanggan (CSAT skor 1-100), usia harapan hidup manusia, atau tingkat kehadiran murid berprestasi.',
    analysisStrategy: 'Fokuskan investigasi pada ekor kiri: mengapa ada segelintir pelanggan yang memberikan skor kepuasan di bawah 40?',
    warningNote: 'Peringatan: Laporkan median persentil dan periksa apakah ada anomali teknis pada sistem yang memicu skor terendah.'
  },
  {
    id: 'uniform',
    name: 'Uniform Distribution (Distribusi Seragam)',
    shapeDescription: 'Frekuensi relatif merata dan konstan di sepanjang seluruh rentang nilai tanpa puncak yang dominan.',
    meanVsMedian: 'Mean ≈ Median ≈ (Min + Max) / 2.',
    sampleDatasetKey: 'uniform',
    dataPoints: [
      10, 12, 14, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58,
      60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90
    ],
    realWorldScenario: 'Peluang pelemparan dadu yang adil, alokasi nomor tiket antrean acak, atau distribusi waktu transaksi dalam toko 24 jam.',
    analysisStrategy: 'Setiap nilai memiliki kemungkinan kemunculan yang setara. Standar deviasi dihitung dengan rumus interval seragam (b - a) / √12.',
    warningNote: 'Peringatan: Jika data transaksional bisnis berdistribusi seragam, verifikasi apakah data tersebut merupakan data uji acak sintetis (random dummy).'
  },
  {
    id: 'bimodal',
    name: 'Bimodal & Multimodal Distribution (Dua Puncak)',
    shapeDescription: 'Kurva memiliki dua puncak frekuensi yang terpisah dengan lembah di antaranya.',
    meanVsMedian: 'Mean dan Median sering kali jatuh di area "lembah" di mana justru sangat sedikit data yang sebenarnya berada!',
    sampleDatasetKey: 'bimodal',
    dataPoints: [
      20, 22, 24, 25, 25, 26, 27, 28, 29, 30, 30, 32, 48, 52, 70, 72, 74, 75, 76, 77,
      78, 79, 80, 80, 81, 82, 84, 85
    ],
    realWorldScenario: 'Ukuran sepatu pelanggan gabungan (pria dan wanita), jam sibuk restoran (makan siang pukul 12.00 dan makan malam pukul 19.00), atau harga mobil bekas vs mobil baru.',
    analysisStrategy: 'JANGAN menggabungkan data ini dalam satu analisis tunggal! Lakukan segmentasi data untuk memecah populasi menjadi 2 kelompok terpisah.',
    warningNote: 'Peringatan: Mengambil satu angka rata-rata untuk data bimodal adalah kesalahan fatal dalam analitik bisnis.'
  },
  {
    id: 'outliers_iqr',
    name: 'Clusters & Outliers (Deteksi Pencilan IQR)',
    shapeDescription: 'Mayoritas data berkumpul rapat dalam satu atau dua kluster, namun terdapat beberapa titik terisolasi yang sangat jauh dari massa data.',
    meanVsMedian: 'Pencilan ekstrem sangat merusak nilai Mean dan Standar Deviasi, sementara Median dan IQR tetap kokoh (robust).',
    sampleDatasetKey: 'outliers_iqr',
    dataPoints: [
      45, 48, 50, 51, 52, 52, 53, 54, 55, 55, 56, 57, 58, 60, 62, 63, 65, 140, 195
    ],
    realWorldScenario: 'Nilai klaim penipuan kartu kredit, pesanan borongan institusi B2B di tengah ribuan pesanan ritel B2C, atau glitch sensor mesin pabrik.',
    analysisStrategy: 'Gunakan batas pagar Tukey: Lower Fence = Q1 - 1.5*IQR dan Upper Fence = Q3 + 1.5*IQR. Data di luar pagar adalah kandidat outlier.',
    warningNote: 'Peringatan: Outlier tidak selalu merupakan kesalahan data! Dalam audit fraud, justru titik outlier-lah yang menjadi sasaran penyelidikan bisnis terpenting.'
  }
];
