import { useCallback, useEffect, useRef, useState } from "react";
import type { ExpenseManagerState, IncomeRecord } from "../types";
import { useIncomeService } from "./use-income-service";

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

interface UseIncomeSearchOptions {
  toolState: ExpenseManagerState;
  dateRange?: { start: Date; end: Date };
  limit?: number;
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
  onRefresh?: () => void;
}

interface SearchFilters {
  selectedCategory: string;
  searchTerm: string;
  currentPage: number;
}

export function useIncomeSearch({
  toolState,
  dateRange,
  limit = 5,
  setToolState,
  onRefresh,
}: UseIncomeSearchOptions) {
  const [filters, setFilters] = useState<SearchFilters>({
    selectedCategory: "all",
    searchTerm: "",
    currentPage: 1,
  });

  const previousIncomeLength = useRef<number>(toolState.income?.length || 0);

  const [results, setResults] = useState<{
    income: IncomeRecord[];
    total: number;
    isLoading: boolean;
  }>({
    income: [],
    total: 0,
    isLoading: false,
  });

  const { searchIncome, deleteIncome } = useIncomeService(toolState, setToolState);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Search function that calls database
  const performSearch = useCallback(
    async (category: string, searchTerm: string, page: number) => {
      setResults((prev) => ({ ...prev, isLoading: true }));

      try {
        const result = await searchIncome({
          searchTerm: searchTerm.trim() || undefined,
          category: category !== "all" ? category : undefined,
          startDate: dateRange?.start,
          endDate: dateRange?.end,
          page,
          limit,
        });

        setResults({
          income: result.income,
          total: result.total,
          isLoading: false,
        });
      } catch (error) {
        console.error("Search failed:", error);
        setResults({
          income: [],
          total: 0,
          isLoading: false,
        });
      }
    },
    [searchIncome, dateRange, limit]
  );

  // Trigger search when category, debounced search term or pagination changes
  useEffect(() => {
    performSearch(filters.selectedCategory, debouncedSearchTerm, filters.currentPage);
  }, [filters.selectedCategory, debouncedSearchTerm, filters.currentPage, performSearch]);

  // Watch for changes in income data length and refresh search
  useEffect(() => {
    const currentIncomeLength = toolState.income?.length || 0;
    if (previousIncomeLength.current !== currentIncomeLength) {
      previousIncomeLength.current = currentIncomeLength;
      // Refresh search results when data changes
      performSearch(filters.selectedCategory, debouncedSearchTerm, filters.currentPage);
    }
  }, [
    toolState.income?.length,
    performSearch,
    filters.selectedCategory,
    debouncedSearchTerm,
    filters.currentPage,
  ]);

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

  // Remove income function
  const removeIncome = useCallback(
    async (incomeId: string) => {
      try {
        await deleteIncome(incomeId);
        // Refresh search results after deletion
        performSearch(filters.selectedCategory, debouncedSearchTerm, filters.currentPage);
        // Trigger parent refresh
        onRefresh?.();
      } catch (error) {
        console.error("Failed to remove income:", error);
        throw error;
      }
    },
    [
      deleteIncome,
      filters.selectedCategory,
      debouncedSearchTerm,
      filters.currentPage,
      performSearch,
      onRefresh,
    ]
  );

  return {
    // State
    selectedCategory: filters.selectedCategory,
    searchTerm: filters.searchTerm,
    currentPage: filters.currentPage,
    income: results.income,
    total: results.total,
    isLoading: results.isLoading,

    // Actions
    setSelectedCategory,
    setSearchTerm,
    setCurrentPage,
    clearFilters,
    removeIncome,

    // Computed
    totalPages: Math.ceil(results.total / limit),
    hasFilters: filters.selectedCategory !== "all" || filters.searchTerm.trim() !== "",
  };
}
