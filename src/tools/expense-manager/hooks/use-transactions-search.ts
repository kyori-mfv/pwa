import { useCallback, useEffect, useState } from "react";
import type { ExpenseManagerState, ExpenseRecord } from "../types";
import { useExpenseManager } from "./use-expense-manager";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UseTransactionsSearchOptions {
  toolState: ExpenseManagerState;
  dateRange?: { start: Date; end: Date };
  limit?: number;
}

interface SearchFilters {
  selectedCategory: string;
  searchTerm: string;
  currentPage: number;
}

export function useTransactionsSearch({
  toolState,
  dateRange,
  limit = 5,
}: UseTransactionsSearchOptions) {
  const [filters, setFilters] = useState<SearchFilters>({
    selectedCategory: "all",
    searchTerm: "",
    currentPage: 1,
  });

  const [results, setResults] = useState<{
    expenses: ExpenseRecord[];
    total: number;
    isLoading: boolean;
  }>({
    expenses: [],
    total: 0,
    isLoading: false,
  });

  const { searchExpenses, deleteExpense } = useExpenseManager(toolState);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Search function that calls database
  const performSearch = useCallback(
    async (category: string, searchTerm: string, page: number) => {
      setResults((prev) => ({ ...prev, isLoading: true }));

      try {
        const result = await searchExpenses({
          searchTerm: searchTerm.trim() || undefined,
          category: category !== "all" ? category : undefined,
          startDate: dateRange?.start,
          endDate: dateRange?.end,
          page,
          limit,
        });

        setResults({
          expenses: result.expenses,
          total: result.total,
          isLoading: false,
        });
      } catch (error) {
        console.error("Search failed:", error);
        setResults({
          expenses: [],
          total: 0,
          isLoading: false,
        });
      }
    },
    [searchExpenses, dateRange, limit]
  );

  // Trigger search when category, debounced search term or pagination changes
  useEffect(() => {
    performSearch(filters.selectedCategory, debouncedSearchTerm, filters.currentPage);
  }, [filters.selectedCategory, debouncedSearchTerm, filters.currentPage, performSearch]);

  // Update filters helper
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      // Reset page if category or search term changed
      if (newFilters.selectedCategory !== undefined || newFilters.searchTerm !== undefined) {
        updated.currentPage = 1;
      }

      return updated;
    });
  }, []);

  // Helper functions
  const setSelectedCategory = useCallback(
    (selectedCategory: string) => {
      updateFilters({ selectedCategory });
    },
    [updateFilters]
  );

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      updateFilters({ searchTerm });
    },
    [updateFilters]
  );

  const setCurrentPage = useCallback(
    (currentPage: number) => {
      updateFilters({ currentPage });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      selectedCategory: "all",
      searchTerm: "",
      currentPage: 1,
    });
  }, []);

  // Remove expense function
  const removeExpense = useCallback(
    async (expenseId: string) => {
      try {
        await deleteExpense(expenseId);
        // Refresh search results after deletion
        performSearch(filters.selectedCategory, debouncedSearchTerm, filters.currentPage);
      } catch (error) {
        console.error("Failed to remove expense:", error);
        throw error;
      }
    },
    [
      deleteExpense,
      filters.selectedCategory,
      debouncedSearchTerm,
      filters.currentPage,
      performSearch,
    ]
  );

  return {
    // State
    selectedCategory: filters.selectedCategory,
    searchTerm: filters.searchTerm,
    currentPage: filters.currentPage,
    expenses: results.expenses,
    total: results.total,
    isLoading: results.isLoading,

    // Actions
    setSelectedCategory,
    setSearchTerm,
    setCurrentPage,
    clearFilters,
    removeExpense,

    // Computed
    totalPages: Math.ceil(results.total / limit),
    hasFilters: filters.selectedCategory !== "all" || filters.searchTerm.trim() !== "",
  };
}
