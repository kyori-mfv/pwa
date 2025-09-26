import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AlertCircle, TrendingUp, Wand2 } from "lucide-react";
import { useAIIncomeForm } from "../../hooks/use-ai-income-form";
import type { ExpenseManagerState } from "../../types";
import { AIProviderConfig } from "./ai-provider-config";
import { IncomeEditForm } from "./income-edit-form";
import { IncomeTextInput } from "./income-text-input";

interface AIIncomeInputProps {
  toolState: ExpenseManagerState;
  setToolState: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
}

export const AIIncomeInput: React.FC<AIIncomeInputProps> = ({ toolState, setToolState }) => {
  const {
    input,
    isProcessing,
    preview,
    error,
    isSavingIncome,
    editablePreview,
    datePickerOpen,
    isLoading,
    isGeminiConfigured,
    setInput,
    setEditablePreview,
    setDatePickerOpen,
    handleParseIncome,
    handleSaveIncome,
    handleConfigureGemini,
  } = useAIIncomeForm(toolState, setToolState);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              <TrendingUp className="w-5 h-5 text-chart-5" />
            </div>
            Nhập Thu nhập bằng AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AIProviderConfig
            isGeminiConfigured={isGeminiConfigured}
            isLoading={isLoading}
            onConfigureGemini={handleConfigureGemini}
          />

          {isGeminiConfigured && (
            <>
              <IncomeTextInput
                input={input}
                isProcessing={isProcessing}
                editablePreview={editablePreview}
                isSavingIncome={isSavingIncome}
                onInputChange={setInput}
                onParseIncome={handleParseIncome}
                onSaveIncome={handleSaveIncome}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </>
          )}

          {editablePreview && (
            <IncomeEditForm
              editablePreview={editablePreview}
              preview={preview}
              categories={toolState.categories.filter(
                (cat) => cat.type === "income" || cat.type === "both"
              )}
              datePickerOpen={datePickerOpen}
              onEditablePreviewChange={setEditablePreview}
              onDatePickerOpenChange={setDatePickerOpen}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
