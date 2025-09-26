import { useCallback, useEffect, useState } from "react";
import { aiProviderFactory } from "../services/ai-providers";
import { ExpenseDB } from "../services/database";
import type { ExpenseManagerState, ParsedExpense } from "../types";

export function useAIManager(
  toolState: ExpenseManagerState,
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize database categories only
  useEffect(() => {
    const initializeDatabase = async () => {
      setIsLoading(true);
      try {
        // Initialize default categories
        await ExpenseDB.initializeDefaultCategories(toolState.categories);

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
  }, [toolState.categories, setToolState]);

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

  return {
    // State
    isLoading,

    // Actions
    initializeAI,
    parseExpense,
    updateAIProvider,
    setPreferredProvider,
  };
}
