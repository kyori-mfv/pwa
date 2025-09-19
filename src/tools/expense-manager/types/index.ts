export interface ExpenseRecord {
  id?: number;
  amount: number;
  category: string;
  description: string;
  date: Date;
  originalInput?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRecord {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface BudgetRecord {
  id?: number;
  categoryId: string;
  amount: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface ParsedExpense {
  amount: number;
  category: string;
  description: string;
  date?: Date;
  confidence: number;
  suggestions?: string[];
}

export interface AIProvider {
  name: string;
  parseExpense(input: string): Promise<ParsedExpense>;
  isConfigured(): boolean;
  validateConfig(config: AIProviderConfig): boolean;
}

export interface AIProviderConfig {
  id: string;
  name: string;
  apiUrl: string;
  model: string;
  enabled: boolean;
  apiKey?: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}

export interface ExpenseManagerState extends Record<string, unknown> {
  expenses: ExpenseRecord[];
  categories: CategoryRecord[];
  budgets: BudgetRecord[];
  selectedDateRange: {
    start: Date;
    end: Date;
  };
  aiProviders: AIProviderConfig[];
  preferredProvider?: string;
  settings: {
    currency: string;
    locale: string;
    theme: string;
    notifications: boolean;
  };
}

export interface ImportResult {
  total: number;
  valid: number;
  invalid: number;
  expenses: ExpenseRecord[];
}

export interface ExportOptions {
  includeAll?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  format: "json" | "csv";
}
