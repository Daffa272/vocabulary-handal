/* =========================================================
   modul3.js : Korelasi & regresi linear
   ========================================================= */
(function () {
  var S = Stat, V = Viz, U = UI, D = DATA, fmt = V.fmt;
  var COLORS = ['#2848F0', '#12866F', '#E4572E'];

  function strength(r) {
    var a = Math.abs(r);
    if (a < 0.1) return 'hampir tidak ada hubungan linear';
    var k = a < 0.3 ? 'lemah' : a < 0.5 ? 'sedang' : a < 0.7 ? 'cukup kuat' : a < 0.9 ? 'kuat' : 'sangat kuat';
    return 'hubungan linear ' + (r > 0 ? 'positif' : 'negatif') + ' yang ' + k;
  }

  Modules.m3 = function (root) {
    var keys = Object.keys(D.corr);
    var key = 'belajar', extra = [], showLine = true, showRes = false, byGroup = false;

    root.innerHTML =
      '<div class="controls">' +
        '<div class="ctl"><span class="ctl-l">Dataset simulasi</span>' +
          U.seg('Pilih dataset', keys.map(function (k) { return [k, D.corr[k].short]; }), key) + '</div>' +
      '</div>' +
      '<div class="controls">' +
        U.check('m3-line', 'Garis regresi', true) +
        U.check('m3-res', 'Residual (jarak titik ke garis)', false) +
        '<span id="m3-grpwrap" hidden>' + U.check('m3-grp', 'Warnai per kelompok', false) + '</span>' +
        '<button type="button" class="btn small ghost" id="m3-clear">Hapus titik tambahan</button>' +
      '</div>' +
      '<figure class="plate">' +
        '<div class="plate-head" id="m3-title"></div>' +
        '<div class="plot-wrap" id="m3-plot"></div>' +
        '<figcaption class="readouts" id="m3-ro"></figcaption>' +
      '</figure>' +
      '<div class="reading" aria-live="polite"><h4>Catatan interpretasi</h4><div id="m3-read"></div></div>';

    var P = V.plot(root.querySelector('#m3-plot'), { label: 'Scatter plot dua variabel dengan garis regresi', m: { l: 62 } });
    P.svg.classList.add('clickable');

    function draw() {
      var ds = D.corr[key];
      var X = ds.x.concat(extra.map(function (p) { return p.x; }));
      var Y = ds.y.concat(extra.map(function (p) { return p.y; }));
      var lr = S.linreg(X, Y), base = S.linreg(ds.x, ds.y);
      var grouped = byGroup && ds.g;

      P.clear();
      P.axes(ds.xd, ds.yd, { xLabel: ds.xName + ' (' + ds.xUnit + ')', yLabel: ds.yName + ' (' + ds.yUnit + ')' });

      /* residual */
      if (showRes) {
        for (var i = 0; i < X.length; i++) {
          var yh = lr.intercept + lr.slope * X[i];
          P.line(P.x(X[i]), P.y(Y[i]), P.x(X[i]), P.y(yh), 'resid');
        }
      }
      /* garis */
      function drawLine(l, x0, x1, cls, color) {
        var el = V.el('line', {
          x1: P.x(x0), y1: P.y(l.intercept + l.slope * x0), x2: P.x(x1), y2: P.y(l.intercept + l.slope * x1), 'class': cls
        }, P.data);
        if (color) el.style.stroke = color;
        el.setAttribute('clip-path', 'url(#m3clip)');
      }
      var defs = V.el('defs', {}, P.data);
      var cp = V.el('clipPath', { id: 'm3clip' }, defs);
      V.el('rect', { x: P.m.l, y: P.m.t, width: P.W - P.m.l - P.m.r, height: P.H - P.m.t - P.m.b }, cp);

      var gStats = [];
      if (showLine) {
        if (grouped) {
          for (var g = 0; g < 3; g++) {
            var gx = ds.x.filter(function (_, i) { return ds.g[i] === g; });
            var gy = ds.y.filter(function (_, i) { return ds.g[i] === g; });
            var gl = S.linreg(gx, gy);
            gStats.push(gl);
            drawLine(gl, Math.min.apply(null, gx), Math.max.apply(null, gx), 'regline group', COLORS[g]);
          }
          drawLine(lr, ds.xd[0], ds.xd[1], 'regline dashed');
        } else {
          drawLine(lr, ds.xd[0], ds.xd[1], 'regline');
        }
      } else if (grouped) {
        for (var g2 = 0; g2 < 3; g2++) {
          gStats.push(S.linreg(
            ds.x.filter(function (_, i) { return ds.g[i] === g2; }),
            ds.y.filter(function (_, i) { return ds.g[i] === g2; })));
        }
      }
      /* titik */
      ds.x.forEach(function (xv, i) {
        var c = P.circle(xv, ds.y[i], 5, 'pt');
        if (grouped) { c.style.fill = COLORS[ds.g[i]]; c.style.fillOpacity = 0.85; }
        var t = V.el('title', {}, c);
        t.textContent = ds.xName + ': ' + fmt(xv, 1) + ', ' + ds.yName + ': ' + fmt(ds.y[i], 1);
      });
      extra.forEach(function (p) { P.circle(p.x, p.y, 6.5, 'pt-extra'); });

      if (grouped) {
        ds.groups.forEach(function (name, g) {
          var lx = P.m.l + 14 + g * 96, ly = P.m.t + 12;
          V.el('circle', { cx: lx, cy: ly - 4, r: 5, fill: COLORS[g] }, P.front);
          V.text(P.front, lx + 10, ly, name, 'vlabel', 'start');
        });
      }

      root.querySelector('#m3-title').textContent = ds.xName + ' dan ' + ds.yName.toLowerCase() + '. ' + ds.x.length + ' pengamatan simulasi' + (extra.length ? ' + ' + extra.length + ' titik tambahan' : '') + '. Klik di grafik untuk menambah titik.';
      root.querySelector('#m3-ro').innerHTML = U.ro([
        ['Korelasi (r)', fmt(lr.r, 2)],
        ['R²', fmt(lr.r2, 2)],
        ['Slope', fmt(lr.slope, 2)],
        ['Intercept', fmt(lr.intercept, 1)],
        ['n', X.length]
      ]);

      /* ----- interpretasi ----- */
      var h = '';
      h += '<p>Nilai r = <strong>' + fmt(lr.r, 2) + '</strong> menunjukkan ' + strength(lr.r) + '.</p>';
      if (ds.kind === 'linear') {
        h += '<p>Slope ' + fmt(lr.slope, 2) + ' berarti: setiap kenaikan 1 ' + ds.xUnit + ' pada ' + ds.xName.toLowerCase() + ', ' + ds.yName.toLowerCase() + ' <em>diprediksi</em> ' + (lr.slope > 0 ? 'naik' : 'turun') + ' sekitar ' + fmt(Math.abs(lr.slope), 1) + ' ' + ds.yUnit + '. R² = ' + fmt(lr.r2, 2) + ' artinya sekitar ' + fmt(lr.r2 * 100, 0) + '% variasi ' + ds.yName.toLowerCase() + ' dapat dijelaskan oleh garis ini. Sisanya ditentukan faktor lain.</p>';
        h += '<p>Hati-hati: korelasi menunjukkan dua variabel bergerak bersama, bukan bahwa satu <em>menyebabkan</em> yang lain. Perlu desain studi atau penalaran tambahan untuk klaim sebab-akibat.</p>';
      } else if (ds.kind === 'nonlinear') {
        h += '<p><strong>Jangan berhenti di angka r.</strong> Scatter plot jelas membentuk lengkung U terbalik: hasil panen naik sampai dosis sekitar 50 kg/ha, lalu turun karena pupuk berlebih. Hubungannya kuat tetapi tidak lurus, sehingga r mendekati nol dan garis regresi datar. r hanya mengukur hubungan <em>linear</em>. Selalu lihat grafiknya dulu.</p>';
      } else if (ds.kind === 'none') {
        h += '<p>Titik-titik tersebar tanpa pola, dan garis regresi hampir datar. Karena sampel terbatas, r hampir tidak pernah tepat nol; selisih kecil dari nol seperti ini wajar muncul karena kebetulan. Coba tambah beberapa titik di sudut grafik dan lihat betapa mudahnya r berubah.</p>';
      } else if (ds.kind === 'simpson') {
        if (!grouped) {
          h += '<p>Secara keseluruhan, makin banyak jam latihan tampak berkaitan dengan skor lebih tinggi. Sebelum menyimpulkan, aktifkan <em>Warnai per kelompok</em> dan lihat kelas masing-masing.</p>';
        } else {
          h += '<p>Di dalam setiap kelas, hubungannya justru <strong>negatif</strong> (r kelas 7: ' + fmt(gStats[0].r, 2) + ', kelas 8: ' + fmt(gStats[1].r, 2) + ', kelas 9: ' + fmt(gStats[2].r, 2) + '). Pola positif secara keseluruhan muncul karena kelas yang lebih tinggi memang punya skor dan jam latihan lebih besar. Fenomena ini disebut <strong>Simpson&#39;s paradox</strong>: menggabungkan kelompok bisa membalik arah hubungan.</p>';
        }
      }
      if (extra.length) {
        h += '<p>Dengan ' + extra.length + ' titik tambahan, r berubah dari ' + fmt(base.r, 2) + ' menjadi <strong>' + fmt(lr.r, 2) + '</strong>. Titik yang jauh dari kumpulan lainnya (khususnya di ujung sumbu x) punya pengaruh besar terhadap garis, sehingga disebut <em>influential point</em>.</p>';
      }
      root.querySelector('#m3-read').innerHTML = h;
    }

    function refreshGroupToggle() {
      var ds = D.corr[key], w = root.querySelector('#m3-grpwrap');
      w.hidden = !ds.g;
      if (!ds.g) { byGroup = false; root.querySelector('#m3-grp').checked = false; }
    }

    U.bindSeg(root.querySelector('.seg'), function (k) { key = k; extra = []; refreshGroupToggle(); draw(); });
    root.querySelector('#m3-line').addEventListener('change', function (e) { showLine = e.target.checked; draw(); });
    root.querySelector('#m3-res').addEventListener('change', function (e) { showRes = e.target.checked; draw(); });
    root.querySelector('#m3-grp').addEventListener('change', function (e) { byGroup = e.target.checked; draw(); });
    root.querySelector('#m3-clear').addEventListener('click', function () { extra = []; draw(); });
    P.svg.addEventListener('click', function (e) {
      var q = P.pt(e), ds = D.corr[key];
      if (!P.inside(q) || extra.length >= 30) return;
      extra.push({
        x: Math.max(ds.xd[0], Math.min(ds.xd[1], q.x)),
        y: Math.max(ds.yd[0], Math.min(ds.yd[1], q.y))
      });
      draw();
    });

    refreshGroupToggle();
    draw();
  };
})();
