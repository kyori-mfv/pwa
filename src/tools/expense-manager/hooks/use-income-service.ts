import { useCallback, useEffect, useState } from "react";
import type { IncomeRecord } from "../services/database";
import * as IncomeService from "../services/income-service";
import type { ExpenseManagerState, TransactionRecord } from "../types";

export function useIncomeService(
  toolState: ExpenseManagerState,
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize and load recent income
  const loadRecentIncome = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load recent income
      const incomeRecords = await IncomeService.getRecentIncome(20);

      setToolState?.((prev) => ({
        ...prev,
        income: incomeRecords,
      }));
    } catch (error) {
      console.error("Failed to load recent income:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setToolState]);

  // Initialize on mount
  useEffect(() => {
    loadRecentIncome();
  }, [loadRecentIncome]);

  // Add income
  const addIncome = useCallback(
    async (income: Omit<IncomeRecord, "id" | "type" | "createdAt" | "updatedAt">) => {
      try {
        setIsLoading(true);
        const newIncome = await IncomeService.addIncome(income);

        // Update local state
        setToolState?.((prev) => ({
          ...prev,
          income: [newIncome, ...(prev.income || [])].slice(0, 20),
        }));

        // Dashboard will refresh automatically when toolState changes

        return newIncome;
      } catch (error) {
        console.error("Failed to add income:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setToolState]
  );

  // Search income
  const searchIncome = useCallback(
    async (options: {
      searchTerm?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    }) => {
      try {
        const result = await IncomeService.searchIncome(options);
        return {
          income: result.income.map((income) => ({
            ...income,
            type: "income" as const,
          })),
          total: result.total,
        };
      } catch (error) {
        console.error("Failed to search income:", error);
        return { income: [], total: 0 };
      }
    },
    []
  );

  // Get income by date range
  const getIncomeByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      const incomeRecords = await IncomeService.getIncomeByDateRange(startDate, endDate);
      return incomeRecords.map((income) => ({
        ...income,
        type: "income" as const,
      }));
    } catch (error) {
      console.error("Failed to get income by date range:", error);
      return [];
    }
  }, []);

  // Get income statistics
  const getIncomeStats = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      return await IncomeService.getIncomeStats(startDate, endDate);
    } catch (error) {
      console.error("Failed to get income stats:", error);
      return { total: 0, count: 0, categories: [] };
    }
  }, []);

  // Update income
  const updateIncome = useCallback(
    async (id: string, updates: Partial<IncomeRecord>) => {
      try {
        await IncomeService.updateIncome(id, updates);

        // Update local state
        setToolState?.((prev) => ({
          ...prev,
          income: (prev.income || []).map((income) =>
            income.id === id ? { ...income, ...updates, updatedAt: new Date() } : income
          ),
        }));

        // Dashboard will refresh automatically when toolState changes
      } catch (error) {
        console.error("Failed to update income:", error);
        throw error;
      }
    },
    [setToolState]
  );

  // Delete income
  const deleteIncome = useCallback(
    async (id: string) => {
      try {
        await IncomeService.deleteIncome(id);

        // Update local state
        setToolState?.((prev) => ({
          ...prev,
          income: (prev.income || []).filter((income) => income.id !== id),
        }));

        // Dashboard will refresh automatically when toolState changes
      } catch (error) {
        console.error("Failed to delete income:", error);
        throw error;
      }
    },
    [setToolState]
  );

  // Get income by category
  const getIncomeByCategory = useCallback(
    async (category: string, startDate?: Date, endDate?: Date) => {
      try {
        const incomeRecords = await IncomeService.getIncomeByCategory(category, startDate, endDate);
        return incomeRecords.map((income) => ({
          ...income,
          type: "income" as const,
        }));
      } catch (error) {
        console.error("Failed to get income by category:", error);
        return [];
      }
    },
    []
  );

  // Clear all income
  const clearAllIncome = useCallback(async () => {
    try {
      const count = await IncomeService.clearAllIncome();

      // Update local state - clear income
      setToolState?.((prev) => ({
        ...prev,
        income: [],
      }));

      // Dashboard will refresh automatically when toolState changes

      return count;
    } catch (error) {
      console.error("Failed to clear income:", error);
      throw error;
    }
  }, [setToolState]);

  return {
    // State
    isLoading,

    // Actions
    addIncome,
    updateIncome,
    deleteIncome,
    searchIncome,
    getIncomeByDateRange,
    getIncomeByCategory,
    getIncomeStats,
    clearAllIncome,
    loadRecentIncome,
  };
}
