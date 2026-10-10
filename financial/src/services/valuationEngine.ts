export interface DCFValuationResult {
  isValid: boolean;
  validationError?: string;
  waccPercent: number;
  terminalGrowthPercent: number;
  forecastCashFlows: { year: number; fcf: number; pvFactor: number; pv: number }[];
  sumPvFCF: number;
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  netDebt: number; // (Short term debt + Long term debt) - Cash
  equityValue: number;
  sharesOutstanding: number;
  impliedSharePrice: number | null;
  sensitivityMatrix: {
    waccValues: number[];
    growthValues: number[];
    grid: { wacc: number; growth: number; sharePrice: number | null }[][];
  };
}

export function calculateDCFValuation(
  forecastFCFs: { year: number; fcf: number }[],
  waccPercent: number,
  terminalGrowthPercent: number,
  cash: number,
  totalDebt: number,
  sharesOutstanding: number
): DCFValuationResult {
  // Gordon Growth Requirement: WACC > terminal growth
  if (terminalGrowthPercent >= waccPercent) {
    return {
      isValid: false,
      validationError: `Terminal growth rate (${terminalGrowthPercent}%) must be strictly lower than discount rate / WACC (${waccPercent}%) under the Gordon Growth Model to avoid mathematical infinity.`,
      waccPercent,
      terminalGrowthPercent,
      forecastCashFlows: [],
      sumPvFCF: 0,
      terminalValue: 0,
      pvTerminalValue: 0,
      enterpriseValue: 0,
      netDebt: totalDebt - cash,
      equityValue: 0,
      sharesOutstanding,
      impliedSharePrice: null,
      sensitivityMatrix: { waccValues: [], growthValues: [], grid: [] },
    };
  }

  const wacc = waccPercent / 100;
  const g = terminalGrowthPercent / 100;
  const n = forecastFCFs.length;

  // 1. Discount each year's FCF
  let sumPvFCF = 0;
  const discountedFCFs = forecastFCFs.map((item, index) => {
    const t = index + 1;
    const pvFactor = 1 / Math.pow(1 + wacc, t);
    const pv = item.fcf * pvFactor;
    sumPvFCF += pv;
    return {
      year: item.year,
      fcf: item.fcf,
      pvFactor: Number(pvFactor.toFixed(4)),
      pv: Math.round(pv),
    };
  });

  // 2. Terminal Value
  const lastFCF = forecastFCFs[n - 1]?.fcf ?? 0;
  const terminalFCF = lastFCF * (1 + g);
  const terminalValue = terminalFCF / (wacc - g);
  const pvTerminalValue = terminalValue / Math.pow(1 + wacc, n);

  // 3. Enterprise Value & Equity Value
  const enterpriseValue = sumPvFCF + pvTerminalValue;
  const netDebt = totalDebt - cash;
  const equityValue = enterpriseValue - netDebt;
  const impliedSharePrice =
    sharesOutstanding > 0 ? Number((equityValue / sharesOutstanding).toFixed(2)) : null;

  // 4. Sensitivity Matrix: WACC vs Growth
  const waccRange = [
    Number((waccPercent - 2.0).toFixed(1)),
    Number((waccPercent - 1.0).toFixed(1)),
    Number(waccPercent.toFixed(1)),
    Number((waccPercent + 1.0).toFixed(1)),
    Number((waccPercent + 2.0).toFixed(1)),
  ];

  const growthRange = [
    Number((terminalGrowthPercent - 1.0).toFixed(1)),
    Number((terminalGrowthPercent - 0.5).toFixed(1)),
    Number(terminalGrowthPercent.toFixed(1)),
    Number((terminalGrowthPercent + 0.5).toFixed(1)),
    Number((terminalGrowthPercent + 1.0).toFixed(1)),
  ];

  const grid = waccRange.map((wVal) => {
    const wRatio = wVal / 100;
    return growthRange.map((gVal) => {
      const gRatio = gVal / 100;
      if (gRatio >= wRatio) {
        return { wacc: wVal, growth: gVal, sharePrice: null };
      }

      // Re-sum PV
      let sPV = 0;
      forecastFCFs.forEach((item, idx) => {
        sPV += item.fcf / Math.pow(1 + wRatio, idx + 1);
      });
      const tVal = (lastFCF * (1 + gRatio)) / (wRatio - gRatio);
      const pvTV = tVal / Math.pow(1 + wRatio, n);
      const ev = sPV + pvTV;
      const eqVal = ev - netDebt;
      const price = sharesOutstanding > 0 ? Number((eqVal / sharesOutstanding).toFixed(2)) : null;

      return { wacc: wVal, growth: gVal, sharePrice: price };
    });
  });

  return {
    isValid: true,
    waccPercent,
    terminalGrowthPercent,
    forecastCashFlows: discountedFCFs,
    sumPvFCF: Math.round(sumPvFCF),
    terminalValue: Math.round(terminalValue),
    pvTerminalValue: Math.round(pvTerminalValue),
    enterpriseValue: Math.round(enterpriseValue),
    netDebt: Math.round(netDebt),
    equityValue: Math.round(equityValue),
    sharesOutstanding,
    impliedSharePrice,
    sensitivityMatrix: {
      waccValues: waccRange,
      growthValues: growthRange,
      grid,
    },
  };
}
