/* =========================================================
   ui.js : pembangun kontrol kecil (tombol pilihan, slider, dst.)
   Objek global: `UI`. Setiap modul didaftarkan di `Modules`.
   ========================================================= */
(function () {
  var U = {};
  window.Modules = {};

  U.seg = function (label, items, active) {
    return '<div class="seg" role="group" aria-label="' + label + '">' +
      items.map(function (i) {
        return '<button type="button" data-k="' + i[0] + '" aria-pressed="' + (i[0] === active) + '">' + i[1] + '</button>';
      }).join('') + '</div>';
  };

  U.bindSeg = function (el, cb) {
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !el.contains(b)) return;
      Array.prototype.forEach.call(el.children, function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      cb(b.dataset.k);
    });
  };

  U.slider = function (id, label, min, max, step, val) {
    return '<label class="ctl"><span class="ctl-l">' + label + ': <output id="' + id + '-o">' +
      Viz.fmt(val, 2) + '</output></span>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></label>';
  };

  U.bindSlider = function (root, id, cb) {
    var i = root.querySelector('#' + id), o = root.querySelector('#' + id + '-o');
    i.addEventListener('input', function () {
      o.textContent = Viz.fmt(+i.value, 2);
      cb(+i.value);
    });
    return i;
  };

  U.check = function (id, label, on) {
    return '<label class="chk"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><span>' + label + '</span></label>';
  };

  U.ro = function (items) {
    return items.map(function (i) {
      return '<div class="ro"><span class="k">' + i[0] + '</span><span class="v">' + i[1] + '</span></div>';
    }).join('');
  };

  U.p = function (p) { return p < 0.001 ? '< 0,001' : Viz.fmt(p, 3); };

  window.UI = U;
})();
