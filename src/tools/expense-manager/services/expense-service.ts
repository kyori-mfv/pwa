import { generateUUID } from "../../../shared/utils/uuid";
import type { ExpenseRecord } from "../types";
import { ExpenseDB } from "./database";

/**
 * Add a new expense - saves to both legacy and transactions tables
 */
export async function addExpense(
  expense: Omit<ExpenseRecord, "id" | "createdAt" | "updatedAt">
): Promise<ExpenseRecord> {
  const now = new Date();
  const id = generateUUID();

  const newExpense: ExpenseRecord = {
    ...expense,
    id,
    type: "expense",
    createdAt: now,
    updatedAt: now,
  };

  try {
    // Save to expenses table
    await ExpenseDB.addExpense(newExpense);
    return newExpense;
  } catch (error) {
    console.error("Failed to add expense:", error);
    throw new Error("Failed to save expense");
  }
}

/**
 * Get expenses by date range
 */
export async function getExpensesByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ExpenseRecord[]> {
  return await ExpenseDB.searchExpenses({
    startDate,
    endDate,
    limit: 1000, // Get all expenses in range
  }).then((result) => result.expenses);
}

/**
 * Search expenses with filters
 */
export async function searchExpenses(options: {
  searchTerm?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}): Promise<{ expenses: ExpenseRecord[]; total: number }> {
  const { page, limit = 15, ...otherOptions } = options;
  const offset = page ? (page - 1) * limit : 0;

  const result = await ExpenseDB.searchExpenses({
    ...otherOptions,
    limit,
    offset,
  });

  return {
    expenses: result.expenses,
    total: result.total,
  };
}

/**
 * Get expense statistics by category
 */
export async function getExpenseStats(startDate?: Date, endDate?: Date) {
  let expenses: ExpenseRecord[];

  if (startDate && endDate) {
    expenses = await getExpensesByDateRange(startDate, endDate);
  } else {
    const result = await ExpenseDB.searchExpenses({ limit: 10000 });
    expenses = result.expenses;
  }

  // Group by category
  const categoryMap = new Map<string, { amount: number; count: number }>();
  let total = 0;

  for (const expense of expenses) {
    total += expense.amount;
    const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
    categoryMap.set(expense.category, {
      amount: existing.amount + expense.amount,
      count: existing.count + 1,
    });
  }

  return {
    total,
    count: expenses.length,
    categories: Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      ...stats,
    })),
  };
}

/**
 * Get recent expenses
 */
export async function getRecentExpenses(limit = 10): Promise<ExpenseRecord[]> {
  const result = await ExpenseDB.searchExpenses({ limit });
  return result.expenses.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Update an expense
 */
export async function updateExpense(
  id: string,
  updates: Partial<Omit<ExpenseRecord, "id" | "createdAt">>
): Promise<void> {
  const now = new Date();
  const updateData = {
    ...updates,
    updatedAt: now,
  };

  try {
    // Update in expenses table
    await ExpenseDB.updateExpense(id, updateData);
  } catch (error) {
    console.error("Failed to update expense:", error);
    throw new Error("Failed to update expense");
  }
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: string): Promise<void> {
  try {
    // Delete from expenses table
    await ExpenseDB.deleteExpense(id);
  } catch (error) {
    console.error("Failed to delete expense:", error);
    throw new Error("Failed to delete expense");
  }
}

/**
 * Get expenses by category
 */
export async function getExpensesByCategory(
  category: string,
  startDate?: Date,
  endDate?: Date
): Promise<ExpenseRecord[]> {
  const result = await ExpenseDB.searchExpenses({
    category,
    startDate,
    endDate,
    limit: 1000,
  });
  return result.expenses;
}

/**
 * Clear all expenses
 */
export async function clearAllExpenses(): Promise<number> {
  try {
    const expenseCount = await ExpenseDB.clearAllExpenses();
    return expenseCount;
  } catch (error) {
    console.error("Failed to clear expenses:", error);
    throw new Error("Failed to clear expenses");
  }
}
