import { useCallback, useEffect, useState } from "react";
import type { ExpenseManagerState, ExpenseRecord } from "../types";
import { useExpenseManager } from "./use-expense-manager";

interface UseTransactionsSearchOptions {
  toolState: ExpenseManagerState;
  dateRange?: { start: Date; end: Date };
  limit?: number;
}

interface SearchFilters {
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
}

export function useTransactionsSearch({
  toolState,
  dateRange,
  limit = 5,
}: UseTransactionsSearchOptions) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    selectedCategory: "all",
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

  const { searchExpenses } = useExpenseManager(toolState);

  // Search function that calls database
  const performSearch = useCallback(
    async (searchFilters: SearchFilters) => {
      setResults((prev) => ({ ...prev, isLoading: true }));

      try {
        const result = await searchExpenses({
          searchTerm: searchFilters.searchTerm.trim() || undefined,
          category:
            searchFilters.selectedCategory !== "all" ? searchFilters.selectedCategory : undefined,
          startDate: dateRange?.start,
          endDate: dateRange?.end,
          page: searchFilters.currentPage,
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

  // Trigger search when filters change
  useEffect(() => {
    performSearch(filters);
  }, [filters, performSearch]);

  // Reset page when search term or category changes
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      // Reset page if search term or category changed
      if (newFilters.searchTerm !== undefined || newFilters.selectedCategory !== undefined) {
        updated.currentPage = 1;
      }

      return updated;
    });
  }, []);

  // Helper functions
  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      updateFilters({ searchTerm });
    },
    [updateFilters]
  );

  const setSelectedCategory = useCallback(
    (selectedCategory: string) => {
      updateFilters({ selectedCategory });
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
      searchTerm: "",
      selectedCategory: "all",
      currentPage: 1,
    });
  }, []);

  return {
    // State
    searchTerm: filters.searchTerm,
    selectedCategory: filters.selectedCategory,
    currentPage: filters.currentPage,
    expenses: results.expenses,
    total: results.total,
    isLoading: results.isLoading,

    // Actions
    setSearchTerm,
    setSelectedCategory,
    setCurrentPage,
    clearFilters,

    // Computed
    totalPages: Math.ceil(results.total / limit),
    hasFilters: filters.searchTerm.trim() !== "" || filters.selectedCategory !== "all",
  };
}
