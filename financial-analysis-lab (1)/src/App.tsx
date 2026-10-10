/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { FilterBar } from './components/layout/FilterBar';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { StatementsView } from './components/statements/StatementsView';
import { RatioCalculatorView } from './components/ratios/RatioCalculatorView';
import { ProfitabilityAnalysisView } from './components/profitability/ProfitabilityAnalysisView';
import { LiquiditySolvencyView } from './components/liquidity/LiquiditySolvencyView';
import { CashFlowAnalysisView } from './components/cashflow/CashFlowAnalysisView';
import { WorkingCapitalView } from './components/workingcapital/WorkingCapitalView';
import { BudgetVsActualView } from './components/budget/BudgetVsActualView';
import { ForecastScenarioView } from './components/forecast/ForecastScenarioView';
import { CompanyValuationView } from './components/valuation/CompanyValuationView';
import { InterpretationLabView } from './components/interpretation/InterpretationLabView';
import { DataImportMappingView } from './components/import/DataImportMappingView';
import { ReportsExportView } from './components/reports/ReportsExportView';
import { LearningCenterView } from './components/learning/LearningCenterView';
import { AdminPortal } from './components/admin/AdminPortal';

const MainContent: React.FC = () => {
  const { activePage } = useFinancial();

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
      <div className="max-w-7xl mx-auto pb-12">
        {activePage === 'overview' && <OverviewDashboard />}
        {activePage === 'statements' && <StatementsView />}
        {activePage === 'ratios' && <RatioCalculatorView />}
        {activePage === 'profitability' && <ProfitabilityAnalysisView />}
        {activePage === 'liquidity' && <LiquiditySolvencyView />}
        {activePage === 'cashflow' && <CashFlowAnalysisView />}
        {activePage === 'workingcapital' && <WorkingCapitalView />}
        {activePage === 'budget' && <BudgetVsActualView />}
        {activePage === 'forecast' && <ForecastScenarioView />}
        {activePage === 'valuation' && <CompanyValuationView />}
        {activePage === 'interpretation' && <InterpretationLabView />}
        {activePage === 'import' && <DataImportMappingView />}
        {activePage === 'reports' && <ReportsExportView />}
        {activePage === 'learning' && <LearningCenterView />}
        {activePage === 'admin' && <AdminPortal />}
      </div>
    </main>
  );
};

export default function App() {
  return (
    <FinancialProvider>
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
        {/* Navigation Sidebar (Hidden on print) */}
        <div className="no-print shrink-0">
          <Sidebar />
        </div>

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar />
          <div className="no-print">
            <FilterBar />
          </div>
          <MainContent />
        </div>
      </div>
    </FinancialProvider>
  );
}
