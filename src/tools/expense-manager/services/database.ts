import Dexie, { type EntityTable } from "dexie";
import { generateUUID } from "../../../shared/utils/uuid";
import type { BudgetRecord, CategoryRecord, ExpenseRecord, TransactionRecord } from "../types";

// Define IncomeRecord type based on TransactionRecord
type IncomeRecord = Omit<TransactionRecord, "type"> & { type: "income" };

export interface ExpenseDatabase extends Dexie {
  expenses: EntityTable<ExpenseRecord, "id">;
  income: EntityTable<IncomeRecord, "id">;
  transactions: EntityTable<TransactionRecord, "id">; // Keep for backward compatibility
  categories: EntityTable<CategoryRecord, "id">;
  budgets: EntityTable<BudgetRecord, "id">;
  settings: EntityTable<{ key: string; value: unknown }, "key">;
}

export type { IncomeRecord };

const db = new Dexie("ExpenseManagerDB") as ExpenseDatabase;

// Define schemas with optimized indexing - date is the main index for filtering expenses
db.version(1).stores({
  expenses:
    "id, amount, category, description, *date, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount]",
  categories: "id, name, icon, color, budget, isDefault, createdAt",
  budgets: "++id, categoryId, amount, period, startDate, endDate, createdAt",
  settings: "key, value",
});

// Version 2: Add transactions table
db.version(2).stores({
  expenses:
    "id, amount, category, description, *date, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount]",
  transactions:
    "id, amount, category, description, *date, type, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount], [type+date]",
  categories: "id, name, icon, color, type, budget, isDefault, createdAt",
  budgets: "++id, categoryId, amount, period, startDate, endDate, createdAt",
  settings: "key, value",
});

