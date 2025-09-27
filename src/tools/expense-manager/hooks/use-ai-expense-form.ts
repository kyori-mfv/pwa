import { useCallback, useEffect, useState } from "react";
import type { ExpenseManagerState, ParsedExpense } from "../types";
import { useAIManager } from "./use-ai-manager";
import { useExpenseService } from "./use-expense-service";

export function useAIExpenseForm(
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
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [editablePreview, setEditablePreview] = useState<ParsedExpense | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { initializeAI, parseExpense, updateAIProvider, isLoading } = useAIManager(
    toolState,
    setToolState
  );
  const { addExpense } = useExpenseService(toolState, setToolState);

  // Initialize AI providers on mount
  useEffect(() => {
    initializeAI();
  }, [initializeAI]);

  // Check if Gemini is configured
  const isGeminiConfigured = toolState.aiProviders.some(
    (provider) => provider.id === "gemini" && provider.enabled && provider.apiKey
  );

  const handleParseExpense = useCallback(async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const parsed = await parseExpense(input, "expense");
      setPreview(parsed);
      setEditablePreview(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse expense");
    } finally {
      setIsProcessing(false);
    }
  }, [input, parseExpense]);

  const handleSaveExpense = useCallback(async () => {
    if (!editablePreview) return;

    setIsSavingExpense(true);
    try {
      await addExpense({
        amount: editablePreview.amount,
        category: editablePreview.category,
        description: editablePreview.description,
        date: editablePreview.date || new Date(),
        type: "expense",
        originalInput: input,
      });

      // Clear form after successful save
      setInput("");
      setPreview(null);
      setEditablePreview(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setIsSavingExpense(false);
    }
  }, [editablePreview, input, addExpense]);

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
    isSavingExpense,
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
    handleParseExpense,
    handleSaveExpense,
    handleConfigureGemini,
  };
}
