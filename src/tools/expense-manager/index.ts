import { toolRegistry } from "@/core/registry/tool-registry";
import type { ToolPlugin } from "@/shared/types/tool";
import { ExpenseManager } from "./components";

const ExpenseManagerPlugin: ToolPlugin = {
  id: "expense-manager",
  metadata: {
    id: "expense-manager",
    name: "Expense Manager",
    category: "finance",
    description: "AI-powered expense tracking with natural language input and rich visualizations",
    version: "1.0.0",
    icon: "💰",
  },
  component: ExpenseManager,
};

// Auto-register the plugin
toolRegistry.register(ExpenseManagerPlugin);
