(function () {
  if (document.documentElement.dataset.trackerMenuInitialized === 'true') return;
  document.documentElement.dataset.trackerMenuInitialized = 'true';

  const categories = [
    {
      pages: [
        'vocabulary.html',
        'objects.html',
        'chunk.html',
        'journal.html',
        'note.html',
        'kbbi.html',
        'toefl/listening.html',
        ...Array.from({ length: 18 }, (_, index) => `toefl/kartu${index + 1}.html`)
      ],
      entries: [
        { href: 'vocabulary.html', label: 'Vocabulary' },
        { href: 'objects.html', label: 'Object English' },
        { href: 'chunk.html', label: 'Chunk Speak' },
        { href: 'journal.html', label: 'Jurnal Harian' },
        { href: 'note.html', label: 'Catatan' },
        { href: 'kbbi.html', label: 'KBBI' },
        { href: 'toefl/listening.html', label: 'TOEFL Listening' }
      ]
    },
    {
      pages: [
        'psikotest.html',
        'fgd.html',
        'convert.html',
        'dod.html',
        'lamaran.html',
        'transcript.html',
        'jejak-data/index.html',
        'financial/index.html',
        'financial/dist/index.html',
        'finmetrics/index.html',
        'finmetrics/dist/index.html',
        'power-bi-academy-—-from-beginner-to-data-analyst (1)/index.html',
        'power-bi-academy-—-from-beginner-to-data-analyst (1)/dist/index.html',
        'scrapping/index.html',
        'scrapping/dist/index.html',
        'scrapping/jejak-data-ambil-data/index.html'
      ],
      entries: [
        { href: 'psikotest.html', label: 'Psikotest' },
        { href: 'fgd.html', label: 'FGD' },
        { href: 'convert.html', label: 'Convert' },
        { href: 'dod.html', label: 'Tanya (DOD)' },
        { href: 'lamaran.html', label: 'Lamaran Kerja' },
        { href: 'transcript.html', label: 'Transcript' },
        { href: 'jejak-data/index.html', label: 'Jejak Data' },
        { href: 'financial/dist/index.html', label: 'Financial Analysis Lab' },
        { href: 'finmetrics/dist/index.html', label: 'FinMetrics Lab' },
        { href: 'power-bi-academy-—-from-beginner-to-data-analyst (1)/dist/index.html', label: 'Power BI Academy' },
        { href: 'scrapping/dist/index.html', label: 'Scraping & Ambil Data' }
      ]
    },
    {
      pages: [
        'mandarin.html',
        'material.html',
        'supply.html',
        'publicspeaking.html',
        'pranikah.html',
        'pajak.html',
        ...Array.from({ length: 25 }, (_, index) => `pajak/pajak${index + 1}.html`),
        'ekonomi/INDONIA.html',
        'ekonomi/bi-rate.html',
        'ekonomi/ikhtisar.html',
        'ekonomi/ikhtisar2.html',
        'ekonomi/indikatormoneter.html',
        'ekonomi/inflasi.html',
        'ekonomi/jisdor.html',
        'ekonomi/keuanganhijau.html',
        'ekonomi/keuanganinklusif.html',
        'ekonomi/koordinasibi.html',
        'ekonomi/krisismanajemen.html',
        'ekonomi/makroprudensial.html',
        'ekonomi/moneter.html',
        'ekonomi/operasimoneter.html',
        'ekonomi/pasaruang.html',
        'ekonomi/profilbi.html',
        'ekonomi/umkm.html',
        'investment bank/akuntansiperbankan2.html',
        'investment bank/dasarbanking1.html',
        'investment bank/rasiokeuangan4.html',
        'investment bank/risikoperbankan3.html'
      ],
      entries: [
        { href: 'mandarin.html', label: 'Vocabulary Mandarin' },
        { href: 'material.html', label: 'Material' },
        { href: 'supply.html', label: 'Supply' },
        { href: 'publicspeaking.html', label: 'Public Speaking' },
        { href: 'pranikah.html', label: 'Pranikah' },
        { href: 'pajak.html', label: 'Materi Pajak' },
        { href: 'ekonomi/indikatormoneter.html', label: 'Indikator Moneter' },
        { href: 'ekonomi/ikhtisar.html', label: 'Ekonomi' },
        { href: 'investment bank/dasarbanking1.html', label: 'Dasar Perbankan' }
      ]
    }
  ];
  const scriptUrl = document.currentScript?.src;
  const rootUrl = new URL('.', scriptUrl || window.location.href);
  const rootPath = decodeURIComponent(rootUrl.pathname).replace(/\/+$/, '') + '/';
  const currentPath = decodeURIComponent(window.location.pathname)
    .replace(/\\/g, '/')
    .toLowerCase();
  const currentPage = currentPath.startsWith(rootPath.toLowerCase())
    ? currentPath.slice(rootPath.length).replace(/^\/+/, '')
    : currentPath.split('/').pop() || '';
  const currentCategory = categories.find(({ pages }) =>
    pages.some((page) => page.toLowerCase() === currentPage)
  );

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
    @media (max-width: 820px) {
      .global-nav {
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        overflow-x: auto;
      }
    }
  `;
  document.head.appendChild(style);

  let navigation = document.querySelector('.global-nav');
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

  const homeLink = document.createElement('a');
  homeLink.href = new URL('index.html', rootUrl).href;
  homeLink.textContent = 'Beranda';
  homeLink.className = 'tracker-menu-link';
  navigation.appendChild(homeLink);

  const navEntries = (currentCategory ? currentCategory.entries : []).map((entry) => {
    const { href, label } = entry;
    const link = document.createElement('a');
    link.href = new URL(href, rootUrl).href;
    link.textContent = label;
    link.className = 'tracker-menu-link';
    if (currentPage === href) {
      link.classList.add('tracker-menu-link--active');
    }
    return link;
  });

  navEntries.forEach((link) => navigation.appendChild(link));
})();
