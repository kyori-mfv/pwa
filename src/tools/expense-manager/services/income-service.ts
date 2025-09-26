import { generateUUID } from "../../../shared/utils/uuid";
import type { IncomeRecord } from "../types";
import { DatabaseAccess } from "./database";

/**
 * Add a new income record
 */
export async function addIncome(
  income: Omit<IncomeRecord, "id" | "type" | "createdAt" | "updatedAt">
): Promise<IncomeRecord> {
  const now = new Date();
  const id = generateUUID();

  const newIncome: IncomeRecord = {
    ...income,
    id,
    type: "income",
    createdAt: now,
    updatedAt: now,
  };

  try {
    await DatabaseAccess.db.income.add(newIncome);
    return newIncome;
  } catch (error) {
    console.error("Failed to add income:", error);
    throw new Error("Failed to save income");
  }
}

/**
 * Get income by date range
 */
export async function getIncomeByDateRange(
  startDate: Date,
  endDate: Date
): Promise<IncomeRecord[]> {
  return await DatabaseAccess.db.income
    .where("date")
    .between(startDate, endDate, true, true)
    .reverse()
    .toArray();
}

/**
 * Search income with filters
 */
export async function searchIncome(options: {
  searchTerm?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}): Promise<{ income: IncomeRecord[]; total: number }> {
  const { searchTerm, category, startDate, endDate, limit = 15, page = 1 } = options;
  const actualOffset = (page - 1) * limit;

  let query = DatabaseAccess.db.income.orderBy("date").reverse();

  // Apply date range filter first (most selective)
  if (startDate && endDate) {
    query = DatabaseAccess.db.income
      .where("date")
      .between(startDate, endDate, true, true)
      .reverse();
  }

  // Get all matching records for further filtering
  let results = await query.toArray();

  // Apply search filter
  if (searchTerm?.trim()) {
    const search = searchTerm.toLowerCase().trim();
    results = results.filter(
      (income) =>
        income.description.toLowerCase().includes(search) ||
        income.category.toLowerCase().includes(search) ||
        income.originalInput?.toLowerCase().includes(search)
    );
  }

  // Apply category filter
  if (category && category !== "all") {
    results = results.filter((income) => income.category === category);
  }

  const total = results.length;
  const income = results.slice(actualOffset, actualOffset + limit);

  return { income, total };
}

/**
 * Get income statistics by category
 */
export async function getIncomeStats(
  startDate?: Date,
  endDate?: Date
): Promise<{
  total: number;
  count: number;
  categories: Array<{ category: string; amount: number; count: number }>;
}> {
  let incomeRecords: IncomeRecord[];

  if (startDate && endDate) {
    incomeRecords = await getIncomeByDateRange(startDate, endDate);
  } else {
    incomeRecords = await DatabaseAccess.db.income.toArray();
  }

  // Group by category
  const categoryMap = new Map<string, { amount: number; count: number }>();
  let total = 0;

  for (const income of incomeRecords) {
    total += income.amount;
    const existing = categoryMap.get(income.category) || { amount: 0, count: 0 };
    categoryMap.set(income.category, {
      amount: existing.amount + income.amount,
      count: existing.count + 1,
    });
  }

  return {
    total,
    count: incomeRecords.length,
    categories: Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      ...stats,
    })),
  };
}

/**
 * Get recent income records
 */
export async function getRecentIncome(limit = 10): Promise<IncomeRecord[]> {
  return await DatabaseAccess.db.income.orderBy("createdAt").reverse().limit(limit).toArray();
}

/**
 * Update an income record
 */
export async function updateIncome(
  id: string,
  updates: Partial<Omit<IncomeRecord, "id" | "type" | "createdAt">>
): Promise<void> {
  const now = new Date();
  const updateData = {
    ...updates,
    updatedAt: now,
  };

  try {
    await DatabaseAccess.db.income.update(id, updateData);
  } catch (error) {
    console.error("Failed to update income:", error);
    throw new Error("Failed to update income");
  }
}

/**
 * Delete an income record
 */
export async function deleteIncome(id: string): Promise<void> {
  try {
    await DatabaseAccess.db.income.delete(id);
  } catch (error) {
    console.error("Failed to delete income:", error);
    throw new Error("Failed to delete income");
  }
}

/**
 * Get income by category
 */
export async function getIncomeByCategory(
  category: string,
  startDate?: Date,
  endDate?: Date
): Promise<IncomeRecord[]> {
  const query = DatabaseAccess.db.income.where("category").equals(category);
  const results = await query.toArray();

  return results
    .filter((income) => {
      const matchesDateRange =
        !startDate ||
        !endDate ||
        (new Date(income.date) >= startDate && new Date(income.date) <= endDate);
      return matchesDateRange;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Clear all income records
 */
export async function clearAllIncome(): Promise<number> {
  try {
    const count = await DatabaseAccess.db.income.count();
    await DatabaseAccess.db.income.clear();
    return count;
  } catch (error) {
    console.error("Failed to clear income:", error);
    throw new Error("Failed to clear income");
  }
}
