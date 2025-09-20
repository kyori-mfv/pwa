import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Check, Loader2, Wand2 } from "lucide-react";
import type { ParsedExpense } from "../../types";

interface ExpenseTextInputProps {
  input: string;
  isProcessing: boolean;
  editablePreview: ParsedExpense | null;
  isSavingExpense: boolean;
  onInputChange: (value: string) => void;
  onParseExpense: () => void;
  onSaveExpense: () => void;
}

export const ExpenseTextInput: React.FC<ExpenseTextInputProps> = ({
  input,
  isProcessing,
  editablePreview,
  isSavingExpense,
  onInputChange,
  onParseExpense,
  onSaveExpense,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="expense-input">Mô tả chi tiêu của bạn</Label>
        <Input
          id="expense-input"
          placeholder="Coffee sáng 50k"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          onClick={onParseExpense}
          disabled={!input.trim() || isProcessing}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          {isProcessing ? "Đang phân tích..." : "Phân tích bằng AI"}
        </Button>

        {editablePreview && (
          <Button
            onClick={onSaveExpense}
            variant="default"
            className="flex items-center gap-2"
            disabled={isSavingExpense}
          >
            {isSavingExpense ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {isSavingExpense ? "Đang lưu..." : "Lưu Chi tiêu"}
          </Button>
        )}
      </div>
    </>
  );
};
