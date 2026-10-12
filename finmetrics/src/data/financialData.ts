export interface FinancialYearData {
  year: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingMargin: number;
  ebit: number;
  ebitda: number;
  ebitdaMargin: number;
  gainOnSaleAssets?: number;
  ebt: number;
  tax: number;
  netIncome: number;
  netMargin: number;
  eps: number;
  dps?: number;
}

export const incomeStatementSeries: FinancialYearData[] = [
  {
    year: 'Tahun 5 (Terbaru)',
    revenue: 800.10,
    costOfRevenue: 508.20,
    grossProfit: 291.90,
    grossMargin: 36.48,
    operatingExpenses: 231.29,
    operatingIncome: 60.61,
    operatingMargin: 7.58,
    ebit: 60.61,
    ebitda: 133.70,
    ebitdaMargin: 16.71,
    gainOnSaleAssets: 44.29,
    ebt: 72.31,
    tax: 31.05,
    netIncome: 41.26,
    netMargin: 5.16,
    eps: 0.52,
    dps: 1.00,
  },
  {
    year: 'Tahun 4',
    revenue: 457.22,
    costOfRevenue: 343.87,
    grossProfit: 113.35,
    grossMargin: 24.79,
    operatingExpenses: 259.14,
    operatingIncome: -145.79,
    operatingMargin: -31.89,
    ebit: -145.79,
    ebitda: -8.18,
    ebitdaMargin: -1.79,
    gainOnSaleAssets: 85.03,
    ebt: -60.76,
    tax: -85.81,
    netIncome: 25.05,
    netMargin: 5.48,
    eps: 0.31,
    dps: 0.50,
  },
  {
    year: 'Tahun 3',
    revenue: 372.67,
    costOfRevenue: 261.05,
    grossProfit: 111.62,
    grossMargin: 29.95,
    operatingExpenses: 268.68,
    operatingIncome: -157.06,
    operatingMargin: -42.14,
    ebit: -157.06,
    ebitda: 10.36,
    ebitdaMargin: 2.78,
    gainOnSaleAssets: 0,
    ebt: -157.06,
    tax: 0,
    netIncome: -48.41,
    netMargin: -12.99,
    eps: -0.40,
  },
  {
    year: 'Tahun 2',
    revenue: 353.99,
    costOfRevenue: 283.12,
    grossProfit: 70.87,
    grossMargin: 20.02,
    operatingExpenses: 216.66,
    operatingIncome: -145.79,
    operatingMargin: -41.18,
    ebit: -145.79,
    ebitda: -103.65,
    ebitdaMargin: -29.28,
    gainOnSaleAssets: 0,
    ebt: -145.79,
    tax: 0,
    netIncome: -212.10,
    netMargin: -59.92,
    eps: -2.09,
  },
  {
    year: 'Tahun 1 (Terlama)',
    revenue: 319.90,
    costOfRevenue: 298.18,
    grossProfit: 21.72,
    grossMargin: 6.79,
    operatingExpenses: 178.78,
    operatingIncome: -157.06,
    operatingMargin: -49.10,
    ebit: -157.06,
    ebitda: -115.39,
    ebitdaMargin: -36.07,
    gainOnSaleAssets: 0,
    ebt: -157.06,
    tax: 0,
    netIncome: -149.39,
    netMargin: -46.70,
    eps: -1.58,
  },
];

export interface BalanceSheetData {
  totalAssets: number;
  currentAssets: {
    total: number;
    cashAndEquivalents: number;
    shortTermInvestments: number;
    receivables: number;
    inventory: number;
    prepaidExpenses: number;
  };
  nonCurrentAssets: {
    total: number;
    grossPPE: number;
    accumulatedDepreciation: number;
    netPPE: number;
    longTermInvestments: number;
    intangibleAssets: number;
    goodwill: number;
  };
  totalLiabilities: number;
  currentLiabilities: {
    total: number;
    accountsPayable: number;
    shortTermDebt: number;
    accruedExpenses: number;
    currentLease: number;
  };
  nonCurrentLiabilities: {
    total: number;
    longTermDebt: number;
    longTermLeases: number;
    otherNonCurrent: number;
  };
  totalDebt: number;
  totalEquity: number;
  equityComponents: {
    commonStock: number;
    apic: number;
    retainedEarnings: number;
    treasuryStock: number;
  };
}

