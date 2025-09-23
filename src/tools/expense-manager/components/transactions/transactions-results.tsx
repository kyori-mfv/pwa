import { Button } from "@/shared/components/ui/button";
import { FileText, Search } from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { ExpenseManagerState } from "../../types";
import { ExpensePagination } from "../shared/expense-pagination";
import { TransactionItem } from "../shared/transaction-item";

interface TransactionsResultsProps {
  searchResults: ExpenseManagerState["expenses"];
  total: number;
  currentPage: number;
  totalPages: number;
  hasFilters: boolean;
  toolState: ExpenseManagerState;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onRemoveExpense: (expenseId: string) => Promise<void>;
}

export const TransactionsResults: React.FC<TransactionsResultsProps> = memo(
  ({
    searchResults,
    total,
    currentPage,
    totalPages,
    hasFilters,
    toolState,
    onPageChange,
    onClearFilters,
    onRemoveExpense,
  }) => {
    const [removingExpenseId, setRemovingExpenseId] = useState<string | null>(null);

    const handleRemoveExpense = useCallback(
      async (expenseId: string) => {
        setRemovingExpenseId(expenseId);
        try {
          await onRemoveExpense(expenseId);
        } catch (error) {
          console.error("Failed to remove expense:", error);
          // You could add toast notification here
        } finally {
          setRemovingExpenseId(null);
        }
      },
      [onRemoveExpense]
    );

    // No results state
    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2" />
            <p>{hasFilters ? "Không tìm thấy giao dịch nào phù hợp" : "Chưa có giao dịch nào"}</p>
            {hasFilters && (
              <Button variant="outline" size="sm" className="mt-2" onClick={onClearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Results with pagination
    return (
      <div className="space-y-4">
        {/* Pagination */}
        <ExpensePagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          itemsPerPage={5}
          onPageChange={onPageChange}
        />

        {/* Transaction List */}
        <div className="space-y-3">
          {searchResults.map((expense) => (
            <TransactionItem
              key={expense.id || `${expense.date}-${expense.amount}`}
              expense={expense}
              settings={toolState.settings}
              showOriginalInput={false}
              compact={false}
              showRemoveButton={true}
              onRemove={handleRemoveExpense}
              isRemoving={removingExpenseId === expense.id}
            />
          ))}
        </div>

        {/* Pagination */}
        <ExpensePagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          itemsPerPage={5}
          onPageChange={onPageChange}
        />
      </div>
    );
  }
);
