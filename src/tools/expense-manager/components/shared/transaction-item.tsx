import { Badge } from "@/shared/components/ui/badge";
import type { ExpenseRecord, UserSettings } from "../../types";
import { formatAmount } from "../../utils/currency-utils";

interface TransactionItemProps {
  expense: ExpenseRecord;
  settings: UserSettings;
  showOriginalInput?: boolean;
  compact?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  expense,
  settings,
  showOriginalInput = false,
  compact = false,
}) => {
  return (
    <div
      className={`${
        compact ? "p-3" : "p-4"
      } bg-muted/50 rounded-md border border-muted hover:bg-muted/70 transition-colors`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <p
            className={`font-medium ${compact ? "text-sm" : "text-base"} flex-1 min-w-0 line-clamp-2`}
          >
            {expense.description}
          </p>
          <span
            className={`font-bold ${
              compact ? "text-sm md:text-base" : "text-base md:text-lg"
            } text-right whitespace-nowrap flex-shrink-0`}
          >
            {formatAmount(expense.amount, settings)}
          </span>
        </div>

        <div className="flex text-xs justify-between items-center text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="text-xs flex-shrink-0">{expense.category}</Badge>
            {showOriginalInput && expense.originalInput && (
              <span className="italic text-muted-foreground break-words min-w-0">
                "
                {expense.originalInput.length > (compact ? 15 : 25)
                  ? `${expense.originalInput.substring(0, compact ? 15 : 25)}...`
                  : expense.originalInput}
                "
              </span>
            )}
          </div>

          <span className="font-mono text-xs flex-shrink-0">
            {expense.date.toLocaleDateString("vi-VN", {
              weekday: compact ? undefined : "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