export const sampleBalanceSheet: BalanceSheetData = {
  totalAssets: 1877.83,
  currentAssets: {
    total: 1045.00,
    cashAndEquivalents: 722.66,
    shortTermInvestments: 120.00,
    receivables: 112.34,
    inventory: 75.00,
    prepaidExpenses: 15.00,
  },
  nonCurrentAssets: {
    total: 832.83,
    grossPPE: 2035.69,
    accumulatedDepreciation: 1739.99,
    netPPE: 295.70,
    longTermInvestments: 210.00,
    intangibleAssets: 185.00,
    goodwill: 142.13,
  },
  totalLiabilities: 461.00,
  currentLiabilities: {
    total: 372.04,
    accountsPayable: 7.65,
    shortTermDebt: 80.00,
    accruedExpenses: 245.39,
    currentLease: 39.00,
  },
  nonCurrentLiabilities: {
    total: 88.96,
    longTermDebt: 71.09,
    longTermLeases: 10.62,
    otherNonCurrent: 7.25,
  },
  totalDebt: 190.09,
  totalEquity: 1416.83,
  equityComponents: {
    commonStock: 807.52,
    apic: 759.33,
    retainedEarnings: 41.30,
    treasuryStock: -191.32,
  },
};

export interface CompanyRatioComparison {
  category: string;
  metric: string;
  code: string;
  companyA: string | number;
  companyB: string | number;
  unit: string;
  verdict: 'A' | 'B' | 'neutral' | 'investigate';
  analysisNote: string;
}

