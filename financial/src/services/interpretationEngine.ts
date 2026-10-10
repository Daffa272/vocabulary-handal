import { FinancialPeriodRecord, FinancialRatios, InterpretationItem } from '../types/financial';
import { safeDivide } from './calculationEngine';

export function generateFinancialInterpretations(
  current: FinancialPeriodRecord,
  prior: FinancialPeriodRecord | null,
  ratios: FinancialRatios
): InterpretationItem[] {
  const items: InterpretationItem[] = [];

  const curIS = current.incomeStatement;
  const curBS = current.balanceSheet;
  const curCF = current.cashFlow;

  const priorIS = prior?.incomeStatement;
  const priorBS = prior?.balanceSheet;
  const priorCF = prior?.cashFlow;

  // 1. PROFITABILITY & GROWTH COUPLING
  if (priorIS) {
    const revGrowth = safeDivide(curIS.revenue - priorIS.revenue, priorIS.revenue, 100);
    const curNPM = ratios.netProfitMargin ?? 0;
    const priorNPM = safeDivide(priorIS.netIncome, priorIS.revenue, 100) ?? 0;
    const npmDelta = curNPM - priorNPM;

    const curGPM = ratios.grossProfitMargin ?? 0;
    const priorGPM = safeDivide(priorIS.grossProfit, priorIS.revenue, 100) ?? 0;
    const gpmDelta = curGPM - priorGPM;

    if (revGrowth !== null && revGrowth > 5 && npmDelta < -0.5) {
      items.push({
        id: 'profitability-margin-dilution',
        domain: 'Profitability',
        keyFinding: 'Revenue Growth with Profit Margin Compression',
        evidence: `Revenue grew +${revGrowth.toFixed(1)}%, but Net Profit Margin fell from ${priorNPM.toFixed(1)}% to ${curNPM.toFixed(1)}% (Δ ${npmDelta.toFixed(1)} pp). Gross margin shifted by ${gpmDelta >= 0 ? '+' : ''}${gpmDelta.toFixed(1)} pp.`,
        interpretation: 'The enterprise expanded top-line sales volume, but profitability per dollar earned contracted. This indicates operating costs or input procurement escalated faster than gross pricing power.',
        potentialRisk: 'Diminishing economic return on sales expansion, margin degradation if higher input prices cannot be passed to customers, or aggressive promotional discounting.',
        recommendedInvestigation: 'Perform price-volume-mix (PVM) analysis across business lines. Audit procurement contracts for raw material spikes and review fixed overhead additions.',
        limitations: 'Product-level unit economics and exact discount rates are not provided in high-level financial statements.',
      });
    } else if (revGrowth !== null && revGrowth > 0 && npmDelta >= 0.5) {
      items.push({
        id: 'profitability-operating-leverage',
        domain: 'Profitability',
        keyFinding: 'Positive Operating Leverage & Margin Expansion',
        evidence: `Revenue expanded +${revGrowth.toFixed(1)}% accompanied by Net Margin expansion of +${npmDelta.toFixed(1)} pp (from ${priorNPM.toFixed(1)}% to ${curNPM.toFixed(1)}%).`,
        interpretation: 'Top-line growth translated into disproportionately higher bottom-line earnings, signaling favorable fixed cost absorption across existing production capacity.',
        potentialRisk: 'Capacity constraints if volume nears physical ceiling; potential underinvestment in R&D or maintenance to artificially preserve short-term margins.',
        recommendedInvestigation: 'Examine capacity utilization rates and verify whether SG&A reductions stem from genuine operational efficiencies rather than deferred expenditures.',
        limitations: 'Variable vs fixed expense splits are approximated from standard line-item disclosures.',
      });
    } else if (revGrowth !== null && revGrowth < 0) {
      items.push({
        id: 'profitability-revenue-contraction',
        domain: 'Profitability',
        keyFinding: 'Top-Line Revenue Contraction',
        evidence: `Revenue decreased by ${Math.abs(revGrowth).toFixed(1)}% compared to the prior period (from ${priorIS.revenue.toLocaleString()} to ${curIS.revenue.toLocaleString()}).`,
        interpretation: 'Sales shrinkage places pressure on fixed asset recovery and fixed overhead burden, directly squeezing operating margins.',
        potentialRisk: 'Under-absorption of plant and equipment overhead, loss of market share, or downward pricing pressure.',
        recommendedInvestigation: 'Evaluate churn rates, order volumes vs average selling prices (ASP), and competitors quarterly disclosures.',
        limitations: 'Macroeconomic market size trends and industry-wide demand data are not included in internal reports.',
      });
    }
  }

  // 2. LIQUIDITY EVALUATION
  const curCR = ratios.currentRatio;
  const curQR = ratios.quickRatio;
  const curCashR = ratios.cashRatio;

  if (curCR !== null) {
    if (curCR < 1.0) {
      items.push({
        id: 'liquidity-short-term-deficit',
        domain: 'Liquidity',
        keyFinding: 'Negative Net Working Capital & Immediate Refinancing Pressure',
        evidence: `Current Ratio stands at ${curCR.toFixed(2)}x (Quick Ratio: ${curQR ? curQR.toFixed(2) + 'x' : '—'}, Cash Ratio: ${curCashR ? curCashR.toFixed(2) + 'x' : '—'}). Current liabilities exceed current assets by ${(curBS.totalCurrentLiabilities - curBS.totalCurrentAssets).toLocaleString()}.`,
        interpretation: 'Short-term obligations due within 12 months outstrip liquid assets. The firm cannot extinguish short-term debts relying solely on currently held liquid reserves.',
        potentialRisk: 'Supplier credit holds, liquidity crunch if receivables collection stutters, or forced emergency credit drawing at elevated interest spreads.',
        recommendedInvestigation: 'Inspect accounts payable aging distribution, unused revolving credit facilities, and near-term debt maturity schedules.',
        limitations: 'Credit facility commitment fees and undrawn bank lines are off-balance-sheet items.',
      });
    } else if (curCR >= 1.0 && curCR < 1.5) {
      items.push({
        id: 'liquidity-lean-buffer',
        domain: 'Liquidity',
        keyFinding: 'Lean Working Capital Cushion',
        evidence: `Current Ratio is ${curCR.toFixed(2)}x, with Quick Ratio at ${curQR ? curQR.toFixed(2) + 'x' : '—'}.`,
        interpretation: 'Liquid assets adequately cover short-term debts under normal operating conditions, but provide limited buffer against sudden inventory liquidation delays.',
        potentialRisk: 'Vulnerability to delayed collections or supply chain bottlenecks.',
        recommendedInvestigation: 'Monitor cash collections velocity and benchmark against industry peers with similar inventory velocity.',
        limitations: 'Cash tied up in designated security deposits or foreign subsidiaries with repatriation restrictions is unobserved.',
      });
    } else {
      items.push({
        id: 'liquidity-conservative-cushion',
        domain: 'Liquidity',
        keyFinding: 'Robust Short-Term Solvency Buffer',
        evidence: `Current Ratio is ${curCR.toFixed(2)}x and Quick Ratio is ${curQR ? curQR.toFixed(2) + 'x' : '—'}.`,
        interpretation: 'The company maintains a comfortable liquidity runway, providing insulation against operational disruptions.',
        potentialRisk: 'Potential cash drag or inefficient asset utilization if excess cash is held in zero-yield checking accounts.',
        recommendedInvestigation: 'Assess treasury yield on surplus cash and explore strategic capital reallocation or share repurchases.',
        limitations: 'Treasury policy restrictions and minimum operational cash mandates are not detailed.',
      });
    }
  }

  // 3. CASH FLOW & QUALITY OF EARNINGS
  const ocf = curCF.operatingActivities.total;
  const netIncome = curIS.netIncome;
  const fcf = ratios.freeCashFlow ?? (ocf - Math.abs(curCF.investingActivities.capitalExpenditures));

  if (netIncome > 0 && ocf < 0) {
    items.push({
      id: 'cashflow-accrual-divergence',
      domain: 'Cash Flow',
      keyFinding: 'Material Divergence Between Accounting Net Income and Operating Cash Flow',
      evidence: `Positive Net Income of ${netIncome.toLocaleString()} contrasts sharply with negative Operating Cash Flow of ${ocf.toLocaleString()} (Discrepancy: ${(netIncome - ocf).toLocaleString()}).`,
      interpretation: 'Reported profits are predominantly accrual-driven and have not materialized as collected cash. This typically stems from rapid inventory accumulation or uncollected customer invoices.',
      potentialRisk: 'Earnings quality fragility, potential future receivables write-downs, or need for external bridge debt.',
      recommendedInvestigation: 'Scrutinize changes in Accounts Receivable and Inventory in the operating cash flow reconciliation. Review customer credit terms.',
      limitations: 'Aging of receivables and allowance for doubtful accounts details are aggregated.',
    });
  } else if (ocf > 0 && fcf > 0) {
    items.push({
      id: 'cashflow-self-funding',
      domain: 'Cash Flow',
      keyFinding: 'High Cash Conversion & Positive Free Cash Flow Generation',
      evidence: `Operating Cash Flow of ${ocf.toLocaleString()} fully covers Capital Expenditures of ${Math.abs(curCF.investingActivities.capitalExpenditures).toLocaleString()}, generating Free Cash Flow of ${fcf.toLocaleString()}.`,
      interpretation: 'The business model is self-funding, capable of funding capital expenditures and organic expansion without immediate external capital raises.',
      potentialRisk: 'Under-investment in growth capital if CapEx is trimmed purely to report higher short-term free cash flow.',
      recommendedInvestigation: 'Compare depreciation and amortization against CapEx to check whether asset base is being replaced or depleted.',
      limitations: 'Maintenance CapEx vs Growth CapEx breakdown is not separately itemized in standard reports.',
    });
  }

  // 4. SOLVENCY & LEVERAGE
  const deRatio = ratios.debtToEquity;
  const intCov = ratios.interestCoverage;

  if (intCov !== null && intCov < 2.0 && intCov > 0) {
    items.push({
      id: 'solvency-interest-coverage-strain',
      domain: 'Solvency',
      keyFinding: 'Constrained Interest Coverage Capacity',
      evidence: `Interest Coverage Ratio is ${intCov.toFixed(2)}x (Operating Income: ${curIS.operatingIncome.toLocaleString()}, Interest Expense: ${curIS.interestExpense.toLocaleString()}).`,
      interpretation: 'Operating earnings provide minimal safety buffer over fixed debt servicing requirements. A minor downturn in EBIT could threaten debt covenants.',
      potentialRisk: 'Debt covenant breaches, elevated refinancing interest rates, credit rating downgrades.',
      recommendedInvestigation: 'Review loan agreements for minimum debt service coverage ratio (DSCR) covenants and debt maturity schedules.',
      limitations: 'Effective interest rates, fixed vs floating debt breakdown, and covenant definitions are not provided in summary tables.',
    });
  } else if (deRatio !== null && deRatio > 2.5) {
    items.push({
      id: 'solvency-high-leverage',
      domain: 'Solvency',
      keyFinding: 'Elevated Financial Leverage',
      evidence: `Debt-to-Equity stands at ${deRatio.toFixed(2)}x (Total Liabilities: ${curBS.totalLiabilities.toLocaleString()} vs Equity: ${curBS.totalEquity.toLocaleString()}).`,
      interpretation: 'The capital structure relies substantially on debt financing relative to equity cushion.',
      potentialRisk: 'Heightened financial distress sensitivity during interest rate hikes or cyclical demand drops.',
      recommendedInvestigation: 'Determine proportions of interest-bearing debt vs non-interest operational payables.',
      limitations: 'Subordinated shareholder debt vs third-party senior bank debt distinctions are omitted.',
    });
  }

  // 5. WORKING CAPITAL & CASH CONVERSION CYCLE
  const ccc = ratios.cashConversionCycle;
  const dso = ratios.daysSalesOutstanding;
  const dio = ratios.daysInventoryOutstanding;
  const dpo = ratios.daysPayableOutstanding;

  if (ccc !== null && dso !== null && dio !== null && dpo !== null) {
    items.push({
      id: 'workingcapital-cycle-efficiency',
      domain: 'Working Capital',
      keyFinding: `Cash Conversion Cycle Operating at ${ccc.toFixed(0)} Days`,
      evidence: `Cash Conversion Cycle is ${ccc.toFixed(1)} days (DSO: ${dso.toFixed(0)}d, DIO: ${dio.toFixed(0)}d, DPO: ${dpo.toFixed(0)}d).`,
      interpretation: `It takes approximately ${ccc.toFixed(0)} days between cash outlay for raw materials and cash collection from sold finished products. ${ccc > 90 ? 'This represents a capital-intensive working capital requirement.' : 'This represents a reasonably efficient operating turnover.'}`,
      potentialRisk: ccc > 90 ? 'Large working capital commitments create liquidity drag as enterprise grows.' : 'Overly aggressive DPO elongation risks supplier friction.',
      recommendedInvestigation: 'Benchmark collection cycles across top 10 enterprise clients and review inventory reorder point parameters.',
      limitations: 'Assumes uniform 365-day annualization across line items.',
    });
  }

  return items;
}
