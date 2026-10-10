import { DaxFunctionItem, SalesRecord } from '../types';

export const daxFunctionsList: DaxFunctionItem[] = [
  {
    id: 'sum',
    name: 'SUM',
    category: 'Aggregation',
    syntax: 'SUM(<ColumnName>)',
    returnType: 'Decimal / Whole Number',
    shortDesc: 'Menjumlahkan seluruh nilai numerik dalam satu kolom dalam Filter Context aktif.',
    detailedExplanation: 'Fungsi agregasi paling fundamental. SUM mengambil satu kolom numerik sebagai argumen dan menjumlahkan semua baris yang lolos filter context saat ini. Mengabaikan nilai kosong (BLANK).',
    syntaxBreakdown: [
      { param: '<ColumnName>', desc: 'Nama kolom numerik yang ingin dijumlahkan, misal: Sales[SalesAmount]' }
    ],
    contextType: 'Filter Context',
    sampleFormula: 'Total Sales = SUM(Sales[SalesAmount])',
    computeFormulaName: 'Total Sales',
    measureFormula: 'SUM(Sales[SalesAmount])',
    businessApplication: 'Menghitung total pendapatan kotor dari seluruh transaksi.',
    notes: 'Hanya bisa menerima satu kolom tunggal, tidak bisa menerima ekspresi aritmatika seperti SUM(Sales[Qty] * Sales[Price]). Untuk ekspresi, gunakan SUMX.'
  },
  {
    id: 'distinctcount',
    name: 'DISTINCTCOUNT',
    category: 'Aggregation',
    syntax: 'DISTINCTCOUNT(<ColumnName>)',
    returnType: 'Whole Number',
    shortDesc: 'Menghitung jumlah nilai unik (tidak duplikat) dalam satu kolom.',
    detailedExplanation: 'Menghitung berapa banyak entitas unik yang muncul dalam data. Jika ada transaksi dari pelanggan yang sama berulang kali, DISTINCTCOUNT hanya menghitung pelanggan tersebut satu kali.',
    syntaxBreakdown: [
      { param: '<ColumnName>', desc: 'Kolom ID atau teks yang ingin dihitung keunikannya, misal: Sales[OrderID] atau Sales[CustomerID]' }
    ],
    contextType: 'Filter Context',
    sampleFormula: 'Total Orders = DISTINCTCOUNT(Sales[OrderID])',
    computeFormulaName: 'Total Orders',
    measureFormula: 'DISTINCTCOUNT(Sales[OrderID])',
    businessApplication: 'Mengetahui volume pesanan riil atau jumlah pelanggan aktif unik.',
    notes: 'Termasuk menghitung nilai BLANK sebagai salah satu nilai unik jika ada dalam kolom.'
  },
  {
    id: 'divide',
    name: 'DIVIDE',
    category: 'Logical',
    syntax: 'DIVIDE(<Numerator>, <Denominator> [, <AlternateResult>])',
    returnType: 'Decimal Number',
    shortDesc: 'Melakukan pembagian aman (safe division) dengan penanganan error Division by Zero otomatis.',
    detailedExplanation: 'Sangat disarankan menggunakan fungsi DIVIDE() daripada operator garis miring biasa ( / ). Jika penyebut bernilai 0 atau BLANK, DIVIDE otomatis mengembalikan BLANK (atau nilai alternatif yang ditentukan) tanpa memunculkan error "NaN" di visual kartu KPI.',
    syntaxBreakdown: [
      { param: '<Numerator>', desc: 'Pembilang (angka atas), biasanya measure seperti [Total Profit]' },
      { param: '<Denominator>', desc: 'Penyebut (angka bawah), biasanya measure seperti [Total Sales]' },
      { param: '<AlternateResult>', desc: 'Opsional: Nilai pengganti jika terjadi pembagian dengan nol (default: BLANK)' }
    ],
    contextType: 'Filter Context',
    sampleFormula: 'Profit Margin = DIVIDE([Total Profit], [Total Sales], 0)',
    computeFormulaName: 'Profit Margin',
    measureFormula: 'DIVIDE([Total Profit], [Total Sales], 0)',
    businessApplication: 'Menghitung rasio profitabilitas, rasio konversi, atau Average Order Value (AOV).',
    notes: 'Memberikan performa yang dioptimalkan oleh VertiPaq engine dan tampilan laporan yang bersih.'
  },
  {
    id: 'calculate',
    name: 'CALCULATE',
    category: 'Filter & Calculate',
    syntax: 'CALCULATE(<Expression>, <Filter1> [, <Filter2>, ...])',
    returnType: 'Sesuai tipe ekspresi',
    shortDesc: 'Mengevaluasi ekspresi dalam konteks filter yang dimodifikasi atau ditambahkan.',
    detailedExplanation: 'CALCULATE adalah fungsi DAX paling sakti dan paling sering digunakan. Ia mampu mengubah, menambah, menghapus, atau menimpa filter yang sedang berlaku di visual sebelum mengevaluasi ekspresi agregasi.',
    syntaxBreakdown: [
      { param: '<Expression>', desc: 'Ekspresi yang ingin dihitung, misal: [Total Sales] atau SUM(Sales[Profit])' },
      { param: '<Filter1>, <Filter2>', desc: 'Satu atau lebih kondisi filter logis, misal: Products[Category] = "Technology"' }
    ],
    contextType: 'Both / Transition',
    sampleFormula: 'Tech Sales = CALCULATE([Total Sales], Sales[Category] = "Technology")',
    computeFormulaName: 'Tech Sales',
    measureFormula: 'CALCULATE([Total Sales], Sales[Category] = "Technology")',
    businessApplication: 'Menganalisis penjualan lini produk tertentu, performa cabang utama, atau membandingkan segmen khusus.',
    notes: 'CALCULATE memicu Context Transition: mengubah Row Context yang aktif menjadi Filter Context yang setara.'
  },
  {
    id: 'sumx',
    name: 'SUMX',
    category: 'Iterator (X-Functions)',
    syntax: 'SUMX(<Table>, <Expression>)',
    returnType: 'Decimal / Whole Number',
    shortDesc: 'Fungsi iterator yang mengiterasi tabel baris demi baris, mengevaluasi ekspresi di tiap baris, lalu menjumlahkannya.',
    detailedExplanation: 'Fungsi berakhiran "X" adalah iterator. SUMX membuka Row Context pada tabel yang diberikan, mengeksekusi ekspresi matematika untuk setiap baris, lalu mengumpulkan semua hasilnya dan menjumlahkannya (SUM).',
    syntaxBreakdown: [
      { param: '<Table>', desc: 'Tabel atau fungsi tabel yang akan diiterasi, misal: Sales atau FILTER(Sales, ...)' },
      { param: '<Expression>', desc: 'Ekspresi matematika yang dihitung di tiap baris, misal: Sales[Quantity] * Sales[UnitPrice]' }
    ],
    contextType: 'Row Context',
    sampleFormula: 'Total Revenue SUMX = SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    computeFormulaName: 'Total Revenue SUMX',
    measureFormula: 'SUMX(Sales, Sales[Quantity] * Sales[UnitPrice])',
    businessApplication: 'Menghitung total nilai transaksi ketika tabel hanya memiliki kolom Kuantitas dan Harga Satuan tanpa kolom Total.',
    notes: 'Dapat lebih lambat dibanding SUM jika tabel memiliki ratusan juta baris, gunakan dengan bijak.'
  },
  {
    id: 'filter',
    name: 'FILTER',
    category: 'Filter & Calculate',
    syntax: 'FILTER(<Table>, <FilterExpression>)',
    returnType: 'Table (Sub-tabel)',
    shortDesc: 'Mengembalikan tabel yang telah disaring berdasarkan ekspresi kondisi boolean.',
    detailedExplanation: 'FILTER adalah fungsi tabel (Table Function) yang menghasilkan subset tabel. Biasanya digunakan di dalam argumen filter pada fungsi CALCULATE atau SUMX untuk kondisi penyaringan yang kompleks.',
    syntaxBreakdown: [
      { param: '<Table>', desc: 'Tabel yang akan difilter, misal: Sales atau ALL(Sales[Region])' },
      { param: '<FilterExpression>', desc: 'Kondisi boolean yang dievaluasi baris demi baris, misal: Sales[Profit] > 10000000' }
    ],
    contextType: 'Row Context',
    sampleFormula: 'High Profit Orders = CALCULATE([Total Orders], FILTER(Sales, Sales[Profit] > 10000000))',
    computeFormulaName: 'High Profit Orders',
    measureFormula: 'CALCULATE([Total Orders], FILTER(Sales, Sales[Profit] > 10000000))',
    businessApplication: 'Memisahkan pesanan bermargin tinggi atau pelanggan tier-1.',
    notes: 'Hindari membungkus seluruh tabel dengan FILTER jika hanya menyaring satu kolom sederhana; CALCULATE(..., Table[Col] = "X") lebih efisien.'
  },
  {
    id: 'all',
    name: 'ALL / REMOVEFILTERS',
    category: 'Filter & Calculate',
    syntax: 'ALL([<TableOrColumnName>])',
    returnType: 'Table / Column',
    shortDesc: 'Menghapus seluruh filter context yang menempel pada tabel atau kolom yang ditentukan.',
    detailedExplanation: 'ALL digunakan untuk melepaskan filter aktif. Sangat penting ketika Anda ingin menghitung persentase kontribusi (misal: Penjualan Wilayah / Total Penjualan Nasional), di mana penyebut harus tetap menghitung seluruh wilayah meskipun visual difilter.',
    syntaxBreakdown: [
      { param: '<TableOrColumnName>', desc: 'Tabel atau kolom yang filternya ingin diabaikan, misal: ALL(Sales) atau ALL(Sales[Region])' }
    ],
    contextType: 'Filter Context',
    sampleFormula: 'Grand Total Sales = CALCULATE([Total Sales], ALL(Sales))',
    computeFormulaName: 'Grand Total Sales',
    measureFormula: 'CALCULATE([Total Sales], ALL(Sales))',
    businessApplication: 'Menghitung % Share of Total: DIVIDE([Total Sales], [Grand Total Sales], 0).',
    notes: 'Di versi DAX modern, REMOVEFILTERS() sering digunakan sebagai alias yang lebih deskriptif ketika ditaruh di dalam CALCULATE.'
  },
  {
    id: 'average',
    name: 'AVERAGE',
    category: 'Aggregation',
    syntax: 'AVERAGE(<ColumnName>)',
    returnType: 'Decimal Number',
    shortDesc: 'Menghitung nilai rata-rata aritmatika dari semua nilai numerik dalam kolom.',
    detailedExplanation: 'Menjumlahkan semua angka di kolom lalu membaginya dengan jumlah baris yang memiliki nilai non-kosong dalam filter context.',
    syntaxBreakdown: [
      { param: '<ColumnName>', desc: 'Kolom numerik target, misal: Sales[Discount]' }
    ],
    contextType: 'Filter Context',
    sampleFormula: 'Avg Discount = AVERAGE(Sales[Discount])',
    computeFormulaName: 'Avg Discount',
    measureFormula: 'AVERAGE(Sales[Discount])',
    businessApplication: 'Memonitor tingkat diskon rata-rata yang diberikan tim penjualan.',
    notes: 'Baris dengan nilai nol (0) tetap dihitung dalam pembagi, sedangkan baris kosong (BLANK) diabaikan.'
  }
];

