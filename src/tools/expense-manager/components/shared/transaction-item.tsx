import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { memo } from "react";
import type { ExpenseRecord, TransactionRecord, UserSettings } from "../../types";
import { formatAmount } from "../../utils/currency-utils";

interface TransactionItemProps {
  transaction?: TransactionRecord;
  expense?: ExpenseRecord; // Legacy support
  settings: UserSettings;
  showOriginalInput?: boolean;
  compact?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (expenseId: string) => Promise<void>;
  isRemoving?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = memo(
  ({
    transaction,
    expense,
    settings,
    showOriginalInput = false,
    compact = false,
    showRemoveButton = false,
    onRemove,
    isRemoving = false,
  }) => {
    // Support both new transaction format and legacy expense format
    const item = transaction || (expense ? { ...expense, type: "expense" as const } : null);

    if (!item) return null;

    const isIncome = item.type === "income";
    const Icon = isIncome ? TrendingUp : TrendingDown;
    const amountColor = isIncome ? "text-chart-5" : "text-chart-3";
    const iconColor = isIncome ? "text-chart-5" : "text-chart-3";
    return (
      <div
        className={`${
          compact ? "p-3" : "p-4"
        } ${isIncome ? "bg-chart-5/10 border-chart-5/20" : "bg-chart-3/10 border-chart-3/20"} rounded-md border hover:opacity-80 transition-all`}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className={cn("p-1 rounded-full", iconColor, compact ? "p-1" : "p-1.5")}>
                <Icon className={compact ? "w-3 h-3" : "w-4 h-4"} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${compact ? "text-sm" : "text-base"} flex-1 min-w-0 line-clamp-2`}
                >
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={isIncome ? "default" : "secondary"} className="text-xs">
                    {isIncome ? "Thu" : "Chi"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <span
                  className={cn(
                    "font-bold whitespace-nowrap",
                    compact ? "text-sm md:text-base" : "text-base md:text-lg",
                    amountColor
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {formatAmount(item.amount, settings)}
                </span>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(item.date), "dd/MM", { locale: vi })}
                </div>
              </div>
              {showRemoveButton && item.id && onRemove && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isRemoving}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Xóa giao dịch"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa giao dịch</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa giao dịch "{item.description}" với số tiền{" "}
                        {formatAmount(item.amount, settings)}?
                        <br />
                        <span className="text-sm text-muted-foreground mt-2 block">
                          Hành động này không thể hoàn tác.
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemove(item.id as string)}
                        disabled={isRemoving}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        {isRemoving ? "Đang xóa..." : "Xóa"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {showOriginalInput && item.originalInput && (
            <div className="text-xs text-muted-foreground mt-2">
              <span className="italic break-words min-w-0">
                "
                {item.originalInput.length > (compact ? 30 : 50)
                  ? `${item.originalInput.substring(0, compact ? 30 : 50)}...`
                  : item.originalInput}
                "
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
