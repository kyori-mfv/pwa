import { useEffect, useState } from "react";
import { useExpenseManager } from "../../hooks/use-expense-manager";
import type { ExpenseManagerState } from "../../types";
import { formatAmount } from "../../utils/currency-utils";
import { DateRangePicker } from "../shared/date-range-picker";
import { TransactionsView } from "../transactions/transactions-view";
import { CategoryChart } from "./category-chart";

interface ExpenseDashboardProps {
  toolState: ExpenseManagerState;
}

export const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({ toolState }) => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const [categoryData, setCategoryData] = useState<
    Array<{
      name: string;
      amount: number;
      color: string;
      budget: number;
      count: number;
    }>
  >([]);

  const { getCategoryStats } = useExpenseManager(toolState);

  // Load category statistics from database when date range changes
  useEffect(() => {
    const loadCategoryStats = async () => {
      try {
        const stats = await getCategoryStats(dateRange.start, dateRange.end);

        // Merge with category metadata (colors, budgets)
        const enrichedData = stats
          .map((stat) => {
            const categoryMeta = toolState.categories.find((cat) => cat.name === stat.category);
            return {
              name: stat.category,
              amount: stat.amount,
              count: stat.count,
              color: categoryMeta?.color || "#6b7280",
              budget: categoryMeta?.budget || 0,
            };
          })
          .filter((item) => item.amount > 0); // Only show categories with expenses

        setCategoryData(enrichedData);
      } catch (error) {
        console.error("Failed to load category stats:", error);
      }
    };

    loadCategoryStats();
  }, [dateRange, getCategoryStats, toolState.categories]);

  // Calculate total amount from category stats
  const totalAmount = categoryData.reduce((sum, category) => sum + category.amount, 0);

  return (
    <div className="space-y-6">
      {/* Date Range Picker and Total Amount */}
      <div className="flex flex-wrap-reverse justify-between gap-x-6 gap-y-2">
        <div className="shrink-0 text-center">
          <p className="text-lg font-semibold text-muted-foreground text-center">
            Tổng chi tiêu:{" "}
            <span className="text-primary font-bold">
              {formatAmount(totalAmount, toolState.settings)}
            </span>
          </p>
        </div>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      {/* Desktop 2-Column Layout */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left Column - Category Chart (fixed minimum width, no shrinking) */}
        <div className="w-full lg:w-96 lg:min-w-[24rem] lg:flex-shrink-0">
          <CategoryChart data={categoryData} settings={toolState.settings} />
        </div>

        {/* Right Column - Transactions (flexible width) */}
        <div className="w-full lg:flex-1 lg:min-w-0">
          <TransactionsView
            toolState={{
              ...toolState,
              expenses: toolState.expenses.filter((expense) => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= dateRange.start && expenseDate <= dateRange.end;
              }),
            }}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
};
