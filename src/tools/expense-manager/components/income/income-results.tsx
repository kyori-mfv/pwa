import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { ExpenseManagerState, IncomeRecord } from "../../types";
import { TransactionItem } from "../shared/transaction-item";

interface IncomeResultsProps {
  searchResults: IncomeRecord[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasFilters: boolean;
  toolState: ExpenseManagerState;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onRemoveIncome: (id: string) => Promise<void>;
}

export const IncomeResults: React.FC<IncomeResultsProps> = memo(
  ({
    searchResults,
    total,
    currentPage,
    totalPages,
    hasFilters,
    toolState,
    onPageChange,
    onClearFilters,
    onRemoveIncome,
  }) => {
    const [removingIncomeId, setRemovingIncomeId] = useState<string | null>(null);

    const handleRemoveIncome = useCallback(
      async (incomeId: string) => {
        setRemovingIncomeId(incomeId);
        try {
          await onRemoveIncome(incomeId);
        } catch (error) {
          console.error("Failed to remove income:", error);
          // You could add toast notification here
        } finally {
          setRemovingIncomeId(null);
        }
      },
      [onRemoveIncome]
    );
    if (searchResults.length === 0 && hasFilters) {
      return (
        <div className="text-center py-12 space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Không tìm thấy thu nhập nào</h3>
            <p className="text-sm text-muted-foreground">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <Button variant="outline" onClick={onClearFilters} className="mt-4">
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      );
    }

    if (searchResults.length === 0 && !hasFilters) {
      return (
        <div className="text-center py-12 space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Chưa có thu nhập nào</h3>
            <p className="text-sm text-muted-foreground">
              Thu nhập sẽ xuất hiện ở đây sau khi bạn thêm
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Results */}
        <div className="space-y-3">
          {searchResults.map((income) => (
            <TransactionItem
              key={income.id}
              transaction={income}
              settings={toolState.settings}
              showOriginalInput={false}
              compact={false}
              showRemoveButton={true}
              onRemove={handleRemoveIncome}
              isRemoving={removingIncomeId === income.id}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} ({total} thu nhập)
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex items-center gap-1"
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
