import { useCallback, useEffect, useState } from "react";
import type { ExpenseManagerState, ParsedExpense } from "../types";
import { useAIManager } from "./use-ai-manager";
import { useIncomeService } from "./use-income-service";

export function useAIIncomeForm(
  toolState: ExpenseManagerState,
  setToolState: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void
) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<ParsedExpense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSavingIncome, setIsSavingIncome] = useState(false);
  const [editablePreview, setEditablePreview] = useState<ParsedExpense | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { initializeAI, parseExpense, updateAIProvider, isLoading } = useAIManager(
    toolState,
    setToolState
  );
  const { addIncome } = useIncomeService(toolState, setToolState);

  // Initialize AI providers on mount
  useEffect(() => {
    initializeAI();
  }, [initializeAI]);

  // Check if Gemini is configured
  const isGeminiConfigured = toolState.aiProviders.some(
    (provider) => provider.id === "gemini" && provider.enabled && provider.apiKey
  );

  const handleParseIncome = useCallback(async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Use the same parsing logic as expenses
      const parsed = await parseExpense(input);
      setPreview(parsed);
      setEditablePreview(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse income");
    } finally {
      setIsProcessing(false);
    }
  }, [input, parseExpense]);

  const handleSaveIncome = useCallback(async () => {
    if (!editablePreview) return;

    setIsSavingIncome(true);
    try {
      await addIncome({
        amount: editablePreview.amount,
        category: editablePreview.category,
        description: editablePreview.description,
        date: editablePreview.date || new Date(),
        originalInput: input,
      });

      // Clear form after successful save
      setInput("");
      setPreview(null);
      setEditablePreview(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save income");
    } finally {
      setIsSavingIncome(false);
    }
  }, [editablePreview, input, addIncome]);

  const handleConfigureGemini = useCallback(
    async (apiKey: string) => {
      try {
        await updateAIProvider("gemini", {
          apiKey: apiKey.trim(),
          enabled: true,
        });
        // Re-initialize providers
        initializeAI();
        setError(null);
      } catch (error) {
        setError("Failed to save API key");
        throw error;
      }
    },
    [updateAIProvider, initializeAI]
  );

  return {
    // State
    input,
    isProcessing,
    preview,
    error,
    isSavingIncome,
    editablePreview,
    datePickerOpen,
    isLoading,
    isGeminiConfigured,

    // Setters
    setInput,
    setError,
    setEditablePreview,
    setDatePickerOpen,

    // Actions
    handleParseIncome,
    handleSaveIncome,
    handleConfigureGemini,
  };
}
