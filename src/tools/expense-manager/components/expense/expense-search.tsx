import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo } from "react";
import { useExpenseSearch } from "../../hooks/use-expense-search";
import type { ExpenseManagerState } from "../../types";
import { DateRangePicker } from "../shared/date-range-picker";
import { ExpenseFilters } from "../shared/expense-filters";
import { TransactionsResults } from "../transactions/transactions-results";

interface ExpenseSearchProps {
  toolState: ExpenseManagerState;
  dateRange: { start: Date; end: Date };
  onDateRangeChange: (dateRange: { start: Date; end: Date }) => void;
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
  onRefresh?: () => void;
}

export const ExpenseSearch: React.FC<ExpenseSearchProps> = ({
  toolState,
  dateRange,
  onDateRangeChange,
  setToolState,
  onRefresh,
}) => {
  const {
    selectedCategory,
    searchTerm,
    currentPage,
    expenses: searchResults,
    total,
    isLoading,
    totalPages,
    hasFilters,
    setSelectedCategory,
    setSearchTerm,
    setCurrentPage,
    clearFilters,
    removeExpense,
  } = useExpenseSearch({
    toolState,
    dateRange,
    limit: 5,
    setToolState,
    onRefresh,
  });

  const categories = useMemo(() => {
    // Filter to only show expense categories
    return toolState.categories
      .filter((cat) => cat.type === "expense" || cat.type === "both")
      .map((cat) => cat.name);
  }, [toolState.categories]);

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Tìm kiếm & Quản lý Chi tiêu</CardTitle>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-muted-foreground">{total} giao dịch</p>
          <p className="text-xs md:text-sm text-primary break-words">
            từ {format(dateRange.start, "dd/MM/yyyy", { locale: vi })} đến{" "}
            {format(dateRange.end, "dd/MM/yyyy", { locale: vi })}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
        {/* Date Range Picker */}
        <div className="flex justify-center">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
        </div>

        {/* Search & Filter Controls */}
        <ExpenseFilters
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />

        {/* Search Results */}
        <TransactionsResults
          searchResults={searchResults}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          hasFilters={hasFilters}
          toolState={toolState}
          onPageChange={setCurrentPage}
          onClearFilters={clearFilters}
          onRemoveExpense={removeExpense}
        />
      </CardContent>
    </Card>
  );
};
