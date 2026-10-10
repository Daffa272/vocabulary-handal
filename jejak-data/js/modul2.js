/* =========================================================
   modul2.js : Spread (SD, IQR, boxplot, pencilan)
   ========================================================= */
(function () {
  var S = Stat, V = Viz, U = UI, D = DATA, fmt = V.fmt;

  Modules.m2 = function (root) {
    var names = D.spread.names, groups = D.spread.groups;
    var useExtra = false, extraVal = 12, showPts = true;

    root.innerHTML =
      '<div class="controls">' +
        U.check('m2-pts', 'Tampilkan titik data', true) +
        U.check('m2-extra', 'Tambahkan 1 titik ke Kelas C', false) +
        U.slider('m2-val', 'Nilai titik tambahan', 0, 100, 1, extraVal) +
      '</div>' +
      '<figure class="plate">' +
        '<div class="plate-head">Nilai tes tiga kelas (masing-masing 40 siswa). ' +
          '<span class="legend"><i class="lg lg-mean"></i> mean &nbsp; <i class="lg lg-med"></i> median &nbsp; <i class="lg lg-out"></i> pencilan (di luar 1,5 × IQR)</span></div>' +
        '<div class="plot-wrap" id="m2-plot"></div>' +
        '<div class="table-wrap"><table class="stat-table" id="m2-table"></table></div>' +
      '</figure>' +
      '<div class="reading" aria-live="polite"><h4>Catatan interpretasi</h4><div id="m2-read"></div></div>';

    var P = V.plot(root.querySelector('#m2-plot'), { h: 400, label: 'Boxplot nilai tiga kelas', m: { b: 44 } });

    /* jitter tetap supaya titik tidak loncat saat redraw */
    var jr = S.rng(5), jitter = groups.map(function (g) { return g.concat([0]).map(function () { return (jr() - 0.5) * 0.5; }); });

    function data(i) { return (i === 2 && useExtra) ? groups[2].concat([extraVal]) : groups[i]; }

    function draw() {
      P.clear();
      P.axes([0.4, 3.6], [0, 100], {
        xTicks: [1, 2, 3], xFmt: function (v) { return names[v - 1]; },
        yLabel: 'Nilai tes (poin)', yn: 5
      });
      var stats = [0, 1, 2].map(function (i) { return S.box(data(i)); });
      stats.forEach(function (b, i) {
        var cx = i + 1, hw = 0.2;
        /* whisker */
        P.line(P.x(cx), P.y(b.wlo), P.x(cx), P.y(b.q1), 'whisker');
        P.line(P.x(cx), P.y(b.q3), P.x(cx), P.y(b.whi), 'whisker');
        P.line(P.x(cx - 0.09), P.y(b.wlo), P.x(cx + 0.09), P.y(b.wlo), 'whisker');
        P.line(P.x(cx - 0.09), P.y(b.whi), P.x(cx + 0.09), P.y(b.whi), 'whisker');
        /* kotak */
        P.rect(cx - hw, b.q3, cx + hw, b.q1, 'boxrect');
        P.line(P.x(cx - hw), P.y(b.med), P.x(cx + hw), P.y(b.med), 'medline');
        /* titik */
        if (showPts) {
          data(i).forEach(function (v, k) {
            var isOut = v < b.lf || v > b.hf;
            P.circle(cx + jitter[i][k], v, isOut ? 4.5 : 3, isOut ? 'pt-out' : 'pt-in');
          });
        } else {
          b.out.forEach(function (v) { P.circle(cx, v, 4.5, 'pt-out'); });
        }
        /* mean (belah ketupat) */
        var mx = P.x(cx), my = P.y(b.mean);
        V.el('path', { d: 'M' + mx + ',' + (my - 7) + ' L' + (mx + 7) + ',' + my + ' L' + mx + ',' + (my + 7) + ' L' + (mx - 7) + ',' + my + ' Z', 'class': 'meandia' }, P.front);
      });

      var base = S.box(groups[2]);
      var rows = '<thead><tr><th>Kelas</th><th>n</th><th>Mean</th><th>Median</th><th>SD</th><th>Q1</th><th>Q3</th><th>IQR</th><th>Pencilan</th></tr></thead><tbody>';
      stats.forEach(function (b, i) {
        rows += '<tr><th>' + names[i] + '</th><td>' + b.n + '</td><td>' + fmt(b.mean, 1) + '</td><td>' + fmt(b.med, 1) +
          '</td><td>' + fmt(b.sd, 1) + '</td><td>' + fmt(b.q1, 1) + '</td><td>' + fmt(b.q3, 1) + '</td><td>' + fmt(b.iqr, 1) +
          '</td><td>' + b.out.length + '</td></tr>';
      });
      root.querySelector('#m2-table').innerHTML = rows + '</tbody>';

      var A = stats[0], B = stats[1], C = stats[2], h = '';
      h += '<p><strong>Kelas A dan B</strong> punya mean hampir sama (' + fmt(A.mean, 1) + ' dan ' + fmt(B.mean, 1) + '), tetapi standard deviation Kelas B (' + fmt(B.sd, 1) + ') sekitar <strong>' + fmt(B.sd / A.sd, 1) + ' kali</strong> Kelas A (' + fmt(A.sd, 1) + '). Kotak B juga jauh lebih tinggi: IQR ' + fmt(B.iqr, 1) + ' berbanding ' + fmt(A.iqr, 1) + '. Rata-rata yang sama bisa menyembunyikan kelas yang seragam dan kelas yang sangat beragam.</p>';
      if (useExtra) {
        h += '<p>Satu titik bernilai ' + fmt(extraVal, 0) + ' di Kelas C mengubah mean dari ' + fmt(base.mean, 1) + ' menjadi <strong>' + fmt(C.mean, 1) + '</strong> dan SD dari ' + fmt(base.sd, 1) + ' menjadi <strong>' + fmt(C.sd, 1) + '</strong>. Median hanya berubah dari ' + fmt(base.med, 1) + ' menjadi ' + fmt(C.med, 1) + ' dan IQR dari ' + fmt(base.iqr, 1) + ' menjadi ' + fmt(C.iqr, 1) + '.</p>';
        if (C.out.indexOf(extraVal) >= 0) h += '<p>Titik tambahan itu berada di luar pagar boxplot, sehingga ditandai sebagai pencilan. Tanda ini hanya peringatan: periksa dulu apakah itu salah input, siswa yang sakit saat ujian, atau memang nilai nyata sebelum memutuskan mengabaikannya.</p>';
        else h += '<p>Nilai itu masih berada di dalam pagar (1,5 × IQR), jadi belum dianggap pencilan meski sudah menggeser mean.</p>';
      } else {
        h += '<p>Aktifkan <em>Tambahkan 1 titik ke Kelas C</em> lalu geser nilainya. Amati statistik mana yang ikut bergerak dan mana yang hampir diam.</p>';
      }
      root.querySelector('#m2-read').innerHTML = h;
    }

    root.querySelector('#m2-pts').addEventListener('change', function (e) { showPts = e.target.checked; draw(); });
    root.querySelector('#m2-extra').addEventListener('change', function (e) { useExtra = e.target.checked; draw(); });
    U.bindSlider(root, 'm2-val', function (v) { extraVal = v; if (useExtra) draw(); });
    draw();
  };
})();
