import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AlertCircle, Wand2 } from "lucide-react";
import { useAIExpenseForm } from "../../hooks/use-ai-expense-form";
import type { ExpenseManagerState } from "../../types";
import { AIProviderConfig } from "./ai-provider-config";
import { ExpenseEditForm } from "./expense-edit-form";
import { ExpenseTextInput } from "./expense-text-input";

interface AIExpenseInputProps {
  toolState: ExpenseManagerState;
  setToolState: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
}

export const AIExpenseInput: React.FC<AIExpenseInputProps> = ({ toolState, setToolState }) => {
  const {
    input,
    isProcessing,
    preview,
    error,
    isSavingExpense,
    editablePreview,
    datePickerOpen,
    isLoading,
    isGeminiConfigured,
    setInput,
    setEditablePreview,
    setDatePickerOpen,
    handleParseExpense,
    handleSaveExpense,
    handleConfigureGemini,
  } = useAIExpenseForm(toolState, setToolState);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Nhập Chi tiêu bằng AI
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
              <ExpenseTextInput
                input={input}
                isProcessing={isProcessing}
                editablePreview={editablePreview}
                isSavingExpense={isSavingExpense}
                onInputChange={setInput}
                onParseExpense={handleParseExpense}
                onSaveExpense={handleSaveExpense}
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
            <ExpenseEditForm
              editablePreview={editablePreview}
              preview={preview}
              categories={toolState.categories}
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
