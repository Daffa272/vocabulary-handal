import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Link,
  Code,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  Scale,
  PieChart,
  Settings,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import {
  BalanceSheetData,
  BudgetActualRow,
  CashFlowData,
  CompanyProfile,
  FinancialPeriodRecord,
  IncomeStatementData,
  ProductBreakdown,
} from '../../types/financial';
import { formatFinancialNumber } from '../../services/calculationEngine';

export const AdminPortal: React.FC = () => {
  const {
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    activeCompany,
    importCompanyData,
    setActivePage,
    currency,
  } = useFinancial();

  // Selected period to edit in admin
  const [editingPeriodId, setEditingPeriodId] = useState<string>(
    activeCompany.periods[activeCompany.periods.length - 1]?.periodId || ''
  );

  const activeEditingPeriod =
    activeCompany.periods.find((p) => p.periodId === editingPeriodId) ||
    activeCompany.periods[0];

  // Active admin tab
  const [adminTab, setAdminTab] = useState<
    'income' | 'balance' | 'cashflow' | 'products' | 'budget' | 'company' | 'sync'
  >('income');

  // Notification status
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Local state for draft editing of active period
  const [draftIS, setDraftIS] = useState<IncomeStatementData>(
    activeEditingPeriod.incomeStatement
  );
  const [draftBS, setDraftBS] = useState<BalanceSheetData>(
    activeEditingPeriod.balanceSheet
  );
  const [draftCF, setDraftCF] = useState<CashFlowData>(
    activeEditingPeriod.cashFlow
  );
  const [draftProducts, setDraftProducts] = useState<ProductBreakdown[]>(
    activeEditingPeriod.products || []
  );
  const [draftBudget, setDraftBudget] = useState<BudgetActualRow[]>(
    activeEditingPeriod.budgetActual || []
  );
  const [draftCompany, setDraftCompany] = useState<CompanyProfile>(activeCompany);

  // Sync draft when editing period changes
  const handlePeriodSelect = (periodId: string) => {
    setEditingPeriodId(periodId);
    const p = activeCompany.periods.find((x) => x.periodId === periodId);
    if (p) {
      setDraftIS(p.incomeStatement);
      setDraftBS(p.balanceSheet);
      setDraftCF(p.cashFlow);
      setDraftProducts(p.products || []);
      setDraftBudget(p.budgetActual || []);
      setSaveMessage(null);
    }
  };

  // Live Auto-Calculations for Income Statement
  const computedGrossProfit = draftIS.revenue - draftIS.costOfGoodsSold;
  const computedTotalOpEx =
    draftIS.operatingExpenses.rd +
    draftIS.operatingExpenses.sga +
    draftIS.operatingExpenses.depreciation +
    draftIS.operatingExpenses.other;
  const computedOperatingIncome = computedGrossProfit - computedTotalOpEx;
  const computedEBT =
    computedOperatingIncome - draftIS.interestExpense + draftIS.otherIncomeExpense;
  const computedNetIncome = computedEBT - draftIS.incomeTaxExpense;

  // Live Auto-Calculations for Balance Sheet (ALL 14 items)
  const computedTotalCA =
    draftBS.cashAndEquivalents +
    draftBS.accountsReceivable +
    draftBS.inventory +
    draftBS.otherCurrentAssets;
  const computedTotalNCA =
    draftBS.propertyPlantEquipment +
    draftBS.intangibleAssets +
    draftBS.longTermInvestments +
    draftBS.otherNonCurrentAssets;
  const computedTotalAssets = computedTotalCA + computedTotalNCA;

  const computedTotalCL =
    draftBS.accountsPayable +
    draftBS.shortTermDebt +
    draftBS.accruedLiabilities +
    draftBS.otherCurrentLiabilities;
  const computedTotalNCL = draftBS.longTermDebt + draftBS.otherNonCurrentLiabilities;
  const computedTotalLiab = computedTotalCL + computedTotalNCL;
  const computedTotalEquity =
    draftBS.commonStock + draftBS.retainedEarnings + draftBS.additionalPaidInCapital;

  const computedTotalLiabAndEquity = computedTotalLiab + computedTotalEquity;
  const bsCheck = computedTotalAssets - computedTotalLiabAndEquity;
  const isBsBalanced = Math.abs(bsCheck) < 0.1;

  // Live Auto-Calculations for Cash Flow (ALL 13 items)
  const computedTotalOpsCF =
    draftCF.operatingActivities.netIncome +
    draftCF.operatingActivities.depreciationAmortization +
    draftCF.operatingActivities.changeInReceivables +
    draftCF.operatingActivities.changeInInventory +
    draftCF.operatingActivities.changeInPayables +
    draftCF.operatingActivities.otherOperating;

  const computedTotalInvCF =
    draftCF.investingActivities.capitalExpenditures +
    draftCF.investingActivities.acquisitionsAndInvestments +
    draftCF.investingActivities.otherInvesting;

  const computedTotalFinCF =
    draftCF.financingActivities.debtIssuedRepaid +
    draftCF.financingActivities.dividendsPaid +
    draftCF.financingActivities.equityIssuedRepurchased +
    draftCF.financingActivities.otherFinancing;

  const computedNetChangeInCash = computedTotalOpsCF + computedTotalInvCF + computedTotalFinCF;
  const computedEndingCash = draftCF.beginningCash + computedNetChangeInCash;
  const cashReconDelta = computedEndingCash - draftBS.cashAndEquivalents;
  const isCashReconciled = Math.abs(cashReconDelta) < 0.1;

  // Save all changes to the active company
  const handleSavePeriod = () => {
    const updatedIS: IncomeStatementData = {
      ...draftIS,
      grossProfit: computedGrossProfit,
      operatingExpenses: {
        ...draftIS.operatingExpenses,
        total: computedTotalOpEx,
      },
      operatingIncome: computedOperatingIncome,
      incomeBeforeTax: computedEBT,
      netIncome: computedNetIncome,
    };

    const updatedBS: BalanceSheetData = {
      ...draftBS,
      totalCurrentAssets: computedTotalCA,
      totalNonCurrentAssets: computedTotalNCA,
      totalAssets: computedTotalAssets,
      totalCurrentLiabilities: computedTotalCL,
      totalNonCurrentLiabilities: computedTotalNCL,
      totalLiabilities: computedTotalLiab,
      totalEquity: computedTotalEquity,
      isBalanced: isBsBalanced,
      discrepancy: Number(bsCheck.toFixed(2)),
    };

    const updatedCF: CashFlowData = {
      ...draftCF,
      operatingActivities: {
        ...draftCF.operatingActivities,
        total: computedTotalOpsCF,
      },
      investingActivities: {
        ...draftCF.investingActivities,
        total: computedTotalInvCF,
      },
      financingActivities: {
        ...draftCF.financingActivities,
        total: computedTotalFinCF,
      },
      netChangeInCash: computedNetChangeInCash,
      endingCash: computedEndingCash,
      reconciliationDelta: Number(cashReconDelta.toFixed(2)),
    };

    const updatedPeriods = activeCompany.periods.map((p) => {
      if (p.periodId === editingPeriodId) {
        return {
          ...p,
          incomeStatement: updatedIS,
          balanceSheet: updatedBS,
          cashFlow: updatedCF,
          products: draftProducts,
          budgetActual: draftBudget,
        };
      }
      return p;
    });

    const updatedCompany: CompanyProfile = {
      ...draftCompany,
      id: activeCompany.id,
      periods: updatedPeriods,
    };

    importCompanyData(updatedCompany);
    setSaveMessage('Seluruh data laporan lengkap berhasil disimpan dan tersinkronisasi ke Dashboard Visualisasi!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Auto-balance Equity: sets Retained Earnings so Assets = Liabilities + Equity exactly
  const handleAutoBalanceEquity = () => {
    const requiredRetainedEarnings =
      computedTotalAssets - computedTotalLiab - draftBS.commonStock - draftBS.additionalPaidInCapital;
    setDraftBS((prev) => ({
      ...prev,
      retainedEarnings: Math.round(requiredRetainedEarnings),
    }));
  };

  // Auto-sync Net Income into Cash Flow Operating Line
  const handleSyncNetIncomeToCF = () => {
    setDraftCF((prev) => ({
      ...prev,
      operatingActivities: {
        ...prev.operatingActivities,
        netIncome: computedNetIncome,
        depreciationAmortization: draftIS.operatingExpenses.depreciation,
      },
    }));
  };

  // Add new financial period (e.g., FY 2026)
  const handleAddNewPeriod = () => {
    const lastP = activeCompany.periods[activeCompany.periods.length - 1];
    const nextYear = lastP ? lastP.year + 1 : 2026;
    const newPeriodId = `${nextYear}`;

    const newPeriod: FinancialPeriodRecord = {
      periodId: newPeriodId,
      year: nextYear,
      label: `FY ${nextYear}`,
      type: 'Annual',
      incomeStatement: {
        revenue: Math.round((lastP?.incomeStatement.revenue || 100000000) * 1.1),
        costOfGoodsSold: Math.round((lastP?.incomeStatement.costOfGoodsSold || 60000000) * 1.1),
        grossProfit: Math.round(((lastP?.incomeStatement.revenue || 100000000) * 1.1) - ((lastP?.incomeStatement.costOfGoodsSold || 60000000) * 1.1)),
        operatingExpenses: {
          rd: Math.round((lastP?.incomeStatement.operatingExpenses.rd || 8000000) * 1.08),
          sga: Math.round((lastP?.incomeStatement.operatingExpenses.sga || 18000000) * 1.08),
          depreciation: Math.round((lastP?.incomeStatement.operatingExpenses.depreciation || 5000000) * 1.05),
          other: 1000000,
          total: 32000000,
        },
        operatingIncome: 15000000,
        interestExpense: 2500000,
        otherIncomeExpense: 300000,
        incomeBeforeTax: 12800000,
        incomeTaxExpense: 2816000,
        netIncome: 9984000,
      },
      balanceSheet: {
        cashAndEquivalents: 20000000,
        accountsReceivable: 25000000,
        inventory: 28000000,
        otherCurrentAssets: 4000000,
        totalCurrentAssets: 77000000,
        propertyPlantEquipment: 60000000,
        intangibleAssets: 12000000,
        longTermInvestments: 6000000,
        otherNonCurrentAssets: 4000000,
        totalNonCurrentAssets: 82000000,
        totalAssets: 159000000,
        accountsPayable: 18000000,
        shortTermDebt: 5000000,
        accruedLiabilities: 7000000,
        otherCurrentLiabilities: 3000000,
        totalCurrentLiabilities: 33000000,
        longTermDebt: 36000000,
        otherNonCurrentLiabilities: 8000000,
        totalNonCurrentLiabilities: 44000000,
        totalLiabilities: 77000000,
        commonStock: 25000000,
        retainedEarnings: 50500000,
        additionalPaidInCapital: 6500000,
        totalEquity: 82000000,
        isBalanced: true,
        discrepancy: 0,
      },
      cashFlow: {
        operatingActivities: {
          netIncome: 9984000,
          depreciationAmortization: 5000000,
          changeInReceivables: -2000000,
          changeInInventory: -2000000,
          changeInPayables: 2000000,
          otherOperating: 250000,
          total: 13234000,
        },
        investingActivities: {
          capitalExpenditures: -7000000,
          acquisitionsAndInvestments: -1000000,
          otherInvesting: 0,
          total: -8000000,
        },
        financingActivities: {
          debtIssuedRepaid: 1000000,
          dividendsPaid: -3000000,
          equityIssuedRepurchased: 0,
          otherFinancing: -1000000,
          total: -3000000,
        },
        netChangeInCash: 2234000,
        beginningCash: 17766000,
        endingCash: 20000000,
        reconciliationDelta: 0,
      },
    };

    const updatedCompany: CompanyProfile = {
      ...activeCompany,
      periods: [...activeCompany.periods, newPeriod],
    };

    importCompanyData(updatedCompany);
    handlePeriodSelect(newPeriodId);
    setSaveMessage(`Periode baru ${newPeriod.label} berhasil ditambahkan!`);
  };

  // Product breakdown helpers
  const handleAddProduct = () => {
    setDraftProducts((prev) => [
      ...prev,
      {
        name: `Produk Baru ${prev.length + 1}`,
        revenue: 10000000,
        cogs: 6000000,
        grossProfit: 4000000,
        marginPercent: 40.0,
      },
    ]);
  };

  const handleUpdateProduct = (index: number, field: keyof ProductBreakdown, val: any) => {
    setDraftProducts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      if (field === 'revenue' || field === 'cogs') {
        const rev = field === 'revenue' ? parseFloat(val) || 0 : copy[index].revenue;
        const cogs = field === 'cogs' ? parseFloat(val) || 0 : copy[index].cogs;
        const gp = rev - cogs;
        copy[index].grossProfit = gp;
        copy[index].marginPercent = rev > 0 ? Number(((gp / rev) * 100).toFixed(1)) : 0;
      }
      return copy;
    });
  };

  const handleDeleteProduct = (index: number) => {
    setDraftProducts((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Budget vs Actual helpers
  const handleAddBudgetRow = () => {
    setDraftBudget((prev) => [
      ...prev,
      {
        accountName: 'Akun Biaya/Omzet Baru',
        category: 'OpEx',
        department: 'Operations',
        budget: 5000000,
        actual: 4800000,
        variance: -200000,
        variancePercent: -4.0,
        isFavorable: true,
      },
    ]);
  };

  const handleUpdateBudgetRow = (index: number, field: keyof BudgetActualRow, val: any) => {
    setDraftBudget((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      if (field === 'budget' || field === 'actual' || field === 'category') {
        const b = field === 'budget' ? parseFloat(val) || 0 : copy[index].budget;
        const a = field === 'actual' ? parseFloat(val) || 0 : copy[index].actual;
        const cat = field === 'category' ? val : copy[index].category;
        const variance = a - b;
        const variancePercent = b !== 0 ? Number(((variance / Math.abs(b)) * 100).toFixed(1)) : null;
        const isFavorable = cat === 'Revenue' ? variance >= 0 : variance <= 0;
        copy[index].variance = variance;
        copy[index].variancePercent = variancePercent;
        copy[index].isFavorable = isFavorable;
      }
      return copy;
    });
  };

  const handleDeleteBudgetRow = (index: number) => {
    setDraftBudget((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Export full JSON database
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(activeCompany, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `${activeCompany.ticker}_Database_Export.json`);
    dlAnchorElem.click();
  };

  const integrationSnippet = `// CONTOH KONEKSI WEBSITE ADMIN KE WEBSITE VISUALISASI VIA REST API
// 1. Website Admin mem-publish seluruh 3 laporan keuangan (Income, Balance, Cash Flow):
async function saveFinancialReport(payload) {
  const response = await fetch('https://api.perusahaan.com/v1/financial-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer TOKEN' },
    body: JSON.stringify(payload)
  });
  return await response.json();
}

// 2. Website Visualisasi menarik data dan langsung me-render 14 modul:
useEffect(() => {
  fetch('https://api.perusahaan.com/v1/financial-reports/APEX')
    .then(res => res.json())
    .then(data => setLiveCompanyData(data));
}, []);`;

  return (
    <div className="space-y-6">
      {/* Admin Header & Direct Visualizer Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              Full Admin Data Hub
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">
              Modul Entri Laporan Keuangan Lengkap
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            Financial Data Hub & Administration Console
          </h2>
          <p className="text-xs text-slate-400">
            Kelola dan input seluruh komponen Laba Rugi, Neraca (Aset Lancar/Tidak Lancar, Liabilitas, Ekuitas), Arus Kas 3 Pilar, Rincian Produk, dan Anggaran.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage('overview')}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold text-xs transition-colors shadow-md shadow-cyan-900/30"
          >
            <span>Lihat di Website Visualisasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saveMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveMessage}</span>
          </div>
          <button
            onClick={() => setActivePage('statements')}
            className="text-emerald-200 underline hover:text-white"
          >
            Buka Statements →
          </button>
        </div>
      )}

      {/* Company & Period Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Company Picker */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 font-medium">Perusahaan:</span>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name} ({c.ticker})
                </option>
              ))}
            </select>
          </div>

          {/* Period to Edit */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-medium">Periode Diedit:</span>
            <select
              value={editingPeriodId}
              onChange={(e) => handlePeriodSelect(e.target.value)}
              className="bg-transparent text-cyan-300 font-mono font-semibold focus:outline-none cursor-pointer"
            >
              {activeCompany.periods.map((p) => (
                <option key={p.periodId} value={p.periodId} className="bg-slate-900">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Period Button */}
          <button
            onClick={handleAddNewPeriod}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tambah Periode Baru</span>
          </button>
        </div>

        {/* Global Action: Save Changes */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSavePeriod}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs transition-colors shadow-lg shadow-emerald-900/30"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan ke Dashboard</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
        <button
          onClick={() => setAdminTab('income')}
          className={`px-3 py-2 rounded font-medium transition-colors ${
            adminTab === 'income'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Laba Rugi (Income Statement)
        </button>
        <button
          onClick={() => setAdminTab('balance')}
          className={`px-3 py-2 rounded font-medium transition-colors flex items-center gap-1.5 ${
            adminTab === 'balance'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>2. Neraca Lengkap (Balance Sheet)</span>
          {!isBsBalanced && (
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setAdminTab('cashflow')}
          className={`px-3 py-2 rounded font-medium transition-colors ${
            adminTab === 'cashflow'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Arus Kas (Cash Flow)
        </button>
        <button
          onClick={() => setAdminTab('products')}
          className={`px-3 py-2 rounded font-medium transition-colors ${
            adminTab === 'products'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Rincian Produk
        </button>
        <button
          onClick={() => setAdminTab('budget')}
          className={`px-3 py-2 rounded font-medium transition-colors ${
            adminTab === 'budget'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          5. Budget vs Actual
        </button>
        <button
          onClick={() => setAdminTab('company')}
          className={`px-3 py-2 rounded font-medium transition-colors ${
            adminTab === 'company'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          6. Profil Entitas
        </button>
        <button
          onClick={() => setAdminTab('sync')}
          className={`px-3 py-2 rounded font-medium transition-colors flex items-center gap-1.5 ${
            adminTab === 'sync'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>7. Panduan Koneksi</span>
        </button>
      </div>

      {/* TAB CONTENT 1: INCOME STATEMENT (ALL FIELDS) */}
      {adminTab === 'income' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Input Laporan Laba Rugi Lengkap ({activeEditingPeriod.label})</h3>
              <p className="text-xs text-slate-400">
                Lengkapi omzet, beban pokok, rincian biaya operasional, pendapatan/beban non-operasional, bunga, dan pajak.
              </p>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-slate-400">Net Income: </span>
              <span className="text-emerald-400 font-bold text-sm">
                {formatFinancialNumber(computedNetIncome, currency)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Revenue */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Revenue / Pendapatan Kotor ({currency})</label>
              <input
                type="number"
                value={draftIS.revenue}
                onChange={(e) => setDraftIS({ ...draftIS, revenue: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">Penjualan kotor / omzet</span>
            </div>

            {/* COGS */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Cost of Goods Sold (COGS)</label>
              <input
                type="number"
                value={draftIS.costOfGoodsSold}
                onChange={(e) => setDraftIS({ ...draftIS, costOfGoodsSold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">Beban pokok produksi & bahan baku</span>
            </div>

            {/* Auto Gross Profit */}
            <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded space-y-1">
              <span className="text-slate-400 font-medium">Laba Kotor (Gross Profit) - Auto</span>
              <div className="text-lg font-bold font-mono text-cyan-300">
                {formatFinancialNumber(computedGrossProfit, currency)}
              </div>
              <span className="text-[10px] text-slate-500">
                Gross Margin: {draftIS.revenue > 0 ? ((computedGrossProfit / draftIS.revenue) * 100).toFixed(1) : 0}%
              </span>
            </div>

            {/* OpEx R&D */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Biaya Riset & Pengembangan (R&D)</label>
              <input
                type="number"
                value={draftIS.operatingExpenses.rd}
                onChange={(e) =>
                  setDraftIS({
                    ...draftIS,
                    operatingExpenses: { ...draftIS.operatingExpenses, rd: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>

            {/* OpEx SG&A */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Beban Penjualan, Umum & Admin (SG&A)</label>
              <input
                type="number"
                value={draftIS.operatingExpenses.sga}
                onChange={(e) =>
                  setDraftIS({
                    ...draftIS,
                    operatingExpenses: { ...draftIS.operatingExpenses, sga: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>

            {/* OpEx Depreciation */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Beban Depresiasi & Amortisasi</label>
              <input
                type="number"
                value={draftIS.operatingExpenses.depreciation}
                onChange={(e) =>
                  setDraftIS({
                    ...draftIS,
                    operatingExpenses: { ...draftIS.operatingExpenses, depreciation: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>

            {/* Other Operating Expenses */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Beban Operasional Lainnya (Other OpEx)</label>
              <input
                type="number"
                value={draftIS.operatingExpenses.other}
                onChange={(e) =>
                  setDraftIS({
                    ...draftIS,
                    operatingExpenses: { ...draftIS.operatingExpenses, other: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">Biaya sewa, perizinan, atau beban operasional lain</span>
            </div>

            {/* Operating Income EBIT */}
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded space-y-1">
              <span className="text-slate-400 font-medium">Laba Operasional (EBIT) - Auto</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {formatFinancialNumber(computedOperatingIncome, currency)}
              </div>
              <span className="text-[10px] text-slate-500">Gross Profit - Total OpEx ({formatFinancialNumber(computedTotalOpEx, currency)})</span>
            </div>

            {/* Interest */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Beban Bunga Pinjaman (Interest)</label>
              <input
                type="number"
                value={draftIS.interestExpense}
                onChange={(e) => setDraftIS({ ...draftIS, interestExpense: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>

            {/* Other Income / Expense */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Pendapatan / (Beban) Non-Operasional Lainnya</label>
              <input
                type="number"
                value={draftIS.otherIncomeExpense}
                onChange={(e) => setDraftIS({ ...draftIS, otherIncomeExpense: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">Keuntungan selisih kurs, bunga simpanan bank</span>
            </div>

            {/* Tax */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-slate-300 font-medium">Beban Pajak Penghasilan (Income Tax)</label>
              <input
                type="number"
                value={draftIS.incomeTaxExpense}
                onChange={(e) => setDraftIS({ ...draftIS, incomeTaxExpense: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>

            {/* Auto Net Income */}
            <div className="p-3 bg-cyan-950/30 border border-cyan-800/60 rounded space-y-1">
              <span className="text-slate-300 font-semibold">Laba Bersih Final (Net Income) - Auto</span>
              <div className="text-xl font-bold font-mono text-cyan-300">
                {formatFinancialNumber(computedNetIncome, currency)}
              </div>
              <span className="text-[10px] text-slate-400">
                Net Margin: {draftIS.revenue > 0 ? ((computedNetIncome / draftIS.revenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: BALANCE SHEET (100% COMPLETE: ALL 14 BALANCE SHEET ITEMS) */}
      {adminTab === 'balance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Input Neraca Keuangan Lengkap & Live Equilibrium Validator</h3>
              <p className="text-xs text-slate-400">
                Semua pos aset lancar, aset tetap, investasi, kewajiban jangka pendek/panjang, dan ekuitas.
              </p>
            </div>

            {/* Live Balance Status Badge & Auto-Balance */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold ${
                  isBsBalanced
                    ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                    : 'bg-red-950/80 border border-red-500 text-red-300 animate-pulse'
                }`}
              >
                {isBsBalanced ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>NERACA SEIMBANG (Selisih: 0)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>SELISIH: {formatFinancialNumber(bsCheck, currency)}</span>
                  </>
                )}
              </div>

              {!isBsBalanced && (
                <button
                  onClick={handleAutoBalanceEquity}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                  title="Sesuaikan Laba Ditahan agar Neraca langsung Seimbang"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Balance Ekuitas</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* 1. SECTION ASET (LANCAR & TIDAK LANCAR) */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                1. Aset Lancar & Tidak Lancar
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Kas & Setara Kas (Cash & Equivalents)</label>
                <input
                  type="number"
                  value={draftBS.cashAndEquivalents}
                  onChange={(e) => setDraftBS({ ...draftBS, cashAndEquivalents: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Piutang Usaha (Accounts Receivable)</label>
                <input
                  type="number"
                  value={draftBS.accountsReceivable}
                  onChange={(e) => setDraftBS({ ...draftBS, accountsReceivable: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Persediaan (Inventory)</label>
                <input
                  type="number"
                  value={draftBS.inventory}
                  onChange={(e) => setDraftBS({ ...draftBS, inventory: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              {/* Other Current Assets */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Aset Lancar Lainnya (Other Current Assets)</label>
                <input
                  type="number"
                  value={draftBS.otherCurrentAssets}
                  onChange={(e) => setDraftBS({ ...draftBS, otherCurrentAssets: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Biaya dibayar di muka, uang muka vendor</span>
              </div>

              <div className="p-2 bg-slate-900 rounded font-mono text-cyan-400 flex justify-between">
                <span>Total Aset Lancar:</span>
                <span className="font-bold">{formatFinancialNumber(computedTotalCA, currency)}</span>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-slate-300 font-medium">Aset Tetap (Property, Plant & Equipment)</label>
                <input
                  type="number"
                  value={draftBS.propertyPlantEquipment}
                  onChange={(e) => setDraftBS({ ...draftBS, propertyPlantEquipment: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              {/* Intangibles */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Aset Tak Berwujud & Goodwill (Intangibles)</label>
                <input
                  type="number"
                  value={draftBS.intangibleAssets}
                  onChange={(e) => setDraftBS({ ...draftBS, intangibleAssets: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              {/* Long term investments */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Investasi Jangka Panjang (Long-Term Inv)</label>
                <input
                  type="number"
                  value={draftBS.longTermInvestments}
                  onChange={(e) => setDraftBS({ ...draftBS, longTermInvestments: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              {/* Other Non-Current Assets */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Aset Tidak Lancar Lainnya (Other Non-Current)</label>
                <input
                  type="number"
                  value={draftBS.otherNonCurrentAssets}
                  onChange={(e) => setDraftBS({ ...draftBS, otherNonCurrentAssets: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-cyan-800/60 rounded font-mono font-bold text-white flex justify-between">
                <span>TOTAL ASET KESELURUHAN:</span>
                <span className="text-cyan-300">{formatFinancialNumber(computedTotalAssets, currency)}</span>
              </div>
            </div>

            {/* 2. SECTION LIABILITAS (LANCAR & JANGKA PANJANG) */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="font-semibold text-rose-400 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                2. Liabilitas (Kewajiban)
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Utang Usaha (Accounts Payable)</label>
                <input
                  type="number"
                  value={draftBS.accountsPayable}
                  onChange={(e) => setDraftBS({ ...draftBS, accountsPayable: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Utang Bank Jangka Pendek (Short-Term Debt)</label>
                <input
                  type="number"
                  value={draftBS.shortTermDebt}
                  onChange={(e) => setDraftBS({ ...draftBS, shortTermDebt: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              {/* Accrued Liabilities */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Beban Akrual Terutang (Accrued Liabilities)</label>
                <input
                  type="number"
                  value={draftBS.accruedLiabilities}
                  onChange={(e) => setDraftBS({ ...draftBS, accruedLiabilities: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Gaji karyawan terutang, bunga belum bayar</span>
              </div>

              {/* Other Current Liabilities */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Liabilitas Lancar Lainnya (Other Current Liab)</label>
                <input
                  type="number"
                  value={draftBS.otherCurrentLiabilities}
                  onChange={(e) => setDraftBS({ ...draftBS, otherCurrentLiabilities: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="p-2 bg-slate-900 rounded font-mono text-rose-400 flex justify-between">
                <span>Total Liabilitas Lancar:</span>
                <span className="font-bold">{formatFinancialNumber(computedTotalCL, currency)}</span>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-slate-300 font-medium">Pinjaman Jangka Panjang (Long-Term Debt)</label>
                <input
                  type="number"
                  value={draftBS.longTermDebt}
                  onChange={(e) => setDraftBS({ ...draftBS, longTermDebt: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              {/* Other Non-Current Liabilities */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Liabilitas Jangka Panjang Lainnya (Other Non-Current)</label>
                <input
                  type="number"
                  value={draftBS.otherNonCurrentLiabilities}
                  onChange={(e) => setDraftBS({ ...draftBS, otherNonCurrentLiabilities: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Liabilitas imbalan kerja, pajak tangguhan</span>
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-rose-800/60 rounded font-mono font-bold text-white flex justify-between">
                <span>TOTAL LIABILITAS:</span>
                <span className="text-rose-300">{formatFinancialNumber(computedTotalLiab, currency)}</span>
              </div>
            </div>

            {/* 3. SECTION EKUITAS PEMEGANG SAHAM */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                3. Ekuitas Pemegang Saham
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Modal Saham Disetor (Common Stock)</label>
                <input
                  type="number"
                  value={draftBS.commonStock}
                  onChange={(e) => setDraftBS({ ...draftBS, commonStock: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              {/* Additional Paid-In Capital */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Tambahan Modal Disetor / Agio (APIC)</label>
                <input
                  type="number"
                  value={draftBS.additionalPaidInCapital}
                  onChange={(e) => setDraftBS({ ...draftBS, additionalPaidInCapital: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Agio saham di atas nilai nominal</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Laba Ditahan Akumulatif (Retained Earnings)</label>
                <input
                  type="number"
                  value={draftBS.retainedEarnings}
                  onChange={(e) => setDraftBS({ ...draftBS, retainedEarnings: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-emerald-800/60 rounded font-mono font-bold text-white flex justify-between">
                <span>TOTAL EKUITAS:</span>
                <span className="text-emerald-300">{formatFinancialNumber(computedTotalEquity, currency)}</span>
              </div>

              {/* Total Liabilitas + Ekuitas vs Aset check */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/80 space-y-2 mt-4">
                <div className="flex justify-between font-mono font-bold text-xs">
                  <span className="text-slate-300">TOTAL LIABILITAS & EKUITAS:</span>
                  <span className="text-cyan-300">{formatFinancialNumber(computedTotalLiabAndEquity, currency)}</span>
                </div>
                <div className="flex justify-between font-mono font-bold text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-300">SELISIH KESEIMBANGAN:</span>
                  <span className={isBsBalanced ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatFinancialNumber(bsCheck, currency)} {isBsBalanced ? '(SEIMBANG)' : '(TIDAK SEIMBANG)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CASH FLOW (100% COMPLETE: ALL 13 CASH FLOW LINE ITEMS) */}
      {adminTab === 'cashflow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Input Laporan Arus Kas Lengkap ({activeEditingPeriod.label})</h3>
              <p className="text-xs text-slate-400">
                Lengkapi seluruh penyesuaian modal kerja operasional, belanja modal CapEx, dan aktivitas pendanaan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncNetIncomeToCF}
                className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sinkronkan Laba Bersih & Depresiasi dari Laba Rugi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* 1. Operating Activities */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                1. Aktivitas Operasi (Operating CF)
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Laba Bersih Akrual (Net Income)</label>
                <input
                  type="number"
                  value={draftCF.operatingActivities.netIncome}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      operatingActivities: { ...draftCF.operatingActivities, netIncome: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Depresiasi & Amortisasi (Non-Cash)</label>
                <input
                  type="number"
                  value={draftCF.operatingActivities.depreciationAmortization}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      operatingActivities: { ...draftCF.operatingActivities, depreciationAmortization: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Perubahan Piutang Usaha (Δ AR)</label>
                <input
                  type="number"
                  value={draftCF.operatingActivities.changeInReceivables}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      operatingActivities: { ...draftCF.operatingActivities, changeInReceivables: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Piutang naik = negatif (kas terserap)</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Perubahan Persediaan (Δ Inventory)</label>
                <input
                  type="number"
                  value={draftCF.operatingActivities.changeInInventory}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      operatingActivities: { ...draftCF.operatingActivities, changeInInventory: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Persediaan naik = negatif (kas terserap)</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Perubahan Utang Usaha (Δ AP)</label>
                <input
                  type="number"
                  value={draftCF.operatingActivities.changeInPayables}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      operatingActivities: { ...draftCF.operatingActivities, changeInPayables: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Utang usaha naik = positif (penundaan kas keluar)</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Penyesuaian Kas Operasi Lainnya</label>
                <input
                  type="number"
                  value={draftCF.operatingActivities.otherOperating}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      operatingActivities: { ...draftCF.operatingActivities, otherOperating: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="p-2 bg-slate-900 border border-cyan-800/60 rounded font-mono font-bold text-cyan-300 flex justify-between">
                <span>TOTAL ARUS KAS OPERASI:</span>
                <span>{formatFinancialNumber(computedTotalOpsCF, currency)}</span>
              </div>
            </div>

            {/* 2. Investing Activities */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                2. Aktivitas Investasi (Investing CF)
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Belanja Modal / CapEx (Negatif: Kas Keluar)</label>
                <input
                  type="number"
                  value={draftCF.investingActivities.capitalExpenditures}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      investingActivities: { ...draftCF.investingActivities, capitalExpenditures: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500">Pembelian mesin, pabrik, peralatan (CapEx)</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Akuisisi & Investasi Jangka Panjang</label>
                <input
                  type="number"
                  value={draftCF.investingActivities.acquisitionsAndInvestments}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      investingActivities: { ...draftCF.investingActivities, acquisitionsAndInvestments: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Arus Kas Investasi Lainnya</label>
                <input
                  type="number"
                  value={draftCF.investingActivities.otherInvesting}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      investingActivities: { ...draftCF.investingActivities, otherInvesting: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="p-2 bg-slate-900 border border-amber-800/60 rounded font-mono font-bold text-amber-300 flex justify-between">
                <span>TOTAL ARUS KAS INVESTASI:</span>
                <span>{formatFinancialNumber(computedTotalInvCF, currency)}</span>
              </div>

              {/* Free Cash Flow preview */}
              <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400">Free Cash Flow (OCF - CapEx):</span>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {formatFinancialNumber(computedTotalOpsCF - Math.abs(draftCF.investingActivities.capitalExpenditures), currency)}
                </div>
              </div>
            </div>

            {/* 3. Financing & Cash Rollforward */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="font-semibold text-purple-400 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
                3. Aktivitas Pendanaan (Financing CF)
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Penerbitan / (Pelunasan) Pinjaman Utang</label>
                <input
                  type="number"
                  value={draftCF.financingActivities.debtIssuedRepaid}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      financingActivities: { ...draftCF.financingActivities, debtIssuedRepaid: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Dividen Dibayarkan (Negatif: Kas Keluar)</label>
                <input
                  type="number"
                  value={draftCF.financingActivities.dividendsPaid}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      financingActivities: { ...draftCF.financingActivities, dividendsPaid: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Emisi / (Buyback) Saham Ekuitas</label>
                <input
                  type="number"
                  value={draftCF.financingActivities.equityIssuedRepurchased}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      financingActivities: { ...draftCF.financingActivities, equityIssuedRepurchased: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Arus Kas Pendanaan Lainnya</label>
                <input
                  type="number"
                  value={draftCF.financingActivities.otherFinancing}
                  onChange={(e) =>
                    setDraftCF({
                      ...draftCF,
                      financingActivities: { ...draftCF.financingActivities, otherFinancing: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                />
              </div>

              <div className="p-2 bg-slate-900 border border-purple-800/60 rounded font-mono font-bold text-purple-300 flex justify-between">
                <span>TOTAL ARUS KAS PENDANAAN:</span>
                <span>{formatFinancialNumber(computedTotalFinCF, currency)}</span>
              </div>

              {/* Cash Rollforward Card */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 space-y-2 mt-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Saldo Kas Awal Periode:</label>
                  <input
                    type="number"
                    value={draftCF.beginningCash}
                    onChange={(e) => setDraftCF({ ...draftCF, beginningCash: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                </div>

                <div className="flex justify-between font-mono text-xs">
                  <span className="text-slate-400">Perubahan Bersih Kas:</span>
                  <span className={computedNetChangeInCash >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {formatFinancialNumber(computedNetChangeInCash, currency)}
                  </span>
                </div>

                <div className="flex justify-between font-mono font-bold text-xs pt-1 border-t border-slate-800 text-white">
                  <span>SALDO KAS AKHIR TERHITUNG:</span>
                  <span className="text-cyan-300">{formatFinancialNumber(computedEndingCash, currency)}</span>
                </div>

                <div className="flex justify-between font-mono text-[11px] pt-1 text-slate-400">
                  <span>Kas di Neraca:</span>
                  <span>{formatFinancialNumber(draftBS.cashAndEquivalents, currency)}</span>
                </div>

                <div className={`p-1.5 rounded text-[11px] font-mono text-center font-semibold ${
                  isCashReconciled ? 'bg-emerald-950/60 text-emerald-300' : 'bg-amber-950/60 text-amber-300'
                }`}>
                  {isCashReconciled ? 'Rekonsiliasi Kas: MATCH (Sesuai Neraca)' : `Selisih Rekonsiliasi: ${formatFinancialNumber(cashReconDelta, currency)}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: PRODUCT BREAKDOWN */}
      {adminTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Rincian Portofolio Produk & Lini Bisnis</h3>
              <p className="text-xs text-slate-400">
                Atur kontribusi omzet dan HPP per segmen produk untuk analisis profitabilitas.
              </p>
            </div>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {draftProducts.map((p, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 bg-slate-950 rounded border border-slate-800 items-end text-xs"
              >
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400">Nama Produk / Lini Layanan</label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handleUpdateProduct(idx, 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Omzet Penjualan</label>
                  <input
                    type="number"
                    value={p.revenue}
                    onChange={(e) => handleUpdateProduct(idx, 'revenue', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">HPP / COGS</label>
                  <input
                    type="number"
                    value={p.cogs}
                    onChange={(e) => handleUpdateProduct(idx, 'cogs', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-right font-mono">
                    <span className="text-cyan-300 font-bold block">{p.marginPercent}%</span>
                    <span className="text-[10px] text-slate-500">Margin Kotor</span>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(idx)}
                    className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-slate-800 rounded"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: BUDGET VS ACTUAL */}
      {adminTab === 'budget' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Kelola Akun Anggaran vs Realisasi (Budget vs Actual)</h3>
              <p className="text-xs text-slate-400">
                Entri nilai target anggaran dan realisasi per departemen. Logika Favorable/Unfavorable dihitung otomatis.
              </p>
            </div>
            <button
              onClick={handleAddBudgetRow}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Akun Anggaran</span>
            </button>
          </div>

          <div className="space-y-3">
            {draftBudget.map((b, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-6 gap-3 p-3 bg-slate-950 rounded border border-slate-800 items-end text-xs"
              >
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400">Nama Akun / Uraian</label>
                  <input
                    type="text"
                    value={b.accountName}
                    onChange={(e) => handleUpdateBudgetRow(idx, 'accountName', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Kategori Akun</label>
                  <select
                    value={b.category}
                    onChange={(e) => handleUpdateBudgetRow(idx, 'category', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                  >
                    <option value="Revenue">Revenue</option>
                    <option value="COGS">COGS</option>
                    <option value="OpEx">OpEx</option>
                    <option value="CapEx">CapEx</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Departemen</label>
                  <input
                    type="text"
                    value={b.department}
                    onChange={(e) => handleUpdateBudgetRow(idx, 'department', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Budget (Anggaran)</label>
                  <input
                    type="number"
                    value={b.budget}
                    onChange={(e) => handleUpdateBudgetRow(idx, 'budget', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <label className="text-slate-400">Actual (Realisasi)</label>
                    <input
                      type="number"
                      value={b.actual}
                      onChange={(e) => handleUpdateBudgetRow(idx, 'actual', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteBudgetRow(idx)}
                    className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-slate-800 rounded self-end mb-1"
                    title="Hapus Akun"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: COMPANY PROFILE SETTINGS */}
      {adminTab === 'company' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Pengaturan Profil Perusahaan & Parameter Pasar</h3>
            <p className="text-xs text-slate-400">
              Ubah identitas korporat, mata uang pelaporan, jumlah saham beredar, dan harga saham pasar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nama Resmi Perusahaan</label>
              <input
                type="text"
                value={draftCompany.name}
                onChange={(e) => setDraftCompany({ ...draftCompany, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Kode Ticker Saham</label>
              <input
                type="text"
                value={draftCompany.ticker}
                onChange={(e) => setDraftCompany({ ...draftCompany, ticker: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Sektor Industri</label>
              <input
                type="text"
                value={draftCompany.industry}
                onChange={(e) => setDraftCompany({ ...draftCompany, industry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Mata Uang Pelaporan Dasar</label>
              <select
                value={draftCompany.currency}
                onChange={(e) => setDraftCompany({ ...draftCompany, currency: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="IDR">IDR (Rp - Indonesian Rupiah)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Jumlah Lembar Saham Beredar</label>
              <input
                type="number"
                value={draftCompany.sharesOutstanding}
                onChange={(e) => setDraftCompany({ ...draftCompany, sharesOutstanding: parseFloat(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Harga Saham Terkini (Stock Price)</label>
              <input
                type="number"
                value={draftCompany.currentStockPrice}
                onChange={(e) => setDraftCompany({ ...draftCompany, currentStockPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 font-medium">Deskripsi & Profil Bisnis</label>
              <textarea
                rows={3}
                value={draftCompany.description}
                onChange={(e) => setDraftCompany({ ...draftCompany, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: INTEGRATION GUIDE & SYNC HUB */}
      {adminTab === 'sync' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Link className="w-5 h-5 text-cyan-400" />
              Cara Menghubungkan Website Admin ke Website Visualisasi
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Terdapat 3 metode arsitektur standar untuk mengintegrasikan website input admin ini dengan website visualisasi dashboard:
            </p>
          </div>

          {/* 3 Methods Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Method 1 */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                METODE 1 (SUDAH AKTIF)
              </span>
              <h4 className="text-sm font-semibold text-white">Unified State & LocalStorage Bridge</h4>
              <p className="text-slate-400 leading-relaxed">
                Di aplikasi ini, saat Anda menekan tombol <strong>"Simpan Perubahan ke Dashboard"</strong> di Admin, data langsung tersimpan ke <em>reactive state & browser storage</em>. Saat Anda beralih ke tab visualisasi, seluruh 14 halaman langsung otomatis memperbarui grafik dan rasio tanpa perlu reload.
              </p>
            </div>

            {/* Method 2 */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                METODE 2 (PRODUKSI)
              </span>
              <h4 className="text-sm font-semibold text-white">Shared Backend REST API / Database</h4>
              <p className="text-slate-400 leading-relaxed">
                Jika website admin di-hosting di domain terpisah (misal: <code>admin.perusahaan.com</code>) dan visualisasi di <code>analytics.perusahaan.com</code>:
                Kedua website mengakses database terpusat yang sama (PostgreSQL, MySQL, atau Firestore) via endpoint REST API <code>/api/v1/financial-reports</code>.
              </p>
            </div>

            {/* Method 3 */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                METODE 3 (OFFLINE / FILE)
              </span>
              <h4 className="text-sm font-semibold text-white">JSON / Excel Database Export-Import</h4>
              <p className="text-slate-400 leading-relaxed">
                Admin mengekspor data ke file JSON atau Excel menggunakan tombol <strong>Export Database JSON</strong> di bawah, kemudian operator visualisasi mengunggah file tersebut melalui halaman <em>Data Import & Mapping</em>.
              </p>
            </div>
          </div>

          {/* Export JSON Button */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Download Data Entitas Saat Ini (JSON Package)</span>
              <span className="text-[11px] text-slate-400">Dapat disimpan sebagai file backup atau dipindahkan ke server lain</span>
            </div>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs border border-slate-700 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Database JSON</span>
            </button>
          </div>

          {/* Technical Integration Code Example */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-cyan-400" />
                Contoh Script Koneksi Dua Website Terpisah (Fetch API):
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(integrationSnippet);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Disalin!' : 'Salin Kode'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              {integrationSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
