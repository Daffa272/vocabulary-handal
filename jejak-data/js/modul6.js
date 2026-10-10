/* =========================================================
   modul6.js : Pola waktu (trend, seasonality, noise, anomali)
   ========================================================= */
(function () {
  var S = Stat, V = Viz, U = UI, fmt = V.fmt;
  var N = 48, MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var FULL = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var SPIKE = 29;

  /* moving average terpusat; untuk window genap, ujung diberi bobot 0,5 */
  function cma(y, w) {
    var n = y.length, out = [], half = Math.floor(w / 2), i, j;
    if (w <= 1) return y.slice();
    for (i = 0; i < n; i++) out.push(null);
    for (i = half; i < n - half; i++) {
      var s = 0, wt = 0;
      for (j = -half; j <= half; j++) {
        var k = (w % 2 === 0 && Math.abs(j) === half) ? 0.5 : 1;
        s += y[i + j] * k; wt += k;
      }
      out[i] = s / wt;
    }
    return out;
  }

  Modules.m6 = function (root) {
    var trend = 1.5, amp = 18, noise = 10, spike = false, win = 1, showTrend = true;
    var z = (function () { var r = S.rng(61), a = []; for (var i = 0; i < N; i++) a.push(S.normal(r, 0, 1)); return a; })();

    root.innerHTML =
      '<div class="controls">' +
        U.slider('m6-trend', 'Tren (per bulan)', -2, 4, 0.1, trend) +
        U.slider('m6-amp', 'Kekuatan musiman', 0, 40, 1, amp) +
        U.slider('m6-noise', 'Noise (acak)', 0, 30, 1, noise) +
      '</div>' +
      '<div class="controls">' +
        U.slider('m6-win', 'Window moving average (bulan)', 1, 13, 1, win) +
        U.check('m6-trl', 'Garis tren linear', true) +
        U.check('m6-spk', 'Sisipkan lonjakan tak terduga', false) +
      '</div>' +
      '<figure class="plate">' +
        '<div class="plate-head">Kunjungan bulanan toko oleh-oleh (ratus orang), 48 bulan sejak Januari 2022. Data simulasi.</div>' +
        '<div class="plot-wrap" id="m6-plot"></div>' +
        '<figcaption class="readouts" id="m6-ro"></figcaption>' +
      '</figure>' +
      '<div class="reading" aria-live="polite"><h4>Catatan interpretasi</h4><div id="m6-read"></div></div>';

    var P = V.plot(root.querySelector('#m6-plot'), { h: 400, label: 'Grafik garis deret waktu bulanan', m: { t: 16, b: 50 } });

    function series() {
      var y = [];
      for (var t = 0; t < N; t++) {
        var v = 100 + trend * t + amp * Math.sin(2 * Math.PI * (t - 8) / 12) + noise * z[t];
        if (spike && t === SPIKE) v += 60;
        y.push(v);
      }
      return y;
    }
    function label(i) { return MONTHS[i % 12] + ' ' + (22 + Math.floor(i / 12)); }

    function draw() {
      var y = series(), t = y.map(function (_, i) { return i; });
      var lr = S.linreg(t, y);
      var ymin = Math.min.apply(null, y), ymax = Math.max.apply(null, y);
      var lo = Math.floor((ymin - 10) / 20) * 20, hi = Math.ceil((ymax + 10) / 20) * 20;
      P.clear();
      var xt = []; for (var i = 0; i < N; i += 6) xt.push(i);
      P.axes([0, N - 1], [lo, hi], { xTicks: xt, xFmt: label, yLabel: 'Pengunjung (ratus)', xLabel: 'Bulan' });

      /* tandai bulan Desember dengan garis tipis supaya musiman mudah dilihat */
      for (i = 11; i < N; i += 12) P.line(P.x(i), P.y(lo), P.x(i), P.y(hi), 'decline', P.back);

      if (showTrend) P.line(P.x(0), P.y(lr.intercept), P.x(N - 1), P.y(lr.intercept + lr.slope * (N - 1)), 'regline dashed');

      var d = '';
      y.forEach(function (v, k) { d += (k ? ' L' : 'M') + P.x(k) + ',' + P.y(v); });
      V.el('path', { d: d, 'class': win > 1 ? 'tsline faint' : 'tsline' }, P.data);
      y.forEach(function (v, k) { P.circle(k, v, win > 1 ? 2.2 : 3, 'tspt'); });

      if (win > 1) {
        var m = cma(y, win), d2 = '', started = false;
        m.forEach(function (v, k) {
          if (v === null || v === undefined) return;
          d2 += (started ? ' L' : 'M') + P.x(k) + ',' + P.y(v); started = true;
        });
        V.el('path', { d: d2, 'class': 'maline' }, P.front);
      }

      /* komponen musiman: rata-rata sisa per bulan kalender */
      var det = y.map(function (v, k) { return v - (lr.intercept + lr.slope * k); });
      var sm = []; for (i = 0; i < 12; i++) { var s = 0, c = 0; for (var k2 = i; k2 < N; k2 += 12) { s += det[k2]; c++; } sm.push(s / c); }
      var seasonal = det.map(function (_, k) { return sm[k % 12]; });
      var vDet = S.variance(det), vSea = S.variance(seasonal);
      var strength = vDet > 0 ? vSea / vDet : 0;
      var resid = det.map(function (v, k) { return v - seasonal[k]; });
      var rsd = S.sd(resid);
      var peakM = sm.indexOf(Math.max.apply(null, sm)), lowM = sm.indexOf(Math.min.apply(null, sm));

      /* kandidat anomali: sisa yang sangat jauh dari median sisa */
      var rmed = S.median(resid), mad = S.median(resid.map(function (v) { return Math.abs(v - rmed); })) * 1.4826 || 1;
      var anom = [];
      resid.forEach(function (v, k) { if (Math.abs(v - rmed) > 3.5 * mad && Math.abs(v - rmed) > 25) anom.push(k); });
      anom.forEach(function (k) {
        V.el('circle', { cx: P.x(k), cy: P.y(y[k]), r: 9, 'class': 'anomring' }, P.front);
      });

      root.querySelector('#m6-ro').innerHTML = U.ro([
        ['Tren terukur', (lr.slope >= 0 ? '+' : '') + fmt(lr.slope, 2) + ' / bulan'],
        ['Setara per tahun', (lr.slope >= 0 ? '+' : '') + fmt(lr.slope * 12, 1)],
        ['Porsi pola musiman', fmt(strength * 100, 0) + '%'],
        ['Noise (SD sisa)', fmt(rsd, 1)],
        ['Kandidat anomali', anom.length ? anom.map(label).join(', ') : 'tidak ada']
      ]);

      var h = '';
      if (Math.abs(lr.slope) < 0.15) h += '<p><strong>Tren:</strong> hampir datar. Level kunjungan tidak banyak berubah dari tahun ke tahun.</p>';
      else h += '<p><strong>Tren:</strong> ' + (lr.slope > 0 ? 'naik' : 'turun') + ' sekitar ' + fmt(Math.abs(lr.slope), 1) + ' ratus pengunjung per bulan, atau ' + fmt(Math.abs(lr.slope) * 12, 0) + ' ratus per tahun.</p>';
      if (strength < 0.1) h += '<p><strong>Musiman:</strong> lemah. Naik-turun antarbulan hampir tidak berulang pada waktu yang sama setiap tahun.</p>';
      else h += '<p><strong>Musiman:</strong> ' + fmt(strength * 100, 0) + '% variasi di sekitar tren berulang tiap tahun. Puncak rata-rata terjadi pada ' + FULL[peakM] + ' dan titik terendah pada ' + FULL[lowM] + '. Garis tegak tipis menandai setiap Desember.</p>';
      h += '<p><strong>Noise:</strong> sisa yang tidak dijelaskan tren maupun musiman bersimpangan baku sekitar ' + fmt(rsd, 1) + ' ratus pengunjung. Makin besar noise, makin sulit melihat dua pola di atas dengan mata saja.</p>';
      if (anom.length) h += '<p><strong>Anomali:</strong> titik di ' + anom.map(label).join(', ') + ' (dilingkari) menyimpang jauh dari pola tren dan musiman. Cari penyebabnya: promosi, kejadian khusus, atau salah catat.</p>';
      if (win > 1) {
        var suffix = (win === 12 || win === 13) ? ' Window sepanjang satu siklus (12 atau 13 bulan) menghapus pola musiman sehingga yang tersisa hanya tren.' : ' Window yang lebih panjang meratakan lebih banyak naik-turun, tetapi juga meredam lonjakan nyata.';
        h += '<p><strong>Moving average ' + win + ' bulan</strong> (garis kuning) menghaluskan data.' + suffix + '</p>';
      }
      root.querySelector('#m6-read').innerHTML = h;
    }

    U.bindSlider(root, 'm6-trend', function (v) { trend = v; draw(); });
    U.bindSlider(root, 'm6-amp', function (v) { amp = v; draw(); });
    U.bindSlider(root, 'm6-noise', function (v) { noise = v; draw(); });
    U.bindSlider(root, 'm6-win', function (v) { win = v; draw(); });
    root.querySelector('#m6-trl').addEventListener('change', function (e) { showTrend = e.target.checked; draw(); });
    root.querySelector('#m6-spk').addEventListener('change', function (e) { spike = e.target.checked; draw(); });
    draw();
  };
})();
