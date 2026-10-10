export interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  variance: number;
  skewness: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  outliers: number[];
}

export function calculateDescriptiveStats(numbers: number[]): DescriptiveStats {
  if (!numbers || numbers.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      variance: 0,
      skewness: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      outliers: []
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Median
  const median = n % 2 !== 0 
    ? sorted[Math.floor(n / 2)] 
    : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  // Quartiles
  const getPercentile = (p: number) => {
    const pos = (n - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  const q1 = getPercentile(0.25);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;

  // Variance & Standard Deviation
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const stdDev = Math.sqrt(variance);

  // Skewness (Sample Skewness)
  let skewness = 0;
  if (stdDev > 0 && n > 2) {
    const m3 = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n;
    skewness = (m3 / Math.pow(stdDev, 3)) * (Math.sqrt(n * (n - 1)) / (n - 2));
  }

  // Outliers by 1.5 * IQR rule
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sorted.filter(x => x < lowerFence || x > upperFence);

  return {
    count: n,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    skewness: Number(skewness.toFixed(3)),
    min: sorted[0],
    max: sorted[n - 1],
    q1: Number(q1.toFixed(2)),
    q3: Number(q3.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
    outliers
  };
}

export interface BinItem {
  binLabel: string;
  min: number;
  max: number;
  count: number;
  frequencyPercent: number;
}

export function computeHistogramBins(data: number[], binCount: number): BinItem[] {
  if (!data || data.length === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = range / binCount;

  const bins: BinItem[] = [];
  for (let i = 0; i < binCount; i++) {
    const binMin = min + i * step;
    const binMax = i === binCount - 1 ? max : binMin + step;
    bins.push({
      binLabel: `${Math.round(binMin)} - ${Math.round(binMax)}`,
      min: binMin,
      max: binMax,
      count: 0,
      frequencyPercent: 0
    });
  }

  data.forEach(val => {
    let placed = false;
    for (let i = 0; i < bins.length; i++) {
      if (val >= bins[i].min && (i === bins.length - 1 ? val <= bins[i].max : val < bins[i].max)) {
        bins[i].count += 1;
        placed = true;
        break;
      }
    }
    if (!placed) {
      bins[bins.length - 1].count += 1;
    }
  });

  const total = data.length;
  bins.forEach(b => {
    b.frequencyPercent = Number(((b.count / total) * 100).toFixed(1));
  });

  return bins;
}

export interface InterpretationReport {
  title: string;
  observation: string;
  statisticalEvidence: {
    metric: string;
    value: string | number;
    benchmark?: string;
  }[];
  interpretation: string;
  nextSteps: string[];
  limitations: string[];
}

export function generateStructuredInterpretation(
  metricName: string,
  stats: DescriptiveStats,
  contextNote: string
): InterpretationReport {
  let shapeDesc = "Simetris mendekati normal";
  if (stats.skewness > 0.5) shapeDesc = "Right-Skewed (condong ke kanan dengan ekor nilai tinggi)";
  else if (stats.skewness < -0.5) shapeDesc = "Left-Skewed (condong ke kiri dengan ekor nilai rendah)";

  const observation = `Distribusi data untuk "${metricName}" memiliki rentang dari ${stats.min.toLocaleString('id-ID')} hingga ${stats.max.toLocaleString('id-ID')}. Pola data menunjukkan karakteristik ${shapeDesc}. Nilai tengah berada di angka median ${stats.median.toLocaleString('id-ID')}, sementara mean berada pada ${stats.mean.toLocaleString('id-ID')}.`;

  const statisticalEvidence = [
    { metric: "Total Sampel (N)", value: stats.count },
    { metric: "Rata-rata (Mean)", value: stats.mean.toLocaleString('id-ID') },
    { metric: "Nilai Tengah (Median)", value: stats.median.toLocaleString('id-ID'), benchmark: `Selisih: ${(stats.mean - stats.median).toFixed(1)}` },
    { metric: "Standar Deviasi (σ)", value: stats.stdDev.toLocaleString('id-ID') },
    { metric: "Koefisien Skewness", value: stats.skewness, benchmark: stats.skewness > 0 ? "Positif" : "Negatif" },
    { metric: "Interquartile Range (IQR)", value: stats.iqr.toLocaleString('id-ID') },
    { metric: "Jumlah Outlier (1.5x IQR)", value: `${stats.outliers.length} data poin` }
  ];

  let interpretation = `Berdasarkan statistik aktual, ${contextNote}. `;
  if (Math.abs(stats.mean - stats.median) > stats.stdDev * 0.2) {
    interpretation += `Terdapat disparitas signifikan antara mean dan median (${stats.mean.toLocaleString('id-ID')} vs ${stats.median.toLocaleString('id-ID')}). Hal ini mengindikasikan adanya nilai-nilai ekstrem (skews) yang menarik nilai rata-rata, sehingga median lebih representatif sebagai patokan ukuran tendensi sentral.`;
  } else {
    interpretation += `Nilai mean dan median relatif berdekatan, menandakan mayoritas data berpusat seimbang di sekitar nilai tengah.`;
  }

  if (stats.outliers.length > 0) {
    interpretation += ` Terdeteksi ${stats.outliers.length} transaksi/observasi outlier yang berada di luar rentang pagar Q1 - 1.5*IQR atau Q3 + 1.5*IQR.`;
  }

  const nextSteps = [
    "Periksa detail rekaman outlier: apakah disebabkan oleh pesanan korporasi skala besar, kesalahan input data, atau diskon khusus.",
    "Lakukan segmentasi lanjutan (misal berdasarkan Kategori Produk atau Wilayah) untuk memisahkan sub-populasi yang memiliki karakteristik berbeda.",
    "Bandingkan tren metrik ini dari bulan ke bulan untuk mengidentifikasi apakah pola skewness bersifat musiman (seasonal) atau struktural."
  ];

  const limitations = [
    "Analisis ini berbasis data historis yang tersedia dalam sampel saat ini dan belum memperhitungkan faktor eksternal makroekonomi.",
    "Korelasi yang tampak antarvariabel tidak membuktikan hubungan sebab-akibat (causation) tanpa uji kausalitas kontrol.",
    "Bentuk visual histogram dapat berubah bila jumlah bin diubah; interpretasi harus mengacu pada angka skewness dan kuartil matematis."
  ];

  return {
    title: `Laporan Interpretasi: ${metricName}`,
    observation,
    statisticalEvidence,
    interpretation,
    nextSteps,
    limitations
  };
}
