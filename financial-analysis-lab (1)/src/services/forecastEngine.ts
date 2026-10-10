import { FinancialPeriodRecord, ForecastAssumptions } from '../types/financial';

export interface ProjectedPeriod {
  year: number;
  periodLabel: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPercent: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingMarginPercent: number;
  interestExpense: number;
  taxExpense: number;
  netIncome: number;
  netMarginPercent: number;
  accountsReceivable: number;
  inventory: number;
  workingCapital: number;
  operatingCashFlow: number;
  capEx: number;
  freeCashFlow: number;
  endingCash: number;
}

export interface ScenarioResult {
  name: string;
  assumptions: ForecastAssumptions;
  projections: ProjectedPeriod[];
  cagrRevenue: number;
  cagrNetIncome: number;
  cumulativeFreeCashFlow: number;
  breakEvenRevenue: number;
}

export function generateForecastProjections(
  basePeriod: FinancialPeriodRecord,
  assumptions: ForecastAssumptions,
  projectionYears: number = 5
): ProjectedPeriod[] {
  const results: ProjectedPeriod[] = [];

  let lastRevenue = basePeriod.incomeStatement.revenue;
  let lastOpEx = basePeriod.incomeStatement.operatingExpenses.total;
  let lastCash = basePeriod.balanceSheet.cashAndEquivalents;
  let lastInventory = basePeriod.balanceSheet.inventory;

  const baseYear = basePeriod.year;

  for (let i = 1; i <= projectionYears; i++) {
    const currentYear = baseYear + i;
    const projectedRevenue = lastRevenue * (1 + assumptions.revenueGrowthPercent / 100);
    const grossMarginRatio = assumptions.grossMarginPercent / 100;
    const projectedGrossProfit = projectedRevenue * grossMarginRatio;
    const projectedCOGS = projectedRevenue - projectedGrossProfit;

    const projectedOpEx = lastOpEx * (1 + assumptions.opExGrowthPercent / 100);
    const projectedOperatingIncome = projectedGrossProfit - projectedOpEx;

    const taxableIncome = Math.max(0, projectedOperatingIncome - assumptions.interestExpense);
    const projectedTax = taxableIncome * (assumptions.taxRatePercent / 100);
    const projectedNetIncome = projectedOperatingIncome - assumptions.interestExpense - projectedTax;

    // Working Capital projection
    const projectedAR = (projectedRevenue / 365) * assumptions.targetDSO;
    const projectedInventory = lastInventory * (1 + assumptions.inventoryGrowthPercent / 100);
    const projectedAP = (projectedCOGS / 365) * 45; // standardized 45 days AP
    const projectedWorkingCapital = projectedAR + projectedInventory - projectedAP;

    // Approximate Operating Cash Flow: Net Income + Depreciation (~4% of revenue) - Δ NWC
    const depreciationApprox = projectedRevenue * 0.04;
    const priorNWC = results.length > 0 
      ? results[results.length - 1].workingCapital 
      : (basePeriod.balanceSheet.accountsReceivable + basePeriod.balanceSheet.inventory - basePeriod.balanceSheet.accountsPayable);
    const deltaNWC = projectedWorkingCapital - priorNWC;
    const projectedOCF = projectedNetIncome + depreciationApprox - deltaNWC;

    // CapEx & Free Cash Flow
    const projectedCapEx = projectedRevenue * (assumptions.capExPercentOfRevenue / 100);
    const projectedFCF = projectedOCF - projectedCapEx;
    const projectedEndingCash = Math.max(0, lastCash + projectedFCF);

    results.push({
      year: currentYear,
      periodLabel: `${currentYear} (E)`,
      revenue: Math.round(projectedRevenue),
      cogs: Math.round(projectedCOGS),
      grossProfit: Math.round(projectedGrossProfit),
      grossMarginPercent: Number(assumptions.grossMarginPercent.toFixed(1)),
      operatingExpenses: Math.round(projectedOpEx),
      operatingIncome: Math.round(projectedOperatingIncome),
      operatingMarginPercent: Number(((projectedOperatingIncome / projectedRevenue) * 100).toFixed(1)),
      interestExpense: Math.round(assumptions.interestExpense),
      taxExpense: Math.round(projectedTax),
      netIncome: Math.round(projectedNetIncome),
      netMarginPercent: Number(((projectedNetIncome / projectedRevenue) * 100).toFixed(1)),
      accountsReceivable: Math.round(projectedAR),
      inventory: Math.round(projectedInventory),
      workingCapital: Math.round(projectedWorkingCapital),
      operatingCashFlow: Math.round(projectedOCF),
      capEx: Math.round(projectedCapEx),
      freeCashFlow: Math.round(projectedFCF),
      endingCash: Math.round(projectedEndingCash),
    });

    // Roll forward to next loop
    lastRevenue = projectedRevenue;
    lastOpEx = projectedOpEx;
    lastCash = projectedEndingCash;
    lastInventory = projectedInventory;
  }

  return results;
}

export function calculateBreakEvenRevenue(opEx: number, grossMarginPercent: number): number {
  if (grossMarginPercent <= 0) return 0;
  return Math.round(opEx / (grossMarginPercent / 100));
}

export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
  return Number(((Math.pow(endValue / startValue, 1 / years) - 1) * 100).toFixed(1));
}
