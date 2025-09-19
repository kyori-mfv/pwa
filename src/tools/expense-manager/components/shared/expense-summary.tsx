import type { ExpenseRecord, UserSettings } from "../../types";
import { formatAmount } from "../../utils/currency-utils";

interface ExpenseSummaryProps {
  // All expenses in the date range (for totals)
  allExpenses: ExpenseRecord[];
  // Filtered results count (for display)
  filteredCount: number;
  settings: UserSettings;
  isLoading: boolean;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  allExpenses,
  filteredCount,
  settings,
  isLoading,
}) => {
  if (isLoading) {
    return null;
  }

  // Calculate totals based on ALL expenses in date range, not just filtered results
  const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageAmount = allExpenses.length > 0 ? totalAmount / allExpenses.length : 0;
  const totalExpensesInRange = allExpenses.length;

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 p-3 md:p-4 bg-muted/30 rounded-lg">
      <div className="text-center">
        <div className="text-sm md:text-lg font-bold text-primary break-words">
          {formatAmount(totalAmount, settings)}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Tổng chi tiêu</div>
      </div>

      <div className="text-center">
        <div className="text-sm md:text-lg font-bold text-primary break-words">
          {formatAmount(averageAmount, settings)}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Trung bình</div>
      </div>

      <div className="text-center">
        <div className="text-sm md:text-lg font-bold text-primary">
          {filteredCount}/{totalExpensesInRange}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Tìm thấy/Tổng</div>
      </div>
    </div>
  );
};
