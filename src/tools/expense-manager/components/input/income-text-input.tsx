import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Check, Loader2, Wand2 } from "lucide-react";
import type { ParsedExpense } from "../../types";

interface IncomeTextInputProps {
  input: string;
  isProcessing: boolean;
  editablePreview: ParsedExpense | null;
  isSavingIncome: boolean;
  onInputChange: (value: string) => void;
  onParseIncome: () => void;
  onSaveIncome: () => void;
}

export const IncomeTextInput: React.FC<IncomeTextInputProps> = ({
  input,
  isProcessing,
  editablePreview,
  isSavingIncome,
  onInputChange,
  onParseIncome,
  onSaveIncome,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="income-input">Mô tả thu nhập của bạn</Label>
        <Input
          id="income-input"
          placeholder="Lương tháng 10tr..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          onClick={onParseIncome}
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
            onClick={onSaveIncome}
            variant="default"
            className="flex items-center gap-2"
            disabled={isSavingIncome}
          >
            {isSavingIncome ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {isSavingIncome ? "Đang lưu..." : "Lưu Thu nhập"}
          </Button>
        )}
      </div>
    </>
  );
};