export function executeDaxSimulation(
  funcId: string, 
  records: SalesRecord[], 
  extraParams?: { selectedCategory?: string; minProfit?: number }
): {
  metricName: string;
  calculatedValue: number | string;
  formattedDisplay: string;
  explanation: string;
  appliedFilters: string;
} {
  const totalSales = records.reduce((acc, r) => acc + r.salesAmount, 0);
  const totalProfit = records.reduce((acc, r) => acc + r.profit, 0);
  const totalOrders = new Set(records.map(r => r.orderId)).size;

  switch (funcId) {
    case 'sum':
      return {
        metricName: 'Total Sales',
        calculatedValue: totalSales,
        formattedDisplay: `Rp ${totalSales.toLocaleString('id-ID')}`,
        explanation: `Menjumlahkan kolom SalesAmount pada seluruh ${records.length} baris transaksi yang aktif.`,
        appliedFilters: 'Seluruh transaksi saat ini (None)'
      };

    case 'distinctcount':
      return {
        metricName: 'Total Orders',
        calculatedValue: totalOrders,
        formattedDisplay: `${totalOrders} Pesanan Unik`,
        explanation: `Menghitung OrderID yang unik dari ${records.length} baris data transaksi.`,
        appliedFilters: 'Nilai OrderID tanpa duplikasi'
      };

    case 'divide': {
      const margin = totalSales > 0 ? (totalProfit / totalSales) : 0;
      return {
        metricName: 'Profit Margin',
        calculatedValue: Number((margin * 100).toFixed(2)),
        formattedDisplay: `${(margin * 100).toFixed(2)}%`,
        explanation: `Membagi Total Laba (Rp ${totalProfit.toLocaleString('id-ID')}) dengan Total Penjualan (Rp ${totalSales.toLocaleString('id-ID')}). Bebas error Division by Zero.`,
        appliedFilters: 'Kalkulasi rasio agregat tingkat model'
      };
    }

    case 'calculate': {
      const targetCat = extraParams?.selectedCategory || 'Technology';
      const techRecords = records.filter(r => r.category === targetCat);
      const techSales = techRecords.reduce((acc, r) => acc + r.salesAmount, 0);
      return {
        metricName: `${targetCat} Sales`,
        calculatedValue: techSales,
        formattedDisplay: `Rp ${techSales.toLocaleString('id-ID')}`,
        explanation: `CALCULATE menimpa konteks filter dengan kondisi Sales[Category] = "${targetCat}". Ditemukan ${techRecords.length} transaksi yang cocok.`,
        appliedFilters: `Sales[Category] == "${targetCat}"`
      };
    }

    case 'sumx': {
      const sumxValue = records.reduce((acc, r) => acc + (r.quantity * r.unitPrice), 0);
      return {
        metricName: 'Total Revenue (SUMX)',
        calculatedValue: sumxValue,
        formattedDisplay: `Rp ${sumxValue.toLocaleString('id-ID')}`,
        explanation: `SUMX mengiterasi setiap baris dan mengevaluasi (Quantity * UnitPrice) secara dinamis sebelum menjumlahkan hasilnya.`,
        appliedFilters: 'Row Context iterasi 30 baris data'
      };
    }

    case 'filter': {
      const threshold = extraParams?.minProfit || 10000000;
      const highProfitOrders = records.filter(r => r.profit > threshold);
      const countHigh = new Set(highProfitOrders.map(r => r.orderId)).size;
      return {
        metricName: `High Profit Orders (> Rp ${(threshold / 1000000).toFixed(0)}M)`,
        calculatedValue: countHigh,
        formattedDisplay: `${countHigh} Pesanan`,
        explanation: `FILTER menghasilkan tabel virtual berisi transaksi dengan laba > Rp ${threshold.toLocaleString('id-ID')}, lalu dihitung jumlah pesanan uniknya.`,
        appliedFilters: `FILTER(Sales, Sales[Profit] > ${threshold})`
      };
    }

    case 'all': {
      return {
        metricName: 'Grand Total Sales (ALL)',
        calculatedValue: totalSales,
        formattedDisplay: `Rp ${totalSales.toLocaleString('id-ID')}`,
        explanation: `ALL mengabaikan seluruh slicer dan filter yang dipilih pengguna, mengembalikan total penjualan dari seluruh basis data.`,
        appliedFilters: 'ALL(Sales) melepaskan seluruh filter context'
      };
    }

    case 'average': {
      const avgDiscount = records.length > 0 
        ? records.reduce((acc, r) => acc + r.discount, 0) / records.length 
        : 0;
      return {
        metricName: 'Avg Discount',
        calculatedValue: Number((avgDiscount * 100).toFixed(2)),
        formattedDisplay: `${(avgDiscount * 100).toFixed(2)}%`,
        explanation: `Menghitung rata-rata nilai kolom Discount dari seluruh transaksi aktif.`,
        appliedFilters: 'Filter context rata-rata aritmatika'
      };
    }

    default:
      return {
        metricName: 'Total Sales',
        calculatedValue: totalSales,
        formattedDisplay: `Rp ${totalSales.toLocaleString('id-ID')}`,
        explanation: 'Kalkulasi default',
        appliedFilters: 'None'
      };
  }
}
