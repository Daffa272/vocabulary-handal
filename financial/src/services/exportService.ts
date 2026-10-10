import * as XLSX from 'xlsx';
import { CompanyProfile, FinancialPeriodRecord, FinancialRatios } from '../types/financial';
import { formatFinancialNumber, formatPercent, formatRatio } from './calculationEngine';

export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportIncomeStatementCSV(periods: FinancialPeriodRecord[]): void {
  const headers = ['Line Item', ...periods.map((p) => p.label)];
  const rows = [
    ['Revenue', ...periods.map((p) => p.incomeStatement.revenue.toString())],
    ['Cost of Goods Sold (COGS)', ...periods.map((p) => p.incomeStatement.costOfGoodsSold.toString())],
    ['Gross Profit', ...periods.map((p) => p.incomeStatement.grossProfit.toString())],
    ['R&D Expenses', ...periods.map((p) => p.incomeStatement.operatingExpenses.rd.toString())],
    ['SG&A Expenses', ...periods.map((p) => p.incomeStatement.operatingExpenses.sga.toString())],
    ['Depreciation & Amortization', ...periods.map((p) => p.incomeStatement.operatingExpenses.depreciation.toString())],
    ['Total Operating Expenses', ...periods.map((p) => p.incomeStatement.operatingExpenses.total.toString())],
    ['Operating Income (EBIT)', ...periods.map((p) => p.incomeStatement.operatingIncome.toString())],
    ['Interest Expense', ...periods.map((p) => p.incomeStatement.interestExpense.toString())],
    ['Income Before Taxes (EBT)', ...periods.map((p) => p.incomeStatement.incomeBeforeTax.toString())],
    ['Income Tax Expense', ...periods.map((p) => p.incomeStatement.incomeTaxExpense.toString())],
    ['Net Income', ...periods.map((p) => p.incomeStatement.netIncome.toString())],
  ];

  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
  downloadCSV('Income_Statement.csv', csv);
}

export function exportFullFinancialModelExcel(
  company: CompanyProfile,
  ratiosMap: Record<string, FinancialRatios>
): void {
  const wb = XLSX.utils.book_new();

  // 1. Summary Sheet
  const summaryAoa = [
    ['FINANCIAL ANALYSIS LAB - EXECUTIVE SUMMARY REPORT'],
    ['Company Name', company.name],
    ['Ticker / Code', company.ticker],
    ['Industry Sector', company.industry],
    ['Currency', company.currency],
    ['Total Periods Analyzed', company.periods.length],
    [],
    ['KEY PERFORMANCE METRICS SUMMARY'],
    ['Period', 'Revenue', 'Gross Profit', 'Operating Income', 'Net Income', 'Operating Cash Flow', 'Current Ratio', 'D/E Ratio'],
    ...company.periods.map((p) => {
      const r = ratiosMap[p.periodId];
      return [
        p.label,
        p.incomeStatement.revenue,
        p.incomeStatement.grossProfit,
        p.incomeStatement.operatingIncome,
        p.incomeStatement.netIncome,
        p.cashFlow.operatingActivities.total,
        r?.currentRatio ?? 'N/A',
        r?.debtToEquity ?? 'N/A',
      ];
    }),
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryAoa);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // 2. Income Statement Sheet
  const isAoa = [
    ['INCOME STATEMENT', ...company.periods.map((p) => p.label)],
    ['Revenue', ...company.periods.map((p) => p.incomeStatement.revenue)],
    ['Cost of Goods Sold', ...company.periods.map((p) => p.incomeStatement.costOfGoodsSold)],
    ['Gross Profit', ...company.periods.map((p) => p.incomeStatement.grossProfit)],
    ['Total Operating Expenses', ...company.periods.map((p) => p.incomeStatement.operatingExpenses.total)],
    ['Operating Income (EBIT)', ...company.periods.map((p) => p.incomeStatement.operatingIncome)],
    ['Interest Expense', ...company.periods.map((p) => p.incomeStatement.interestExpense)],
    ['Income Before Tax', ...company.periods.map((p) => p.incomeStatement.incomeBeforeTax)],
    ['Income Tax Expense', ...company.periods.map((p) => p.incomeStatement.incomeTaxExpense)],
    ['Net Income', ...company.periods.map((p) => p.incomeStatement.netIncome)],
  ];
  const isWs = XLSX.utils.aoa_to_sheet(isAoa);
  XLSX.utils.book_append_sheet(wb, isWs, 'Income Statement');

  // 3. Balance Sheet
  const bsAoa = [
    ['BALANCE SHEET', ...company.periods.map((p) => p.label)],
    ['Cash and Cash Equivalents', ...company.periods.map((p) => p.balanceSheet.cashAndEquivalents)],
    ['Accounts Receivable', ...company.periods.map((p) => p.balanceSheet.accountsReceivable)],
    ['Inventory', ...company.periods.map((p) => p.balanceSheet.inventory)],
    ['Other Current Assets', ...company.periods.map((p) => p.balanceSheet.otherCurrentAssets)],
    ['Total Current Assets', ...company.periods.map((p) => p.balanceSheet.totalCurrentAssets)],
    ['Total Non-Current Assets', ...company.periods.map((p) => p.balanceSheet.totalNonCurrentAssets)],
    ['TOTAL ASSETS', ...company.periods.map((p) => p.balanceSheet.totalAssets)],
    ['Accounts Payable', ...company.periods.map((p) => p.balanceSheet.accountsPayable)],
    ['Short-Term Debt', ...company.periods.map((p) => p.balanceSheet.shortTermDebt)],
    ['Total Current Liabilities', ...company.periods.map((p) => p.balanceSheet.totalCurrentLiabilities)],
    ['Long-Term Debt', ...company.periods.map((p) => p.balanceSheet.longTermDebt)],
    ['TOTAL LIABILITIES', ...company.periods.map((p) => p.balanceSheet.totalLiabilities)],
    ['TOTAL EQUITY', ...company.periods.map((p) => p.balanceSheet.totalEquity)],
    ['Total Liabilities & Equity', ...company.periods.map((p) => p.balanceSheet.totalLiabilities + p.balanceSheet.totalEquity)],
    ['Balance Equilibrium Check (Delta)', ...company.periods.map((p) => p.balanceSheet.discrepancy)],
  ];
  const bsWs = XLSX.utils.aoa_to_sheet(bsAoa);
  XLSX.utils.book_append_sheet(wb, bsWs, 'Balance Sheet');

  // 4. Cash Flow Statement
  const cfAoa = [
    ['CASH FLOW STATEMENT', ...company.periods.map((p) => p.label)],
    ['Operating Activities Total', ...company.periods.map((p) => p.cashFlow.operatingActivities.total)],
    ['Capital Expenditures', ...company.periods.map((p) => p.cashFlow.investingActivities.capitalExpenditures)],
    ['Investing Activities Total', ...company.periods.map((p) => p.cashFlow.investingActivities.total)],
    ['Financing Activities Total', ...company.periods.map((p) => p.cashFlow.financingActivities.total)],
    ['Net Change in Cash', ...company.periods.map((p) => p.cashFlow.netChangeInCash)],
    ['Beginning Cash', ...company.periods.map((p) => p.cashFlow.beginningCash)],
    ['Ending Cash', ...company.periods.map((p) => p.cashFlow.endingCash)],
  ];
  const cfWs = XLSX.utils.aoa_to_sheet(cfAoa);
  XLSX.utils.book_append_sheet(wb, cfWs, 'Cash Flow');

  // Write file
  XLSX.writeFile(wb, `${company.ticker}_Financial_Model.xlsx`);
}
