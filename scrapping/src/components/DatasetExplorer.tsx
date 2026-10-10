import React, { useState, useMemo } from 'react';
import { MOCK_BOOKS_DATASET } from '../data/simulatorData';
import { ScrapedBookItem } from '../types';
import { Table2, Search, ArrowUpDown, Filter, Download, BarChart3, BookOpen, Layers } from 'lucide-react';

export const DatasetExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc'>('price-asc');
  const [activeChartTab, setActiveChartTab] = useState<'category' | 'priceRange'>('category');

  // Available unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    MOCK_BOOKS_DATASET.forEach((b) => set.add(b.category));
    return ['Semua', ...Array.from(set).sort()];
  }, []);

  // Filter & sort logic
  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS_DATASET.filter((b) => {
      // Search title
      if (searchQuery.trim() && !b.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'Semua' && b.category !== selectedCategory) {
        return false;
      }
      // Stock filter
      if (stockFilter === 'inStock' && !b.inStock) return false;
      if (stockFilter === 'outOfStock' && b.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [searchQuery, selectedCategory, stockFilter, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = filteredBooks.length;
    if (total === 0) return { total: 0, avgPrice: 0, inStockPercent: 0, avgRating: 0 };

    const totalPrice = filteredBooks.reduce((acc, b) => acc + b.price, 0);
    const inStockCount = filteredBooks.filter((b) => b.inStock).length;
    const totalRating = filteredBooks.reduce((acc, b) => acc + b.rating, 0);

    return {
      total,
      avgPrice: (totalPrice / total).toFixed(2),
      inStockPercent: Math.round((inStockCount / total) * 100),
      avgRating: (totalRating / total).toFixed(1)
    };
  }, [filteredBooks]);

  // Category chart distribution data
  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredBooks.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredBooks]);

  // Price range distribution data
  const priceRangeDistribution = useMemo(() => {
    const under20 = filteredBooks.filter((b) => b.price < 20).length;
    const between20and40 = filteredBooks.filter((b) => b.price >= 20 && b.price <= 40).length;
    const over40 = filteredBooks.filter((b) => b.price > 40).length;
    return [
      { label: '< £20 (Terjangkau)', count: under20 },
      { label: '£20 - £40 (Menengah)', count: between20and40 },
      { label: '> £40 (Premium)', count: over40 }
    ];
  }, [filteredBooks]);

  // Export current filtered dataset to CSV
  const handleExportCSV = () => {
    const headers = ['id', 'judul', 'kategori', 'harga_gbp', 'rating_bintang', 'tersedia', 'upc'];
    const rows = filteredBooks.map((b) => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.category}"`,
      b.price,
      b.rating,
      b.inStock,
      `"${b.upc}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'eksplorasi_buku_tersaring.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">
              <Table2 className="w-3.5 h-3.5" />
              <span>Laboratorium Analisis Data Pasca-Scraping</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Eksplorasi & Visualisasi Data Hasil Koleksi
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Scraping hanyalah permulaan! Bagian paling bernilai adalah saat data yang berhasil diambil diubah menjadi wawasan (insights): penyaringan, pengurutan, perhitungan statistik, dan visualisasi distribusi.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-mono text-stone-500 block uppercase">Total Buku Terpilih</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{stats.total}</div>
          <span className="text-[11px] text-stone-400">Dari 15 buku simulasi</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-mono text-stone-500 block uppercase">Rata-rata Harga</span>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">£{stats.avgPrice}</div>
          <span className="text-[11px] text-stone-400">df['harga_gbp'].mean()</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-mono text-stone-500 block uppercase">Stok Tersedia</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{stats.inStockPercent}%</div>
          <span className="text-[11px] text-stone-400">Status in-stock</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-mono text-stone-500 block uppercase">Rata-rata Rating</span>
          <div className="text-2xl font-bold font-mono text-sky-700 mt-1">{stats.avgRating} / 5</div>
          <span className="text-[11px] text-stone-400">Rating bintang</span>
        </div>
      </div>

      {/* Visual Chart & Distribution Section */}
      <div className="bg-white border border-stone-300 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-bold text-stone-900 text-sm">
              Visualisasi Distribusi Sederhana
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded text-xs font-mono">
            <button
              onClick={() => setActiveChartTab('category')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeChartTab === 'category' ? 'bg-white text-stone-900 font-bold shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Per Kategori
            </button>
            <button
              onClick={() => setActiveChartTab('priceRange')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeChartTab === 'priceRange' ? 'bg-white text-stone-900 font-bold shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Rentang Harga
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        {activeChartTab === 'category' ? (
          <div className="space-y-2.5 pt-1">
            {categoryDistribution.map(([cat, count]) => {
              const maxCount = Math.max(...categoryDistribution.map(([, c]) => c), 1);
              const percentage = Math.round((count / maxCount) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-700 font-medium">{cat}</span>
                    <span className="text-stone-500">{count} buku</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {priceRangeDistribution.map((range) => {
              const maxCount = Math.max(...priceRangeDistribution.map((r) => r.count), 1);
              const percentage = Math.round((range.count / maxCount) * 100);
              return (
                <div key={range.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-700 font-medium">{range.label}</span>
                    <span className="text-stone-500">{range.count} buku</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-3.5 overflow-hidden border border-stone-200">
                    <div
                      className="bg-sky-600 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-stone-300 rounded-lg p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Search by Title */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku..."
              className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filter Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Kategori: {cat}
              </option>
            ))}
          </select>

          {/* Filter Stock */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Semua Ketersediaan</option>
            <option value="inStock">Hanya In-Stock</option>
            <option value="outOfStock">Hanya Habis (Out of Stock)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer font-mono"
          >
            <option value="price-asc">Harga: Murah ke Mahal</option>
            <option value="price-desc">Harga: Mahal ke Murah</option>
            <option value="rating-desc">Rating: Tertinggi (5 ke 1)</option>
            <option value="title-asc">Judul: A ke Z</option>
          </select>
        </div>

        {/* Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono">
            Menampilkan {filteredBooks.length} dari {MOCK_BOOKS_DATASET.length} baris dataset
          </span>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-stone-800 font-medium cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Hasil Saring (.csv)</span>
          </button>
        </div>
      </div>

      {/* Dataset Table View */}
      <div className="bg-white border border-stone-300 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-200 font-mono text-[11px] text-stone-600">
                <th className="py-2.5 px-3 w-10">ID</th>
                <th className="py-2.5 px-3">Judul Buku</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-right">Harga (GBP)</th>
                <th className="py-2.5 px-3 text-center">Rating</th>
                <th className="py-2.5 px-3 text-center">Stok</th>
                <th className="py-2.5 px-3 font-mono text-[10px]">UPC Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-stone-400">{book.id}</td>
                  <td className="py-2.5 px-3 font-medium text-stone-900">{book.title}</td>
                  <td className="py-2.5 px-3 text-stone-600">
                    <span className="font-mono text-[11px]">{book.category}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-800 text-right">
                    £{book.price.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-amber-500 font-mono text-[11px]">
                    {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono ${
                        book.inStock
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {book.inStock ? `Ada (${book.stockCount})` : 'Habis'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-stone-400">
                    {book.upc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
