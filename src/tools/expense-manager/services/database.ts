import Dexie, { type EntityTable } from "dexie";
import type { BudgetRecord, CategoryRecord, ExpenseRecord } from "../types";

export interface ExpenseDatabase extends Dexie {
  expenses: EntityTable<ExpenseRecord, "id">;
  categories: EntityTable<CategoryRecord, "id">;
  budgets: EntityTable<BudgetRecord, "id">;
  settings: EntityTable<{ key: string; value: unknown }, "key">;
}

const db = new Dexie("ExpenseManagerDB") as ExpenseDatabase;

// Define schemas with optimized indexing - date is the main index for filtering expenses
db.version(1).stores({
  expenses:
    "++id, amount, category, description, *date, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount]",
  categories: "id, name, icon, color, budget, isDefault, createdAt",
  budgets: "++id, categoryId, amount, period, startDate, endDate, createdAt",
  settings: "key, value",
});

// Database operations
export const ExpenseDB = {
  // Get expenses by date range - optimized for filtering
  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<ExpenseRecord[]> {
    return await db.expenses
      .where("date")
      .between(startDate, endDate, true, true)
      .reverse()
      .toArray();
  },

  // Get expenses for a specific month - optimized for Vietnamese users
  async getExpensesByMonth(year: number, month: number): Promise<ExpenseRecord[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return await this.getExpensesByDateRange(startDate, endDate);
  },

  async getRecentCreatedExpenses(limit = 10): Promise<ExpenseRecord[]> {
    return await db.expenses.orderBy("createdAt").reverse().limit(limit).toArray();
  },

  async addExpense(
    expense: Omit<ExpenseRecord, "id" | "createdAt" | "updatedAt">
  ): Promise<ExpenseRecord> {
    const now = new Date();
    const newExpense: ExpenseRecord = {
      ...expense,
      id: await db.expenses.add({
        ...expense,
        createdAt: now,
        updatedAt: now,
      } as ExpenseRecord),
      createdAt: now,
      updatedAt: now,
    };
    return newExpense;
  },

  async updateExpense(id: number, updates: Partial<ExpenseRecord>): Promise<void> {
    await db.expenses.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteExpense(id: number): Promise<void> {
    await db.expenses.delete(id);
  },

  async getAllCategories(): Promise<CategoryRecord[]> {
    return await db.categories.orderBy("name").toArray();
  },

  async addCategory(category: CategoryRecord): Promise<void> {
    await db.categories.put(category);
  },

  async getAllBudgets(): Promise<BudgetRecord[]> {
    return await db.budgets.toArray();
  },

  async addBudget(budget: Omit<BudgetRecord, "id" | "createdAt">): Promise<void> {
    await db.budgets.add({
      ...budget,
      createdAt: new Date(),
    } as BudgetRecord);
  },

  // Settings operations
  async getSetting<T>(key: string): Promise<T | undefined> {
    const result = await db.settings.get(key);
    return result?.value as T;
  },

  async setSetting<T>(key: string, value: T): Promise<void> {
    await db.settings.put({ key, value });
  },

  async deleteSetting(key: string): Promise<void> {
    await db.settings.delete(key);
  },

  // Initialize default categories
  async initializeDefaultCategories(categories: CategoryRecord[]): Promise<void> {
    const existingCount = await db.categories.count();
    if (existingCount === 0) {
      await db.categories.bulkAdd(categories);
    }
  },

  // Get API key
  async getGeminiApiKey(): Promise<string | undefined> {
    return await this.getSetting<string>("gemini_api_key");
  },

  // Store API key (encrypted in real implementation)
  async setGeminiApiKey(apiKey: string): Promise<void> {
    await this.setSetting("gemini_api_key", apiKey);
  },
};

export { db };
