import { TrendingUp } from "lucide-react";
import type { ExpenseManagerState } from "../../types";
import { AIIncomeInput } from "../input/ai-income-input";
import { ImportExportActions } from "../shared/import-export-actions";
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
