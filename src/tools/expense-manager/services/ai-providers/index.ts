import type { AIProvider, AIProviderConfig } from "../../types";
import { GeminiProvider } from "./gemini-provider";

export class AIProviderFactory {
  private providers: Map<string, AIProvider> = new Map();

  initialize(configs: AIProviderConfig[]) {
    this.providers.clear();

    for (const config of configs) {
      if (config.enabled) {
        switch (config.id) {
          case "gemini":
            this.providers.set("gemini", new GeminiProvider(config));
            break;
          // OpenAI and Claude providers can be added later
          default:
            console.warn(`Unknown AI provider: ${config.id}`);
        }
      }
    }
  }

  getProvider(providerId?: string): AIProvider | null {
    if (providerId) {
      return this.providers.get(providerId) || null;
    }

    // Return first available provider
    const providers = Array.from(this.providers.values());
    return providers.find((provider) => provider.isConfigured()) || null;
  }

  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.values()).filter((provider) => provider.isConfigured());
  }
}

export const aiProviderFactory = new AIProviderFactory();
