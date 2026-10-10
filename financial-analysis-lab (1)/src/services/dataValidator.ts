import { CompanyProfile, FinancialPeriodRecord, ValidationIssue } from '../types/financial';

export function validateFinancialDataset(
  company: CompanyProfile,
  tolerance: number = 1.0
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check 1: Missing periods or order gaps
  if (!company.periods || company.periods.length === 0) {
    issues.push({
      id: 'no-periods',
      severity: 'error',
      category: 'Missing Data',
      title: 'No Financial Periods Found',
      affectedAccountOrPeriod: company.name,
      impact: 'No analysis or ratio calculations can be performed.',
      recommendation: 'Import or seed at least one financial period dataset.',
    });
    return issues;
  }

  // Iterate over each period
  company.periods.forEach((p, idx) => {
    const is = p.incomeStatement;
    const bs = p.balanceSheet;
    const cf = p.cashFlow;

    // Check 2: Balance Sheet Equilibrium
    const calculatedEquityLiab = bs.totalLiabilities + bs.totalEquity;
    const bsDelta = Math.abs(bs.totalAssets - calculatedEquityLiab);
    if (bsDelta > tolerance) {
      issues.push({
        id: `bs-unbalanced-${p.periodId}`,
        severity: 'error',
        category: 'Balance Sheet',
        title: `Balance Sheet Out of Balance by ${bsDelta.toLocaleString()}`,
        affectedAccountOrPeriod: `${p.label} (Assets vs Liab + Equity)`,
        impact: 'Violates fundamental accounting identity. Ratios relying on assets or equity will be distorted.',
        recommendation: `Check Retained Earnings, Accumulated Depreciation, or rounding entries for a net difference of ${bsDelta.toFixed(2)}.`,
      });
    }

    // Check 3: Income Statement Arithmetic
    const expectedGrossProfit = is.revenue - is.costOfGoodsSold;
    if (Math.abs(expectedGrossProfit - is.grossProfit) > tolerance) {
      issues.push({
        id: `is-gp-calc-${p.periodId}`,
        severity: 'warning',
        category: 'Arithmetic',
        title: 'Gross Profit Discrepancy',
        affectedAccountOrPeriod: `${p.label} (Revenue - COGS)`,
        impact: 'Reported Gross Profit does not equal Revenue minus COGS.',
        recommendation: 'Verify cost allocation and inventory adjustments in COGS.',
      });
    }

    const expectedOpIncome = is.grossProfit - is.operatingExpenses.total;
    if (Math.abs(expectedOpIncome - is.operatingIncome) > tolerance) {
      issues.push({
        id: `is-op-calc-${p.periodId}`,
        severity: 'warning',
        category: 'Arithmetic',
        title: 'Operating Income Calculation Inconsistency',
        affectedAccountOrPeriod: `${p.label} (Gross Profit - OpEx)`,
        impact: 'Operating margin calculations may show irregular variations.',
        recommendation: 'Verify SG&A and R&D additions to ensure sum matches Total OpEx.',
      });
    }

    // Check 4: Cash Flow Statement Internal Consistency
    const calcNetChange =
      cf.operatingActivities.total +
      cf.investingActivities.total +
      cf.financingActivities.total;
    if (Math.abs(calcNetChange - cf.netChangeInCash) > tolerance) {
      issues.push({
        id: `cf-net-change-${p.periodId}`,
        severity: 'warning',
        category: 'Cash Flow',
        title: 'Net Change in Cash Sum Mismatch',
        affectedAccountOrPeriod: `${p.label} (Operating + Investing + Financing)`,
        impact: 'Cash flow reconciliation has an unexplained discrepancy.',
        recommendation: 'Check currency exchange impact or non-cash financing adjustments.',
      });
    }

    // Check 5: Ending Cash = Beginning Cash + Net Change
    const expectedEndingCash = cf.beginningCash + cf.netChangeInCash;
    if (Math.abs(expectedEndingCash - cf.endingCash) > tolerance) {
      issues.push({
        id: `cf-rollforward-${p.periodId}`,
        severity: 'error',
        category: 'Cash Flow',
        title: 'Cash Rollforward Does Not Reconcile',
        affectedAccountOrPeriod: `${p.label} (Beg Cash + Net Change vs Ending Cash)`,
        impact: 'Cash ledger rollforward fails basic reconciliation.',
        recommendation: `Recalculate ending cash: Beginning (${cf.beginningCash}) + Net Change (${cf.netChangeInCash}) = ${expectedEndingCash}.`,
      });
    }

    // Check 6: Ending Cash == Balance Sheet Cash
    if (Math.abs(cf.endingCash - bs.cashAndEquivalents) > tolerance) {
      issues.push({
        id: `cf-bs-cash-mismatch-${p.periodId}`,
        severity: 'warning',
        category: 'Cash Flow',
        title: 'Cash Flow Ending Cash != Balance Sheet Cash',
        affectedAccountOrPeriod: `${p.label} (Cash Flow vs Balance Sheet)`,
        impact: `Cash on BS (${bs.cashAndEquivalents.toLocaleString()}) differs from CF ending cash (${cf.endingCash.toLocaleString()}).`,
        recommendation: 'Confirm whether restricted cash or short-term liquid investments are classified differently.',
      });
    }

    // Check 7: Sign Conventions
    if (is.revenue < 0) {
      issues.push({
        id: `neg-revenue-${p.periodId}`,
        severity: 'error',
        category: 'Sign Convention',
        title: 'Negative Revenue Detected',
        affectedAccountOrPeriod: `${p.label} Revenue`,
        impact: 'Negative revenues distort margin denominators and growth calculations.',
        recommendation: 'Verify if refunds or returns were recorded without reversing gross billings.',
      });
    }

    if (bs.totalAssets < 0 || bs.cashAndEquivalents < 0) {
      issues.push({
        id: `neg-assets-${p.periodId}`,
        severity: 'warning',
        category: 'Sign Convention',
        title: 'Negative Asset Balance',
        affectedAccountOrPeriod: `${p.label} Cash/Assets`,
        impact: 'Overdraft may be mistakenly booked as negative cash instead of short-term liability.',
        recommendation: 'Reclassify bank overdrafts to Current Liabilities.',
      });
    }

    // Check 8: Previous period continuity
    if (idx > 0) {
      const prev = company.periods[idx - 1];
      if (Math.abs(cf.beginningCash - prev.cashFlow.endingCash) > tolerance) {
        issues.push({
          id: `beg-cash-seq-${p.periodId}`,
          severity: 'info',
          category: 'Cash Flow',
          title: 'Period-to-Period Cash Continuity Gap',
          affectedAccountOrPeriod: `${prev.label} -> ${p.label}`,
          impact: 'Current period beginning cash differs from prior period ending cash.',
          recommendation: 'Check if there was a restatement, acquisition opening balance, or currency revaluation.',
        });
      }
    }
  });

  return issues;
}
