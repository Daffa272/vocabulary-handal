/* =========================================================
   app.js : menyalakan semua modul dan navigasi
   ========================================================= */
(function () {
  function safeInit(id, fn) {
    var el = document.getElementById(id);
    if (!el || typeof fn !== 'function') return;
    try { fn(el); }
    catch (err) {
      el.innerHTML = '<p class="error-note">Modul ini gagal dimuat. Buka console browser (F12) untuk melihat pesan kesalahan.</p>';
      if (window.console) console.error(id, err);
    }
  }

  function init() {
    safeInit('hero-lab', Modules.hero);
    safeInit('lab1', Modules.m1);
    safeInit('lab2', Modules.m2);
    safeInit('lab3', Modules.m3);
    safeInit('lab4', Modules.m4);
    safeInit('lab5', Modules.m5);
    safeInit('lab6', Modules.m6);
    safeInit('quiz-root', Modules.quiz);

    /* checklist misi, disimpan di perangkat */
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem('jd-missions') || '{}'); } catch (e) { saved = {}; }
    document.querySelectorAll('.mission input[type=checkbox]').forEach(function (cb) {
      cb.checked = !!saved[cb.dataset.id];
      cb.addEventListener('change', function () {
        saved[cb.dataset.id] = cb.checked;
        try { localStorage.setItem('jd-missions', JSON.stringify(saved)); } catch (e) { /* abaikan */ }
      });
    });

    /* tandai menu yang sedang dibaca */
    var links = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      document.querySelectorAll('main section[id]').forEach(function (s) { obs.observe(s); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
