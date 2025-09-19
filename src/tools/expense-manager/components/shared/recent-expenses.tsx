import type { ExpenseRecord, UserSettings } from "../../types";
import { TransactionItem } from "./transaction-item";

interface RecentExpensesProps {
  expenses: ExpenseRecord[];
  settings: UserSettings;
  limit?: number;
  title?: string;
  emptyMessage?: string;
}

export const RecentExpenses: React.FC<RecentExpensesProps> = ({
  expenses,
  settings,
  limit = 5,
  title = "Chi tiêu thêm gần đây",
  emptyMessage = "Chưa có chi tiêu nào. Hãy bắt đầu thêm chi tiêu đầu tiên bằng tiếng Việt!",
}) => {
  const displayExpenses = expenses.slice(0, limit);

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {expenses.length === 0 ? (
        <p className="text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {displayExpenses.map((expense, index) => (
            <TransactionItem
              key={expense.id || index}
              expense={expense}
              settings={settings}
              showOriginalInput={false}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
