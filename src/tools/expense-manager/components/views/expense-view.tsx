import { TrendingDown } from "lucide-react";
import { useState } from "react";
import type { ExpenseManagerState } from "../../types";
import { ExpenseSearch } from "../expense/expense-search";
import { AIExpenseInput } from "../input/ai-expense-input";
import { ImportExportActions } from "../shared/import-export-actions";
import { RecentTransactions } from "../shared/recent-transactions";

interface ExpenseViewProps {
  toolState: ExpenseManagerState;
  setToolState: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
  onRefresh?: () => void;
}

export const ExpenseView: React.FC<ExpenseViewProps> = ({ toolState, setToolState, onRefresh }) => {
  // State for date range in search component
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const handleImportComplete = async () => {
    // Trigger refresh instead of full page reload
    if (onRefresh) {
      onRefresh();
    } else {
      // Fallback to reload if no refresh callback
      window.location.reload();
    }
  };

  // Get expense records from toolState
  const expenseRecords = toolState.expenses || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="h-6 w-6 text-chart-3" />
        <div>
          <h1 className="text-2xl font-bold">Quản lý Chi tiêu</h1>
          <p className="text-muted-foreground">Theo dõi chi tiêu với AI ngôn ngữ tự nhiên</p>
        </div>
      </div>

      {/* Main Input Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AIExpenseInput toolState={toolState} setToolState={setToolState} />
        </div>

        <div className="space-y-6">
          <RecentTransactions
            transactions={expenseRecords}
            settings={toolState.settings}
            title="Chi tiêu gần đây"
            emptyMessage="Chưa có chi tiêu nào"
            limit={5}
          />
        </div>
      </div>

      {/* Expense Search Section */}
      <div className="mt-8">
        <ExpenseSearch
          toolState={toolState}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          setToolState={setToolState}
          onRefresh={onRefresh}
        />
      </div>

      {/* Import/Export Actions */}
      <div className="flex justify-center">
        <ImportExportActions
          expenses={toolState.expenses}
          onImportComplete={handleImportComplete}
        />
      </div>
    </div>
  );
};
