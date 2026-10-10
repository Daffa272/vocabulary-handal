export type NavTab = 
  | 'dashboard'
  | 'learning-path'
  | 'connection-lab'
  | 'power-query-lab'
  | 'modeling-lab'
  | 'dax-lab'
  | 'visualization-lab'
  | 'interpretation-lab'
  | 'distribution-lab'
  | 'dashboard-studio'
  | 'big-data-lab'
  | 'case-studies'
  | 'quiz'
  | 'glossary'
  | 'docs';

export interface SalesRecord {
  orderId: string;
  orderDate: string;
  customerId: string;
  customerName: string;
  segment: 'Consumer' | 'Corporate' | 'Home Office';
  region: 'Jawa' | 'Sumatera' | 'Kalimantan' | 'Sulawesi' | 'Bali & Nusa Tenggara';
  city: string;
  category: 'Technology' | 'Office Supplies' | 'Furniture';
  subCategory: string;
  product: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  salesAmount: number;
  cost: number;
  profit: number;
  discount: number;
  returned: boolean;
}

export interface DirtyRecord {
  id: string;
  rawDate: string;
  customerName: string;
  categoryRaw: string;
  quantityRaw: string;
  amountRaw: string;
  statusCode: string;
  isDuplicate?: boolean;
}

export interface FinanceRecord {
  period: string;
  department: string;
  category: string;
  budget: number;
  actual: number;
  variance: number;
}

export interface HRRecord {
  empId: string;
  name: string;
  department: string;
  jobRole: string;
  performance: 1 | 2 | 3 | 4 | 5;
  monthlySalary: number;
  attrition: boolean;
  tenureYears: number;
  absentDays: number;
}

export interface LearningModule {
  id: number;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estTime: string;
  keySkills: string[];
  description: string;
  interactiveLabLink?: NavTab;
  content: ModuleContent;
}

export interface ModuleContent {
  overview: string;
  objectives: string[];
  sections: {
    title: string;
    description: string;
    details?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    codeSnippet?: {
      language: string;
      code: string;
      explanation: string;
    };
    proTip?: string;
    warning?: string;
  }[];
  interactiveLabLink?: NavTab;
}

export interface ConnectionSource {
  id: string;
  name: string;
  category: 'File' | 'Database' | 'Cloud / Web' | 'Enterprise';
  icon: string;
  whenToUse: string;
  preparation: string[];
  stepByStep: string[];
  credentials: string;
  pros: string[];
  limitations: string[];
  supportedModes: ('Import' | 'DirectQuery' | 'Composite' | 'Live Connection')[];
  refreshMechanism: string;
  troubleshootingTips: { issue: string; resolution: string }[];
}

export interface DaxFunctionItem {
  id: string;
  name: string;
  category: 'Aggregation' | 'Logical' | 'Filter & Calculate' | 'Iterator (X-Functions)' | 'Relationship' | 'Time Intelligence';
  syntax: string;
  returnType: string;
  shortDesc: string;
  detailedExplanation: string;
  syntaxBreakdown: { param: string; desc: string }[];
  contextType: 'Row Context' | 'Filter Context' | 'Both / Transition';
  sampleFormula: string;
  computeFormulaName: string;
  measureFormula: string;
  businessApplication: string;
  notes: string;
}

export interface VisualCatalogItem {
  id: string;
  name: string;
  category: 'KPI' | 'Comparison' | 'Trend' | 'Composition' | 'Distribution' | 'Advanced';
  iconName: string;
  businessQuestions: string[];
  requiredColumns: string[];
  buildSteps: string[];
  whyChoose: string;
  howToRead: string;
  patternsToWatch: string[];
  commonPitfalls: string[];
}

export interface DistributionTypeInfo {
  id: string;
  name: string;
  shapeDescription: string;
  meanVsMedian: string;
  sampleDatasetKey: string;
  dataPoints: number[];
  realWorldScenario: string;
  analysisStrategy: string;
  warningNote: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  domain: 'Sales' | 'Finance' | 'HR' | 'Enterprise Big Data';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  businessProblem: string;
  datasetName: string;
  datasetFile: string;
  dataDictionary: { field: string; type: string; desc: string; sample: string }[];
  instructions: string[];
  powerQuerySteps: string[];
  daxMeasures: { name: string; formula: string; desc: string }[];
  recommendedVisuals: string[];
  expectedInsights: string[];
  rubric: { criterion: string; weight: string; target: string }[];
}

export interface QuizQuestion {
  id: number;
  category: 'Data Connection' | 'Power Query' | 'Data Modeling' | 'DAX' | 'Visualization' | 'Distribution' | 'Big Data' | 'Deployment';
  question: string;
  options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
}

export interface GlossaryItem {
  term: string;
  category: 'Core BI' | 'Power Query' | 'Modeling' | 'DAX' | 'Visualization' | 'Architecture';
  definition: string;
  exampleOrFormula?: string;
  relatedTerms: string[];
}
