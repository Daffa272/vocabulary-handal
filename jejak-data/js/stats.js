/* =========================================================
   stats.js : fungsi statistik inti (tanpa library eksternal)
   Semua fungsi ada di objek global `Stat`.
   ========================================================= */
(function () {
  var S = {};

  /* ---------- Random generator yang bisa diulang (seeded) ---------- */
  S.rng = function (seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  S.normal = function (r, mu, sd) {
    if (mu === undefined) mu = 0;
    if (sd === undefined) sd = 1;
    var u = 0, v = r();
    while (u === 0) u = r();
    return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  /* ---------- Statistik deskriptif ---------- */
  S.sum = function (a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; };
  S.mean = function (a) { return S.sum(a) / a.length; };
  S.sorted = function (a) { return a.slice().sort(function (x, y) { return x - y; }); };
  S.quantile = function (a, p, isSorted) {
    var s = isSorted ? a : S.sorted(a);
    var i = (s.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
    return s[lo] + (s[hi] - s[lo]) * (i - lo);
  };
  S.median = function (a) { return S.quantile(a, 0.5); };
  S.variance = function (a) {
    var m = S.mean(a), s = 0;
    for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m);
    return s / (a.length - 1);
  };
  S.sd = function (a) { return Math.sqrt(S.variance(a)); };
  S.skew = function (a) {
    var n = a.length, m = S.mean(a), s2 = 0, s3 = 0;
    for (var i = 0; i < n; i++) { var d = a[i] - m; s2 += d * d; s3 += d * d * d; }
    var s = Math.sqrt(s2 / n);
    return s === 0 ? 0 : (s3 / n) / (s * s * s);
  };

  /* Ringkasan boxplot dengan aturan pencilan 1,5 x IQR */
  S.box = function (a) {
    var s = S.sorted(a);
    var q1 = S.quantile(s, 0.25, true), med = S.quantile(s, 0.5, true), q3 = S.quantile(s, 0.75, true);
    var iqr = q3 - q1, lf = q1 - 1.5 * iqr, hf = q3 + 1.5 * iqr;
    var inside = s.filter(function (v) { return v >= lf && v <= hf; });
    return {
      n: s.length, q1: q1, med: med, q3: q3, iqr: iqr, lf: lf, hf: hf,
      wlo: inside[0], whi: inside[inside.length - 1],
      out: s.filter(function (v) { return v < lf || v > hf; }),
      mean: S.mean(s), sd: S.sd(s)
    };
  };

  /* Histogram dengan bin sama lebar pada rentang [lo, hi] */
  S.histogram = function (a, bins, lo, hi) {
    var w = (hi - lo) / bins, out = [], i;
    for (i = 0; i < bins; i++) out.push({ x0: lo + i * w, x1: lo + (i + 1) * w, count: 0 });
    a.forEach(function (v) {
      if (v < lo || v > hi) return;
      var k = Math.floor((v - lo) / w);
      if (k >= bins) k = bins - 1;
      out[k].count++;
    });
    return out;
  };

  /* Hitung jumlah puncak pada histogram (setelah dihaluskan) */
  S.peakCount = function (counts) {
    var n = counts.length, s = [], i, j;
    for (i = 0; i < n; i++) {
      var sum = 0, k = 0;
      for (j = i - 1; j <= i + 1; j++) if (j >= 0 && j < n) { sum += counts[j]; k++; }
      s.push(sum / k);
    }
    var mx = Math.max.apply(null, s), peaks = [];
    for (i = 0; i < n; i++) {
      var l = i > 0 ? s[i - 1] : -1, r = i < n - 1 ? s[i + 1] : -1;
      if (s[i] > l && s[i] >= r && s[i] >= 0.35 * mx) peaks.push(i);
    }
    var kept = [];
    peaks.forEach(function (p) {
      if (!kept.length) { kept.push(p); return; }
      var q = kept[kept.length - 1];
      var valley = Math.min.apply(null, s.slice(q, p + 1));
      if (valley < 0.55 * Math.min(s[p], s[q])) kept.push(p);
      else if (s[p] > s[q]) kept[kept.length - 1] = p;
    });
    return kept.length;
  };

  /* ---------- Korelasi & regresi linear sederhana ---------- */
  S.linreg = function (x, y) {
    var n = x.length, mx = S.mean(x), my = S.mean(y), sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i++) {
      var dx = x[i] - mx, dy = y[i] - my;
      sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
    }
    var slope = sxx === 0 ? 0 : sxy / sxx;
    var r = (sxx === 0 || syy === 0) ? 0 : sxy / Math.sqrt(sxx * syy);
    return { slope: slope, intercept: my - slope * mx, r: r, r2: r * r };
  };

  /* ---------- Distribusi normal dan t ---------- */
  S.normPdf = function (x, mu, sd) {
    var z = (x - mu) / sd;
    return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  };

  function lgamma(x) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
             -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, t = x + 5.5, s = 1.000000000190015;
    t -= (x + 0.5) * Math.log(t);
    for (var j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  function betacf(a, b, x) {
    var FPMIN = 1e-30, qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap, m, aa, del;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    var h = d;
    for (m = 1; m <= 200; m++) {
      var m2 = 2 * m;
      aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; del = d * c; h *= del;
      if (Math.abs(del - 1) < 3e-12) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }
  S.tCDF = function (t, df) {
    var x = df / (df + t * t);
    var p = 0.5 * ibeta(x, df / 2, 0.5);
    return t > 0 ? 1 - p : p;
  };
  var tcCache = {};
  /* nilai kritis t dua sisi untuk tingkat kepercayaan `conf` */
  S.tCrit = function (conf, df) {
    var key = conf + '|' + Math.round(df * 100);
    if (tcCache[key]) return tcCache[key];
    var target = 1 - (1 - conf) / 2, lo = 0, hi = 200;
    for (var i = 0; i < 70; i++) {
      var mid = (lo + hi) / 2;
      if (S.tCDF(mid, df) < target) lo = mid; else hi = mid;
    }
    tcCache[key] = (lo + hi) / 2;
    return tcCache[key];
  };

  /* Uji t Welch untuk dua kelompok independen */
  S.welch = function (a, b) {
    var na = a.length, nb = b.length, ma = S.mean(a), mb = S.mean(b);
    var va = S.variance(a), vb = S.variance(b);
    var se = Math.sqrt(va / na + vb / nb);
    var t = (mb - ma) / se;
    var df = Math.pow(va / na + vb / nb, 2) / (Math.pow(va / na, 2) / (na - 1) + Math.pow(vb / nb, 2) / (nb - 1));
    var p = 2 * (1 - S.tCDF(Math.abs(t), df));
    var tc = S.tCrit(0.95, df), diff = mb - ma;
    return { ma: ma, mb: mb, diff: diff, se: se, t: t, df: df, p: p, lo: diff - tc * se, hi: diff + tc * se };
  };

  window.Stat = S;
})();
