import Dexie, { type EntityTable } from "dexie";
import { generateUUID } from "../../../shared/utils/uuid";
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
    "id, amount, category, description, *date, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount]",
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

  // Search expenses with optional filters - database level
  async searchExpenses(options: {
    searchTerm?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ expenses: ExpenseRecord[]; total: number }> {
    const { searchTerm, category, startDate, endDate, limit = 15, offset = 0 } = options;

    let query = db.expenses.orderBy("date").reverse();

    // Apply date range filter first (most selective)
    if (startDate && endDate) {
      query = db.expenses.where("date").between(startDate, endDate, true, true).reverse();
    }

    // Get all matching records for further filtering
    let results = await query.toArray();

    // Apply search filter
    if (searchTerm?.trim()) {
      const search = searchTerm.toLowerCase().trim();
      results = results.filter(
        (expense) =>
          expense.description.toLowerCase().includes(search) ||
          expense.category.toLowerCase().includes(search) ||
          expense.originalInput?.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (category && category !== "all") {
      results = results.filter((expense) => expense.category === category);
    }

    const total = results.length;
    const expenses = results.slice(offset, offset + limit);

    return { expenses, total };
  },

  // Get expenses count by category for analytics
  async getExpensesByCategory(
    category: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ExpenseRecord[]> {
    const query = db.expenses.where("category").equals(category);

    if (startDate && endDate) {
      // For category with date range, we need to filter after querying
      const results = await query.toArray();
      return results
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= endDate;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return await query.reverse().toArray();
  },

  // Get category statistics for dashboard
  async getCategoryStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      category: string;
      amount: number;
      count: number;
    }>
  > {
    let expenses: ExpenseRecord[];

    if (startDate && endDate) {
      expenses = await this.getExpensesByDateRange(startDate, endDate);
    } else {
      expenses = await db.expenses.toArray();
    }

    // Group by category
    const categoryMap = new Map<string, { amount: number; count: number }>();

    for (const expense of expenses) {
      const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
      categoryMap.set(expense.category, {
        amount: existing.amount + expense.amount,
        count: existing.count + 1,
      });
    }

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      ...stats,
    }));
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
    const id = generateUUID();
    const newExpense: ExpenseRecord = {
      ...expense,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.expenses.add(newExpense);
    return newExpense;
  },

  async updateExpense(id: string, updates: Partial<ExpenseRecord>): Promise<void> {
    await db.expenses.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteExpense(id: string): Promise<void> {
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

  // Clear all expenses - for cleanup functionality
  async clearAllExpenses(): Promise<number> {
    const count = await db.expenses.count();
    await db.expenses.clear();
    return count;
  },
};

export { db };
