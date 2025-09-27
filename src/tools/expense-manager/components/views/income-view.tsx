import { TrendingUp } from "lucide-react";
import { useState } from "react";
import type { ExpenseManagerState } from "../../types";
import { IncomeSearch } from "../income/income-search";
import { AIIncomeInput } from "../input/ai-income-input";
import { IncomeImportExportActions } from "../shared/income-import-export-actions";
import { RecentTransactions } from "../shared/recent-transactions";

interface IncomeViewProps {
  toolState: ExpenseManagerState;
  setToolState: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
  onRefresh?: () => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({ toolState, setToolState, onRefresh }) => {
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

  // Get income records from toolState
  const incomeRecords = toolState.income || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-chart-5" />
        <div>
          <h1 className="text-2xl font-bold">Quản lý Thu nhập</h1>
          <p className="text-muted-foreground">Theo dõi các khoản thu nhập với AI</p>
        </div>
      </div>

      {/* Main Input Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AIIncomeInput toolState={toolState} setToolState={setToolState} />
        </div>

        <div className="space-y-6">
          <RecentTransactions
            transactions={incomeRecords}
            settings={toolState.settings}
            title="Thu nhập gần đây"
            emptyMessage="Chưa có thu nhập nào"
            limit={5}
          />
        </div>
      </div>

      {/* Income Search Section */}
      <div className="mt-8">
        <IncomeSearch
          toolState={toolState}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          setToolState={setToolState}
          onRefresh={onRefresh}
        />
      </div>

      {/* Import/Export Actions */}
      <div className="flex justify-center">
        <IncomeImportExportActions
          income={toolState.income}
          onImportComplete={handleImportComplete}
        />
      </div>
    </div>
  );
};
