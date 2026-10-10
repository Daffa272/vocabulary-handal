export type CurrencyCode = 'USD' | 'IDR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rate
  format: (amount: number) => string;
}

export interface IncomeStatementData {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number; // revenue - cogs
  operatingExpenses: {
    rd: number;
    sga: number;
    depreciation: number;
    other: number;
    total: number;
  };
  operatingIncome: number; // grossProfit - operatingExpenses.total
  interestExpense: number;
  otherIncomeExpense: number;
  incomeBeforeTax: number; // operatingIncome - interestExpense + otherIncomeExpense
  incomeTaxExpense: number;
  netIncome: number; // incomeBeforeTax - incomeTaxExpense
}

export interface BalanceSheetData {
  // Current Assets
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;

  // Non-Current Assets
  propertyPlantEquipment: number;
  intangibleAssets: number;
  longTermInvestments: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;

  totalAssets: number;

  // Current Liabilities
  accountsPayable: number;
  shortTermDebt: number;
  accruedLiabilities: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;

  // Non-Current Liabilities
  longTermDebt: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;

  totalLiabilities: number;

  // Equity
  commonStock: number;
  retainedEarnings: number;
  additionalPaidInCapital: number;
  totalEquity: number;

  // Verification
  isBalanced: boolean;
  discrepancy: number; // totalAssets - (totalLiabilities + totalEquity)
}

export interface CashFlowData {
  operatingActivities: {
    netIncome: number;
    depreciationAmortization: number;
    changeInReceivables: number;
    changeInInventory: number;
    changeInPayables: number;
    otherOperating: number;
    total: number;
  };
  investingActivities: {
    capitalExpenditures: number;
    acquisitionsAndInvestments: number;
    otherInvesting: number;
    total: number;
  };
  financingActivities: {
    debtIssuedRepaid: number;
    dividendsPaid: number;
    equityIssuedRepurchased: number;
    otherFinancing: number;
    total: number;
  };
  netChangeInCash: number;
  beginningCash: number;
  endingCash: number;
  reconciliationDelta: number; // endingCash vs BalanceSheet cashAndEquivalents
}

export interface ProductBreakdown {
  name: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  marginPercent: number;
}

export interface BusinessUnitBreakdown {
  name: string;
  revenue: number;
  operatingIncome: number;
  headcount: number;
}

export interface BudgetActualRow {
  accountName: string;
  category: 'Revenue' | 'COGS' | 'OpEx' | 'Interest' | 'Tax' | 'CapEx';
  department: string;
  budget: number;
  actual: number;
  variance: number; // actual - budget
  variancePercent: number | null; // safe division
  isFavorable: boolean;
}

export interface FinancialPeriodRecord {
  periodId: string; // e.g. "2025", "2025-Q1", "2025-M03"
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  month?: number;
  label: string;
  type: 'Annual' | 'Quarterly' | 'Monthly';
  incomeStatement: IncomeStatementData;
  balanceSheet: BalanceSheetData;
  cashFlow: CashFlowData;
  products?: ProductBreakdown[];
  businessUnits?: BusinessUnitBreakdown[];
  budgetActual?: BudgetActualRow[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  currency: CurrencyCode;
  description: string;
  sharesOutstanding: number;
  currentStockPrice: number;
  periods: FinancialPeriodRecord[];
}

export interface FinancialRatios {
  // Liquidity
  currentRatio: number | null;
  quickRatio: number | null;
  cashRatio: number | null;

  // Profitability
  grossProfitMargin: number | null;
  operatingProfitMargin: number | null;
  netProfitMargin: number | null;
  roa: number | null;
  roe: number | null;
  hasAverageBalanceWarning?: boolean;

  // Solvency
  debtToEquity: number | null;
  debtToEquityInterestBearing: number | null;
  debtRatio: number | null;
  interestCoverage: number | null;

  // Efficiency
  inventoryTurnover: number | null;
  daysInventoryOutstanding: number | null;
  receivablesTurnover: number | null;
  daysSalesOutstanding: number | null;
  payablesTurnover: number | null;
  daysPayableOutstanding: number | null;
  assetTurnover: number | null;
  cashConversionCycle: number | null;

  // Cash Flow
  operatingCashFlowRatio: number | null;
  freeCashFlow: number | null;
  cashFlowToDebt: number | null;
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'Balance Sheet' | 'Cash Flow' | 'Missing Data' | 'Sign Convention' | 'Arithmetic';
  title: string;
  affectedAccountOrPeriod: string;
  impact: string;
  recommendation: string;
}

export interface InterpretationItem {
  id: string;
  domain: 'Liquidity' | 'Profitability' | 'Solvency' | 'Cash Flow' | 'Working Capital';
  keyFinding: string;
  evidence: string;
  interpretation: string;
  potentialRisk: string;
  recommendedInvestigation: string;
  limitations: string;
}

export interface ForecastAssumptions {
  revenueGrowthPercent: number;
  grossMarginPercent: number;
  opExGrowthPercent: number;
  taxRatePercent: number;
  interestExpense: number;
  capExPercentOfRevenue: number;
  targetDSO: number;
  inventoryGrowthPercent: number;
}

export interface ScenarioDefinition {
  name: 'Base Case' | 'Optimistic Case' | 'Pessimistic Case';
  description: string;
  assumptions: ForecastAssumptions;
}

export interface ValuationInputs {
  waccPercent: number;
  terminalGrowthPercent: number;
  forecastYears: number;
  sharesOutstanding: number;
  netDebtAdjustment: number;
}
