/* =========================================================
   modul1.js : Distribusi (histogram, mean, median, modus, skewness)
   ========================================================= */
(function () {
  var S = Stat, V = Viz, U = UI, D = DATA, fmt = V.fmt;

  Modules.m1 = function (root) {
    var keys = Object.keys(D.dist);
    var key = 'tinggi', bins = 16, extra = [];

    root.innerHTML =
      '<div class="controls">' +
        '<div class="ctl"><span class="ctl-l">Dataset simulasi</span>' +
          U.seg('Pilih dataset', keys.map(function (k) { return [k, D.dist[k].short]; }), key) + '</div>' +
        U.slider('m1-bins', 'Jumlah bin', 5, 40, 1, bins) +
      '</div>' +
      '<div class="controls">' +
        U.check('m1-mean', 'Mean', true) + U.check('m1-median', 'Median', true) +
        U.check('m1-mode', 'Modus (perkiraan)', false) +
        '<button type="button" class="btn small" id="m1-out">Tambah 5 pencilan</button>' +
        '<button type="button" class="btn small ghost" id="m1-clear">Hapus data tambahan</button>' +
      '</div>' +
      '<figure class="plate">' +
        '<div class="plate-head" id="m1-title"></div>' +
        '<div class="plot-wrap" id="m1-plot"></div>' +
        '<figcaption class="readouts" id="m1-ro"></figcaption>' +
      '</figure>' +
      '<div class="reading" aria-live="polite"><h4>Catatan interpretasi</h4><div id="m1-read"></div></div>';

    var P = V.plot(root.querySelector('#m1-plot'), { label: 'Histogram distribusi data', m: { t: 20, b: 52 } });
    P.svg.classList.add('clickable');

    function draw() {
      var ds = D.dist[key], data = ds.data.concat(extra);
      var x0 = ds.xd[0], x1 = ds.xd[1];
      var hist = S.histogram(data, bins, x0, x1);
      var maxC = Math.max.apply(null, hist.map(function (h) { return h.count; }));
      P.clear();
      P.axes([x0, x1], [0, Math.ceil(maxC * 1.2)], {
        xLabel: ds.name + ' (' + ds.unit + ')', yLabel: 'Frekuensi (jumlah data)', yInt: true
      });
      V.bars(P, hist, 'bar');

      var mean = S.mean(data), med = S.median(data);
      var tallest = hist.reduce(function (a, b) { return b.count > a.count ? b : a; }, hist[0]);
      var mode = (tallest.x0 + tallest.x1) / 2;

      var marks = [];
      if (root.querySelector('#m1-mean').checked) marks.push({ v: mean, cls: 'l-mean', t: 'Mean ' + fmt(mean, 1) });
      if (root.querySelector('#m1-median').checked) marks.push({ v: med, cls: 'l-median', t: 'Median ' + fmt(med, 1) });
      if (root.querySelector('#m1-mode').checked) marks.push({ v: mode, cls: 'l-mode', t: 'Modus ≈ ' + fmt(mode, 1) });
      marks.forEach(function (m, i) {
        P.vline(m.v, 'vmark ' + m.cls, P.front);
        var right = P.x(m.v) < P.W * 0.68;
        var t = V.text(P.front, P.x(m.v) + (right ? 6 : -6), P.m.t + 14 + i * 17, m.t, 'vlabel ' + m.cls, right ? 'start' : 'end');
        t.setAttribute('data-for', m.cls);
      });

      var sd = S.sd(data), sk = S.skew(data);
      root.querySelector('#m1-title').textContent = 'Data: ' + ds.story + (extra.length ? ' + ' + extra.length + ' titik tambahan' : '') + '. Klik di grafik untuk menambah satu data.';
      root.querySelector('#m1-ro').innerHTML = U.ro([
        ['Jumlah data (n)', data.length],
        ['Mean', fmt(mean, 1)],
        ['Median', fmt(med, 1)],
        ['Modus ≈', fmt(mode, 1)],
        ['Standard deviation', fmt(sd, 1)],
        ['Skewness', fmt(sk, 2)]
      ]);

      /* ----- interpretasi ----- */
      var peaks = S.peakCount(hist.map(function (h) { return h.count; }));
      var shape, h = '';
      if (peaks === 2) shape = 'tampak <strong>berpuncak dua (bimodal)</strong>';
      else if (Math.abs(sk) < 0.3) shape = '<strong>relatif simetris</strong>';
      else if (sk > 0) shape = '<strong>miring ke kanan (right-skewed)</strong>, ekor panjang di sisi nilai besar';
      else shape = '<strong>miring ke kiri (left-skewed)</strong>, ekor panjang di sisi nilai kecil';
      h += '<p>Bentuk distribusi ' + shape + ' (skewness ' + fmt(sk, 2) + ').</p>';

      var gap = mean - med, rel = Math.abs(gap) / (sd || 1);
      if (peaks === 2) {
        h += '<p>Mean (' + fmt(mean, 1) + ') dan median (' + fmt(med, 1) + ') sama-sama jatuh di antara dua puncak.</p>';
      } else if (rel < 0.1) {
        h += '<p>Mean (' + fmt(mean, 1) + ') dan median (' + fmt(med, 1) + ') hampir sama. Pada data simetris, keduanya sama-sama layak dipakai sebagai ukuran pusat.</p>';
      } else if (gap > 0) {
        h += '<p>Mean (' + fmt(mean, 1) + ') <strong>lebih besar</strong> daripada median (' + fmt(med, 1) + '). Beberapa nilai besar di ekor kanan menarik mean ke atas, sedangkan median tidak ikut tertarik.</p>';
      } else {
        h += '<p>Mean (' + fmt(mean, 1) + ') <strong>lebih kecil</strong> daripada median (' + fmt(med, 1) + '). Beberapa nilai kecil di ekor kiri menarik mean ke bawah, sedangkan median bertahan.</p>';
      }

      if (peaks === 2) {
        h += '<p>Perhatikan: mean jatuh di <em>lembah</em> di antara dua puncak, tempat hampir tidak ada data. Angka rata-rata ini tidak mewakili kelompok mana pun. Langkah yang masuk akal adalah memisahkan dua subkelompok lalu menganalisis masing-masing.</p>';
      } else if (rel >= 0.1) {
        h += '<p>Untuk menggambarkan nilai yang <em>tipikal</em>, median lebih jujur pada data seperti ini. Laporkan mean hanya bila total atau rata-rata memang yang dibutuhkan.</p>';
      }
      if (extra.length) {
        var base = ds.data, bm = S.mean(base), bmed = S.median(base);
        h += '<p>Setelah ada ' + extra.length + ' titik tambahan, mean bergeser <strong>' + fmt(Math.abs(mean - bm), 1) + '</strong> dari ' + fmt(bm, 1) + ' menjadi ' + fmt(mean, 1) + ', sedangkan median hanya bergeser <strong>' + fmt(Math.abs(med - bmed), 1) + '</strong>. Inilah arti median lebih <em>robust</em> terhadap pencilan.</p>';
      }
      root.querySelector('#m1-read').innerHTML = h;
    }

    U.bindSeg(root.querySelector('.seg'), function (k) { key = k; extra = []; draw(); });
    U.bindSlider(root, 'm1-bins', function (v) { bins = v; draw(); });
    ['m1-mean', 'm1-median', 'm1-mode'].forEach(function (id) {
      root.querySelector('#' + id).addEventListener('change', draw);
    });
    root.querySelector('#m1-out').addEventListener('click', function () {
      var ds = D.dist[key], v = ds.outlier;
      for (var i = 0; i < 5; i++) extra.push(v);
      draw();
    });
    root.querySelector('#m1-clear').addEventListener('click', function () { extra = []; draw(); });
    P.svg.addEventListener('click', function (e) {
      var q = P.pt(e), ds = D.dist[key];
      if (!P.inside(q) || extra.length >= 150) return;
      extra.push(Math.max(ds.xd[0], Math.min(ds.xd[1], q.x)));
      draw();
    });

    draw();
  };
})();
