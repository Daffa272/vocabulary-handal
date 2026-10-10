/* =========================================================
   modul4.js : Sampling dan Central Limit Theorem
   ========================================================= */
(function () {
  var S = Stat, V = Viz, U = UI, D = DATA, fmt = V.fmt;

  Modules.m4 = function (root) {
    var keys = Object.keys(D.pops);
    var key = 'eksponensial', n = 10, means = [], showNorm = true, lastSample = null;

    root.innerHTML =
      '<div class="controls">' +
        '<div class="ctl"><span class="ctl-l">Bentuk populasi</span>' +
          U.seg('Pilih populasi', keys.map(function (k) { return [k, D.pops[k].short]; }), key) + '</div>' +
        U.slider('m4-n', 'Ukuran sampel (n)', 1, 100, 1, n) +
      '</div>' +
      '<div class="controls">' +
        '<button type="button" class="btn small" data-take="1">Ambil 1 sampel</button>' +
        '<button type="button" class="btn small" data-take="100">Ambil 100 sampel</button>' +
        '<button type="button" class="btn small" data-take="1000">Ambil 1.000 sampel</button>' +
        '<button type="button" class="btn small ghost" id="m4-reset">Ulang dari nol</button>' +
        U.check('m4-norm', 'Kurva normal teoretis', true) +
      '</div>' +
      '<figure class="plate">' +
        '<div class="plate-head">Atas: populasi (20.000 nilai). Bawah: rata-rata dari setiap sampel yang diambil.</div>' +
        '<div class="plot-wrap" id="m4-pop"></div>' +
        '<div class="plot-wrap" id="m4-means"></div>' +
        '<figcaption class="readouts" id="m4-ro"></figcaption>' +
      '</figure>' +
      '<div class="reading" aria-live="polite"><h4>Catatan interpretasi</h4><div id="m4-read"></div></div>';

    var P1 = V.plot(root.querySelector('#m4-pop'), { h: 200, label: 'Histogram populasi', m: { t: 14, b: 40, l: 58 } });
    var P2 = V.plot(root.querySelector('#m4-means'), { h: 300, label: 'Histogram rata-rata sampel', m: { t: 14, b: 52, l: 58 } });

    function pop() { return D.pops[key]; }

    function drawPop() {
      var p = pop(), lo = Math.floor(p.min), hi = Math.ceil(p.max);
      var hist = S.histogram(p.data, 40, lo, hi);
      var mx = Math.max.apply(null, hist.map(function (h) { return h.count; }));
      P1.clear();
      P1.axes([lo, hi], [0, mx * 1.1], { yTicks: [], xn: 8, xLabel: p.name, yLabel: 'Populasi' });
      V.bars(P1, hist, 'bar bar-pop');
      P1.vline(p.mu, 'vmark l-mean', P1.front);
      V.text(P1.front, P1.x(p.mu) + 6, P1.m.t + 14, 'μ = ' + fmt(p.mu, 1), 'vlabel l-mean', 'start');
    }

    function drawMeans() {
      var p = pop(), se = p.sigma / Math.sqrt(n);
      var lo = Math.max(p.min, p.mu - 4 * se), hi = Math.min(p.max, p.mu + 4 * se);
      P2.clear();
      var bins = 30, hist = S.histogram(means, bins, lo, hi);
      var mxc = Math.max(1, Math.max.apply(null, hist.map(function (h) { return h.count; })));
      var w = (hi - lo) / bins;
      var peakNorm = means.length ? S.normPdf(p.mu, p.mu, se) * w * means.length : 0;
      var ymax = Math.max(mxc, showNorm ? peakNorm : 0) * 1.15 || 5;
      P2.axes([lo, hi], [0, ymax], {
        xLabel: 'Rata-rata sampel (n = ' + n + ')', yLabel: 'Jumlah sampel', yInt: true, xn: 8
      });
      if (!means.length) { P2.note('Belum ada sampel. Klik "Ambil 100 sampel" untuk mulai.'); return; }
      V.bars(P2, hist, 'bar');
      if (showNorm) {
        var d = '';
        for (var i = 0; i <= 140; i++) {
          var x = lo + (hi - lo) * i / 140;
          var y = S.normPdf(x, p.mu, se) * w * means.length;
          d += (i ? ' L' : 'M') + P2.x(x) + ',' + P2.y(y);
        }
        V.el('path', { d: d, 'class': 'normcurve' }, P2.front);
      }
      P2.vline(p.mu, 'vmark l-mean', P2.front);
    }

    function readouts() {
      var p = pop(), se = p.sigma / Math.sqrt(n), k = means.length;
      root.querySelector('#m4-ro').innerHTML = U.ro([
        ['Sampel diambil', fmt(k, 0)],
        ['Mean populasi (μ)', fmt(p.mu, 1)],
        ['Mean dari rata-rata sampel', k ? fmt(S.mean(means), 2) : '-'],
        ['SD rata-rata sampel', k > 1 ? fmt(S.sd(means), 2) : '-'],
        ['Standard error teoretis (σ/√n)', fmt(se, 2)]
      ]);

      var h = '';
      if (!k) {
        h = '<p>Setiap kali kamu mengambil sampel, komputer memilih <strong>n = ' + n + '</strong> nilai acak dari populasi lalu menghitung rata-ratanya. Populasi di atas berbentuk <em>' + p.shape + '</em>. Ambil beberapa ratus sampel dan lihat bentuk rata-ratanya.</p>';
      } else {
        h += '<p>Setiap batang di grafik bawah menghitung berapa sampel yang rata-ratanya jatuh di rentang itu. Mean dari semua rata-rata sampel (' + fmt(S.mean(means), 2) + ') sangat dekat dengan μ (' + fmt(p.mu, 1) + '): rata-rata sampel itu <em>tidak bias</em>.</p>';
        if (k > 30) {
          h += '<p>Sebaran rata-rata sampel (SD ' + fmt(S.sd(means), 2) + ') mendekati standard error teoretis σ/√n = ' + fmt(se, 2) + '. Makin besar n, makin kecil SE: menaikkan n empat kali lipat memperkecil SE menjadi setengahnya.</p>';
          var sk = S.skew(means);
          if (k >= 200) {
            if (Math.abs(sk) < 0.25) h += '<p>Walau populasinya ' + p.shape + ', histogram rata-rata sampel sudah <strong>mendekati lonceng normal</strong> (skewness ' + fmt(sk, 2) + '). Itulah isi <em>Central Limit Theorem</em>.</p>';
            else h += '<p>Histogram rata-rata sampel masih agak miring (skewness ' + fmt(sk, 2) + ') karena n = ' + n + ' belum cukup besar untuk populasi yang ' + p.shape + '. Naikkan n dan bandingkan.</p>';
          }
        }
        if (lastSample !== null) h += '<p class="muted">Sampel terakhir memiliki rata-rata ' + fmt(lastSample, 2) + '.</p>';
      }
      root.querySelector('#m4-read').innerHTML = h;
    }

    function redraw() { drawPop(); drawMeans(); readouts(); }

    function take(k) {
      var d = pop().data, len = d.length;
      for (var i = 0; i < k; i++) {
        var s = 0;
        for (var j = 0; j < n; j++) s += d[Math.floor(Math.random() * len)];
        lastSample = s / n;
        means.push(lastSample);
      }
      drawMeans(); readouts();
    }

    U.bindSeg(root.querySelector('.seg'), function (k) { key = k; means = []; lastSample = null; redraw(); });
    U.bindSlider(root, 'm4-n', function (v) { n = v; means = []; lastSample = null; drawMeans(); readouts(); });
    root.querySelectorAll('[data-take]').forEach(function (b) {
      b.addEventListener('click', function () { take(+b.dataset.take); });
    });
    root.querySelector('#m4-reset').addEventListener('click', function () { means = []; lastSample = null; drawMeans(); readouts(); });
    root.querySelector('#m4-norm').addEventListener('change', function (e) { showNorm = e.target.checked; drawMeans(); });

    redraw();
  };
})();
