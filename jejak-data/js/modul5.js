/* =========================================================
   modul5.js : Inferensi (confidence interval dan p-value)
   ========================================================= */
(function () {
  var S = Stat, V = Viz, U = UI, fmt = V.fmt;
  var MU = 50, SIGMA = 10;

  function rnorm(mu, sd) { return S.normal(Math.random, mu, sd); }
  function sample(n, mu, sd) { var a = []; for (var i = 0; i < n; i++) a.push(rnorm(mu, sd)); return a; }

  Modules.m5 = function (root) {
    var tab = 'ci';
    root.innerHTML =
      '<div class="controls"><div class="ctl"><span class="ctl-l">Pilih eksperimen</span>' +
        U.seg('Pilih eksperimen', [['ci', 'Confidence interval'], ['tes', 'Uji hipotesis dan p-value']], tab) + '</div></div>' +
      '<div id="m5-ci"></div><div id="m5-tes" hidden></div>';

    U.bindSeg(root.querySelector('.seg'), function (k) {
      tab = k;
      root.querySelector('#m5-ci').hidden = k !== 'ci';
      root.querySelector('#m5-tes').hidden = k !== 'tes';
    });

    initCI(root.querySelector('#m5-ci'));
    initTest(root.querySelector('#m5-tes'));
  };

  /* ---------------- Confidence interval ---------------- */
  function initCI(root) {
    var n = 20, conf = 0.95, sims = [], tot = 0, hits = 0;
    root.innerHTML =
      '<div class="controls">' +
        U.slider('m5-n', 'Ukuran sampel (n)', 5, 100, 1, n) +
        '<div class="ctl"><span class="ctl-l">Tingkat kepercayaan</span>' +
          U.seg('Tingkat kepercayaan', [['0.9', '90%'], ['0.95', '95%'], ['0.99', '99%']], '0.95') + '</div>' +
        '<button type="button" class="btn" id="m5-run">Lakukan 50 survei</button>' +
      '</div>' +
      '<figure class="plate">' +
        '<div class="plate-head">Populasi sebenarnya: rata-rata μ = ' + MU + ' (garis tegak). Tiap garis datar adalah confidence interval dari satu survei.</div>' +
        '<div class="plot-wrap" id="m5-plot"></div>' +
        '<figcaption class="readouts" id="m5-ro"></figcaption>' +
      '</figure>' +
      '<div class="reading" aria-live="polite"><h4>Catatan interpretasi</h4><div id="m5-read"></div></div>';

    var P = V.plot(root.querySelector('#m5-plot'), { h: 440, label: 'Lima puluh confidence interval dari lima puluh survei', m: { t: 14, b: 46 } });

    function draw() {
      P.clear();
      P.axes([25, 75], [-1, 50], { yTicks: [], xLabel: 'Rata-rata sampel dan confidence interval-nya', xn: 10 });
      P.vline(MU, 'vmark l-truth', P.back);
      V.text(P.front, P.x(MU) + 6, P.m.t + 12, 'μ sebenarnya', 'vlabel l-truth', 'start');
      var ok = 0, wsum = 0;
      sims.forEach(function (s, i) {
        var y = 49 - i, cls = s.hit ? 'ci-hit' : 'ci-miss';
        if (s.hit) ok++;
        wsum += s.hi - s.lo;
        P.line(P.x(s.lo), P.y(y), P.x(s.hi), P.y(y), cls);
        P.circle(s.m, y, 2.6, cls + '-dot');
      });
      if (!sims.length) P.note('Klik "Lakukan 50 survei" untuk memulai.');

      root.querySelector('#m5-ro').innerHTML = U.ro([
        ['Survei ini', sims.length ? ok + ' dari ' + sims.length + ' menangkap μ' : '-'],
        ['Cakupan survei ini', sims.length ? fmt(ok / sims.length * 100, 0) + '%' : '-'],
        ['Cakupan kumulatif', tot ? hits + ' / ' + tot + ' = ' + fmt(hits / tot * 100, 1) + '%' : '-'],
        ['Lebar rata-rata interval', sims.length ? fmt(wsum / sims.length, 1) : '-']
      ]);

      var h = '';
      if (!sims.length) {
        h = '<p>Bayangkan 50 peneliti, masing-masing mengambil sampel acak berukuran ' + n + ' dari populasi yang sama lalu menghitung confidence interval ' + fmt(conf * 100, 0) + '%. Kita, yang tahu μ = ' + MU + ', bisa memeriksa siapa yang interval-nya benar-benar menangkap nilai itu.</p>';
      } else {
        h += '<p><strong>' + ok + ' dari ' + sims.length + '</strong> interval (' + fmt(ok / sims.length * 100, 0) + '%) menangkap μ. Interval berwarna merah adalah yang meleset. Dalam praktik kita hanya punya <em>satu</em> interval dan tidak tahu apakah ia hijau atau merah.</p>';
        if (tot >= 200) h += '<p>Setelah ' + tot + ' interval, cakupan kumulatifnya ' + fmt(hits / tot * 100, 1) + '%, mendekati tingkat kepercayaan ' + fmt(conf * 100, 0) + '%. Itulah makna "tingkat kepercayaan": sifat dari <em>prosedur</em> bila diulang berkali-kali, bukan peluang bahwa satu interval tertentu benar.</p>';
        h += '<p>Coba ubah n dan tingkat kepercayaan. Sampel lebih besar membuat interval <strong>lebih sempit</strong> tanpa mengubah cakupan. Tingkat kepercayaan lebih tinggi membuat interval <strong>lebih lebar</strong> sebagai harga untuk lebih sedikit meleset.</p>';
      }
      root.querySelector('#m5-read').innerHTML = h;
    }

    function run() {
      sims = [];
      for (var i = 0; i < 50; i++) {
        var a = sample(n, MU, SIGMA), m = S.mean(a), se = S.sd(a) / Math.sqrt(n);
        var tc = S.tCrit(conf, n - 1), lo = m - tc * se, hi = m + tc * se;
        var hit = lo <= MU && MU <= hi;
        sims.push({ m: m, lo: lo, hi: hi, hit: hit });
        tot++; if (hit) hits++;
      }
      draw();
    }
    function resetAll() { sims = []; tot = 0; hits = 0; draw(); }

    U.bindSlider(root, 'm5-n', function (v) { n = v; resetAll(); });
    U.bindSeg(root.querySelector('.seg'), function (k) { conf = parseFloat(k); resetAll(); });
    root.querySelector('#m5-run').addEventListener('click', run);
    draw();
  }

  /* ---------------- Uji hipotesis ---------------- */
  function initTest(root) {
    var diff = 5, n = 20, sd = 10, A = [], B = [], res = null, many = null;

    root.innerHTML =
      '<div class="controls">' +
        U.slider('m5t-diff', 'Selisih sebenarnya (B − A)', 0, 15, 0.5, diff) +
        U.slider('m5t-n', 'Siswa per kelompok', 5, 100, 1, n) +
        U.slider('m5t-sd', 'Keragaman nilai (SD)', 5, 20, 1, sd) +
      '</div>' +
      '<div class="controls">' +
        '<button type="button" class="btn" id="m5t-new">Ambil data baru</button>' +
        '<button type="button" class="btn ghost" id="m5t-many">Ulangi 200 eksperimen</button>' +
      '</div>' +
      '<figure class="plate">' +
        '<div class="plate-head">Metode belajar A dan B, nilai rata-rata sebenarnya A = 70. Titik adalah siswa; garis tebal adalah mean ± confidence interval 95%.</div>' +
        '<div class="plot-wrap" id="m5t-plot"></div>' +
        '<div class="plot-wrap" id="m5t-p" hidden></div>' +
        '<figcaption class="readouts" id="m5t-ro"></figcaption>' +
      '</figure>' +
      '<div class="reading" aria-live="polite"><h4>Catatan interpretasi</h4><div id="m5t-read"></div></div>';

    var P = V.plot(root.querySelector('#m5t-plot'), { h: 380, label: 'Perbandingan nilai dua metode belajar', m: { t: 14, b: 44 } });
    var P2 = V.plot(root.querySelector('#m5t-p'), { h: 240, label: 'Histogram p-value dari 200 eksperimen', m: { t: 14, b: 50 } });
    var jr = S.rng(9);
    var jit = []; for (var i = 0; i < 400; i++) jit.push((jr() - 0.5) * 0.6);

    function newData() {
      A = sample(n, 70, sd); B = sample(n, 70 + diff, sd);
      res = S.welch(A, B);
    }

    function drawStrip() {
      P.clear();
      P.axes([0.4, 2.6], [10, 130], {
        xTicks: [1, 2], xFmt: function (v) { return v === 1 ? 'Metode A' : 'Metode B'; },
        yLabel: 'Nilai tes (poin)', yn: 6
      });
      [A, B].forEach(function (g, gi) {
        var cx = gi + 1;
        g.forEach(function (v, k) { P.circle(cx + jit[k % 400], v, 3.2, gi ? 'pt-b' : 'pt-a'); });
        var m = S.mean(g), se = S.sd(g) / Math.sqrt(g.length), tc = S.tCrit(0.95, g.length - 1);
        P.line(P.x(cx), P.y(m - tc * se), P.x(cx), P.y(m + tc * se), 'ci-bar', P.front);
        P.line(P.x(cx - 0.22), P.y(m), P.x(cx + 0.22), P.y(m), 'mean-bar', P.front);
        V.text(P.front, P.x(cx + 0.27), P.y(m) + 4, fmt(m, 1), 'vlabel', 'start');
      });
    }

    function drawMany() {
      var wrap = root.querySelector('#m5t-p');
      wrap.hidden = !many;
      if (!many) return;
      var hist = S.histogram(many.ps, 20, 0, 1);
      var mx = Math.max.apply(null, hist.map(function (h) { return h.count; }));
      P2.clear();
      P2.axes([0, 1], [0, mx * 1.15], { xLabel: 'p-value dari 200 eksperimen', yLabel: 'Jumlah eksperimen', yInt: true, xn: 10 });
      hist.forEach(function (h, i) {
        if (!h.count) return;
        var x0 = P2.x(h.x0) + 1, w = P2.x(h.x1) - P2.x(h.x0) - 2, y = P2.y(h.count);
        V.el('rect', { x: x0, y: y, width: w, height: P2.y(0) - y, 'class': i === 0 ? 'bar bar-sig' : 'bar' }, P2.data);
      });
      P2.vline(0.05, 'vmark l-mean', P2.front);
      V.text(P2.front, P2.x(0.05) + 6, P2.m.t + 14, 'p = 0,05', 'vlabel l-mean', 'start');
    }

    function readout() {
      root.querySelector('#m5t-ro').innerHTML = U.ro([
        ['Selisih mean (B − A)', fmt(res.diff, 1)],
        ['t', fmt(res.t, 2)],
        ['df', fmt(res.df, 1)],
        ['p-value', U.p(res.p)],
        ['CI 95% selisih', '[' + fmt(res.lo, 1) + '; ' + fmt(res.hi, 1) + ']']
      ] .concat(many ? [['Signifikan (p < 0,05)', many.sig + ' dari 200 (' + fmt(many.sig / 2, 1) + '%)']] : []));

      var h = '';
      h += '<p>Dalam data ini, Metode B rata-rata <strong>' + fmt(Math.abs(res.diff), 1) + ' poin ' + (res.diff >= 0 ? 'lebih tinggi' : 'lebih rendah') + '</strong> daripada Metode A. ';
      if (res.p < 0.05) h += 'Dengan p = ' + U.p(res.p) + ', selisih sebesar ini <strong>jarang muncul kebetulan</strong> jika sebenarnya tidak ada perbedaan; kita menolak hipotesis nol pada α = 0,05.</p>';
      else h += 'Dengan p = ' + U.p(res.p) + ', selisih sebesar ini <strong>masih wajar muncul kebetulan</strong> jika sebenarnya tidak ada perbedaan; kita belum punya cukup bukti menolak hipotesis nol.</p>';
      h += '<p>Interval kepercayaan 95% untuk selisih adalah [' + fmt(res.lo, 1) + '; ' + fmt(res.hi, 1) + ']. ' +
        (res.lo <= 0 && res.hi >= 0 ? 'Interval ini mencakup 0, sejalan dengan p ≥ 0,05. ' : 'Interval ini tidak mencakup 0, sejalan dengan p < 0,05. ') +
        'Interval memberi lebih banyak informasi daripada p-value saja karena menunjukkan <em>seberapa besar</em> selisihnya.</p>';
      if (diff === 0 && res.p < 0.05) h += '<p>Perhatikan: selisih sebenarnya 0, tetapi hasilnya signifikan. Ini <strong>false positive</strong> (kesalahan tipe I) dan akan terjadi pada sekitar 5% eksperimen.</p>';
      if (diff > 0 && res.p >= 0.05) h += '<p>Selisih sebenarnya ada (' + fmt(diff, 1) + ' poin), tetapi uji ini gagal mendeteksinya. Itu <strong>false negative</strong> yang biasanya terjadi karena sampel terlalu kecil atau data terlalu beragam (power rendah).</p>';
      if (many) {
        h += '<p>Dari 200 eksperimen berulang, <strong>' + many.sig + '</strong> (' + fmt(many.sig / 2, 1) + '%) bernilai signifikan. ' +
          (diff === 0 ? 'Karena tidak ada selisih sebenarnya, p-value tersebar merata dan sekitar 5% jatuh di bawah 0,05 hanya karena kebetulan.' :
            'Persentase ini adalah <em>power</em> uji pada pengaturan sekarang. Coba naikkan jumlah siswa dan lihat power naik.') + '</p>';
      }
      h += '<p class="muted">p-value bukan peluang bahwa hipotesis nol benar, dan p < 0,05 tidak otomatis berarti selisihnya penting secara praktis.</p>';
      root.querySelector('#m5t-read').innerHTML = h;
    }

    function fresh() { many = null; newData(); drawStrip(); drawMany(); readout(); }

    U.bindSlider(root, 'm5t-diff', function (v) { diff = v; fresh(); });
    U.bindSlider(root, 'm5t-n', function (v) { n = v; fresh(); });
    U.bindSlider(root, 'm5t-sd', function (v) { sd = v; fresh(); });
    root.querySelector('#m5t-new').addEventListener('click', function () { many = null; newData(); drawStrip(); drawMany(); readout(); });
    root.querySelector('#m5t-many').addEventListener('click', function () {
      var ps = [], sig = 0;
      for (var i = 0; i < 200; i++) {
        var r = S.welch(sample(n, 70, sd), sample(n, 70 + diff, sd));
        ps.push(r.p); if (r.p < 0.05) sig++;
      }
      many = { ps: ps, sig: sig };
      drawMany(); readout();
    });

    fresh();
  }
})();
