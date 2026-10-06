(function () {
  if (document.documentElement.dataset.trackerMenuInitialized === 'true') return;
  document.documentElement.dataset.trackerMenuInitialized = 'true';

  const trackerUrl = 'https://tracker-lamaran-2026.vercel.app/';
  const menuEntries = [
    { href: 'index.html', label: 'Vocabulary' },
    { href: 'mandarin.html', label: 'Vocabulary Mandarin' },
    { href: 'convert.html', label: 'Convert' },
    { href: 'fgd.html', label: 'FGD' },
    { href: 'dod.html', label: 'Tanya (DOD)' },
    { href: 'supply.html', label: 'Supply' },
    { href: 'publicspeaking.html', label: 'Public Speaking' },
    { href: 'chunk.html', label: 'ChunkSpeak' },
    { href: 'material.html', label: 'Material' },
    { href: 'objects.html', label: 'Object English' },
    { href: 'kbbi.html', label: 'KBBI' },
    { href: 'transcript.html', label: 'Transcript' },
    { href: 'pranikah.html', label: 'Pranikah' },
    { href: 'psikotest.html', label: 'Psikotest' },
    { href: 'journal.html', label: 'Jurnal Harian' },
    { href: 'note.html', label: 'Catatan' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .tracker-menu-link {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #dfe7f2;
      color: #1e293b;
      text-decoration: none;
      font-weight: 700;
      font-size: .82rem;
      white-space: nowrap;
      transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    }
    .tracker-menu-link:hover {
      background: #eef2ff;
      color: #312e81;
      border-color: #c7d2fe;
      transform: translateY(-1px);
    }
    .tracker-menu-link--active {
      background: #eafaf1;
      color: #166534;
      border-color: #b7e4c7;
    }
    .tracker-menu-link--tracker {
      background: #fff7ed;
      border-color: #fed7aa;
      color: #9a4d06;
    }
    .tracker-menu-link--tracker:hover {
      background: #ffedd5;
      color: #7c2d12;
      border-color: #fdba74;
    }
    @media (max-width: 820px) {
      .global-nav {
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        overflow-x: auto;
      }
    }
  `;
  document.head.appendChild(style);

  let navigation = document.querySelector('.global-nav, body > nav.nav');
  if (!navigation) {
    navigation = document.createElement('nav');
    navigation.className = 'global-nav';
    navigation.setAttribute('aria-label', 'Menu navigasi utama');
    navigation.style.cssText = 'position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.92);backdrop-filter:blur(10px);border-bottom:1px solid #e5e7eb;padding:12px 20px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;box-shadow:0 8px 18px rgba(15,23,42,0.04);';
    document.body.insertBefore(navigation, document.body.firstElementChild);
  }

  navigation.classList.remove('hidden');
  navigation.removeAttribute('hidden');
  navigation.replaceChildren();

  const navEntries = menuEntries.map(({ href, label }) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    link.className = 'tracker-menu-link';
    if (window.location.pathname.endsWith(href) || (href === 'index.html' && (window.location.pathname.endsWith('/') || window.location.pathname === '/'))) {
      link.classList.add('tracker-menu-link--active');
    }
    return link;
  });

  navEntries.forEach((link) => navigation.appendChild(link));

  const trackerLink = navigation.querySelector('a[href="https://tracker-lamaran-2026.vercel.app/"]');
  if (!trackerLink) {
    const trackLink = document.createElement('a');
    trackLink.href = trackerUrl;
    trackLink.target = '_blank';
    trackLink.rel = 'noopener noreferrer';
    trackLink.className = 'tracker-menu-link tracker-menu-link--tracker';
    trackLink.textContent = 'Tracker Lamaran';
    trackLink.setAttribute('aria-label', 'Buka Tracker Lamaran');
    const insertAfter = navigation.querySelector('a[href="journal.html"]') || navigation.querySelector('a[href="psikotest.html"]') || navigation.lastElementChild;
    if (insertAfter) {
      insertAfter.insertAdjacentElement('afterend', trackLink);
    } else {
      navigation.appendChild(trackLink);
    }
  }
})();
