import { useToolState } from "@/shared/hooks/use-tool-state";
import type { ToolComponentProps } from "@/shared/types/tool";
import type { ExpenseManagerState } from "../types";
import { formatAmount } from "../utils/currency-utils";
import { DEFAULT_CATEGORIES } from "../utils/default-categories";
import { AIExpenseInput } from "./input/ai-expense-input";
import { Badge } from "@/shared/components/ui/badge";

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
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Quản lý Chi tiêu</h1>
        <p className="text-muted-foreground">
          Theo dõi chi tiêu của bạn với AI hỗ trợ nhập liệu tiếng Việt
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AIExpenseInput toolState={toolState} setToolState={setToolState} />
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Chi tiêu thêm gần đây</h3>
            {toolState.expenses.length === 0 ? (
              <p className="text-muted-foreground">
                Chưa có chi tiêu nào. Hãy bắt đầu thêm chi tiêu đầu tiên bằng tiếng Việt!
              </p>
            ) : (
              <div className="space-y-2">
                {toolState.expenses.map((expense, index) => (
                  <div
                    key={expense.id || index}
                    className="p-3 bg-muted/50 rounded-md border border-muted"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm flex-1 pr-2">
                          {expense.description}
                        </p>
                        <span className="font-bold text-base text-right whitespace-nowrap">
                          {formatAmount(expense.amount, toolState.settings)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <Badge>
                          {expense.category}
                        </Badge>
                        <span className="font-mono">
                          {expense.date.toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
