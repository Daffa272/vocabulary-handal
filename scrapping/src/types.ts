export interface ModuleInfo {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  summary: string;
  topics: string[];
}

export interface QuizQuestion {
  id: number;
  moduleId: number;
  moduleName: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctId: string;
  explanation: string;
  wrongExplanations?: Record<string, string>;
}

export interface Mission {
  id: string;
  moduleId: number;
  title: string;
  description: string;
  hint: string;
}

export interface MockRequestPreset {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  statusCode: number;
  statusText: string;
  description: string;
  latencyMs: number;
  headers: Record<string, string>;
  responseBody: string;
  diagnosis: string;
  remedy: string;
}

export interface InspectElementNode {
  tag: string;
  class?: string;
  id?: string;
  text?: string;
  attributes?: Record<string, string>;
  children?: InspectElementNode[];
}

export interface ScrapedBookItem {
  id: number;
  title: string;
  category: string;
  price: number;
  priceFormatted: string;
  rating: number; // 1 to 5
  inStock: boolean;
  stockCount: number;
  upc: string;
}
