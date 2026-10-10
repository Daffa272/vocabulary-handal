export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Analysis' | 'Advanced Modeling';
  summary: string;
  content: string[];
  formula?: string;
  interactiveInputs: {
    key: string;
    label: string;
    defaultValue: number;
    step: number;
    unit: string;
  }[];
  computeOutput: (inputs: Record<string, number>) => { label: string; value: string; note: string }[];
  quiz: QuizQuestion[];
}

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'income-statement',
    title: 'Cara Membaca Laporan Laba Rugi (Income Statement)',
    category: 'Fundamentals',
    summary: 'Memahami bagaimana pendapatan diubah menjadi laba bersih melalui tahapan biaya operasional, bunga, dan pajak.',
    content: [
      'Laporan Laba Rugi mengukur kinerja ekonomi perusahaan selama rentang waktu tertentu (kuartal atau tahunan).',
      'Struktur standar mengikuti hierarki: Pendapatan (Revenue) dikurangi Beban Pokok Pendapatan (COGS) menghasilkan Laba Kotor (Gross Profit).',
      'Dari Laba Kotor, kurangi Beban Operasional (SG&A, R&D, Depresiasi) untuk mendapatkan Laba Operasional (EBIT).',
      'Laba Bersih (Net Income) adalah hasil akhir setelah memperhitungkan beban bunga pinjaman dan beban pajak penghasilan.',
    ],
    formula: 'Laba Bersih = Pendapatan - COGS - Beban Operasional - Bunga - Pajak',
    interactiveInputs: [
      { key: 'revenue', label: 'Pendapatan (Revenue)', defaultValue: 1000000, step: 50000, unit: '$' },
      { key: 'cogs', label: 'Beban Pokok (COGS)', defaultValue: 600000, step: 25000, unit: '$' },
      { key: 'opex', label: 'Beban Operasional (OpEx)', defaultValue: 250000, step: 10000, unit: '$' },
      { key: 'taxRate', label: 'Tarif Pajak Efektif (%)', defaultValue: 22, step: 1, unit: '%' },
    ],
    computeOutput: (inputs) => {
      const gp = inputs.revenue - inputs.cogs;
      const gpm = inputs.revenue > 0 ? (gp / inputs.revenue) * 100 : 0;
      const ebit = gp - inputs.opex;
      const tax = Math.max(0, ebit * (inputs.taxRate / 100));
      const net = ebit - tax;
      const npm = inputs.revenue > 0 ? (net / inputs.revenue) * 100 : 0;

      return [
        { label: 'Laba Kotor (Gross Profit)', value: `$${gp.toLocaleString()}`, note: `Margin Kotor: ${gpm.toFixed(1)}%` },
        { label: 'Laba Operasional (EBIT)', value: `$${ebit.toLocaleString()}`, note: `Operating Margin: ${(ebit / inputs.revenue * 100).toFixed(1)}%` },
        { label: 'Laba Bersih (Net Income)', value: `$${net.toLocaleString()}`, note: `Net Margin: ${npm.toFixed(1)}%` },
      ];
    },
    quiz: [
      {
        question: 'Jika Revenue naik 20% namun Laba Kotor turun, apa penyebab yang paling mungkin?',
        options: [
          'Beban pajak penghasilan melonjak tinggi',
          'Biaya bahan baku atau produksi (COGS) naik lebih cepat dari volume penjualan',
          'Perusahaan membayar dividen tunai lebih banyak',
          'Piutang usaha gagal tertagih di neraca',
        ],
        correctIndex: 1,
        explanation: 'Gross Profit hanya dipengaruhi oleh Revenue dan COGS. Jika Gross Profit turun saat Revenue naik, berarti COGS tumbuh melampaui pertumbuhan pendapatan.',
      },
    ],
  },
  {
    id: 'balance-sheet',
    title: 'Cara Membaca Neraca Keuangan (Balance Sheet)',
    category: 'Fundamentals',
    summary: 'Menganalisis posisi solvabilitas dan struktur modal perusahaan pada satu titik waktu spesifik.',
    content: [
      'Neraca adalah potret instan (snapshot) kekayaan dan kewajiban perusahaan pada tanggal tutup buku.',
      'Persamaan fundamental akuntansi: Total Aset = Total Liabilitas + Total Ekuitas.',
      'Aset diklasifikasikan berdasarkan likuiditas: Aset Lancar (kas, piutang, persediaan) dan Aset Tidak Lancar (mesin, pabrik, paten).',
      'Liabilitas dibagi menjadi kewajiban jangka pendek (< 1 tahun) dan kewajiban jangka panjang.',
    ],
    formula: 'Aset = Liabilitas + Ekuitas',
    interactiveInputs: [
      { key: 'assets', label: 'Total Aset', defaultValue: 5000000, step: 100000, unit: '$' },
      { key: 'liabilities', label: 'Total Liabilitas', defaultValue: 2800000, step: 50000, unit: '$' },
    ],
    computeOutput: (inputs) => {
      const equity = inputs.assets - inputs.liabilities;
      const deRatio = equity > 0 ? inputs.liabilities / equity : 0;
      const debtRatio = inputs.assets > 0 ? (inputs.liabilities / inputs.assets) * 100 : 0;

      return [
        { label: 'Total Ekuitas Pemegang Saham', value: `$${equity.toLocaleString()}`, note: 'Nilai buku bersih perusahaan' },
        { label: 'Debt-to-Equity Ratio', value: `${deRatio.toFixed(2)}x`, note: deRatio > 2 ? 'Leverage tinggi' : 'Leverage terkendali' },
        { label: 'Rasio Utang terhadap Aset', value: `${debtRatio.toFixed(1)}%`, note: 'Proporsi aset yang didanai kreditur' },
      ];
    },
    quiz: [
      {
        question: 'Apakah persamaan neraca boleh memiliki selisih lebih dari nol?',
        options: [
          'Boleh jika perusahaan mencatat kerugian operasional',
          'Tidak boleh, Total Aset harus sama persis dengan Total Liabilitas ditambah Total Ekuitas',
          'Boleh jika ada depresiasi aset tetap',
          'Tergantung mata uang yang digunakan',
        ],
        correctIndex: 1,
        explanation: 'Persamaan Neraca bersifat absolut. Setiap transaksi akuntansi menganut double-entry yang mempertahankan keseimbangan Aset = Liabilitas + Ekuitas.',
      },
    ],
  },
  {
    id: 'three-statement-link',
    title: 'Hubungan Tiga Laporan Keuangan (3-Statement Linkage)',
    category: 'Fundamentals',
    summary: 'Bagaimana Laba Rugi, Neraca, dan Arus Kas saling terhubung secara terintegrasi.',
    content: [
      'Laba Bersih dari Laporan Laba Rugi mengalir ke baris pertama Arus Kas Operasional.',
      'Laba Bersih yang tidak dibagikan sebagai dividen mengalir ke Laba Ditahan (Retained Earnings) pada ekuitas Neraca.',
      'Perubahan pos modal kerja di Neraca (Piutang, Persediaan, Utang Dagang) menjadi penyesuaian kas pada Arus Kas Operasional.',
      'Saldo Kas Akhir pada Laporan Arus Kas harus sama persis dengan Saldo Kas pada Neraca.',
    ],
    interactiveInputs: [
      { key: 'netIncome', label: 'Laba Bersih (Net Income)', defaultValue: 500000, step: 25000, unit: '$' },
      { key: 'dividends', label: 'Dividen Tunai Dibagikan', defaultValue: 150000, step: 10000, unit: '$' },
      { key: 'deltaAR', label: 'Kenaikan Piutang Usaha (Δ AR)', defaultValue: 80000, step: 10000, unit: '$' },
    ],
    computeOutput: (inputs) => {
      const retainedAddition = inputs.netIncome - inputs.dividends;
      const cashImpact = inputs.netIncome - inputs.deltaAR;

      return [
        { label: 'Penambahan Laba Ditahan ke Neraca', value: `$${retainedAddition.toLocaleString()}`, note: 'Masuk ke Ekuitas Neraca' },
        { label: 'Dampak Kas Operasional dari Piutang', value: `$${cashImpact.toLocaleString()}`, note: 'Piutang naik menyerap kas keluar' },
      ];
    },
    quiz: [
      {
        question: 'Jika Piutang Usaha meningkat $100,000 di neraca, bagaimana dampaknya pada Laporan Arus Kas?',
        options: [
          'Arus kas operasional bertambah $100,000',
          'Arus kas operasional berkurang $100,000 sebagai penyesuaian non-kas',
          'Arus kas pendanaan bertambah $100,000',
          'Tidak ada dampak pada arus kas',
        ],
        correctIndex: 1,
        explanation: 'Kenaikan piutang berarti pendapatan sudah diakui di laba rugi tetapi kas fisiknya belum diterima dari pelanggan, sehingga harus dikurangkan dari laba bersih pada arus kas operasional.',
      },
    ],
  },
  {
    id: 'financial-ratios',
    title: 'Financial Ratio Analysis (Likuiditas, Profitabilitas & Solvabilitas)',
    category: 'Analysis',
    summary: 'Kerangka lengkap evaluasi kesehatan finansial menggunakan benchmarking multi-dimensi.',
    content: [
      'Rasio Likuiditas mengukur kesiapan menghadapi kewajiban jatuh tempo segera (Current Ratio, Quick Ratio).',
      'Rasio Profitabilitas mengukur kemampuan menghasilkan return ekonomis dari modal dan aset yang diinvestasikan (ROA, ROE, NPM).',
      'Rasio Solvabilitas mengukur kapasitas bertahan jangka panjang terhadap struktur utang (Debt-to-Equity, Interest Coverage).',
    ],
    interactiveInputs: [
      { key: 'currentAssets', label: 'Aset Lancar', defaultValue: 2000000, step: 50000, unit: '$' },
      { key: 'inventory', label: 'Persediaan (Inventory)', defaultValue: 600000, step: 25000, unit: '$' },
      { key: 'currentLiab', label: 'Liabilitas Lancar', defaultValue: 1200000, step: 50000, unit: '$' },
    ],
    computeOutput: (inputs) => {
      const cr = inputs.currentLiab > 0 ? inputs.currentAssets / inputs.currentLiab : 0;
      const quickAssets = inputs.currentAssets - inputs.inventory;
      const qr = inputs.currentLiab > 0 ? quickAssets / inputs.currentLiab : 0;

      return [
        { label: 'Current Ratio', value: `${cr.toFixed(2)}x`, note: cr >= 1.5 ? 'Likuiditas sehat' : 'Bantalan kas ketat' },
        { label: 'Quick (Acid-Test) Ratio', value: `${qr.toFixed(2)}x`, note: qr >= 1.0 ? 'Kewajiban tertutup aset likuid' : 'Tergantung penjualan stok' },
      ];
    },
    quiz: [
      {
        question: 'Mengapa persediaan dikeluarkan pada perhitungan Quick Ratio?',
        options: [
          'Karena persediaan tidak memiliki nilai buku',
          'Karena persediaan membutuhkan waktu untuk dijual dan tidak selalu dapat diuangkan seketika',
          'Karena persediaan selalu dibeli dengan utang bank',
          'Karena pajak persediaan sangat tinggi',
        ],
        correctIndex: 1,
        explanation: 'Persediaan adalah komponen aset lancar yang paling tidak likuid karena membutuhkan waktu pemasaran dan proses pengiriman sebelum menjadi kas.',
      },
    ],
  },
  {
    id: 'working-capital-ccc',
    title: 'Working Capital & Cash Conversion Cycle (CCC)',
    category: 'Analysis',
    summary: 'Siklus konversi kas mengukur berapa hari kas perusahaan terikat dalam siklus operasi.',
    content: [
      'Net Working Capital = Current Assets - Current Liabilities.',
      'DSO (Days Sales Outstanding): Rata-rata hari penagihan piutang pelanggan.',
      'DIO (Days Inventory Outstanding): Rata-rata hari persediaan tersimpan di gudang.',
      'DPO (Days Payable Outstanding): Rata-rata hari pembayaran utang ke pemasok.',
      'CCC = DSO + DIO - DPO. Semakin pendek siklusnya, semakin efisien pengelolaan modal kerja.',
    ],
    formula: 'Cash Conversion Cycle = DSO + DIO - DPO',
    interactiveInputs: [
      { key: 'dso', label: 'Days Sales Outstanding (DSO)', defaultValue: 45, step: 1, unit: 'hari' },
      { key: 'dio', label: 'Days Inventory Outstanding (DIO)', defaultValue: 60, step: 1, unit: 'hari' },
      { key: 'dpo', label: 'Days Payable Outstanding (DPO)', defaultValue: 35, step: 1, unit: 'hari' },
    ],
    computeOutput: (inputs) => {
      const ccc = inputs.dso + inputs.dio - inputs.dpo;

      return [
        { label: 'Cash Conversion Cycle (CCC)', value: `${ccc} Hari`, note: ccc < 60 ? 'Perputaran kas cepat' : 'Modal kerja intensif' },
        { label: 'Total Waktu Operasi (DSO + DIO)', value: `${inputs.dso + inputs.dio} Hari`, note: 'Lama dari beli bahan hingga terima uang' },
        { label: 'Kredit Pemasok (DPO)', value: `${inputs.dpo} Hari`, note: 'Penundaan pembayaran yang didanai supplier' },
      ];
    },
    quiz: [
      {
        question: 'Dapatkah Cash Conversion Cycle bernilai negatif?',
        options: [
          'Tidak mungkin, hari tidak bisa negatif',
          'Bisa, contohnya model bisnis seperti Dell atau Amazon di mana pelanggan bayar di muka dan supplier dibayar 90 hari kemudian',
          'Hanya jika perusahaan mengalami kebangkrutan',
          'Hanya pada industri manufaktur berat',
        ],
        correctIndex: 1,
        explanation: 'CCC negatif terjadi jika DPO lebih besar daripada penjumlahan DSO dan DIO. Perusahaan mengumpulkan kas dari pembeli sebelum membayar tagihan ke vendor, sehingga operasi didanai oleh pemasok.',
      },
    ],
  },
  {
    id: 'dcf-valuation',
    title: 'Discounted Cash Flow (DCF) & Gordon Growth Valuation',
    category: 'Advanced Modeling',
    summary: 'Metode penilaian intrinsik perusahaan berbasis nilai sekarang dari proyeksi arus kas bebas masa depan.',
    content: [
      'DCF didasarkan pada prinsip Time Value of Money: Satu dolar hari ini lebih berharga daripada satu dolar di masa depan.',
      'Komponen utama: Proyeksi Arus Kas Bebas (FCF), Discount Rate (WACC), dan Terminal Growth Rate (g).',
      'Terminal Value menghitung nilai perusahaan di luar periode proyeksi eksplisit menggunakan Gordon Growth Model: TV = [FCF * (1 + g)] / (WACC - g).',
      'Enterprise Value = PV Arus Kas + PV Nilai Terminal. Nilai Ekuitas = Enterprise Value - Net Debt.',
    ],
    formula: 'TV = [FCF * (1 + g)] / (WACC - g)',
    interactiveInputs: [
      { key: 'fcf', label: 'Arus Kas Bebas Tahun Terakhir ($)', defaultValue: 15000000, step: 1000000, unit: '$' },
      { key: 'wacc', label: 'WACC / Discount Rate (%)', defaultValue: 9.5, step: 0.1, unit: '%' },
      { key: 'growth', label: 'Terminal Growth Rate g (%)', defaultValue: 2.5, step: 0.1, unit: '%' },
      { key: 'netDebt', label: 'Utang Bersih (Net Debt) ($)', defaultValue: 20000000, step: 1000000, unit: '$' },
    ],
    computeOutput: (inputs) => {
      if (inputs.growth >= inputs.wacc) {
        return [
          { label: 'Status Model', value: 'ERROR ASUMSI', note: 'Terminal growth rate harus lebih kecil dari WACC!' },
        ];
      }
      const wacc = inputs.wacc / 100;
      const g = inputs.growth / 100;
      const tv = (inputs.fcf * (1 + g)) / (wacc - g);
      const pvTV = tv / Math.pow(1 + wacc, 5);
      const ev = pvTV + (inputs.fcf * 3.8); // approx 5-year pv
      const equityVal = ev - inputs.netDebt;

      return [
        { label: 'Terminal Value (TV)', value: `$${Math.round(tv).toLocaleString()}`, note: 'Nilai pada horizon 5 tahun' },
        { label: 'Estimated Enterprise Value', value: `$${Math.round(ev).toLocaleString()}`, note: 'Nilai operasi perusahaan' },
        { label: 'Estimated Equity Value', value: `$${Math.round(equityVal).toLocaleString()}`, note: 'Nilai ekuitas pemegang saham' },
      ];
    },
    quiz: [
      {
        question: 'Mengapa Terminal Growth Rate (g) tidak boleh lebih tinggi atau sama dengan WACC?',
        options: [
          'Akan memicu pembagian dengan nol atau angka negatif yang menghasilkan nilai tak hingga matematis yang tidak realistis',
          'Karena aturan pajak internasional melarangnya',
          'Karena laba bersih akan otomatis menjadi nol',
          'Karena bunga bank akan otomatis meningkat',
        ],
        correctIndex: 0,
        explanation: 'Pada rumus TV = FCF*(1+g)/(WACC-g), jika g >= WACC maka penyebut menjadi nol atau negatif, yang secara logis berarti perusahaan tumbuh selamanya lebih cepat dari perekonomian dunia.',
      },
    ],
  },
];
