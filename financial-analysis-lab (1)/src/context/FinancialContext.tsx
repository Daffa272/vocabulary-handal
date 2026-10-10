import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_COMPANIES } from '../data/demoData';
import { calculateFinancialRatios } from '../services/calculationEngine';
import { validateFinancialDataset } from '../services/dataValidator';
import { generateFinancialInterpretations } from '../services/interpretationEngine';
import {
  CompanyProfile,
  CurrencyCode,
  FinancialPeriodRecord,
  FinancialRatios,
  ForecastAssumptions,
  InterpretationItem,
  ValidationIssue,
  ValuationInputs,
} from '../types/financial';

interface FinancialContextType {
  // Navigation & View
  activePage: string;
  setActivePage: (page: string) => void;

  // Companies & Periods
  companies: CompanyProfile[];
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  selectedPeriodId: string;
  setSelectedPeriodId: (id: string) => void;
  comparisonPeriodId: string | null;
  setComparisonPeriodId: (id: string | null) => void;

  // Filters & Settings
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  dataMode: 'Actual' | 'Budget' | 'Forecast';
  setDataMode: (mode: 'Actual' | 'Budget' | 'Forecast') => void;
  balanceTolerance: number;
  setBalanceTolerance: (tol: number) => void;

  // Active Data Entities
  activeCompany: CompanyProfile;
  activePeriod: FinancialPeriodRecord;
  priorPeriod: FinancialPeriodRecord | null;
  comparisonPeriod: FinancialPeriodRecord | null;
  activeRatios: FinancialRatios;
  priorRatios: FinancialRatios | null;
  allRatiosMap: Record<string, FinancialRatios>;
  interpretations: InterpretationItem[];
  validationIssues: ValidationIssue[];

  // Scenario Assumptions
  scenarioAssumptions: Record<'base' | 'optimistic' | 'pessimistic', ForecastAssumptions>;
  setScenarioAssumptions: React.Dispatch<
    React.SetStateAction<Record<'base' | 'optimistic' | 'pessimistic', ForecastAssumptions>>
  >;

  // Valuation Inputs
  valuationInputs: ValuationInputs;
  setValuationInputs: React.Dispatch<React.SetStateAction<ValuationInputs>>;

  // Actions
  importCompanyData: (company: CompanyProfile) => void;
  resetDemoData: () => void;
  updateActivePeriod: (updater: (prev: FinancialPeriodRecord) => FinancialPeriodRecord) => void;
}

const DEFAULT_ASSUMPTIONS: Record<'base' | 'optimistic' | 'pessimistic', ForecastAssumptions> = {
  base: {
    revenueGrowthPercent: 12.0,
    grossMarginPercent: 40.0,
    opExGrowthPercent: 8.5,
    taxRatePercent: 22.0,
    interestExpense: 2800000,
    capExPercentOfRevenue: 5.0,
    targetDSO: 52,
    inventoryGrowthPercent: 7.0,
  },
  optimistic: {
    revenueGrowthPercent: 20.0,
    grossMarginPercent: 43.5,
    opExGrowthPercent: 9.0,
    taxRatePercent: 21.0,
    interestExpense: 2500000,
    capExPercentOfRevenue: 5.5,
    targetDSO: 45,
    inventoryGrowthPercent: 5.0,
  },
  pessimistic: {
    revenueGrowthPercent: 3.0,
    grossMarginPercent: 35.0,
    opExGrowthPercent: 7.0,
    taxRatePercent: 24.0,
    interestExpense: 3200000,
    capExPercentOfRevenue: 4.0,
    targetDSO: 65,
    inventoryGrowthPercent: 12.0,
  },
};

const FinancialContext = createContext<FinancialContextType | null>(null);

