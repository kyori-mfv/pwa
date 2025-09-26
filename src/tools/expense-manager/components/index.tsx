import { useToolState } from "@/shared/hooks/use-tool-state";
import type { ToolComponentProps } from "@/shared/types/tool";
import { useCallback, useState } from "react";
import type { ExpenseManagerState } from "../types";
import { DEFAULT_CATEGORIES } from "../utils/default-categories";
import { ExpenseDashboard } from "./dashboard/expense-dashboard";
import { Sidebar, type SidebarView } from "./sidebar/sidebar";
import { ExpenseView } from "./views/expense-view";
import { IncomeView } from "./views/income-view";

const initialState: ExpenseManagerState = {
  expenses: [],
  income: [],
  categories: DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    createdAt: new Date(),
  })),
  budgets: [],
  selectedDateRange: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  },
  aiProviders: [
    {
      id: "openai",
      name: "OpenAI GPT-4",
      apiUrl: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4",
      enabled: false,
      rateLimits: {
        requestsPerMinute: 60,
        requestsPerDay: 1000,
      },
    },
    {
      id: "gemini",
      name: "Google Gemini",
      apiUrl: "https://generativelanguage.googleapis.com/v1beta/models",
      model: "gemini-2.0-flash",
      enabled: true,
      rateLimits: {
        requestsPerMinute: 60,
        requestsPerDay: 1000,
      },
    },
    {
      id: "claude",
      name: "Anthropic Claude",
      apiUrl: "https://api.anthropic.com/v1/messages",
      model: "claude-3-sonnet-20240229",
      enabled: false,
      rateLimits: {
        requestsPerMinute: 60,
        requestsPerDay: 1000,
      },
    },
  ],
  settings: {
    currency: "VND",
    locale: "vi-VN",
    theme: "system",
    notifications: true,
  },
};

export const ExpenseManager: React.FC<ToolComponentProps> = ({ instanceId }) => {
  const [toolState, setToolState] = useToolState<ExpenseManagerState>(instanceId, initialState);
  const [currentView, setCurrentView] = useState<SidebarView>("expense");
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh function that components can call
  const forceRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <ExpenseDashboard
            key={refreshKey}
            toolState={toolState}
            setToolState={setToolState}
            onRefresh={forceRefresh}
          />
        );
      case "income":
        return (
          <IncomeView toolState={toolState} setToolState={setToolState} onRefresh={forceRefresh} />
        );
      case "expense":
        return (
          <ExpenseView toolState={toolState} setToolState={setToolState} onRefresh={forceRefresh} />
        );
      default:
        return (
          <ExpenseDashboard
            key={refreshKey}
            toolState={toolState}
            setToolState={setToolState}
            onRefresh={forceRefresh}
          />
        );
    }
  };

  return (
    <div className="flex h-full min-h-[600px]">
      {/* Sidebar - Desktop only */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-0 pb-20 lg:pb-6 lg:p-6">{renderCurrentView()}</div>
      </div>
    </div>
  );
};
