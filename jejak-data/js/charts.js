/* =========================================================
   charts.js : pembantu grafik SVG buatan sendiri
   (tanpa library, jadi bisa dibuka offline).
   Objek global: `Viz`.
   ========================================================= */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var V = {};

  V.el = function (tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  /* Format angka gaya Indonesia: 1.234,5 */
  V.fmt = function (n, d) {
    if (d === undefined) d = 1;
    if (!isFinite(n)) return '-';
    return Number(n).toLocaleString('id-ID', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  };

  V.scale = function (d0, d1, r0, r1) {
    var f = function (v) { return r0 + (v - d0) / ((d1 - d0) || 1) * (r1 - r0); };
    f.invert = function (p) { return d0 + (p - r0) / (r1 - r0) * (d1 - d0); };
    return f;
  };

  V.ticks = function (min, max, count, int) {
    var span = max - min, step0 = span / (count || 6);
    var mag = Math.pow(10, Math.floor(Math.log10(step0)));
    var err = step0 / mag;
    var step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag;
    if (int && step < 1) step = 1;
    var start = Math.ceil(min / step - 1e-9) * step, t = [];
    for (var v = start; v <= max + step * 1e-6; v += step) t.push(parseFloat(v.toFixed(10)));
    return t;
  };

  V.text = function (parent, x, y, str, cls, anchor) {
    var t = V.el('text', { x: x, y: y, class: cls || 'lbl', 'text-anchor': anchor || 'start' }, parent);
    t.textContent = str;
    return t;
  };

  /* Membuat satu area plot di dalam `container`.
     Mengembalikan objek P dengan lapisan back/data/front. */
  V.plot = function (container, opt) {
    opt = opt || {};
    var W = opt.w || 760, H = opt.h || 420;
    var m = { t: 18, r: 22, b: 52, l: 58 };
    if (opt.m) for (var k in opt.m) m[k] = opt.m[k];
    var svg = V.el('svg', {
      viewBox: '0 0 ' + W + ' ' + H, 'class': 'plot',
      role: 'img', 'aria-label': opt.label || 'Grafik data'
    });
    container.appendChild(svg);
    var P = { svg: svg, W: W, H: H, m: m };
    P.back = V.el('g', {}, svg);
    P.data = V.el('g', {}, svg);
    P.front = V.el('g', {}, svg);

    P.clear = function () {
      [P.back, P.data, P.front].forEach(function (g) { while (g.firstChild) g.removeChild(g.firstChild); });
    };

    P.axes = function (xd, yd, o) {
      o = o || {};
      P.xd = xd; P.yd = yd;
      P.x = V.scale(xd[0], xd[1], m.l, W - m.r);
      P.y = V.scale(yd[0], yd[1], H - m.b, m.t);
      var xt = o.xTicks || V.ticks(xd[0], xd[1], o.xn || 7);
      var yt = o.yTicks || V.ticks(yd[0], yd[1], o.yn || 6, o.yInt);
      var xf = o.xFmt || function (v) { return V.fmt(v, 2); };
      var yf = o.yFmt || function (v) { return V.fmt(v, 2); };
      var g = P.back;
      yt.forEach(function (v) {
        V.el('line', { x1: m.l, x2: W - m.r, y1: P.y(v), y2: P.y(v), 'class': 'grid' }, g);
        V.text(g, m.l - 8, P.y(v) + 4, yf(v), 'tick', 'end');
      });
      xt.forEach(function (v) {
        V.el('line', { x1: P.x(v), x2: P.x(v), y1: m.t, y2: H - m.b, 'class': 'grid' }, g);
        V.text(g, P.x(v), H - m.b + 18, xf(v), 'tick', 'middle');
      });
      V.el('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, 'class': 'axis' }, g);
      V.el('line', { x1: m.l, x2: m.l, y1: m.t, y2: H - m.b, 'class': 'axis' }, g);
      if (o.xLabel) V.text(g, (m.l + W - m.r) / 2, H - 10, o.xLabel, 'axlabel', 'middle');
      if (o.yLabel) {
        var t = V.el('text', {
          transform: 'translate(15,' + ((m.t + H - m.b) / 2) + ') rotate(-90)',
          'class': 'axlabel', 'text-anchor': 'middle'
        }, g);
        t.textContent = o.yLabel;
      }
    };

    /* Konversi posisi pointer ke koordinat data */
    P.pt = function (e) {
      var pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      var q = pt.matrixTransform(svg.getScreenCTM().inverse());
      return { px: q.x, py: q.y, x: P.x.invert(q.x), y: P.y.invert(q.y) };
    };
    P.inside = function (p) {
      return p.px >= m.l && p.px <= W - m.r && p.py >= m.t && p.py <= H - m.b;
    };

    P.line = function (x1, y1, x2, y2, cls, layer) {
      return V.el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': cls }, layer || P.data);
    };
    P.vline = function (xv, cls, layer) {
      return P.line(P.x(xv), m.t, P.x(xv), H - m.b, cls, layer);
    };
    P.circle = function (xv, yv, r, cls, layer) {
      return V.el('circle', { cx: P.x(xv), cy: P.y(yv), r: r, 'class': cls }, layer || P.data);
    };
    P.rect = function (x0, y0, x1, y1, cls, layer) {
      var xa = Math.min(P.x(x0), P.x(x1)), xb = Math.max(P.x(x0), P.x(x1));
      var ya = Math.min(P.y(y0), P.y(y1)), yb = Math.max(P.y(y0), P.y(y1));
      return V.el('rect', { x: xa, y: ya, width: Math.max(xb - xa, 0), height: Math.max(yb - ya, 0), 'class': cls }, layer || P.data);
    };
    P.note = function (str) {
      var t = V.text(P.front, (m.l + W - m.r) / 2, (m.t + H - m.b) / 2, str, 'emptynote', 'middle');
      return t;
    };
    return P;
  };

  /* Gambar histogram batang ke dalam plot P */
  V.bars = function (P, hist, cls) {
    hist.forEach(function (h) {
      if (!h.count) return;
      var x0 = P.x(h.x0) + 1, w = Math.max(P.x(h.x1) - P.x(h.x0) - 2, 1);
      var y = P.y(h.count);
      V.el('rect', { x: x0, y: y, width: w, height: P.y(0) - y, 'class': cls || 'bar' }, P.data);
    });
  };

  window.Viz = V;
})();
