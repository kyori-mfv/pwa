import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import type { TransactionRecord, UserSettings } from "../../types";
import { formatAmount } from "../../utils/currency-utils";
import { TransactionItem } from "./transaction-item";

interface RecentTransactionsProps {
  transactions: TransactionRecord[];
  settings: UserSettings;
  title?: string;
  emptyMessage?: string;
  limit?: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  settings,
  title = "Giao dịch gần đây",
  emptyMessage = "Chưa có giao dịch nào",
  limit = 10,
}) => {
  // Sort by date (most recent first) and limit results
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  const totalAmount = transactions.reduce((sum, transaction) => {
    return transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount;
  }, 0);

  const incomeCount = transactions.filter((t) => t.type === "income").length;
  const expenseCount = transactions.filter((t) => t.type === "expense").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {title}
        </CardTitle>
        {transactions.length > 0 && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {incomeCount > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-chart-5" />
                <span>{incomeCount} thu nhập</span>
              </div>
            )}
            {expenseCount > 0 && (
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-chart-3" />
                <span>{expenseCount} chi tiêu</span>
              </div>
            )}
            <div className="font-medium">Tổng: {formatAmount(totalAmount, settings)}</div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} settings={settings} />
            ))}
            {transactions.length > limit && (
              <div className="text-center pt-4 text-sm text-muted-foreground">
                Và {transactions.length - limit} giao dịch khác...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
