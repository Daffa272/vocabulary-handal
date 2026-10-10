import {
  BalanceSheetData,
  CashFlowData,
  CurrencyCode,
  FinancialPeriodRecord,
  FinancialRatios,
  IncomeStatementData,
} from '../types/financial';

/**
 * Safe division to strictly avoid division by zero, null, or NaN
 */
export function safeDivide(
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  multiplier: number = 1,
  decimals: number = 2
): number | null {
  if (
    numerator === null ||
    numerator === undefined ||
    denominator === null ||
    denominator === undefined ||
    isNaN(numerator) ||
    isNaN(denominator) ||
    denominator === 0
  ) {
    return null;
  }
  const result = (numerator / denominator) * multiplier;
  if (!isFinite(result) || isNaN(result)) return null;
  return Number(result.toFixed(decimals));
}

/**
 * Currency configuration & conversion
 */
export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; name: string; rateToUSD: number }
> = {
  USD: { symbol: '$', name: 'US Dollar (USD)', rateToUSD: 1.0 },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah (IDR)', rateToUSD: 16000 },
  EUR: { symbol: '€', name: 'Euro (EUR)', rateToUSD: 0.92 },
  GBP: { symbol: '£', name: 'British Pound (GBP)', rateToUSD: 0.79 },
};