const STORAGE_KEY = 'financial_analysis_lab_state_v1';

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('overview');
  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEMO_COMPANIES;
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(DEMO_COMPANIES[0].id);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [comparisonPeriodId, setComparisonPeriodId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [dataMode, setDataMode] = useState<'Actual' | 'Budget' | 'Forecast'>('Actual');
  const [balanceTolerance, setBalanceTolerance] = useState<number>(1.0);

  const [scenarioAssumptions, setScenarioAssumptions] = useState(DEFAULT_ASSUMPTIONS);
  const [valuationInputs, setValuationInputs] = useState<ValuationInputs>({
    waccPercent: 9.5,
    terminalGrowthPercent: 2.5,
    forecastYears: 5,
    sharesOutstanding: 50000000,
    netDebtAdjustment: 16700000,
  });

  // Keep state synced with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    } catch {
      // ignore
    }
  }, [companies]);

  // Active company
  const activeCompany = useMemo(() => {
    const found = companies.find((c) => c.id === selectedCompanyId);
    return found || companies[0] || DEMO_COMPANIES[0];
  }, [companies, selectedCompanyId]);

  // Synchronize currency with active company on change
  useEffect(() => {
    if (activeCompany) {
      setCurrency(activeCompany.currency);
      // Auto set period to last period
      if (activeCompany.periods.length > 0) {
        const lastP = activeCompany.periods[activeCompany.periods.length - 1];
        setSelectedPeriodId(lastP.periodId);
        if (activeCompany.periods.length > 1) {
          setSelectedPeriodId(lastP.periodId);
          setComparisonPeriodId(activeCompany.periods[activeCompany.periods.length - 2].periodId);
        } else {
          setComparisonPeriodId(null);
        }
      }
    }
  }, [activeCompany.id]);

  // Active period
  const activePeriod = useMemo(() => {
    const found = activeCompany.periods.find((p) => p.periodId === selectedPeriodId);
    return found || activeCompany.periods[activeCompany.periods.length - 1] || activeCompany.periods[0];
  }, [activeCompany, selectedPeriodId]);

  // Prior period
  const priorPeriod = useMemo(() => {
    if (!activePeriod) return null;
    const curIdx = activeCompany.periods.findIndex((p) => p.periodId === activePeriod.periodId);
    if (curIdx > 0) {
      return activeCompany.periods[curIdx - 1];
    }
    return null;
  }, [activeCompany, activePeriod]);

  // Explicit comparison period if user selected one
  const comparisonPeriod = useMemo(() => {
    if (!comparisonPeriodId) return priorPeriod;
    const found = activeCompany.periods.find((p) => p.periodId === comparisonPeriodId);
    return found || priorPeriod;
  }, [activeCompany, comparisonPeriodId, priorPeriod]);

  // Ratios for all periods
  const allRatiosMap = useMemo(() => {
    const map: Record<string, FinancialRatios> = {};
    activeCompany.periods.forEach((p, idx) => {
      const prior = idx > 0 ? activeCompany.periods[idx - 1] : null;
      map[p.periodId] = calculateFinancialRatios(p, prior);
    });
    return map;
  }, [activeCompany]);

  const activeRatios = useMemo(() => {
    return allRatiosMap[activePeriod.periodId] || calculateFinancialRatios(activePeriod, priorPeriod);
  }, [allRatiosMap, activePeriod, priorPeriod]);

  const priorRatios = useMemo(() => {
    if (!comparisonPeriod) return null;
    return allRatiosMap[comparisonPeriod.periodId] || null;
  }, [allRatiosMap, comparisonPeriod]);

  // Interpretations
  const interpretations = useMemo(() => {
    return generateFinancialInterpretations(activePeriod, comparisonPeriod, activeRatios);
  }, [activePeriod, comparisonPeriod, activeRatios]);

  // Data quality validations
  const validationIssues = useMemo(() => {
    return validateFinancialDataset(activeCompany, balanceTolerance);
  }, [activeCompany, balanceTolerance]);

  // Handlers
  const importCompanyData = (newComp: CompanyProfile) => {
    setCompanies((prev) => {
      const filtered = prev.filter((c) => c.id !== newComp.id);
      return [newComp, ...filtered];
    });
    setSelectedCompanyId(newComp.id);
    if (newComp.periods.length > 0) {
      setSelectedPeriodId(newComp.periods[newComp.periods.length - 1].periodId);
    }
  };

  const resetDemoData = () => {
    setCompanies(DEMO_COMPANIES);
    setSelectedCompanyId(DEMO_COMPANIES[0].id);
    setSelectedPeriodId(DEMO_COMPANIES[0].periods[DEMO_COMPANIES[0].periods.length - 1].periodId);
    setCurrency(DEMO_COMPANIES[0].currency);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateActivePeriod = (updater: (prev: FinancialPeriodRecord) => FinancialPeriodRecord) => {
    setCompanies((prevComps) => {
      return prevComps.map((comp) => {
        if (comp.id !== activeCompany.id) return comp;
        return {
          ...comp,
          periods: comp.periods.map((p) => {
            if (p.periodId !== activePeriod.periodId) return p;
            return updater(p);
          }),
        };
      });
    });
  };

  return (
    <FinancialContext.Provider
      value={{
        activePage,
        setActivePage,
        companies,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedPeriodId,
        setSelectedPeriodId,
        comparisonPeriodId,
        setComparisonPeriodId,
        currency,
        setCurrency,
        dataMode,
        setDataMode,
        balanceTolerance,
        setBalanceTolerance,
        activeCompany,
        activePeriod,
        priorPeriod,
        comparisonPeriod,
        activeRatios,
        priorRatios,
        allRatiosMap,
        interpretations,
        validationIssues,
        scenarioAssumptions,
        setScenarioAssumptions,
        valuationInputs,
        setValuationInputs,
        importCompanyData,
        resetDemoData,
        updateActivePeriod,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
