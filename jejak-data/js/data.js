/* =========================================================
   data.js : dataset simulasi
   Semua data dibangkitkan dengan seed tetap, jadi hasilnya
   sama setiap kali halaman dibuka. Ubah angka seed untuk
   mendapatkan data baru.
   ========================================================= */
(function () {
  var S = Stat;
  var D = {};

  function gen(seed, n, fn) {
    var r = S.rng(seed), out = [];
    for (var i = 0; i < n; i++) out.push(fn(r, i));
    return out;
  }
  function round(v, d) { var p = Math.pow(10, d === undefined ? 1 : d); return Math.round(v * p) / p; }
  function clip(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---------- Modul 1: distribusi ---------- */
  D.dist = {
    tinggi: {
      short: 'Tinggi badan', name: 'Tinggi badan mahasiswa', unit: 'cm',
      xd: [140, 195], outlier: 192,
      story: '300 mahasiswa, simulasi tinggi badan',
      data: gen(11, 300, function (r) { return round(S.normal(r, 166, 7)); })
    },
    jajan: {
      short: 'Uang jajan', name: 'Pengeluaran jajan per hari', unit: 'ribu rupiah',
      xd: [0, 150], outlier: 140,
      story: '300 mahasiswa, simulasi pengeluaran jajan harian',
      data: gen(12, 300, function (r) { return round(Math.exp(S.normal(r, Math.log(25), 0.55))); })
    },
    tunggu: {
      short: 'Waktu tunggu ojol', name: 'Waktu tunggu ojek online', unit: 'menit',
      xd: [0, 45], outlier: 42,
      story: '300 pesanan, simulasi waktu tunggu driver',
      data: gen(13, 300, function (r) { return round(1 + (-Math.log(1 - r())) * 5); })
    },
    nilai: {
      short: 'Nilai ujian', name: 'Nilai ujian satu angkatan', unit: 'poin',
      xd: [20, 100], outlier: 24,
      story: '300 siswa, simulasi nilai ujian satu angkatan',
      data: gen(14, 300, function (r) {
        var v = r() < 0.5 ? S.normal(r, 52, 7) : S.normal(r, 83, 6);
        return round(clip(v, 20, 100));
      })
    }
  };

  /* ---------- Modul 2: spread ---------- */
  D.spread = {
    names: ['Kelas A', 'Kelas B', 'Kelas C'],
    groups: [
      gen(21, 40, function (r) { return round(clip(S.normal(r, 70, 5), 0, 100)); }),
      gen(22, 40, function (r) { return round(clip(S.normal(r, 70, 14), 0, 100)); }),
      gen(23, 40, function (r) { return round(clip(S.normal(r, 70, 5), 0, 100)); })
    ]
  };

  /* ---------- Modul 3: korelasi & regresi ---------- */
  function uniform(r, a, b) { return a + (b - a) * r(); }

  var belajar = (function () {
    var r = S.rng(31), x = [], y = [];
    for (var i = 0; i < 60; i++) {
      var xi = round(uniform(r, 1, 20), 1);
      x.push(xi); y.push(round(clip(45 + 2.3 * xi + S.normal(r, 0, 7), 0, 100)));
    }
    return { x: x, y: y };
  })();

  var harga = (function () {
    var r = S.rng(32), x = [], y = [];
    for (var i = 0; i < 60; i++) {
      var xi = round(uniform(r, 3, 12), 1);
      x.push(xi); y.push(Math.round(Math.max(5, 150 - 10 * xi + S.normal(r, 0, 14))));
    }
    return { x: x, y: y };
  })();

  var pupuk = (function () {
    var r = S.rng(35), x = [], y = [];
    for (var i = 0; i < 60; i++) {
      var xi = round(uniform(r, 0, 100), 0);
      x.push(xi); y.push(round(Math.max(0.3, 3 + 0.16 * xi - 0.0016 * xi * xi + S.normal(r, 0, 0.45)), 2));
    }
    return { x: x, y: y };
  })();

  var acak = (function () {
    var r = S.rng(35), x = [], y = [];
    for (var i = 0; i < 60; i++) {
      x.push(Math.round(uniform(r, 5, 30)));
      y.push(round(clip(S.normal(r, 70, 10), 0, 100)));
    }
    return { x: x, y: y };
  })();

  var simpson = (function () {
    var r = S.rng(35), x = [], y = [], g = [];
    var cx = [3, 6, 9], cy = [52, 66, 80];
    for (var k = 0; k < 3; k++) {
      for (var i = 0; i < 20; i++) {
        var xi = cx[k] + S.normal(r, 0, 1.0);
        xi = clip(xi, 0.5, 11.5);
        x.push(round(xi, 1));
        y.push(round(clip(cy[k] - 3.2 * (xi - cx[k]) + S.normal(r, 0, 3), 0, 100)));
        g.push(k);
      }
    }
    return { x: x, y: y, g: g };
  })();

  D.corr = {
    belajar: {
      short: 'Jam belajar & nilai', kind: 'linear',
      xName: 'Jam belajar per minggu', xUnit: 'jam', yName: 'Nilai ujian', yUnit: 'poin',
      xd: [0, 22], yd: [20, 100], x: belajar.x, y: belajar.y
    },
    harga: {
      short: 'Harga & penjualan', kind: 'linear',
      xName: 'Harga es teh', xUnit: 'ribu rupiah', yName: 'Terjual per hari', yUnit: 'gelas',
      xd: [2, 13], yd: [0, 160], x: harga.x, y: harga.y
    },
    pupuk: {
      short: 'Pupuk & panen', kind: 'nonlinear',
      xName: 'Dosis pupuk', xUnit: 'kg/ha', yName: 'Hasil panen', yUnit: 'ton/ha',
      xd: [0, 100], yd: [0, 9], x: pupuk.x, y: pupuk.y
    },
    acak: {
      short: 'Tanpa hubungan', kind: 'none',
      xName: 'Jumlah huruf pada nama', xUnit: 'huruf', yName: 'Nilai ujian', yUnit: 'poin',
      xd: [0, 35], yd: [30, 100], x: acak.x, y: acak.y
    },
    simpson: {
      short: 'Jam latihan soal & skor', kind: 'simpson',
      xName: 'Jam di aplikasi latihan soal per minggu', xUnit: 'jam', yName: 'Skor tes akhir', yUnit: 'poin',
      xd: [0, 12], yd: [30, 100], x: simpson.x, y: simpson.y, g: simpson.g,
      groups: ['Kelas 7', 'Kelas 8', 'Kelas 9']
    }
  };

  /* ---------- Modul 4: populasi untuk sampling ---------- */
  function buildPop(seed, fn) { return gen(seed, 20000, fn); }
  D.pops = {
    eksponensial: {
      short: 'Miring ke kanan', name: 'Waktu tunggu (menit)', shape: 'miring ke kanan',
      data: buildPop(41, function (r) { return -Math.log(1 - r()) * 10; })
    },
    bimodal: {
      short: 'Dua puncak', name: 'Nilai ujian (poin)', shape: 'berpuncak dua',
      data: buildPop(42, function (r) { return clip(r() < 0.55 ? S.normal(r, 30, 6) : S.normal(r, 70, 8), 0, 100); })
    },
    seragam: {
      short: 'Rata (uniform)', name: 'Angka acak 0 sampai 100', shape: 'rata (uniform)',
      data: buildPop(43, function (r) { return r() * 100; })
    }
  };
  Object.keys(D.pops).forEach(function (k) {
    var p = D.pops[k], d = p.data;
    p.mu = S.mean(d);
    var s = 0; for (var i = 0; i < d.length; i++) s += (d[i] - p.mu) * (d[i] - p.mu);
    p.sigma = Math.sqrt(s / d.length);
    p.min = Math.min.apply(null, d); p.max = Math.max.apply(null, d);
  });

  window.DATA = D;
})();