// Version 3: Add separate income table
db.version(3).stores({
  expenses:
    "id, amount, category, description, *date, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount]",
  income:
    "id, amount, category, description, *date, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount]",
  transactions:
    "id, amount, category, description, *date, type, originalInput, createdAt, updatedAt, [category+date], [date+category], [date+amount], [type+date]", // Keep for backward compatibility
  categories: "id, name, icon, color, type, budget, isDefault, createdAt",
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
      type: "expense", // Ensure backward compatibility
      createdAt: now,
      updatedAt: now,
    };
    await db.expenses.add(newExpense);
    return newExpense;
  },

  async addTransaction(
    transaction: Omit<TransactionRecord, "id" | "createdAt" | "updatedAt">
  ): Promise<TransactionRecord> {
    const now = new Date();
    const id = generateUUID();
    const newTransaction: TransactionRecord = {
      ...transaction,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.transactions.add(newTransaction);
    return newTransaction;
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

  // Transaction operations for income/expense consistency
  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<TransactionRecord[]> {
    return await db.transactions
      .where("date")
      .between(startDate, endDate, true, true)
      .reverse()
      .toArray();
  },

  async searchTransactions(options: {
    searchTerm?: string;
    category?: string;
    type?: "income" | "expense";
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ transactions: TransactionRecord[]; total: number }> {
    const { searchTerm, category, type, startDate, endDate, limit = 15, offset = 0 } = options;

    let query = db.transactions.orderBy("date").reverse();

    // Apply date range filter first (most selective)
    if (startDate && endDate) {
      query = db.transactions.where("date").between(startDate, endDate, true, true).reverse();
    }

    // Get all matching records for further filtering
    let results = await query.toArray();

    // Apply search filter
    if (searchTerm?.trim()) {
      const search = searchTerm.toLowerCase().trim();
      results = results.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(search) ||
          transaction.category.toLowerCase().includes(search) ||
          transaction.originalInput?.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (category && category !== "all") {
      results = results.filter((transaction) => transaction.category === category);
    }

    // Apply type filter
    if (type) {
      results = results.filter((transaction) => transaction.type === type);
    }

    const total = results.length;
    const transactions = results.slice(offset, offset + limit);

    return { transactions, total };
  },

  async getTransactionsByCategory(
    category: string,
    type?: "income" | "expense",
    startDate?: Date,
    endDate?: Date
  ): Promise<TransactionRecord[]> {
    const query = db.transactions.where("category").equals(category);
    const results = await query.toArray();

    return results
      .filter((transaction) => {
        const matchesType = !type || transaction.type === type;
        const matchesDateRange =
          !startDate ||
          !endDate ||
          (new Date(transaction.date) >= startDate && new Date(transaction.date) <= endDate);
        return matchesType && matchesDateRange;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getTransactionStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    income: {
      total: number;
      count: number;
      categories: Array<{ category: string; amount: number; count: number }>;
    };
    expense: {
      total: number;
      count: number;
      categories: Array<{ category: string; amount: number; count: number }>;
    };
  }> {
    let transactions: TransactionRecord[];

    if (startDate && endDate) {
      transactions = await this.getTransactionsByDateRange(startDate, endDate);
    } else {
      transactions = await db.transactions.toArray();
    }

    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter((t) => t.type === "expense");

    const getStats = (txns: TransactionRecord[]) => {
      const categoryMap = new Map<string, { amount: number; count: number }>();
      let total = 0;

      for (const txn of txns) {
        total += txn.amount;
        const existing = categoryMap.get(txn.category) || { amount: 0, count: 0 };
        categoryMap.set(txn.category, {
          amount: existing.amount + txn.amount,
          count: existing.count + 1,
        });
      }

      return {
        total,
        count: txns.length,
        categories: Array.from(categoryMap.entries()).map(([category, stats]) => ({
          category,
          ...stats,
        })),
      };
    };

    return {
      income: getStats(incomeTransactions),
      expense: getStats(expenseTransactions),
    };
  },

  async getRecentTransactions(
    limit = 10,
    type?: "income" | "expense"
  ): Promise<TransactionRecord[]> {
    const query = db.transactions.orderBy("createdAt").reverse();

    if (type) {
      const results = await query.toArray();
      return results.filter((t) => t.type === type).slice(0, limit);
    }

    return await query.limit(limit).toArray();
  },

  async updateTransaction(id: string, updates: Partial<TransactionRecord>): Promise<void> {
    await db.transactions.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  async deleteTransaction(id: string): Promise<void> {
    await db.transactions.delete(id);
  },

  // Clear all expenses - for cleanup functionality
  async clearAllExpenses(): Promise<number> {
    const count = await db.expenses.count();
    await db.expenses.clear();
    return count;
  },

  // Clear all transactions
  async clearAllTransactions(): Promise<number> {
    const count = await db.transactions.count();
    await db.transactions.clear();
    return count;
  },

  // Clear all data (both expenses and transactions)
  async clearAllData(): Promise<{ expenses: number; transactions: number }> {
    const expenseCount = await this.clearAllExpenses();
    const transactionCount = await this.clearAllTransactions();
    return { expenses: expenseCount, transactions: transactionCount };
  },

  // Migrate existing expenses to transactions table (one-time migration)
  async migrateExpensesToTransactions(): Promise<number> {
    try {
      // Get all existing expenses
      const expenses = await db.expenses.toArray();

      if (expenses.length === 0) {
        return 0; // No expenses to migrate
      }

      // Check if migration has already been done by looking for expense transactions
      const existingExpenseTransactions = await db.transactions
        .where("type")
        .equals("expense")
        .count();

      if (existingExpenseTransactions > 0) {
        return 0; // Migration already done
      }

      // Convert expenses to transactions and bulk add
      const transactionsToAdd = expenses.map((expense) => ({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        type: "expense" as const,
        originalInput: expense.originalInput,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      }));

      await db.transactions.bulkAdd(transactionsToAdd);
      return transactionsToAdd.length;
    } catch (error) {
      console.error("Failed to migrate expenses to transactions:", error);
      return 0;
    }
  },
};

export { db };

// Provide direct database access for services
export const DatabaseAccess = {
  db,
  ExpenseDB,
};
