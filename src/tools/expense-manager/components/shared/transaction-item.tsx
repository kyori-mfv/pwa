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
import { Trash2 } from "lucide-react";
import { memo } from "react";
import type { ExpenseRecord, UserSettings } from "../../types";
import { formatAmount } from "../../utils/currency-utils";

interface TransactionItemProps {
  expense: ExpenseRecord;
  settings: UserSettings;
  showOriginalInput?: boolean;
  compact?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (expenseId: string) => Promise<void>;
  isRemoving?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = memo(
  ({
    expense,
    settings,
    showOriginalInput = false,
    compact = false,
    showRemoveButton = false,
    onRemove,
    isRemoving = false,
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`font-bold ${
                  compact ? "text-sm md:text-base" : "text-base md:text-lg"
                } text-right whitespace-nowrap`}
              >
                {formatAmount(expense.amount, settings)}
              </span>
              {showRemoveButton && expense.id && onRemove && (
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
                        Bạn có chắc chắn muốn xóa giao dịch "{expense.description}" với số tiền{" "}
                        {formatAmount(expense.amount, settings)}?
                        <br />
                        <span className="text-sm text-muted-foreground mt-2 block">
                          Hành động này không thể hoàn tác.
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemove(expense.id as string)}
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
  }
);
