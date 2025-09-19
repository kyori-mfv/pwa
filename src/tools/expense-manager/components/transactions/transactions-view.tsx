import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FileText, Search } from "lucide-react";
import { useMemo } from "react";
import { useTransactionsSearch } from "../../hooks/use-transactions-search";
import type { ExpenseManagerState } from "../../types";
import { ExpenseFilters } from "../shared/expense-filters";
import { ExpensePagination } from "../shared/expense-pagination";
import { TransactionItem } from "../shared/transaction-item";

interface TransactionsViewProps {
  toolState: ExpenseManagerState;
  dateRange?: { start: Date; end: Date };
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  toolState,
  dateRange: externalDateRange,
}) => {
  const {
    searchTerm,
    selectedCategory,
    currentPage,
    expenses: searchResults,
    total,
    isLoading,
    totalPages,
    hasFilters,
    setSearchTerm,
    setSelectedCategory,
    setCurrentPage,
    clearFilters,
  } = useTransactionsSearch({
    toolState,
    dateRange: externalDateRange,
    limit: 5,
  });

  const categories = useMemo(() => {
    return toolState.categories.map((cat) => cat.name);
  }, [toolState.categories]);

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Thông tin giao dịch</CardTitle>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Đang tải..." : `${total} giao dịch`}
          </p>
          {externalDateRange && (
            <p className="text-xs md:text-sm text-primary break-words">
              từ {format(externalDateRange.start, "dd/MM/yyyy", { locale: vi })} đến{" "}
              {format(externalDateRange.end, "dd/MM/yyyy", { locale: vi })}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
        {/* Search and Filter Controls */}
        <ExpenseFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          isLoading={isLoading}
          onSearchTermChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
        {/* Pagination */}
        <ExpensePagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          itemsPerPage={5}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
        />
        {/* Transaction List */}
        {isLoading && searchResults.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-2 animate-spin" />
              <p>Đang tìm kiếm...</p>
            </div>
          </div>
        ) : total === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>{hasFilters ? "Không tìm thấy giao dịch nào phù hợp" : "Chưa có giao dịch nào"}</p>
              {hasFilters && (
                <Button variant="outline" size="sm" className="mt-2" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {searchResults.map((expense) => (
                <TransactionItem
                  key={expense.id || `${expense.date}-${expense.amount}`}
                  expense={expense}
                  settings={toolState.settings}
                  showOriginalInput={false}
                  compact={false}
                />
              ))}
            </div>

            {/* Pagination */}
            <ExpensePagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              itemsPerPage={5}
              isLoading={isLoading}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