export function formatFinancialNumber(
  amount: number | null | undefined,
  currency: CurrencyCode = 'USD',
  compact: boolean = false
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const { symbol, rateToUSD } = CURRENCY_CONFIG[currency];
  const converted = amount * rateToUSD;
  const isNegative = converted < 0;
  const absVal = Math.abs(converted);

  if (compact) {
    if (absVal >= 1_000_000_000_000) {
      return `${isNegative ? '-' : ''}${symbol}${(absVal / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (absVal >= 1_000_000_000) {
      return `${isNegative ? '-' : ''}${symbol}${(absVal / 1_000_000_000).toFixed(2)}B`;
    }
    if (absVal >= 1_000_000) {
      return `${isNegative ? '-' : ''}${symbol}${(absVal / 1_000_000).toFixed(2)}M`;
    }
    if (absVal >= 1_000) {
      return `${isNegative ? '-' : ''}${symbol}${(absVal / 1_000).toFixed(1)}k`;
    }
  }

  if (currency === 'IDR') {
    const formatted = Math.round(absVal).toLocaleString('id-ID');
    return isNegative ? `(${symbol} ${formatted})` : `${symbol} ${formatted}`;
  }

  const formatted = absVal.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return isNegative ? `(${symbol}${formatted})` : `${symbol}${formatted}`;
}

export function formatPercent(value: number | null | undefined, withSign: boolean = false): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const prefix = withSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatRatio(value: number | null | undefined, suffix: string = 'x'): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return `${value.toFixed(2)}${suffix}`;
}

/**
 * Calculates financial ratios with options for average balance calculation when prior period is available
 */
export function calculateFinancialRatios(
  current: FinancialPeriodRecord,
  prior?: FinancialPeriodRecord | null
): FinancialRatios {
  const is = current.incomeStatement;
  const bs = current.balanceSheet;
  const cf = current.cashFlow;

  const avgAssets = prior ? (current.balanceSheet.totalAssets + prior.balanceSheet.totalAssets) / 2 : bs.totalAssets;
  const avgEquity = prior ? (current.balanceSheet.totalEquity + prior.balanceSheet.totalEquity) / 2 : bs.totalEquity;
  const avgInventory = prior ? (current.balanceSheet.inventory + prior.balanceSheet.inventory) / 2 : bs.inventory;
  const avgAR = prior ? (current.balanceSheet.accountsReceivable + prior.balanceSheet.accountsReceivable) / 2 : bs.accountsReceivable;
  const avgAP = prior ? (current.balanceSheet.accountsPayable + prior.balanceSheet.accountsPayable) / 2 : bs.accountsPayable;

  const currentRatio = safeDivide(bs.totalCurrentAssets, bs.totalCurrentLiabilities);
  const quickAssets = bs.cashAndEquivalents + bs.accountsReceivable;
  const quickRatio = safeDivide(quickAssets, bs.totalCurrentLiabilities);
  const cashRatio = safeDivide(bs.cashAndEquivalents, bs.totalCurrentLiabilities);

  const grossProfitMargin = safeDivide(is.grossProfit, is.revenue, 100);
  const operatingProfitMargin = safeDivide(is.operatingIncome, is.revenue, 100);
  const netProfitMargin = safeDivide(is.netIncome, is.revenue, 100);
  const roa = safeDivide(is.netIncome, avgAssets, 100);
  const roe = safeDivide(is.netIncome, avgEquity, 100);

  const debtToEquity = safeDivide(bs.totalLiabilities, bs.totalEquity);
  const interestBearingDebt = bs.shortTermDebt + bs.longTermDebt;
  const debtToEquityInterestBearing = safeDivide(interestBearingDebt, bs.totalEquity);
  const debtRatio = safeDivide(bs.totalLiabilities, bs.totalAssets, 100);
  const interestCoverage = is.interestExpense > 0 ? safeDivide(is.operatingIncome, is.interestExpense) : null;

  const inventoryTurnover = safeDivide(is.costOfGoodsSold, avgInventory);
  const daysInventoryOutstanding = is.costOfGoodsSold > 0 ? safeDivide(avgInventory, is.costOfGoodsSold, 365) : null;

  const receivablesTurnover = safeDivide(is.revenue, avgAR);
  const daysSalesOutstanding = is.revenue > 0 ? safeDivide(avgAR, is.revenue, 365) : null;

  const payablesTurnover = safeDivide(is.costOfGoodsSold, avgAP);
  const daysPayableOutstanding = is.costOfGoodsSold > 0 ? safeDivide(avgAP, is.costOfGoodsSold, 365) : null;

  const assetTurnover = safeDivide(is.revenue, avgAssets);

  let cashConversionCycle: number | null = null;
  if (daysSalesOutstanding !== null && daysInventoryOutstanding !== null && daysPayableOutstanding !== null) {
    cashConversionCycle = Number((daysSalesOutstanding + daysInventoryOutstanding - daysPayableOutstanding).toFixed(1));
  }

  const operatingCashFlowRatio = safeDivide(cf.operatingActivities.total, bs.totalCurrentLiabilities);
  const freeCashFlow = cf.operatingActivities.total - Math.abs(cf.investingActivities.capitalExpenditures);
  const cashFlowToDebt = safeDivide(cf.operatingActivities.total, bs.totalLiabilities);

  return {
    currentRatio,
    quickRatio,
    cashRatio,
    grossProfitMargin,
    operatingProfitMargin,
    netProfitMargin,
    roa,
    roe,
    hasAverageBalanceWarning: !prior,
    debtToEquity,
    debtToEquityInterestBearing,
    debtRatio,
    interestCoverage,
    inventoryTurnover,
    daysInventoryOutstanding,
    receivablesTurnover,
    daysSalesOutstanding,
    payablesTurnover,
    daysPayableOutstanding,
    assetTurnover,
    cashConversionCycle,
    operatingCashFlowRatio,
    freeCashFlow,
    cashFlowToDebt,
  };
}

/**
 * Balance sheet verification helper
 */
export function verifyBalanceSheet(bs: BalanceSheetData, tolerance: number = 0.01): {
  isBalanced: boolean;
  delta: number;
} {
  const assets = bs.totalAssets;
  const liabAndEquity = bs.totalLiabilities + bs.totalEquity;
  const delta = assets - liabAndEquity;
  return {
    isBalanced: Math.abs(delta) <= tolerance,
    delta: Number(delta.toFixed(2)),
  };
}
