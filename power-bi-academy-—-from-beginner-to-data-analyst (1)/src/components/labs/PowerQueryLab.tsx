import React, { useState } from 'react';
import { initialDirtyDataset } from '../../data/mockDatasets';
import { DirtyRecord } from '../../types';
import { 
  Filter, 
  Trash2, 
  RefreshCw, 
  FileCode, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Database,
  Type,
  Calendar,
  DollarSign,
  Split,
  Layers,
  Undo
} from 'lucide-react';

interface AppliedStepItem {
  id: string;
  label: string;
  mCodeSnippet: string;
  impactDesc: string;
}

export const PowerQueryLab: React.FC = () => {
  const [data, setData] = useState<DirtyRecord[]>(initialDirtyDataset);
  const [appliedSteps, setAppliedSteps] = useState<AppliedStepItem[]>([
    {
      id: 'source',
      label: 'Source (Sumber Data Excel Mentah)',
      mCodeSnippet: 'Source = Excel.Workbook(File.Contents("Sales_Raw.xlsx"), null, true)',
      impactDesc: 'Membaca 10 baris mentah yang masih mengandung duplikat, null, dan format teks acak.'
    }
  ]);
  const [activeStepId, setActiveStepId] = useState<string>('source');
  const [showMCodeModal, setShowMCodeModal] = useState<boolean>(false);
  const [unpivotDemoActive, setUnpivotDemoActive] = useState<boolean>(false);

  // Transformation actions
  const handleRemoveDuplicates = () => {
    if (appliedSteps.some(s => s.id === 'distinct')) return;
    const seen = new Set<string>();
    const cleaned = data.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    setData(cleaned);
    const newStep: AppliedStepItem = {
      id: 'distinct',
      label: 'Removed Duplicates (#"Removed Duplicates")',
      mCodeSnippet: '#"Removed Duplicates" = Table.Distinct(Source, {"id"})',
      impactDesc: 'Menghapus 1 baris transaksi ganda (TRX-003). Mencegah penggelembungan angka omzet (double-counting).'
    };
    setAppliedSteps([...appliedSteps, newStep]);
    setActiveStepId(newStep.id);
  };

  const handleHandleNullsAndMissing = () => {
    if (appliedSteps.some(s => s.id === 'handle_nulls')) return;
    const cleaned = data.map(item => ({
      ...item,
      rawDate: item.rawDate === 'null' ? '2024-02-15 (Imputed)' : item.rawDate,
      quantityRaw: item.quantityRaw === 'N/A' ? '1 (Default)' : item.quantityRaw
    }));

    setData(cleaned);
    const newStep: AppliedStepItem = {
      id: 'handle_nulls',
      label: 'Replaced Missing & Nulls (#"Replaced Values")',
      mCodeSnippet: '#"Replaced Values" = Table.ReplaceValue(Source, "null", "2024-02-15", Replacer.ReplaceText, {"rawDate"})',
      impactDesc: 'Mengganti nilai null pada tanggal dan "N/A" pada kuantitas dengan nilai imputasi bisnis yang valid.'
    };
    setAppliedSteps([...appliedSteps, newStep]);
    setActiveStepId(newStep.id);
  };

  const handleStandardizeTextAndTypes = () => {
    if (appliedSteps.some(s => s.id === 'clean_types')) return;
    const cleaned = data.map(item => ({
      ...item,
      customerName: item.customerName.trim().replace(/\b\w/g, l => l.toUpperCase()),
      categoryRaw: item.categoryRaw.trim().charAt(0).toUpperCase() + item.categoryRaw.trim().slice(1).toLowerCase(),
      amountRaw: item.amountRaw.replace(/[^0-9]/g, '')
    }));

    setData(cleaned);
    const newStep: AppliedStepItem = {
      id: 'clean_types',
      label: 'Trim, Text Capitalize & Clean Amount (#"Cleaned Types")',
      mCodeSnippet: '#"Cleaned Types" = Table.TransformColumnTypes(Source, {{"amountRaw", Currency.Type}, {"customerName", type text}})',
      impactDesc: 'Membersihkan string mata uang Rp menjadi angka numerik murni dan merapikan kapitalisasi teks nama pelanggan.'
    };
    setAppliedSteps([...appliedSteps, newStep]);
    setActiveStepId(newStep.id);
  };

  const handleAddConditionalColumn = () => {
    if (appliedSteps.some(s => s.id === 'conditional_col')) return;
    const cleaned = data.map(item => {
      const numAmt = parseInt(item.amountRaw.replace(/[^0-9]/g, '') || '0', 10);
      return {
        ...item,
        statusCode: numAmt > 50000000 ? 'HIGH_VALUE' : 'STANDARD'
      };
    });

    setData(cleaned);
    const newStep: AppliedStepItem = {
      id: 'conditional_col',
      label: 'Added Conditional Column (#"Added Conditional")',
      mCodeSnippet: '#"Added Conditional" = Table.AddColumn(Source, "Tier", each if [amountRaw] > 50000000 then "HIGH_VALUE" else "STANDARD")',
      impactDesc: 'Membuat kolom baru Tiering Transaksi untuk mempermudah segmentasi pesanan bernilai tinggi.'
    };
    setAppliedSteps([...appliedSteps, newStep]);
    setActiveStepId(newStep.id);
  };

  const handleReset = () => {
    setData(initialDirtyDataset);
    setAppliedSteps([
      {
        id: 'source',
        label: 'Source (Sumber Data Excel Mentah)',
        mCodeSnippet: 'Source = Excel.Workbook(File.Contents("Sales_Raw.xlsx"), null, true)',
        impactDesc: 'Membaca 10 baris mentah yang masih mengandung duplikat, null, dan format teks acak.'
      }
    ]);
    setActiveStepId('source');
  };

  const currentStep = appliedSteps.find(s => s.id === activeStepId) || appliedSteps[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>LEVEL 4 LAB</span>
              <span>·</span>
              <span>ETL & DATA TRANSFORMATION</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Power Query & Data Cleaning Lab
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Eksperimen langsung membersihkan data mentah berantakan menjadi data analitik siap pakai (Tidy Data). Amati perubahan tabel dan Applied Steps bahasa M secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMCodeModal(!showMCodeModal)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showMCodeModal ? 'Tutup Kode M' : 'Lihat Bahasa M Lengkap'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 border border-slate-800 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 mr-2 font-medium">Operasi Transformasi:</span>
          
          <button
            onClick={handleRemoveDuplicates}
            disabled={appliedSteps.some(s => s.id === 'distinct')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              appliedSteps.some(s => s.id === 'distinct')
                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>1. Hapus Baris Duplikat</span>
          </button>

          <button
            onClick={handleHandleNullsAndMissing}
            disabled={appliedSteps.some(s => s.id === 'handle_nulls')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              appliedSteps.some(s => s.id === 'handle_nulls')
                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Tangani Null & 'N/A'</span>
          </button>

          <button
            onClick={handleStandardizeTextAndTypes}
            disabled={appliedSteps.some(s => s.id === 'clean_types')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              appliedSteps.some(s => s.id === 'clean_types')
                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>3. Rapikan Format Teks & Angka</span>
          </button>

          <button
            onClick={handleAddConditionalColumn}
            disabled={appliedSteps.some(s => s.id === 'conditional_col')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              appliedSteps.some(s => s.id === 'conditional_col')
                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Buat Conditional Column</span>
          </button>

          <button
            onClick={() => setUnpivotDemoActive(!unpivotDemoActive)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ml-auto ${
              unpivotDemoActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Split className="w-3.5 h-3.5 text-amber-400" />
            <span>{unpivotDemoActive ? 'Tutup Demo Unpivot' : 'Pelajari Unpivot Columns'}</span>
          </button>
        </div>
      </div>

      {/* Unpivot Deep-Dive Demo Section if Toggled */}
      {unpivotDemoActive && (
        <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 font-display">
              Operasi Revolusioner: Mengapa Anda Wajib Melakukan "Unpivot Columns"?
            </h3>
            <span className="text-[11px] text-amber-400 font-mono">Transformasi Data Lebar → Tidy Data</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-red-400 font-semibold block mb-1">❌ Format Spreadsheet Lebar (Sulit untuk BI):</span>
              <p className="text-slate-400 text-[11px] mb-2 leading-relaxed">
                Setiap bulan menjadi kolom terpisah. Anda tidak bisa membuat slicer bulan atau time-intelligence DAX dengan format ini!
              </p>
              <div className="font-mono text-[10px] bg-slate-900 p-2 rounded text-slate-300 overflow-x-auto">
                | Produk | Jan 2024 | Feb 2024 | Mar 2024 |<br />
                | Laptop | 92.500   | 18.500   | 148.000  |
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-semibold block mb-1">✅ Setelah Di-Unpivot (Tidy Data Power BI):</span>
              <p className="text-slate-400 text-[11px] mb-2 leading-relaxed">
                Semua nama bulan dijadikan satu kolom "Month", dan angkanya menjadi kolom "Sales". Sangat mudah dihitung dengan SUM()!
              </p>
              <div className="font-mono text-[10px] bg-slate-900 p-2 rounded text-emerald-300 overflow-x-auto">
                | Produk | Month    | Sales   |<br />
                | Laptop | Jan 2024 | 92.500  |<br />
                | Laptop | Feb 2024 | 18.500  |<br />
                | Laptop | Mar 2024 | 148.000 |
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Data Table vs Applied Steps Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Data Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Tabel Data Pratinjau Power Query ({data.length} Baris Aktif)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {appliedSteps.length > 1 ? 'Data Telah Diformat' : 'Data Mentah (Dirty)'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 font-mono">
                  <tr>
                    <th className="p-2.5 border-b border-slate-800">ID Pesanan</th>
                    <th className="p-2.5 border-b border-slate-800">Tanggal</th>
                    <th className="p-2.5 border-b border-slate-800">Nama Pelanggan</th>
                    <th className="p-2.5 border-b border-slate-800">Kategori</th>
                    <th className="p-2.5 border-b border-slate-800 text-right">Kuantitas</th>
                    <th className="p-2.5 border-b border-slate-800 text-right">Nominal Sales</th>
                    <th className="p-2.5 border-b border-slate-800">Status / Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {data.map((row, rIdx) => {
                    const isDup = row.isDuplicate && !appliedSteps.some(s => s.id === 'distinct');
                    const hasNull = (row.rawDate === 'null' || row.quantityRaw === 'N/A') && !appliedSteps.some(s => s.id === 'handle_nulls');
                    
                    return (
                      <tr 
                        key={rIdx} 
                        className={`transition-colors ${
                          isDup 
                            ? 'bg-red-950/30 text-red-200' 
                            : hasNull 
                            ? 'bg-amber-950/20 text-amber-200' 
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="p-2.5 font-mono text-[11px] font-medium flex items-center gap-1.5">
                          {isDup && <span className="text-[9px] px-1 bg-red-800 text-red-100 rounded">DUP</span>}
                          {row.id}
                        </td>
                        <td className="p-2.5 font-mono text-[11px]">{row.rawDate}</td>
                        <td className="p-2.5">{row.customerName}</td>
                        <td className="p-2.5">{row.categoryRaw}</td>
                        <td className="p-2.5 text-right font-mono">{row.quantityRaw}</td>
                        <td className="p-2.5 text-right font-mono text-cyan-300 font-semibold">{row.amountRaw}</td>
                        <td className="p-2.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            row.statusCode === 'HIGH_VALUE'
                              ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                              : row.statusCode === 'REFUNDED'
                              ? 'bg-red-900/40 text-red-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {row.statusCode}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Live Step Impact Note */}
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <span className="text-cyan-400 font-semibold font-mono block mb-0.5">
                Langkah Terpilih: {currentStep.label}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {currentStep.impactDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Applied Steps Pipeline (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Applied Steps (Riwayat Langkah)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {appliedSteps.length} Langkah
              </span>
            </div>

            <div className="space-y-2">
              {appliedSteps.map((step, idx) => {
                const isSelected = activeStepId === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-cyan-400 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="truncate flex-1">
                      <div className="font-semibold text-slate-200 truncate">{step.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {step.mCodeSnippet}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200 block mb-1">Cara Kerja Applied Steps:</strong>
              Power Query merekam setiap aksi Anda dalam bahasa M. Saat data sumber diperbarui di masa mendatang, urutan langkah ini akan dieksekusi ulang secara instan tanpa perlu tindakan manual berulang.
            </div>
          </div>
        </div>
      </div>

      {/* M Code Modal / Overlay */}
      {showMCodeModal && (
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 font-mono">
              Advanced Editor — Script Bahasa M Lengkap
            </span>
            <button
              onClick={() => setShowMCodeModal(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Tutup
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono overflow-x-auto leading-relaxed">
{`let
    Source = Excel.Workbook(File.Contents("C:\\Data\\Sales_Raw.xlsx"), null, true),
    Sales_Sheet = Source{[Item="Sales",Kind="Table"]}[Data],
${appliedSteps.filter(s => s.id !== 'source').map(s => `    ${s.mCodeSnippet}`).join(',\n')}
in
    ${appliedSteps[appliedSteps.length - 1].id === 'source' ? 'Source' : appliedSteps[appliedSteps.length - 1].mCodeSnippet.split(' = ')[0]}`}
          </pre>
          <p className="text-[11px] text-slate-400">
            Ekspresi bahasa M bersifat deklaratif dan fungsional. Variabel di dalam blok <code className="text-cyan-400">let</code> dievaluasi dan dikembalikan oleh klausa <code className="text-cyan-400">in</code>.
          </p>
        </div>
      )}
    </div>
  );
};