export const ratioComparisons: CompanyRatioComparison[] = [
  // Valuasi
  {
    category: 'Valuasi',
    metric: 'Price to Earnings',
    code: 'P/E (TTM)',
    companyA: '23,29',
    companyB: '30,55',
    unit: 'kali',
    verdict: 'investigate',
    analysisNote: 'P/E Perusahaan A lebih rendah (tampak murah), namun laba operasionalnya negatif. Perusahaan B dihargai wajar dengan laba nyata.',
  },
  {
    category: 'Valuasi',
    metric: 'Price to Sales',
    code: 'P/S (TTM)',
    companyA: '12,26',
    companyB: '4,20',
    unit: 'kali',
    verdict: 'B',
    analysisNote: 'Perusahaan B berharga 4,20x penjualan vs Perusahaan A yang sangat mahal 12,26x penjualan.',
  },
  {
    category: 'Valuasi',
    metric: 'Price to Cash Flow',
    code: 'P/CF (MRQ)',
    companyA: '121,21',
    companyB: '16,02',
    unit: 'kali',
    verdict: 'B',
    analysisNote: 'P/CF Perusahaan A 121,21x sangat ekstrem karena arus kas penyebutnya sangat tipis.',
  },
  {
    category: 'Valuasi',
    metric: 'Price to Free Cash Flow',
    code: 'P/FCF (TTM)',
    companyA: '-9,87',
    companyB: '2,02',
    unit: 'kali',
    verdict: 'B',
    analysisNote: 'Perusahaan A memiliki FCF negatif sehingga rasio minus. P/FCF negatif bukan diskon harga!',
  },
  // Profitabilitas
  {
    category: 'Profitabilitas',
    metric: 'Margin Kotor TTM',
    code: 'GPM (TTM)',
    companyA: '-5,78%',
    companyB: '36,51%',
    unit: '%',
    verdict: 'B',
    analysisNote: 'RED FLAG: Margin kotor Perusahaan A minus (-5,78%). HPP melampaui harga jual, sangat anomali untuk operasi normal.',
  },
  {
    category: 'Profitabilitas',
    metric: 'Margin Kotor Rata-rata 5 Tahun',
    code: 'GPM (5YA)',
    companyA: '23,61%',
    companyB: '38,46%',
    unit: '%',
    verdict: 'B',
    analysisNote: 'Perusahaan B memiliki keunggulan harga dan efisiensi biaya produksi yang konsisten tinggi selama 5 tahun.',
  },
  {
    category: 'Profitabilitas',
    metric: 'Margin Operasional TTM',
    code: 'OPM (TTM)',
    companyA: '-73,60%',
    companyB: '16,34%',
    unit: '%',
    verdict: 'B',
    analysisNote: 'Operasional Perusahaan A berdarah kerugian 73,6% dari setiap rupiah omset. Perusahaan B menghasilkan laba operasi 16,34%.',
  },
  {
    category: 'Profitabilitas',
    metric: 'Margin Sebelum Pajak TTM',
    code: 'EBT Margin',
    companyA: '87,17%',
    companyB: '18,82%',
    unit: '%',
    verdict: 'investigate',
    analysisNote: 'ANOMALI: Margin kotor -5,78% tetapi EBT 87,17%! Ini sinyal kuat adanya pendapatan non-operasional masif (seperti jual aset besar-besaran).',
  },
  {
    category: 'Profitabilitas',
    metric: 'Margin Laba Bersih TTM',
    code: 'NPM (TTM)',
    companyA: '78,06%',
    companyB: '14,87%',
    unit: '%',
    verdict: 'investigate',
    analysisNote: 'Laba bersih semu di Perusahaan A bukan dari bisnis utama, melainkan pos luar biasa yang tidak berulang.',
  },
  // Efektivitas Manajemen
  {
    category: 'Efektivitas',
    metric: 'Return on Equity TTM',
    code: 'ROE (TTM)',
    companyA: '14,58%',
    companyB: '13,85%',
    unit: '%',
    verdict: 'investigate',
    analysisNote: 'ROE Perusahaan A tampak 14,58%, namun 5YA ROE adalah -4,47% dengan EPS tahunan minus. ROE B jauh lebih stabil (5YA: 16,28%).',
  },
  {
    category: 'Efektivitas',
    metric: 'Return on Assets TTM',
    code: 'ROA (TTM)',
    companyA: '-5,78%',
    companyB: '4,97%',
    unit: '%',
    verdict: 'B',
    analysisNote: 'Aset Perusahaan B menghasilkan imbal hasil positif, sedangkan aset Perusahaan A merugi.',
  },
  {
    category: 'Efektivitas',
    metric: 'Return on Investment TTM',
    code: 'ROI (TTM)',
    companyA: '-6,08%',
    companyB: '6,96%',
    unit: '%',
    verdict: 'B',
    analysisNote: 'Investasi modal Perusahaan B memberikan return 6,96% per tahun.',
  },
  // Data Per Saham
  {
    category: 'Per Saham',
    metric: 'Pendapatan per Saham',
    code: 'Rev/Share',
    companyA: '2,81',
    companyB: '40,71',
    unit: 'satuan',
    verdict: 'B',
    analysisNote: 'Perusahaan B menghasilkan skala pendapatan per saham yang jauh lebih besar.',
  },
  {
    category: 'Per Saham',
    metric: 'EPS Biasa Tahunan',
    code: 'Basic EPS',
    companyA: '-1,58',
    companyB: '4,77',
    unit: 'satuan',
    verdict: 'B',
    analysisNote: 'Perusahaan A merugi Rp1,58 per lembar saham. Perusahaan B menghasilkan laba Rp4,77 per lembar.',
  },
  {
    category: 'Per Saham',
    metric: 'Arus Kas per Saham',
    code: 'CF/Share',
    companyA: '0,27',
    companyB: '6,46',
    unit: 'satuan',
    verdict: 'B',
    analysisNote: 'Perusahaan B menghasilkan kas tunai Rp6,46 per saham vs Perusahaan A hanya Rp0,27.',
  },
  // Pertumbuhan
  {
    category: 'Pertumbuhan',
    metric: 'Pertumbuhan Penjualan MRQ (YoY)',
    code: 'Sales Growth',
    companyA: '-36,78%',
    companyB: '+9,30%',
    unit: '%',
    verdict: 'B',
    analysisNote: 'Penjualan Perusahaan A anjlok drastis 36,78%, sementara Perusahaan B tumbuh sehat hampir dua digit.',
  },
  {
    category: 'Pertumbuhan',
    metric: 'Pertumbuhan Penjualan 5 Tahun',
    code: 'Sales 5Y',
    companyA: '-14,12%',
    companyB: '+9,56%',
    unit: '%',
    verdict: 'B',
    analysisNote: 'Tren jangka panjang 5 tahun Perusahaan B terus ekspansi, sedangkan A menyusut.',
  },
  {
    category: 'Pertumbuhan',
    metric: 'Pertumbuhan Belanja Modal 5Y',
    code: 'CapEx Growth',
    companyA: '+84,37%',
    companyB: '+11,89%',
    unit: '%',
    verdict: 'investigate',
    analysisNote: 'Belanja modal Perusahaan A naik 84% saat penjualannya anjlok. Ini membakar kas tanpa diimbangi kenaikan omset.',
  },
  // Kekuatan Finansial
  {
    category: 'Kekuatan Finansial',
    metric: 'Current Ratio (Rasio Lancar)',
    code: 'Current Ratio',
    companyA: '3,92',
    companyB: '2,02',
    unit: 'kali',
    verdict: 'neutral',
    analysisNote: 'Keduanya di atas 1,0. Perusahaan A memiliki bantalan aset lancar sangat tinggi, namun perlu dicek apakah asetnya berupa kas aktif atau piutang macet.',
  },
  {
    category: 'Kekuatan Finansial',
    metric: 'Quick Ratio (Rasio Cepat)',
    code: 'Quick Ratio',
    companyA: '3,13',
    companyB: '1,59',
    unit: 'kali',
    verdict: 'neutral',
    analysisNote: 'Rasio cepat keduanya aman di atas 1,0 kali kewajiban lancar.',
  },
  {
    category: 'Kekuatan Finansial',
    metric: 'Total Utang terhadap Ekuitas',
    code: 'Debt-to-Equity',
    companyA: '35,42%',
    companyB: '36,94%',
    unit: '%',
    verdict: 'neutral',
    analysisNote: 'Tingkat utang berbunga kedua perusahaan relatif konservatif dan terkendali (<40%).',
  },
  // Efisiensi
  {
    category: 'Efisiensi',
    metric: 'Perputaran Aset TTM',
    code: 'Asset Turnover',
    companyA: '0,13',
    companyB: '0,52',
    unit: 'kali',
    verdict: 'B',
    analysisNote: 'Aset Perusahaan B 4x lebih produktif menghasilkan penjualan dibandingkan aset Perusahaan A yang mengendap.',
  },
  {
    category: 'Efisiensi',
    metric: 'Perputaran Piutang TTM',
    code: 'Receivables T/O',
    companyA: '1,38',
    companyB: '6,53',
    unit: 'kali',
    verdict: 'B',
    analysisNote: 'Piutang Perusahaan B berputar 6,53 kali per tahun (cepat ditagih), sedangkan Perusahaan A hanya 1,38 kali.',
  },
  {
    category: 'Efisiensi',
    metric: 'Estimasi Hari Penagihan Piutang',
    code: 'DSO (Days)',
    companyA: '~264 hari',
    companyB: '~56 hari',
    unit: 'hari',
    verdict: 'B',
    analysisNote: 'RED FLAG BESAR: Pelanggan Perusahaan A baru membayar setelah hampir 9 bulan! Risiko piutang tak tertagih sangat tinggi.',
  },
];

