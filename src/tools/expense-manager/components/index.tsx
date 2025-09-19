import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToolState } from "@/shared/hooks/use-tool-state";
import type { ToolComponentProps } from "@/shared/types/tool";
import { BarChart3, Plus } from "lucide-react";
import type { ExpenseManagerState } from "../types";
import { DEFAULT_CATEGORIES } from "../utils/default-categories";
import { ExpenseDashboard } from "./dashboard/expense-dashboard";
import { AIExpenseInput } from "./input/ai-expense-input";
import { RecentExpenses } from "./shared/recent-expenses";

const initialState: ExpenseManagerState = {
  expenses: [],
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

  return (
    <Tabs defaultValue="input" className="w-full">
      <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="input" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm chi tiêu
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6 mt-6">
        <ExpenseDashboard toolState={toolState} />
      </TabsContent>

      <TabsContent value="input" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <AIExpenseInput toolState={toolState} setToolState={setToolState} />
          </div>

          <div className="space-y-6">
            <RecentExpenses expenses={toolState.expenses} settings={toolState.settings} limit={5} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
