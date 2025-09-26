import { useCallback } from "react";
import * as ExpenseService from "../services/expense-service";
import * as IncomeService from "../services/income-service";
import type { ExpenseManagerState } from "../types";

export function useDashboardStats(toolState: ExpenseManagerState) {
  // Get combined financial statistics
  const getFinancialStats = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      // Get stats from both services in parallel
      const [expenseStats, incomeStats] = await Promise.all([
        ExpenseService.getExpenseStats(startDate, endDate),
        IncomeService.getIncomeStats(startDate, endDate),
      ]);

      // Calculate derived metrics
      const netAmount = incomeStats.total - expenseStats.total;
      const savingsRate = incomeStats.total > 0 ? (netAmount / incomeStats.total) * 100 : 0;

      return {
        income: incomeStats,
        expense: expenseStats,
        net: {
          amount: netAmount,
          savingsRate,
          isPositive: netAmount >= 0,
        },
        totals: {
          income: incomeStats.total,
          expense: expenseStats.total,
          net: netAmount,
        },
        counts: {
          income: incomeStats.count,
          expense: expenseStats.count,
          total: incomeStats.count + expenseStats.count,
        },
      };
    } catch (error) {
      console.error("Failed to get financial stats:", error);
      return {
        income: { total: 0, count: 0, categories: [] },
        expense: { total: 0, count: 0, categories: [] },
        net: { amount: 0, savingsRate: 0, isPositive: true },
        totals: { income: 0, expense: 0, net: 0 },
        counts: { income: 0, expense: 0, total: 0 },
      };
    }
  }, []);

  // Get expense category data for charts (enriched with metadata)
  const getExpenseCategoryData = useCallback(
    async (startDate?: Date, endDate?: Date) => {
      try {
        const expenseStats = await ExpenseService.getExpenseStats(startDate, endDate);

        // Enrich with category metadata from toolState
        const enrichedData = expenseStats.categories
          .map((stat) => {
            const categoryMeta = toolState.categories.find((cat) => cat.name === stat.category);
            return {
              name: stat.category,
              amount: stat.amount,
              count: stat.count,
              color: categoryMeta?.color || "#6b7280",
              budget: categoryMeta?.budget || 0,
            };
          })
          .filter((item) => item.amount > 0) // Only show categories with expenses
          .sort((a, b) => b.amount - a.amount); // Sort by amount descending

        return enrichedData;
      } catch (error) {
        console.error("Failed to get expense category data:", error);
        return [];
      }
    },
    [toolState.categories]
  );

  // Get income category data for charts (enriched with metadata)
  const getIncomeCategoryData = useCallback(
    async (startDate?: Date, endDate?: Date) => {
      try {
        const incomeStats = await IncomeService.getIncomeStats(startDate, endDate);

        // Enrich with category metadata from toolState
        const enrichedData = incomeStats.categories
          .map((stat) => {
            const categoryMeta = toolState.categories.find((cat) => cat.name === stat.category);
            return {
              name: stat.category,
              amount: stat.amount,
              count: stat.count,
              color: categoryMeta?.color || "#22c55e",
              budget: categoryMeta?.budget || 0,
            };
          })
          .filter((item) => item.amount > 0) // Only show categories with income
          .sort((a, b) => b.amount - a.amount); // Sort by amount descending

        return enrichedData;
      } catch (error) {
        console.error("Failed to get income category data:", error);
        return [];
      }
    },
    [toolState.categories]
  );

  // Get combined recent transactions from both services
  const getRecentTransactions = useCallback(async (limit = 10) => {
    try {
      // Get recent transactions from both services
      const [recentExpenses, recentIncome] = await Promise.all([
        ExpenseService.getRecentExpenses(Math.ceil(limit / 2)),
        IncomeService.getRecentIncome(Math.ceil(limit / 2)),
      ]);

      // Combine and sort by creation date
      const combined = [
        ...recentExpenses.map((expense) => ({ ...expense, type: "expense" as const })),
        ...recentIncome.map((income) => ({ ...income, type: "income" as const })),
      ];

      // Sort by createdAt desc and limit
      return combined
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error("Failed to get recent transactions:", error);
      return [];
    }
  }, []);

  // Search across both expenses and income
  const searchAllTransactions = useCallback(
    async (options: {
      searchTerm?: string;
      category?: string;
      type?: "income" | "expense";
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    }) => {
      try {
        const { type, ...searchOptions } = options;

        if (type === "expense") {
          const result = await ExpenseService.searchExpenses(searchOptions);
          return {
            transactions: result.expenses.map((e) => ({ ...e, type: "expense" as const })),
            total: result.total,
          };
        }

        if (type === "income") {
          const result = await IncomeService.searchIncome(searchOptions);
          return {
            transactions: result.income.map((i) => ({ ...i, type: "income" as const })),
            total: result.total,
          };
        }

        // Search both if no type specified
        const [expenseResult, incomeResult] = await Promise.all([
          ExpenseService.searchExpenses(searchOptions),
          IncomeService.searchIncome(searchOptions),
        ]);

        const combinedTransactions = [
          ...expenseResult.expenses.map((e) => ({ ...e, type: "expense" as const })),
          ...incomeResult.income.map((i) => ({ ...i, type: "income" as const })),
        ];

        // Sort by date descending
        const sorted = combinedTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Apply pagination manually since we combined results
        const { page = 1, limit = 15 } = options;
        const offset = (page - 1) * limit;

        return {
          transactions: sorted.slice(offset, offset + limit),
          total: combinedTransactions.length,
        };
      } catch (error) {
        console.error("Failed to search all transactions:", error);
        return { transactions: [], total: 0 };
      }
    },
    []
  );

  return {
    getFinancialStats,
    getExpenseCategoryData,
    getIncomeCategoryData,
    getRecentTransactions,
    searchAllTransactions,
  };
}