export interface QuizQuestion {
  id: number;
  section: string;
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  formula?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    section: 'Laba Rugi',
    question: 'Perusahaan memiliki pendapatan Rp500 juta dan Harga Pokok Penjualan (HPP) Rp300 juta. Berapa laba kotornya?',
    options: [
      { label: 'A', text: 'Rp200 juta' },
      { label: 'B', text: 'Rp300 juta' },
      { label: 'C', text: 'Rp500 juta' },
      { label: 'D', text: 'Rp800 juta' },
    ],
    correctAnswer: 'A',
    formula: 'Laba Kotor = Pendapatan - HPP',
    explanation: 'Laba Kotor dihitung dari Pendapatan (Rp500 juta) dikurangi HPP (Rp300 juta) = Rp200 juta. Margin laba kotornya adalah 200/500 x 100% = 40%.',
  },
  {
    id: 2,
    section: 'Laba Rugi',
    question: 'Apa arti laba operasi perusahaan tercatat sebesar -Rp50 juta?',
    options: [
      { label: 'A', text: 'Perusahaan pasti tidak memiliki kas sama sekali' },
      { label: 'B', text: 'Beban operasional melampaui laba kotor sebesar Rp50 juta' },
      { label: 'C', text: 'Pendapatan perusahaan bernilai nol' },
      { label: 'D', text: 'Perusahaan tidak memiliki aset berwujud' },
    ],
    correctAnswer: 'B',
    formula: 'Laba Operasi = Laba Kotor - Beban Operasi',
    explanation: 'Laba operasi negatif (rugi operasional) terjadi ketika total beban operasional (gaji, sewa, pemasaran, administrasi) lebih besar daripada laba kotor yang dihasilkan kegiatan bisnis utama.',
  },
  {
    id: 3,
    section: 'Neraca Keuangan',
    question: 'Aset lancar bernilai Rp600 juta dan kewajiban lancar Rp300 juta. Berapakah Current Ratio (Rasio Lancar)?',
    options: [
      { label: 'A', text: '0,5 kali' },
      { label: 'B', text: '1,0 kali' },
      { label: 'C', text: '2,0 kali' },
      { label: 'D', text: '3,0 kali' },
    ],
    correctAnswer: 'C',
    formula: 'Current Ratio = Aset Lancar / Kewajiban Lancar',
    explanation: 'Current Ratio = 600 / 300 = 2,0 kali. Artinya terdapat Rp2 aset lancar untuk setiap Rp1 kewajiban jangka pendek yang harus dibayar.',
  },
  {
    id: 4,
    section: 'Arus Kas',
    question: 'Pembelian mesin pabrik baru untuk meningkatkan kapasitas produksi dicatat dalam aktivitas apa pada laporan arus kas?',
    options: [
      { label: 'A', text: 'Arus Kas Aktivitas Operasi (CFO)' },
      { label: 'B', text: 'Arus Kas Aktivitas Investasi (CFI)' },
      { label: 'C', text: 'Arus Kas Aktivitas Pembiayaan (CFF)' },
      { label: 'D', text: 'Pendapatan Diterima di Muka' },
    ],
    correctAnswer: 'B',
    explanation: 'Pembelian atau peningkatan aset jangka panjang/aset tetap (CapEx) dicatat sebagai arus kas keluar dalam Aktivitas Investasi (Cash Flow from Investing Activities).',
  },
  {
    id: 5,
    section: 'Arus Kas & Akuntansi',
    question: 'Mengapa sebuah perusahaan bisa mencatat laba bersih positif tetapi justru mengalami penurunan kas yang signifikan?',
    options: [
      { label: 'A', text: 'Laba bersih selalu identik dan bernilai sama persis dengan saldo kas tunai' },
      { label: 'B', text: 'Karena laba akuntansi (metode akrual) dan arus kas (aliran riil uang tunai) mengukur hal yang berbeda' },
      { label: 'C', text: 'Karena aset tidak pernah dimasukkan ke dalam neraca keuangan' },
      { label: 'D', text: 'Karena kewajiban perusahaan selalu bernilai nol' },
    ],
    correctAnswer: 'B',
    explanation: 'Akuntansi menggunakan metode akrual (pendapatan diakui saat transaksi terjadi meski belum dibayar tunai). Kas bisa turun jika banyak penjualan berupa piutang belum tertagih, pembayaran utang lama, atau belanja modal besar.',
  },
  {
    id: 6,
    section: 'Neraca Keuangan',
    question: 'Manakah persamaan dasar akuntansi yang benar dan wajib seimbang?',
    options: [
      { label: 'A', text: 'Aset = Pendapatan + Beban' },
      { label: 'B', text: 'Aset = Kewajiban + Ekuitas' },
      { label: 'C', text: 'Ekuitas = Pendapatan - Beban' },
      { label: 'D', text: 'Kewajiban = Aset + Ekuitas' },
    ],
    correctAnswer: 'B',
    formula: 'Aset = Kewajiban + Ekuitas',
    explanation: 'Semua sumber daya perusahaan (Aset) didanai dari dua sumber: pinjaman/kreditur (Kewajiban) atau modal pemilik/investor (Ekuitas). Neraca selalu seimbang.',
  },
  {
    id: 7,
    section: 'Neraca Keuangan',
    question: 'Jika total aset tercatat 1.877,83 dan total kewajiban adalah 461,00, berapakah nilai ekuitas pemegang saham?',
    options: [
      { label: 'A', text: '461,00' },
      { label: 'B', text: '1.416,83' },
      { label: 'C', text: '2.338,83' },
      { label: 'D', text: '1.877,83' },
    ],
    correctAnswer: 'B',
    formula: 'Ekuitas = Total Aset - Total Kewajiban',
    explanation: 'Ekuitas = 1.877,83 - 461,00 = 1.416,83. Ini adalah nilai buku bersih klaim pemilik atas aset perusahaan.',
  },
  {
    id: 8,
    section: 'Rasio Finansial',
    question: 'Perusahaan A memiliki margin kotor -5,78% tetapi memiliki margin laba bersih 78,06%. Sebagai analis keuangan, apa interpretasi paling tepat?',
    options: [
      { label: 'A', text: 'Perusahaan A memiliki operasi bisnis yang sangat efisien dan produk paling unggul' },
      { label: 'B', text: 'Terdapat anomali laba: Laba bersih bukan berasal dari operasional inti, melainkan kemungkinan besar dari penjualan aset atau pos luar biasa' },
      { label: 'C', text: 'Perusahaan A pasti memiliki kas operasional yang melimpah ruah' },
      { label: 'D', text: 'Harga pokok penjualan selalu diabaikan oleh investor' },
    ],
    correctAnswer: 'B',
    explanation: 'Ketika margin kotor negatif (rugi langsung dari jualan produk) namun laba bersih sangat tinggi, laba tersebut tidak berulang (non-recurring). Analis harus memeriksa pos penjualan aset atau pendapatan bunga non-operasional.',
  },
  {
    id: 9,
    section: 'Rasio Efisiensi',
    question: 'Perusahaan memiliki Days Sales Outstanding (DSO) sebesar 264 hari. Apa artinya bagi kesehatan modal kerja perusahaan?',
    options: [
      { label: 'A', text: 'Pelanggan membayar sangat cepat dalam hitungan jam' },
      { label: 'B', text: 'Rata-rata dibutuhkan waktu hampir 9 bulan bagi perusahaan untuk menagih piutang pelanggannya, menandakan risiko piutang macet yang tinggi' },
      { label: 'C', text: 'Perusahaan menjual barang tanpa margin keuntungan' },
      { label: 'D', text: 'Perputaran persediaan barang terjadi setiap hari' },
    ],
    correctAnswer: 'B',
    formula: 'DSO = 365 / Receivables Turnover',
    explanation: 'DSO 264 hari berarti kas terikat pada piutang selama hampir setahun. Ini membebani arus kas dan meningkatkan risiko gagal bayar dari debitur.',
  },
  {
    id: 10,
    section: 'Valuasi',
    question: 'Perusahaan memiliki Free Cash Flow (FCF) negatif, sehingga Price to FCF tercatat -9,87x. Apakah rasio negatif ini berarti saham tersebut murah?',
    options: [
      { label: 'A', text: 'Ya, rasio negatif selalu menunjukkan diskon valuasi terbesar' },
      { label: 'B', text: 'Tidak, rasio valuasi berbasis arus kas bernilai negatif tidak memiliki makna ekonomis sebagai penanda harga murah' },
      { label: 'C', text: 'Ya, karena perusahaan tidak perlu membayar dividen' },
      { label: 'D', text: 'Tidak, karena harga saham tidak boleh dihitung dengan arus kas' },
    ],
    correctAnswer: 'B',
    explanation: 'Rasio kelipatan (multiples) seperti P/E atau P/FCF yang bernilai negatif tidak dapat diinterpretasikan sebagai "murah". Hal tersebut menunjukkan arus kas bebas perusahaan berada di bawah nol (defisit kas).',
  },
];

