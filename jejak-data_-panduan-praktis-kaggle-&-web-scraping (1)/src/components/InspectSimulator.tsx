import React, { useState } from 'react';
import { INSPECT_MOCK_ITEMS } from '../data/simulatorData';
import { Search, Code, Check, Copy, HelpCircle, Eye, Sparkles } from 'lucide-react';

export const InspectSimulator: React.FC = () => {
  const [selector, setSelector] = useState('h3 a');
  const [copiedCode, setCopiedCode] = useState(false);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  // Selector presets for easy testing
  const presets = [
    { label: 'h3 a', desc: 'Teks Judul Buku' },
    { label: 'p.price_color', desc: 'Harga Buku' },
    { label: 'p.instock', desc: 'Ketersediaan Stok' },
    { label: 'article.product_pod', desc: 'Kartu Wadah Produk' },
    { label: 'p.star-rating', desc: 'Tag Rating Bintang' },
    { label: 'a[title]', desc: 'Atribut Judul Lengkap' }
  ];

  // Logic to determine which elements match the selector
  const isMatched = (type: 'card' | 'title' | 'price' | 'rating' | 'stock' | 'link_attr'): boolean => {
    const s = selector.trim().toLowerCase();
    if (!s) return false;

    if (type === 'card' && (s === 'article' || s === '.product_pod' || s === 'article.product_pod' || s === 'article *' || s === '*')) {
      return true;
    }
    if (type === 'title' && (s === 'h3 a' || s === 'a' || s === 'h3' || s === 'article h3 a' || s === '.product_pod h3 a' || s === 'h3 > a')) {
      return true;
    }
    if (type === 'price' && (s === 'p.price_color' || s === '.price_color' || s === 'p' || s === 'article p.price_color')) {
      return true;
    }
    if (type === 'stock' && (s === 'p.instock' || s === '.instock' || s === '.availability' || s === 'p.availability' || s === 'p')) {
      return true;
    }
    if (type === 'rating' && (s === 'p.star-rating' || s === '.star-rating' || s === 'p')) {
      return true;
    }
    if (type === 'link_attr' && (s === 'a[title]' || s === '[title]' || s === 'h3 a' || s === 'a')) {
      return true;
    }
    return false;
  };

  // Build extracted data preview based on matched selector
  const getExtractedData = () => {
    const s = selector.trim().toLowerCase();
    if (!s) return [];

    if (s.includes('h3 a') || s === 'a' || s === 'h3') {
      return INSPECT_MOCK_ITEMS.map((item, idx) => ({
        id: idx + 1,
        element: '<h3><a href="...">...</a></h3>',
        extractedText: item.title,
        attribute: `title="${item.fullTitle}"`,
        pythonCode: `tag.get_text(strip=True) -> "${item.title}"`
      }));
    }

    if (s.includes('price')) {
      return INSPECT_MOCK_ITEMS.map((item, idx) => ({
        id: idx + 1,
        element: '<p class="price_color">...</p>',
        extractedText: item.price,
        attribute: 'class="price_color"',
        pythonCode: `float(tag.get_text().replace("£", "")) -> ${item.price.replace('£', '')}`
      }));
    }

    if (s.includes('instock') || s.includes('availability')) {
      return INSPECT_MOCK_ITEMS.map((item, idx) => ({
        id: idx + 1,
        element: '<p class="instock availability">...</p>',
        extractedText: item.inStockText,
        attribute: 'class="instock availability"',
        pythonCode: `"In stock" in tag.get_text() -> True`
      }));
    }

    if (s.includes('star-rating')) {
      return INSPECT_MOCK_ITEMS.map((item, idx) => ({
        id: idx + 1,
        element: `<p class="star-rating ${item.ratingWord}"></p>`,
        extractedText: `(Teks kosong, rating di class: ${item.ratingWord})`,
        attribute: `class="star-rating ${item.ratingWord}"`,
        pythonCode: `tag.get("class") -> ['star-rating', '${item.ratingWord}']`
      }));
    }

    if (s.includes('title]')) {
      return INSPECT_MOCK_ITEMS.map((item, idx) => ({
        id: idx + 1,
        element: `<a title="${item.fullTitle}">...</a>`,
        extractedText: item.fullTitle,
        attribute: `title="${item.fullTitle}"`,
        pythonCode: `tag["title"] -> "${item.fullTitle}"`
      }));
    }

    if (s.includes('article') || s.includes('pod')) {
      return INSPECT_MOCK_ITEMS.map((item, idx) => ({
        id: idx + 1,
        element: '<article class="product_pod">',
        extractedText: `[Wadah Utama Kartu Buku #${item.id}]`,
        attribute: 'class="product_pod"',
        pythonCode: `len(soup.select("article.product_pod")) -> 4`
      }));
    }

    return [];
  };

  const extractedList = getExtractedData();
  const matchedCount = extractedList.length;

  const pythonSnippet = `# Cara mengambil elemen ini di Python dengan BeautifulSoup:
import requests
from bs4 import BeautifulSoup

response = requests.get("http://books.toscrape.com/")
soup = BeautifulSoup(response.text, "html.parser")

# Mengekstrak elemen menggunakan selector '${selector}':
elemen_hasil = soup.select("${selector}")
print(f"Ditemukan {len(elemen_hasil)} elemen yang cocok!")

for item in elemen_hasil:
    # Mengambil teks yang ada di dalam elemen:
    print(item.get_text(strip=True))`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Laboratorium Interaktif Inspect Element & CSS Selector</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Uji Coba Seleksi Elemen HTML Secara Live
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Di sebelah kiri adalah simulasi halaman web toko buku latihan (<strong>books.toscrape.com</strong>).
              Ketik atau klik tombol selector di panel kanan untuk melihat elemen mana yang tersorot dan bagaimana BeautifulSoup mengekstrak datanya.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs font-mono bg-stone-200/80 text-stone-700 px-2.5 py-1 rounded">
              Tekan F12 di browser sungguhan
            </span>
          </div>
        </div>
      </div>

      {/* Split Sandbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Mock Browser View */}
        <div className="lg:col-span-6 bg-white border border-stone-300 rounded-lg shadow-sm overflow-hidden">
          {/* Mock Browser Header Bar */}
          <div className="bg-stone-200/80 px-4 py-2.5 border-b border-stone-300 flex items-center gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            </div>
            <div className="flex-1 bg-white border border-stone-300 rounded px-3 py-1 font-mono text-[11px] text-stone-700 truncate">
              http://books.toscrape.com/catalogue/category/books_1/index.html
            </div>
            <span className="text-[10px] font-mono text-stone-500 uppercase">Sandbox Web</span>
          </div>

          {/* Web Mockup Body */}
          <div className="p-4 sm:p-5 bg-stone-50/50 min-h-[500px]">
            <div className="mb-4 pb-3 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">Katalog Buku Latihan</h3>
                <p className="text-xs text-stone-500">Klik elemen mana saja untuk menyalin selectornya ke kotak uji coba</p>
              </div>
              <span className="text-xs font-mono text-stone-500">4 item terpajang</span>
            </div>

            {/* 4 Mock Book Pods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INSPECT_MOCK_ITEMS.map((item) => {
                const cardMatch = isMatched('card');
                const titleMatch = isMatched('title') || isMatched('link_attr');
                const priceMatch = isMatched('price');
                const stockMatch = isMatched('stock');
                const ratingMatch = isMatched('rating');

                return (
                  <article
                    key={item.id}
                    onMouseEnter={() => setHoveredElementId(item.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    onClick={() => setSelector('article.product_pod')}
                    className={`relative bg-white p-3.5 rounded border transition-all cursor-pointer ${
                      cardMatch 
                        ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/40' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Element tag tagger on hover */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-2">
                      <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                        &lt;article.product_pod&gt;
                      </span>
                      <span className="text-xl" aria-hidden="true">{item.thumbnail}</span>
                    </div>

                    {/* Star Rating Tag */}
                    <div
                      onClick={(e) => { e.stopPropagation(); setSelector('p.star-rating'); }}
                      className={`text-xs my-1 px-1 py-0.5 rounded transition-all cursor-pointer ${
                        ratingMatch
                          ? 'ring-2 ring-emerald-500 bg-emerald-100 text-emerald-900 font-bold'
                          : 'text-amber-500'
                      }`}
                      title={`<p class="star-rating ${item.ratingWord}">`}
                    >
                      {'★'.repeat(item.ratingStars)}{'☆'.repeat(5 - item.ratingStars)}
                      <span className="text-[10px] font-mono text-stone-500 ml-1.5">
                        ({item.ratingWord})
                      </span>
                    </div>

                    {/* Book Title */}
                    <h4 className="mt-1">
                      <a
                        href="#inspect"
                        onClick={(e) => { e.stopPropagation(); setSelector('h3 a'); }}
                        title={item.fullTitle}
                        className={`text-sm font-semibold block leading-snug px-1 py-0.5 rounded transition-all ${
                          titleMatch
                            ? 'ring-2 ring-sky-500 bg-sky-100 text-sky-950 font-bold'
                            : 'text-stone-900 hover:text-amber-700'
                        }`}
                      >
                        {item.title}
                      </a>
                    </h4>

                    {/* Price and Stock */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                      <p
                        onClick={(e) => { e.stopPropagation(); setSelector('p.price_color'); }}
                        className={`text-sm font-mono font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                          priceMatch
                            ? 'ring-2 ring-violet-500 bg-violet-100 text-violet-950'
                            : 'text-stone-800'
                        }`}
                        title='<p class="price_color">'
                      >
                        {item.price}
                      </p>

                      <p
                        onClick={(e) => { e.stopPropagation(); setSelector('p.instock'); }}
                        className={`text-xs px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                          stockMatch
                            ? 'ring-2 ring-emerald-500 bg-emerald-100 text-emerald-950 font-bold'
                            : 'text-emerald-700'
                        }`}
                        title='<p class="instock availability">'
                      >
                        ● {item.inStockText}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* DOM Inspector Tip */}
            <div className="mt-4 p-3 bg-stone-100 border border-stone-200 rounded text-xs text-stone-600 flex items-start gap-2">
              <Eye className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
              <div>
                <strong>Tips Rahasia Atribut:</strong> Judul buku di kartu sengaja terpotong dengan tanda titik-titik (<code>...</code>).
                Coba uji selector <code>a[title]</code> untuk melihat bagaimana BeautifulSoup dapat membaca judul aslinya yang lengkap melalui atribut <code>title</code>!
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Selector Tester & Extraction Panel */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Controls Box */}
          <div className="bg-white border border-stone-300 rounded-lg p-5 shadow-sm">
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1.5">
              Tulis CSS Selector Anda
            </label>
            <div className="relative">
              <input
                type="text"
                value={selector}
                onChange={(e) => setSelector(e.target.value)}
                placeholder="Contoh: h3 a, p.price_color, article.product_pod"
                className="w-full pl-9 pr-24 py-2.5 font-mono text-sm bg-stone-50 border border-stone-300 rounded focus:border-amber-500 focus:bg-white focus:outline-none transition-colors"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <button
                onClick={() => setSelector('')}
                className="absolute right-2.5 top-2.5 px-2 py-1 text-xs text-stone-500 hover:text-stone-800 bg-stone-200/70 rounded cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Preset Buttons */}
            <div className="mt-3">
              <span className="text-xs text-stone-500 font-sans block mb-1.5">Preset Populer untuk Dicoba:</span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSelector(p.label)}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                      selector === p.label
                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                        : 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                    }`}
                    title={p.desc}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Match Status Badge */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-stone-500">Status Pencocokan:</span>
                <span className={`px-2 py-0.5 rounded font-mono font-medium ${
                  matchedCount > 0 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {matchedCount > 0 ? `${matchedCount} elemen cocok ditemukan` : '0 elemen cocok'}
                </span>
              </div>
              <span className="text-stone-400 font-mono text-[11px]">soup.select("{selector}")</span>
            </div>
          </div>

          {/* Extracted Data Table */}
          <div className="bg-white border border-stone-300 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-800">
                <Code className="w-3.5 h-3.5 text-amber-600" />
                <span>Hasil Ekstraksi Data Tabular (Preview)</span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">{matchedCount} Baris Data</span>
            </div>

            {matchedCount > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px]">
                      <th className="py-2 px-3 w-10">No</th>
                      <th className="py-2 px-3">Teks yang Terekstrak</th>
                      <th className="py-2 px-3">Atribut Terdeteksi</th>
                      <th className="py-2 px-3">Kode Python (BeautifulSoup)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {extractedList.map((row) => (
                      <tr key={row.id} className="hover:bg-amber-50/30">
                        <td className="py-2.5 px-3 text-stone-400 font-medium">{row.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-stone-900 font-sans">{row.extractedText}</td>
                        <td className="py-2.5 px-3 text-stone-600 text-[11px]">{row.attribute}</td>
                        <td className="py-2.5 px-3 text-sky-800 text-[11px] bg-stone-50/50">{row.pythonCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 text-xs">
                <p>Tidak ada elemen yang cocok dengan selector <code>"{selector}"</code>.</p>
                <p className="mt-1 text-stone-400">Coba pilih preset seperti <code>h3 a</code> atau <code>p.price_color</code> di atas.</p>
              </div>
            )}
          </div>

          {/* Python Code Snippet Box */}
          <div className="bg-[#111927] border border-stone-800 rounded-lg p-4 text-stone-200 text-xs shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 font-mono text-[11px] text-stone-400">
              <span>Cuplikan Kode Python yang Terbentuk</span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Skrip'}</span>
              </button>
            </div>
            <pre className="font-mono text-[12px] leading-relaxed overflow-x-auto text-amber-200/90 whitespace-pre">
              {pythonSnippet}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
};
