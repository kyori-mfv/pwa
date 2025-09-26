import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo } from "react";
import { useTransactionsSearch } from "../../hooks/use-transactions-search";
import type { ExpenseManagerState } from "../../types";
import { TransactionsFilters } from "./transactions-filters";
import { TransactionsResults } from "./transactions-results";

interface TransactionsViewProps {
  toolState: ExpenseManagerState;
  dateRange?: { start: Date; end: Date };
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
  onRefresh?: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  toolState,
  dateRange: externalDateRange,
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
  } = useTransactionsSearch({
    toolState,
    dateRange: externalDateRange,
    limit: 5,
    setToolState,
    onRefresh,
  });

  const categories = useMemo(() => {
    // Filter to only show expense categories since this is "Thông tin chi tiêu"
    return toolState.categories
      .filter((cat) => cat.type === "expense" || cat.type === "both")
      .map((cat) => cat.name);
  }, [toolState.categories]);

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Thông tin chi tiêu</CardTitle>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-muted-foreground">{total} giao dịch</p>
          {externalDateRange && (
            <p className="text-xs md:text-sm text-primary break-words">
              từ {format(externalDateRange.start, "dd/MM/yyyy", { locale: vi })} đến{" "}
              {format(externalDateRange.end, "dd/MM/yyyy", { locale: vi })}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
        {/* Filter Controls - Independent Component */}
        <TransactionsFilters
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />

        {/* Search Results - Completely Separate Component */}
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