export interface GlossaryItem {
  term: string;
  englishTerm: string;
  category: 'Laba Rugi' | 'Neraca' | 'Arus Kas' | 'Rasio & Valuasi';
  shortDef: string;
  formula?: string;
  importance: string;
  example: string;
}

export const financialGlossary: GlossaryItem[] = [
  {
    term: 'Total Pendapatan',
    englishTerm: 'Total Revenue / Top Line',
    category: 'Laba Rugi',
    shortDef: 'Seluruh penghasilan kotor yang diperoleh perusahaan dari penjualan barang atau jasa sebelum dikurangi biaya apapun.',
    formula: 'Total Pendapatan = Harga Jual x Kuantitas Terjual',
    importance: 'Mengukur skala ukuran bisnis dan permintaan pasar.',
    example: '800,10 miliar dari total transaksi penjualan selama satu tahun fiskal.',
  },
  {
    term: 'Harga Pokok Penjualan (HPP)',
    englishTerm: 'Cost of Goods Sold (COGS) / Cost of Revenue',
    category: 'Laba Rugi',
    shortDef: 'Biaya langsung yang timbul untuk memproduksi barang atau memberikan jasa yang dijual.',
    formula: 'HPP = Persediaan Awal + Pembelian Bersih - Persediaan Akhir',
    importance: 'Menentukan efisiensi biaya bahan baku dan tenaga kerja langsung.',
    example: '508,20 juta untuk biaya bahan baku tekstil dan upah penjahit pabrik.',
  },
  {
    term: 'Laba Kotor',
    englishTerm: 'Gross Profit',
    category: 'Laba Rugi',
    shortDef: 'Sisa pendapatan setelah dikurangi seluruh biaya produksi langsung (HPP).',
    formula: 'Laba Kotor = Total Pendapatan - HPP',
    importance: 'Mengukur profitabilitas murni dari produk sebelum biaya kantor.',
    example: 'Pendapatan 800,10 - HPP 508,20 = Laba Kotor 291,90 (Gross Margin 36,48%).',
  },
  {
    term: 'Beban Operasional',
    englishTerm: 'Operating Expenses (OPEX)',
    category: 'Laba Rugi',
    shortDef: 'Biaya harian untuk menjalankan bisnis di luar biaya langsung produk, mencakup R&D dan SG&A.',
    formula: 'OPEX = R&D + Beban Penjualan + Beban Administrasi',
    importance: 'Mencerminkan kemampuan manajemen mengendalikan pengeluaran overhead.',
    example: 'Gaji staf kantor, biaya server, sewa kantor pusat, dan promosi iklan.',
  },
  {
    term: 'Laba Operasi / EBIT',
    englishTerm: 'Operating Income / EBIT',
    category: 'Laba Rugi',
    shortDef: 'Keuntungan dari kegiatan bisnis inti perusahaan sebelum memperhitungkan beban bunga pinjaman dan pajak penghasilan.',
    formula: 'EBIT = Laba Kotor - Beban Operasional',
    importance: 'Indikator terbaik kesehatan bisnis inti tanpa distorsi struktur utang dan tarif pajak.',
    example: 'Laba Kotor 291,90 - Beban Operasi 231,29 = Laba Operasi 60,61.',
  },
  {
    term: 'EBITDA',
    englishTerm: 'Earnings Before Interest, Taxes, Depreciation & Amortization',
    category: 'Laba Rugi',
    shortDef: 'Laba operasi sebelum memperhitungkan bunga, pajak, serta beban non-tunai depresiasi dan amortisasi.',
    formula: 'EBITDA = EBIT + Depresiasi + Amortisasi',
    importance: 'Proksi kasar kemampuan operasional menghasilkan arus kas kotor.',
    example: 'EBIT 60,61 + Depresiasi 73,09 = EBITDA 133,70 (EBITDA Margin 16,71%).',
  },
  {
    term: 'Laba Bersih',
    englishTerm: 'Net Income / Bottom Line',
    category: 'Laba Rugi',
    shortDef: 'Hasil akhir keuntungan perusahaan setelah seluruh beban operasional, bunga pinjaman, pos luar biasa, dan pajak diperhitungkan.',
    formula: 'Laba Bersih = Total Pendapatan - Seluruh Beban (termasuk Bunga & Pajak)',
    importance: 'Dasar penghitungan EPS dan pembagian dividen bagi pemegang saham.',
    example: 'EBT 72,31 - Beban Pajak 31,05 = Laba Bersih 41,26.',
  },
  {
    term: 'Laba per Saham',
    englishTerm: 'Earnings Per Share (EPS)',
    category: 'Laba Rugi',
    shortDef: 'Bagian laba bersih perusahaan yang dialokasikan untuk setiap satu lembar saham biasa yang beredar.',
    formula: 'EPS = (Laba Bersih - Dividen Preferen) / Rata-rata Saham Beredar',
    importance: 'Metrik utama investor saham untuk menghitung valuasi P/E.',
    example: 'Laba Bersih 41,26 juta / 79,35 juta lembar saham = EPS Rp0,52.',
  },
  {
    term: 'Kas dan Setara Kas',
    englishTerm: 'Cash and Cash Equivalents',
    category: 'Neraca',
    shortDef: 'Uang tunai di brankas, saldo rekening giro/tabungan bank, serta investasi likuid yang jatuh tempo < 3 bulan.',
    formula: 'Kas Fisik + Rekening Bank + Deposito Jangka Sangat Pendek',
    importance: 'Oksigen likuiditas perusahaan untuk melunasi tagihan mendesak.',
    example: 'Perusahaan memiliki cadangan kas 722,66 untuk operasional.',
  },
  {
    term: 'Piutang Usaha',
    englishTerm: 'Accounts Receivable',
    category: 'Neraca',
    shortDef: 'Hak tagih perusahaan kepada pelanggan atas barang atau jasa yang sudah diserahkan tetapi belum dibayar tunai.',
    importance: 'Jika piutang membengkak tanpa kas masuk, ada risiko gagal bayar.',
    example: 'Pelanggan korporat berutang 112,34 dengan termin pembayaran 30 hari.',
  },
  {
    term: 'Aset Tetap Bersih',
    englishTerm: 'Net PP&E (Property, Plant, and Equipment)',
    category: 'Neraca',
    shortDef: 'Nilai buku aset fisik produktif (tanah, pabrik, mesin) setelah dikurangi akumulasi penyusutan.',
    formula: 'Net PP&E = Gross PP&E - Akumulasi Depresiasi',
    importance: 'Menunjukkan modal fisik yang masih produktif untuk operasi pabrik.',
    example: 'Gross PP&E 2.035,69 - Akumulasi Depresiasi 1.739,99 = Net PP&E 295,70.',
  },
  {
    term: 'Kewajiban Lancar',
    englishTerm: 'Current Liabilities',
    category: 'Neraca',
    shortDef: 'Seluruh utang dan kewajiban yang wajib diselesaikan dalam jangka waktu 12 bulan.',
    formula: 'Utang Usaha + Pinjaman Jangka Pendek + Beban Akrual + Bagian Utang JP Jatuh Tempo',
    importance: 'Menjadi penyebut dalam evaluasi rasio likuiditas (Current Ratio).',
    example: 'Total kewajiban lancar tercatat 372,04.',
  },
  {
    term: 'Total Ekuitas',
    englishTerm: 'Total Equity / Book Value',
    category: 'Neraca',
    shortDef: 'Hak residual atau nilai bersih pemilik perusahaan atas seluruh aset setelah dikurangi seluruh kewajiban.',
    formula: 'Ekuitas = Total Aset - Total Kewajiban',
    importance: 'Fondasi modal sendiri yang menyerap potensi kerugian sebelum berdampak ke kreditur.',
    example: 'Total Aset 1.877,83 - Total Kewajiban 461,00 = Total Ekuitas 1.416,83.',
  },
  {
    term: 'Laba Ditahan',
    englishTerm: 'Retained Earnings',
    category: 'Neraca',
    shortDef: 'Akumulasi laba bersih historis yang diinvestasikan kembali ke bisnis alih-alih dibagikan sebagai dividen.',
    formula: 'Laba Ditahan Akhir = Laba Ditahan Awal + Laba Bersih - Dividen',
    importance: 'Sumber pendanaan internal terpenting untuk ekspansi jangka panjang.',
    example: 'Saldo laba ditahan berbalik positif menjadi 41,30 setelah beberapa tahun merugi.',
  },
  {
    term: 'Arus Kas Operasi',
    englishTerm: 'Cash Flow from Operating Activities (CFO)',
    category: 'Arus Kas',
    shortDef: 'Aliran kas masuk dan keluar riil dari aktivitas bisnis inti (penerimaan kas pelanggan, bayar vendor & gaji).',
    importance: 'Jika CFO negatif terus-menerus, perusahaan tidak mampu mandiri secara finansial.',
    example: 'CFO positif 150 juta membuktikan barang yang laku berhasil ditagih uang tunainya.',
  },
  {
    term: 'Belanja Modal',
    englishTerm: 'Capital Expenditure (CapEx)',
    category: 'Arus Kas',
    shortDef: 'Pengeluaran kas untuk membeli, merawat, atau memperluas aset jangka panjang seperti mesin dan gedung.',
    formula: 'CapEx = Pembelian Aset Tetap (bagian dari CFI)',
    importance: 'Investasi masa depan untuk mempertahankan atau memperbesar daya saing.',
    example: 'Membeli robot otomatisasi pabrik senilai 50 juta.',
  },
  {
    term: 'Arus Kas Bebas',
    englishTerm: 'Free Cash Flow (FCF)',
    category: 'Arus Kas',
    shortDef: 'Kas riil yang tersisa dari kegiatan operasional setelah menyisihkan dana untuk belanja modal pemeliharaan/ekspansi.',
    formula: 'FCF = Arus Kas Operasi - Belanja Modal (CapEx)',
    importance: 'Uang tunai bebas yang dapat digunakan untuk bayar utang, bagi dividen, atau beli kembali saham.',
    example: 'CFO 150 juta - CapEx 50 juta = FCF 100 juta.',
  },
  {
    term: 'Current Ratio',
    englishTerm: 'Current Ratio (Rasio Lancar)',
    category: 'Rasio & Valuasi',
    shortDef: 'Mengukur kemampuan aset lancar menutupi kewajiban jangka pendek yang segera jatuh tempo.',
    formula: 'Current Ratio = Aset Lancar / Kewajiban Lancar',
    importance: 'Benchmark ideal umumnya >= 1,2x - 2,0x tergantung siklus modal kerja industri.',
    example: 'Aset lancar 1.045 / Kewajiban lancar 372,04 = 2,81 kali.',
  },
  {
    term: 'Cash Ratio',
    englishTerm: 'Cash Ratio (Rasio Kas)',
    category: 'Rasio & Valuasi',
    shortDef: 'Mengukur seberapa kuat cadangan uang tunai dan setara kas menutupi seluruh utang lancar seketika.',
    formula: 'Cash Ratio = Kas dan Setara Kas / Kewajiban Lancar',
    importance: 'Uji ketahanan likuiditas paling konservatif (tanpa mengandalkan penjualan stok atau penagihan piutang).',
    example: 'Kas 722,66 / Kewajiban lancar 372,04 = 1,94 kali (sangat likuid).',
  },
  {
    term: 'Debt to Equity Ratio',
    englishTerm: 'Debt to Equity Ratio (DER)',
    category: 'Rasio & Valuasi',
    shortDef: 'Perbandingan total utang berbunga terhadap modal sendiri (ekuitas pemegang saham).',
    formula: 'DER = Total Utang Berbunga / Total Ekuitas x 100%',
    importance: 'Mengukur risiko kebangkrutan dan ketergantungan pada pinjaman pihak ketiga.',
    example: 'Total Utang 190,09 / Ekuitas 1.416,83 = 13,42% (struktur permodalan sangat aman).',
  },
  {
    term: 'Days Sales Outstanding',
    englishTerm: 'DSO (Hari Penagihan Piutang)',
    category: 'Rasio & Valuasi',
    shortDef: 'Estimasi rata-rata hari yang dibutuhkan perusahaan untuk menerima pembayaran kas sejak penjualan kredit dilakukan.',
    formula: 'DSO = 365 / Perputaran Piutang',
    importance: 'Semakin kecil hari penagihan, semakin cepat kas masuk dan modal kerja berputar.',
    example: 'Perusahaan A membutuhkan 264 hari vs Perusahaan B yang hanya 56 hari.',
  },
  {
    term: 'Price to Earnings',
    englishTerm: 'P/E Ratio',
    category: 'Rasio & Valuasi',
    shortDef: 'Rasio perbandingan harga pasar saham terhadap laba bersih per saham yang dihasilkan.',
    formula: 'P/E = Harga Saham / EPS',
    importance: 'Menunjukkan berapa rupiah yang rela dibayar investor untuk setiap Rp1 laba perusahaan.',
    example: 'Saham berharga Rp1.000 dengan EPS Rp50 memiliki P/E 20 kali.',
  },
  {
    term: 'Trailing Twelve Months',
    englishTerm: 'TTM',
    category: 'Rasio & Valuasi',
    shortDef: 'Periode pengukuran akumulatif 12 bulan terakhir untuk menstandarkan data berjalan antar laporan kuartalan.',
    importance: 'Mencegah distorsi musiman kuartalan tunggal.',
    example: 'Penjualan TTM menggabungkan hasil kuartal Q1, Q2, Q3, dan Q4 terkini.',
  },
];
