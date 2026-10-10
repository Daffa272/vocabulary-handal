export const CSV_TEMPLATES = {
  incomeStatement: `Period,Revenue,CostOfGoodsSold,RD_Expense,SGA_Expense,Depreciation,OperatingIncome,InterestExpense,TaxExpense,NetIncome
2024,100000000,60000000,5000000,15000000,5000000,15000000,2000000,2860000,10140000
2025,120000000,70000000,6000000,18000000,6000000,20000000,2200000,3916000,13884000`,

  balanceSheet: `Period,CashAndEquivalents,AccountsReceivable,Inventory,OtherCurrentAssets,PropertyPlantEquipment,Intangibles,AccountsPayable,ShortTermDebt,LongTermDebt,CommonStock,RetainedEarnings
2024,15000000,18000000,20000000,2000000,40000000,5000000,12000000,3000000,25000000,20000000,40000000
2025,18000000,21000000,22000000,2500000,44000000,5000000,14000000,3500000,26000000,20000000,49000000`,

  cashFlowStatement: `Period,NetIncome,Depreciation,ChangeInReceivables,ChangeInInventory,ChangeInPayables,OperatingCashFlow,CapitalExpenditures,InvestingCashFlow,FinancingCashFlow,NetCashChange,BeginningCash,EndingCash
2024,10140000,5000000,-2000000,-1500000,1200000,12840000,-6000000,-6000000,-3840000,3000000,12000000,15000000
2025,13884000,6000000,-3000000,-2000000,2000000,16884000,-7500000,-7500000,-6384000,3000000,15000000,18000000`,

  budgetVsActual: `AccountName,Category,Department,Budget,Actual
Direct Sales Revenue,Revenue,Commercial,80000000,85400000
Channel Partner Revenue,Revenue,Commercial,30000000,28500000
Raw Materials COGS,COGS,Procurement,45000000,47200000
Assembly Labor COGS,COGS,Operations,22000000,21500000
Engineering R&D Salaries,OpEx,R&D,8000000,7900000
Digital Marketing Spend,OpEx,Marketing,6500000,6900000
Administrative Travel,OpEx,Administration,2000000,2300000
Factory Machine Upgrade,CapEx,Operations,5000000,5200000`,
};
