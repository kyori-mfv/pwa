import { useCallback, useEffect, useState } from "react";
import * as ExpenseService from "../services/expense-service";
import type { ExpenseManagerState, ExpenseRecord, TransactionRecord } from "../types";

export function useExpenseService(
  toolState: ExpenseManagerState,
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize and load recent expenses
  const loadRecentExpenses = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load recent expenses
      const expenses = await ExpenseService.getRecentExpenses(10);

      setToolState?.((prev) => ({
        ...prev,
        expenses: expenses,
      }));
    } catch (error) {
      console.error("Failed to load recent expenses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setToolState]);

  // Initialize on mount
  useEffect(() => {
    loadRecentExpenses();
  }, [loadRecentExpenses]);

  // Add expense
  const addExpense = useCallback(
    async (expense: Omit<ExpenseRecord, "id" | "createdAt" | "updatedAt">) => {
      try {
        setIsLoading(true);
        const newExpense = await ExpenseService.addExpense(expense);

        // Reload recent expenses to update state
        await loadRecentExpenses();

        // Dashboard will refresh automatically when toolState changes

        return newExpense;
      } catch (error) {
        console.error("Failed to add expense:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loadRecentExpenses]
  );

  // Search expenses
  const searchExpenses = useCallback(
    async (options: {
      searchTerm?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    }) => {
      try {
        const result = await ExpenseService.searchExpenses(options);
        return {
          expenses: result.expenses.map((expense) => ({
            ...expense,
            type: "expense" as const,
          })),
          total: result.total,
        };
      } catch (error) {
        console.error("Failed to search expenses:", error);
        return { expenses: [], total: 0 };
      }
    },
    []
  );

  // Get expenses by date range
  const getExpensesByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      const expenses = await ExpenseService.getExpensesByDateRange(startDate, endDate);
      return expenses.map((expense) => ({
        ...expense,
        type: "expense" as const,
      }));
    } catch (error) {
      console.error("Failed to get expenses by date range:", error);
      return [];
    }
  }, []);

  // Get expense statistics
  const getExpenseStats = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      return await ExpenseService.getExpenseStats(startDate, endDate);
    } catch (error) {
      console.error("Failed to get expense stats:", error);
      return { total: 0, count: 0, categories: [] };
    }
  }, []);

  // Update expense
  const updateExpense = useCallback(
    async (id: string, updates: Partial<ExpenseRecord>) => {
      try {
        await ExpenseService.updateExpense(id, updates);

        // Update local state
        setToolState?.((prev) => ({
          expenses: prev.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates, updatedAt: new Date() } : expense
          ),
        }));

        // Dashboard will refresh automatically when toolState changes
      } catch (error) {
        console.error("Failed to update expense:", error);
        throw error;
      }
    },
    [setToolState]
  );

  // Delete expense
  const deleteExpense = useCallback(
    async (id: string) => {
      try {
        await ExpenseService.deleteExpense(id);

        // Update local state
        setToolState?.((prev) => ({
          expenses: prev.expenses.filter((expense) => expense.id !== id),
        }));

        // Dashboard will refresh automatically when toolState changes
      } catch (error) {
        console.error("Failed to delete expense:", error);
        throw error;
      }
    },
    [setToolState]
  );

  // Get expenses by category
  const getExpensesByCategory = useCallback(
    async (category: string, startDate?: Date, endDate?: Date) => {
      try {
        const expenses = await ExpenseService.getExpensesByCategory(category, startDate, endDate);
        return expenses.map((expense) => ({
          ...expense,
          type: "expense" as const,
        }));
      } catch (error) {
        console.error("Failed to get expenses by category:", error);
        return [];
      }
    },
    []
  );

  // Clear all expenses
  const clearAllExpenses = useCallback(async () => {
    try {
      const count = await ExpenseService.clearAllExpenses();

      // Update local state
      setToolState?.((prev) => ({
        ...prev,
        expenses: [],
      }));

      // Dashboard will refresh automatically when toolState changes

      return count;
    } catch (error) {
      console.error("Failed to clear expenses:", error);
      throw error;
    }
  }, [setToolState]);

  return {
    // State
    isLoading,

    // Actions
    addExpense,
    updateExpense,
    deleteExpense,
    searchExpenses,
    getExpensesByDateRange,
    getExpensesByCategory,
    getExpenseStats,
    clearAllExpenses,
    loadRecentExpenses,
  };
}
