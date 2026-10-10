/* =========================================================
   hero.js : scatter plot yang bisa diseret di bagian atas
   Titik-titik "menyusun diri" saat halaman dibuka, lalu
   bisa diseret (mouse, sentuh, atau tombol panah).
   ========================================================= */
(function () {
  var S = Stat, V = Viz, U = UI, fmt = V.fmt;

  Modules.hero = function (root) {
    root.innerHTML =
      '<figure class="plate">' +
        '<div class="plate-head">Seret titik mana pun. Garis dan angka ikut berubah.</div>' +
        '<div class="plot-wrap" id="hero-plot"></div>' +
        '<figcaption class="readouts" id="hero-ro"></figcaption>' +
      '</figure>' +
      '<div class="hero-actions">' +
        '<button type="button" class="btn small" id="hero-add">Tambah satu pencilan</button>' +
        '<button type="button" class="btn small ghost" id="hero-reset">Kembalikan data awal</button>' +
      '</div>';

    var P = V.plot(root.querySelector('#hero-plot'), {
      w: 640, h: 400, label: 'Scatter plot interaktif: seret titik untuk mengubah korelasi',
      m: { t: 16, r: 18, b: 46, l: 50 }
    });
    P.svg.classList.add('draggable');

    function initial() {
      var r = S.rng(7), pts = [];
      for (var i = 0; i < 14; i++) {
        var x = 1 + i * (8 / 13) + S.normal(r, 0, 0.25);
        var y = 1.3 + 0.72 * x + S.normal(r, 0, 0.9);
        pts.push({ x: Math.max(0.3, Math.min(9.7, x)), y: Math.max(0.3, Math.min(9.7, y)) });
      }
      return pts;
    }

    var target = initial();
    var rr = S.rng(99);
    var start = target.map(function () { return { x: 0.5 + rr() * 9, y: 0.5 + rr() * 9 }; });
    var pts = start.map(function (p) { return { x: p.x, y: p.y }; });
    var drag = -1, focusIdx = null, animating = false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clamp(v) { return Math.max(0.2, Math.min(9.8, v)); }

    function reading(lr) {
      var a = Math.abs(lr.r);
      if (a < 0.1) return 'Hampir tidak ada hubungan linear antara x dan y';
      var kuat = a < 0.3 ? 'lemah' : a < 0.5 ? 'sedang' : a < 0.7 ? 'cukup kuat' : a < 0.9 ? 'kuat' : 'sangat kuat';
      return 'Hubungan linear ' + (lr.r > 0 ? 'positif' : 'negatif') + ' ' + kuat;
    }

    function draw() {
      P.clear();
      P.axes([0, 10], [0, 10], {
        xTicks: [0, 2, 4, 6, 8, 10], yTicks: [0, 2, 4, 6, 8, 10],
        xLabel: 'Variabel x', yLabel: 'Variabel y'
      });
      var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
      var lr = S.linreg(xs, ys);
      /* garis regresi */
      var ya = lr.intercept, yb = lr.intercept + lr.slope * 10;
      var defs = V.el('defs', {}, P.data);
      var cp = V.el('clipPath', { id: 'heroclip' }, defs);
      V.el('rect', { x: P.m.l, y: P.m.t, width: P.W - P.m.l - P.m.r, height: P.H - P.m.t - P.m.b }, cp);
      var seg = V.el('line', {
        x1: P.x(0), y1: P.y(ya), x2: P.x(10), y2: P.y(yb), 'class': 'regline'
      }, P.data);
      seg.setAttribute('clip-path', 'url(#heroclip)');
      /* titik */
      pts.forEach(function (p, i) {
        var c = V.el('circle', {
          cx: P.x(p.x), cy: P.y(p.y), r: 9, 'class': 'dot grab', tabindex: 0,
          'aria-label': 'Titik ' + (i + 1) + ', x ' + fmt(p.x, 1) + ', y ' + fmt(p.y, 1) + '. Gunakan tombol panah untuk menggeser.',
          'data-i': i
        }, P.data);
        c.addEventListener('keydown', function (e) {
          var step = e.shiftKey ? 0.5 : 0.15, moved = true;
          if (e.key === 'ArrowLeft') p.x = clamp(p.x - step);
          else if (e.key === 'ArrowRight') p.x = clamp(p.x + step);
          else if (e.key === 'ArrowUp') p.y = clamp(p.y + step);
          else if (e.key === 'ArrowDown') p.y = clamp(p.y - step);
          else moved = false;
          if (moved) { e.preventDefault(); focusIdx = i; draw(); }
        });
      });
      if (focusIdx !== null) {
        var el = P.data.querySelector('circle[data-i="' + focusIdx + '"]');
        if (el) el.focus();
      }
      root.querySelector('#hero-ro').innerHTML = U.ro([
        ['Korelasi (r)', fmt(lr.r, 2)],
        ['Kemiringan garis', fmt(lr.slope, 2)],
        ['Jumlah titik', pts.length]
      ]) + '<div class="ro wide"><span class="k">Bacaan</span><span class="v small">' + reading(lr) + '.</span></div>';
    }

    P.svg.addEventListener('pointerdown', function (e) {
      var c = e.target.closest('circle');
      if (!c) return;
      animating = false;
      drag = +c.getAttribute('data-i');
      focusIdx = null;
      P.svg.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    P.svg.addEventListener('pointermove', function (e) {
      if (drag < 0) return;
      var q = P.pt(e);
      pts[drag].x = clamp(q.x); pts[drag].y = clamp(q.y);
      draw();
    });
    function end() { drag = -1; }
    P.svg.addEventListener('pointerup', end);
    P.svg.addEventListener('pointercancel', end);

    root.querySelector('#hero-add').addEventListener('click', function () {
      animating = false;
      pts.push({ x: 8.8, y: 1.0 });
      draw();
    });
    root.querySelector('#hero-reset').addEventListener('click', function () {
      animating = false; focusIdx = null;
      pts = target.map(function (p) { return { x: p.x, y: p.y }; });
      draw();
    });

    /* Satu momen animasi: titik berpindah dari acak ke pola */
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    if (reduce) {
      pts = target.map(function (p) { return { x: p.x, y: p.y }; });
      draw();
    } else {
      draw();
      animating = true;
      var t0 = null, dur = 1400;
      setTimeout(function () {
        function frame(ts) {
          if (!animating) return;
          if (t0 === null) t0 = ts;
          var t = Math.min(1, (ts - t0) / dur), e = ease(t);
          pts = target.map(function (p, i) {
            return { x: start[i].x + (p.x - start[i].x) * e, y: start[i].y + (p.y - start[i].y) * e };
          });
          draw();
          if (t < 1) requestAnimationFrame(frame); else animating = false;
        }
        requestAnimationFrame(frame);
      }, 500);
    }
  };
})();
