import React, { useState, useMemo } from 'react';
import { rawSalesDataset, downloadCsv } from '../../data/mockDatasets';
import { SalesRecord } from '../../types';
import { 
  PieChart, 
  Filter, 
  Calendar, 
  RotateCcw, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  Download,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DashboardStudio: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [drilldownCategory, setDrilldownCategory] = useState<string | null>(null);

  // Filtered dataset calculation
  const filteredData = useMemo(() => {
    return rawSalesDataset.filter(r => {
      const matchRegion = selectedRegion === 'All' || r.region === selectedRegion;
      const matchCategory = selectedCategory === 'All' || r.category === selectedCategory;
      const matchSegment = selectedSegment === 'All' || r.segment === selectedSegment;
      const matchDrill = !drilldownCategory || r.category === drilldownCategory;
      return matchRegion && matchCategory && matchSegment && matchDrill;
    });
  }, [selectedRegion, selectedCategory, selectedSegment, drilldownCategory]);

  // Aggregate Metrics
  const totalSales = useMemo(() => filteredData.reduce((acc, r) => acc + r.salesAmount, 0), [filteredData]);
  const totalCost = useMemo(() => filteredData.reduce((acc, r) => acc + r.cost, 0), [filteredData]);
  const totalProfit = useMemo(() => filteredData.reduce((acc, r) => acc + r.profit, 0), [filteredData]);
  const totalOrders = useMemo(() => new Set(filteredData.map(r => r.orderId)).size, [filteredData]);
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

  // Monthly Sales Aggregation
  const monthlyAgg = useMemo(() => {
    const map: Record<string, number> = {};
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
    months.forEach(m => { map[m] = 0; });
    
    filteredData.forEach(r => {
      const ym = r.orderDate.slice(0, 7);
      if (map[ym] !== undefined) {
        map[ym] += r.salesAmount;
      }
    });

    return Object.entries(map).map(([month, sales]) => ({
      month: month.split('-')[1], // '01', '02', etc.
      monthLabel: new Date(`${month}-01`).toLocaleDateString('id-ID', { month: 'short' }),
      sales: Math.round(sales / 1000000) // in Millions
    }));
  }, [filteredData]);

  // Category Breakdown
  const categoryAgg = useMemo(() => {
    const map: Record<string, { sales: number; profit: number }> = {};
    filteredData.forEach(r => {
      if (!map[r.category]) map[r.category] = { sales: 0, profit: 0 };
      map[r.category].sales += r.salesAmount;
      map[r.category].profit += r.profit;
    });

    return Object.entries(map).map(([cat, val]) => ({
      category: cat,
      sales: Math.round(val.sales / 1000000),
      profit: Math.round(val.profit / 1000000),
      margin: val.sales > 0 ? Number(((val.profit / val.sales) * 100).toFixed(1)) : 0
    }));
  }, [filteredData]);

  // Regional Breakdown
  const regionalAgg = useMemo(() => {
    const map: Record<string, { sales: number; profit: number }> = {};
    filteredData.forEach(r => {
      if (!map[r.region]) map[r.region] = { sales: 0, profit: 0 };
      map[r.region].sales += r.salesAmount;
      map[r.region].profit += r.profit;
    });

    return Object.entries(map).map(([reg, val]) => ({
      region: reg,
      sales: Math.round(val.sales / 1000000),
      profit: Math.round(val.profit / 1000000)
    })).sort((a, b) => b.sales - a.sales);
  }, [filteredData]);

  // Top 10 Products
  const topProducts = useMemo(() => {
    const map: Record<string, { product: string; category: string; sales: number; profit: number }> = {};
    filteredData.forEach(r => {
      if (!map[r.product]) {
        map[r.product] = { product: r.product, category: r.category, sales: 0, profit: 0 };
      }
      map[r.product].sales += r.salesAmount;
      map[r.product].profit += r.profit;
    });

    return Object.values(map)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8);
  }, [filteredData]);

  const handleResetFilters = () => {
    setSelectedRegion('All');
    setSelectedCategory('All');
    setSelectedSegment('All');
    setDrilldownCategory(null);
  };

  const maxMonthSales = Math.max(...monthlyAgg.map(m => m.sales), 1);
  const maxCatSales = Math.max(...categoryAgg.map(c => c.sales), 1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 11 LAB</span>
              <span>·</span>
              <span>EXECUTIVE BI DASHBOARD</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Studio Dashboard Penjualan Interaktif
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Simulasi kanvas dashboard Power BI Desktop. Semua kartu KPI, grafik batang, tren garis, dan tabel peringkat terhubung ke semantic model yang sama dan saling merespons filter secara instan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCsv('Filtered_Dashboard_Export.csv', filteredData)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ekspor Data Aktif</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 border border-slate-800 rounded-lg flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Global Slicers Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800/80 text-xs">
          {/* Region Slicer */}
          <div>
            <label className="text-slate-400 block text-[11px] font-mono mb-1">Wilayah Penjualan (Slicer):</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">Semua Wilayah (Nasional)</option>
              <option value="Jawa">Jawa</option>
              <option value="Sumatera">Sumatera</option>
              <option value="Kalimantan">Kalimantan</option>
              <option value="Sulawesi">Sulawesi</option>
              <option value="Bali & Nusa Tenggara">Bali & Nusa Tenggara</option>
            </select>
          </div>

          {/* Category Slicer */}
          <div>
            <label className="text-slate-400 block text-[11px] font-mono mb-1">Kategori Produk (Slicer):</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">Semua Kategori</option>
              <option value="Technology">Technology</option>
              <option value="Furniture">Furniture</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>

          {/* Segment Slicer */}
          <div>
            <label className="text-slate-400 block text-[11px] font-mono mb-1">Segmen Pelanggan (Slicer):</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="All">Semua Segmen</option>
              <option value="Corporate">Corporate (B2B)</option>
              <option value="Consumer">Consumer (Ritel)</option>
              <option value="Home Office">Home Office</option>
            </select>
          </div>
        </div>

        {/* Drilldown indicator */}
        {drilldownCategory && (
          <div className="mt-3 p-2 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drill-down Aktif pada Kategori: <strong>{drilldownCategory}</strong></span>
            </div>
            <button
              onClick={() => setDrilldownCategory(null)}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              Kembali ke Level Atas
            </button>
          </div>
        )}
      </div>

      {/* Warning for tiny sample */}
      {filteredData.length < 3 && (
        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Peringatan Sampel Kecil: Filter saat ini hanya menyisakan {filteredData.length} transaksi. Kesimpulan statistik mungkin kurang representatif.</span>
        </div>
      )}

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Sales */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">TOTAL SALES (YTD)</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight text-cyan-300">
            Rp {(totalSales / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Juta
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.8% vs Target Tahun Lalu</span>
          </div>
        </div>

        {/* KPI 2: Total Profit */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">TOTAL LABA BERSIH</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight text-emerald-300">
            Rp {(totalProfit / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Juta
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>COGS: Rp {(totalCost / 1000000).toFixed(0)} Juta</span>
          </div>
        </div>

        {/* KPI 3: Profit Margin % */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">PROFIT MARGIN %</span>
            <Percent className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight text-indigo-300">
            {profitMargin.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className={profitMargin >= 20 ? 'text-emerald-400' : 'text-amber-400'}>
              Target: 20.0% (Standar Industri)
            </span>
          </div>
        </div>

        {/* KPI 4: Total Orders */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">VOLUME PESANAN</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight text-purple-300">
            {totalOrders} Pesanan
          </div>
          <div className="text-[11px] text-slate-400">
            <span>AOV: Rp {totalOrders > 0 ? ((totalSales / totalOrders) / 1000000).toFixed(1) : 0} Juta / Order</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Monthly Trend & Category Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Trend Line / Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white font-display">
                Tren Penjualan Bulanan (Juta Rupiah)
              </h2>
              <span className="text-[11px] text-slate-400">
                Line & Column Hybrid — Evaluasi Musiman
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">Tahun 2024</span>
          </div>

          {/* Monthly Trend Visual */}
          <div className="h-48 w-full bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-end gap-2 justify-between">
            {monthlyAgg.map((item, idx) => {
              const barHeight = Math.max(8, Math.round((item.sales / maxMonthSales) * 88));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 px-2 py-1 bg-slate-800 text-[10px] text-white rounded shadow-lg whitespace-nowrap pointer-events-none font-mono">
                    {item.monthLabel}: Rp {item.sales} Juta
                  </div>

                  <div 
                    className="w-full bg-cyan-500/70 group-hover:bg-cyan-400 rounded-t transition-all"
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[9px] text-slate-400 font-mono mt-1 group-hover:text-cyan-300">
                    {item.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sales & Profit by Category (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white font-display">
                Penjualan Berdasarkan Kategori
              </h2>
              <span className="text-[11px] text-slate-400">
                Klik kategori untuk simulasi Drill-Down
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Interaktif</span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryAgg.map((cat, idx) => {
              const barWidth = Math.max(10, Math.round((cat.sales / maxCatSales) * 100));
              const isSelected = drilldownCategory === cat.category;

              return (
                <div 
                  key={idx} 
                  onClick={() => setDrilldownCategory(isSelected ? null : cat.category)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-sm' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-200">{cat.category}</span>
                    <span className="font-mono text-cyan-300 font-bold">Rp {cat.sales} Juta</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Laba: Rp {cat.profit} Juta</span>
                    <span className={cat.margin < 15 ? 'text-amber-400' : 'text-emerald-400'}>
                      Margin: {cat.margin}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Products Table & Regional Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top 8 Products Table (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-display">
              Peringkat Produk Teratas (Top Products)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Diurutkan Berdasarkan Nilai Omzet
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 text-slate-400 font-mono">
                <tr>
                  <th className="p-2.5 border-b border-slate-800">Produk</th>
                  <th className="p-2.5 border-b border-slate-800">Kategori</th>
                  <th className="p-2.5 border-b border-slate-800 text-right">Penjualan</th>
                  <th className="p-2.5 border-b border-slate-800 text-right">Laba Bersih</th>
                  <th className="p-2.5 border-b border-slate-800 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {topProducts.map((p, idx) => {
                  const marginPct = p.sales > 0 ? (p.profit / p.sales) * 100 : 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-medium text-slate-100 flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono w-4">{idx + 1}.</span>
                        <span>{p.product}</span>
                      </td>
                      <td className="p-2.5 text-slate-400 font-mono text-[11px]">{p.category}</td>
                      <td className="p-2.5 text-right font-mono text-cyan-300 font-semibold">
                        Rp {(p.sales / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}M
                      </td>
                      <td className={`p-2.5 text-right font-mono font-medium ${p.profit < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        Rp {(p.profit / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}M
                      </td>
                      <td className={`p-2.5 text-right font-mono font-bold ${marginPct < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {marginPct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Ranking & Auto Insight (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
            <h2 className="text-sm font-bold text-white font-display pb-2 border-b border-slate-800">
              Kontribusi Wilayah Penjualan
            </h2>

            <div className="space-y-2 text-xs">
              {regionalAgg.map((r, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">{r.region}</span>
                  <div className="text-right font-mono">
                    <span className="text-cyan-300 font-semibold">Rp {r.sales}M</span>
                    <span className="text-[10px] text-slate-400 block">Laba: Rp {r.profit}M</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Automated Insight Card */}
            <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Insight Dashboard Otomatis:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {profitMargin < 15
                  ? "Perhatian: Profit Margin rata-rata di bawah target 15%. Disarankan memeriksa kategori Furnitur yang mencatatkan margin tertekan."
                  : "Performa Sangat Kuat: Dominasi produk Technology di segmen Corporate memberikan marjin sehat di atas 20%."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
