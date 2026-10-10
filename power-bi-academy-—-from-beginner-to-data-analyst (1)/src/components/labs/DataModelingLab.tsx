import React, { useState } from 'react';
import { 
  Boxes, 
  ArrowRight, 
  Key, 
  Filter, 
  HelpCircle, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface SchemaTable {
  id: string;
  name: string;
  type: 'Fact' | 'Dimension';
  color: string;
  columns: { name: string; isKey?: 'PK' | 'FK'; type: string }[];
}

export const DataModelingLab: React.FC = () => {
  const [selectedFilterDimension, setSelectedFilterDimension] = useState<string>('products');
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>('Technology');
  const [crossFilterDirection, setCrossFilterDirection] = useState<'Single' | 'Both'>('Single');
  const [activeRelationship, setActiveRelationship] = useState<string>('rel_products');

  const schemaTables: SchemaTable[] = [
    {
      id: 'products',
      name: 'DimProducts',
      type: 'Dimension',
      color: 'indigo',
      columns: [
        { name: 'ProductID', isKey: 'PK', type: 'Int' },
        { name: 'ProductName', type: 'Text' },
        { name: 'Category', type: 'Text' },
        { name: 'SubCategory', type: 'Text' },
        { name: 'BasePrice', type: 'Currency' }
      ]
    },
    {
      id: 'customers',
      name: 'DimCustomers',
      type: 'Dimension',
      color: 'cyan',
      columns: [
        { name: 'CustomerID', isKey: 'PK', type: 'Int' },
        { name: 'CustomerName', type: 'Text' },
        { name: 'Segment', type: 'Text' },
        { name: 'City', type: 'Text' }
      ]
    },
    {
      id: 'sales',
      name: 'FactSales',
      type: 'Fact',
      color: 'purple',
      columns: [
        { name: 'OrderID', isKey: 'PK', type: 'Text' },
        { name: 'DateKey', isKey: 'FK', type: 'Date' },
        { name: 'ProductID', isKey: 'FK', type: 'Int' },
        { name: 'CustomerID', isKey: 'FK', type: 'Int' },
        { name: 'RegionID', isKey: 'FK', type: 'Int' },
        { name: 'Quantity', type: 'Int' },
        { name: 'SalesAmount', type: 'Currency' },
        { name: 'Profit', type: 'Currency' }
      ]
    },
    {
      id: 'regions',
      name: 'DimRegions',
      type: 'Dimension',
      color: 'emerald',
      columns: [
        { name: 'RegionID', isKey: 'PK', type: 'Int' },
        { name: 'RegionName', type: 'Text' },
        { name: 'IslandGroup', type: 'Text' }
      ]
    },
    {
      id: 'calendar',
      name: 'DimCalendar',
      type: 'Dimension',
      color: 'amber',
      columns: [
        { name: 'DateKey', isKey: 'PK', type: 'Date' },
        { name: 'Year', type: 'Int' },
        { name: 'Quarter', type: 'Text' },
        { name: 'MonthName', type: 'Text' }
      ]
    }
  ];

  // Simulated row counts based on filter
  const getFilteredFactCount = () => {
    if (selectedFilterDimension === 'products') {
      if (selectedFilterValue === 'Technology') return { rows: 14, sales: 'Rp 672.450.000' };
      if (selectedFilterValue === 'Furniture') return { rows: 8, sales: 'Rp 127.400.000' };
      return { rows: 8, sales: 'Rp 40.070.000' };
    }
    if (selectedFilterDimension === 'regions') {
      if (selectedFilterValue === 'Jawa') return { rows: 16, sales: 'Rp 512.000.000' };
      return { rows: 14, sales: 'Rp 327.920.000' };
    }
    return { rows: 30, sales: 'Rp 839.920.000' };
  };

  const filteredStats = getFilteredFactCount();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 5 LAB</span>
              <span>·</span>
              <span>RELATIONAL DATA MODELING</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Data Modeling & Star Schema Visualizer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pahami arsitektur Star Schema, relasi One-to-Many (1:*), Primary Key & Foreign Key, serta cara filter mengalir (Filter Propagation) di antara tabel dimensi dan tabel fakta.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              Model View Simulator
            </span>
          </div>
        </div>

        {/* Filter Propagation Controls */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Uji Filter Propagation:</span>
          
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setSelectedFilterDimension('products');
                setSelectedFilterValue('Technology');
              }}
              className={`px-3 py-1 text-xs rounded font-medium transition-all ${
                selectedFilterDimension === 'products'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Filter DimProducts [Category = "Technology"]
            </button>
            <button
              onClick={() => {
                setSelectedFilterDimension('regions');
                setSelectedFilterValue('Jawa');
              }}
              className={`px-3 py-1 text-xs rounded font-medium transition-all ${
                selectedFilterDimension === 'regions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Filter DimRegions [Region = "Jawa"]
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-400">Filter Direction:</span>
            <button
              onClick={() => setCrossFilterDirection(crossFilterDirection === 'Single' ? 'Both' : 'Single')}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                crossFilterDirection === 'Single'
                  ? 'bg-slate-800 border-slate-700 text-cyan-300'
                  : 'bg-amber-950/60 border-amber-600/50 text-amber-300'
              }`}
            >
              {crossFilterDirection === 'Single' ? 'Single (1 → *) Direkomendasikan' : 'Both (1 ↔ *) Hati-hati!'}
            </button>
          </div>
        </div>
      </div>

      {/* Star Schema Interactive Canvas */}
      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-display">
              Diagram Skema Bintang (Star Schema Architecture)
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Dimensi (1 - Unique)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span>Fakta (* - Many)</span>
            </div>
          </div>
        </div>

        {/* Visual Diagram Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Column 1: Left Dimensions (Products & Customers) */}
          <div className="space-y-6">
            {/* DimProducts */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedFilterDimension === 'products'
                ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-indigo-400 font-mono">DimProducts (1)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-200 font-mono">10 Baris</span>
              </div>
              <ul className="text-[11px] space-y-1 font-mono text-slate-300">
                <li className="flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> ProductID</span>
                  <span className="text-[9px] px-1 bg-amber-950 rounded">PK</span>
                </li>
                <li>ProductName</li>
                <li className={selectedFilterDimension === 'products' ? 'text-indigo-300 font-bold bg-indigo-900/40 px-1 rounded' : ''}>
                  Category {selectedFilterDimension === 'products' && `[= "${selectedFilterValue}"]`}
                </li>
                <li>SubCategory</li>
              </ul>
              {selectedFilterDimension === 'products' && (
                <div className="mt-3 pt-2 border-t border-indigo-800/60 text-[10px] text-cyan-300 flex items-center gap-1 font-sans">
                  <ArrowRight className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>Filter aktif mengalir ke FactSales...</span>
                </div>
              )}
            </div>

            {/* DimCustomers */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-cyan-400 font-mono">DimCustomers (1)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-200 font-mono">25 Baris</span>
              </div>
              <ul className="text-[11px] space-y-1 font-mono text-slate-300">
                <li className="flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> CustomerID</span>
                  <span className="text-[9px] px-1 bg-amber-950 rounded">PK</span>
                </li>
                <li>CustomerName</li>
                <li>Segment</li>
                <li>City</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Center (FactSales) */}
          <div className="p-5 rounded-2xl bg-purple-950/30 border-2 border-purple-500/60 shadow-xl shadow-purple-950/50 space-y-3 relative">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/50">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-300 font-display">FactSales (*)</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 font-semibold">
                Tabel Fakta Sentral
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Menampung jutaan baris transaksi dengan angka ukuran (Quantity, Sales, Profit) dan Foreign Keys.
            </p>

            <ul className="text-[11px] space-y-1 font-mono text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-purple-900/40">
              <li className="text-amber-400 font-semibold flex items-center justify-between">
                <span>OrderID</span>
                <span className="text-[9px] px-1 bg-amber-950 rounded">PK</span>
              </li>
              <li className="text-indigo-400 flex items-center justify-between">
                <span>ProductID</span>
                <span className="text-[9px] px-1 bg-indigo-950 rounded">FK</span>
              </li>
              <li className="text-cyan-400 flex items-center justify-between">
                <span>CustomerID</span>
                <span className="text-[9px] px-1 bg-cyan-950 rounded">FK</span>
              </li>
              <li className="text-emerald-400 flex items-center justify-between">
                <span>RegionID</span>
                <span className="text-[9px] px-1 bg-emerald-950 rounded">FK</span>
              </li>
              <li className="text-amber-400 flex items-center justify-between">
                <span>DateKey</span>
                <span className="text-[9px] px-1 bg-amber-950 rounded">FK</span>
              </li>
              <li className="pt-1.5 border-t border-slate-800 text-slate-100 font-semibold">
                SalesAmount, Cost, Profit
              </li>
            </ul>

            {/* Filtered Result Callout */}
            <div className="p-3 bg-slate-950 rounded-xl border border-purple-700/50 text-xs">
              <div className="text-slate-400 text-[10px] font-mono mb-1">
                DAMPAK FILTER AKTIF TERHADAP FAKTA:
              </div>
              <div className="flex items-center justify-between text-slate-100 font-bold">
                <span>Baris Lolos Filter:</span>
                <span className="text-cyan-400 font-mono">{filteredStats.rows} Transaksi</span>
              </div>
              <div className="flex items-center justify-between text-slate-100 font-bold mt-1">
                <span>Total Omzet Lolos:</span>
                <span className="text-emerald-400 font-mono">{filteredStats.sales}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Right Dimensions (Regions & Calendar) */}
          <div className="space-y-6">
            {/* DimRegions */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedFilterDimension === 'regions'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950'
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-emerald-400 font-mono">DimRegions (1)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-mono">5 Wilayah</span>
              </div>
              <ul className="text-[11px] space-y-1 font-mono text-slate-300">
                <li className="flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> RegionID</span>
                  <span className="text-[9px] px-1 bg-amber-950 rounded">PK</span>
                </li>
                <li className={selectedFilterDimension === 'regions' ? 'text-emerald-300 font-bold bg-emerald-900/40 px-1 rounded' : ''}>
                  RegionName {selectedFilterDimension === 'regions' && `[= "${selectedFilterValue}"]`}
                </li>
                <li>IslandGroup</li>
              </ul>
              {selectedFilterDimension === 'regions' && (
                <div className="mt-3 pt-2 border-t border-emerald-800/60 text-[10px] text-cyan-300 flex items-center gap-1 font-sans">
                  <ArrowRight className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>Filter regional mengalir ke FactSales...</span>
                </div>
              )}
            </div>

            {/* DimCalendar */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-amber-400 font-mono">DimCalendar (1)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 font-mono">365 Hari</span>
              </div>
              <ul className="text-[11px] space-y-1 font-mono text-slate-300">
                <li className="flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> DateKey</span>
                  <span className="text-[9px] px-1 bg-amber-950 rounded">PK</span>
                </li>
                <li>Year</li>
                <li>Quarter</li>
                <li>MonthName</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Architectural Principles Box */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-cyan-400 font-semibold font-mono block">1. Relasi One-to-Many (1:*)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Tabel dimensi bertindak sebagai sisi '1' (nilai PK unik tanpa duplikat). Tabel fakta bertindak sebagai sisi '*' (banyak transaksi). Filter selalu mengalir dari sisi 1 ke sisi *.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-amber-400 font-semibold font-mono block">2. Bahaya Bi-Directional Filter</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Mengaktifkan filter 'Both' dapat memicu circular dependency dan hasil perhitungan measure yang ambigu. Pertahankan arah 'Single' kecuali skenario khusus.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-emerald-400 font-semibold font-mono block">3. Wajib Punya Date Table</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Fungsi time intelligence DAX (TOTALYTD, SAMEPERIODLASTYEAR) memerlukan tabel tanggal kontinu tanpa lubang tanggal yang terhubung ke kolom tanggal tabel fakta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
