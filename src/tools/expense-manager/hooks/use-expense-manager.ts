import { useCallback, useEffect, useState } from "react";
import { aiProviderFactory } from "../services/ai-providers";
import { ExpenseDB } from "../services/database";
import type { ExpenseManagerState, ExpenseRecord, ParsedExpense } from "../types";

export function useExpenseManager(
  toolState: ExpenseManagerState,
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize database and load data
  useEffect(() => {
    const initializeDatabase = async () => {
      setIsLoading(true);
      try {
        // Initialize default categories
        await ExpenseDB.initializeDefaultCategories(toolState.categories);

        // Load recent expenses from database (efficient, only get what we need)
        const expenses = await ExpenseDB.getRecentCreatedExpenses(10);
        setToolState?.({ expenses });

        // Load stored API key
        const storedApiKey = await ExpenseDB.getGeminiApiKey();
        if (storedApiKey) {
          setToolState?.((prev) => ({
            aiProviders: prev.aiProviders.map((provider) =>
              provider.id === "gemini"
                ? { ...provider, apiKey: storedApiKey, enabled: true }
                : provider
            ),
          }));
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, [toolState.categories, setToolState]); // Include dependencies

  // Initialize AI providers
  const initializeAI = useCallback(() => {
    aiProviderFactory.initialize(toolState.aiProviders);
  }, [toolState.aiProviders]);

  // Parse expense with AI
  const parseExpense = useCallback(
    async (input: string): Promise<ParsedExpense> => {
      const provider = aiProviderFactory.getProvider(toolState.preferredProvider);

      if (!provider) {
        throw new Error("No AI provider configured");
      }

      return await provider.parseExpense(input);
    },
    [toolState.preferredProvider]
  );

  // Add expense
  const addExpense = useCallback(
    async (expense: Omit<ExpenseRecord, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newExpense = await ExpenseDB.addExpense(expense);

        // Refresh recent expenses list from database (efficient, maintains limit)
        const recentExpenses = await ExpenseDB.getRecentCreatedExpenses(10);
        setToolState?.((prev) => ({
          ...prev,
          expenses: recentExpenses,
        }));

        return newExpense;
      } catch (error) {
        console.error("Failed to add expense:", error);
        throw error;
      }
    },
    [setToolState]
  );

  // Update expense
  const updateExpense = useCallback(
    async (id: string, updates: Partial<ExpenseRecord>) => {
      try {
        await ExpenseDB.updateExpense(id, updates);

        // Update local state
        setToolState?.((prev) => ({
          expenses: prev.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates, updatedAt: new Date() } : expense
          ),
        }));
      } catch (error) {
        console.error("Failed to update expense:", error);
        throw error;
      }
    },
    [setToolState]
  );

  // Delete expense
  const deleteExpense = useCallback(
    async (id: string) => {
      try {
        await ExpenseDB.deleteExpense(id);

        // Update local state
        setToolState?.((prev) => ({
          expenses: prev.expenses.filter((expense) => expense.id !== id),
        }));
      } catch (error) {
        console.error("Failed to delete expense:", error);
        throw error;
      }
    },
    [setToolState]
  );

  // Update AI provider config
  const updateAIProvider = useCallback(
    async (providerId: string, config: Partial<(typeof toolState.aiProviders)[0]>) => {
      // Store API key persistently if it's a Gemini update with apiKey
      if (providerId === "gemini" && config.apiKey) {
        try {
          await ExpenseDB.setGeminiApiKey(config.apiKey);
        } catch (error) {
          console.error("Failed to store API key:", error);
        }
      }

      setToolState?.((prev) => ({
        aiProviders: prev.aiProviders.map((provider) =>
          provider.id === providerId ? { ...provider, ...config } : provider
        ),
      }));
    },
    [setToolState]
  );

  // Set preferred provider
  const setPreferredProvider = useCallback(
    (providerId: string) => {
      setToolState?.((prev) => ({
        ...prev,
        preferredProvider: providerId,
      }));
    },
    [setToolState]
  );

  // Search expenses with database-level filtering
  const searchExpenses = useCallback(
    async (options: {
      searchTerm?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    }) => {
      try {
        const { page = 1, limit = 5 } = options;
        const offset = (page - 1) * limit;

        const result = await ExpenseDB.searchExpenses({
          ...options,
          limit,
          offset,
        });

        return result;
      } catch (error) {
        console.error("Failed to search expenses:", error);
        return { expenses: [], total: 0 };
      }
    },
    []
  );

  // Get category statistics for dashboard
  const getCategoryStats = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      return await ExpenseDB.getCategoryStats(startDate, endDate);
    } catch (error) {
      console.error("Failed to get category stats:", error);
      return [];
    }
  }, []);

  return {
    initializeAI,
    parseExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    updateAIProvider,
    setPreferredProvider,
    searchExpenses,
    getCategoryStats,
    isLoading,
  };
}
