import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowUpDown, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDashboardStats } from "../../hooks/use-dashboard-stats";
import type { ExpenseManagerState } from "../../types";
import { formatAmount } from "../../utils/currency-utils";
import { DateRangePicker } from "../shared/date-range-picker";
import { TransactionsView } from "../transactions/transactions-view";
import { CategoryChart } from "./category-chart";

interface ExpenseDashboardProps {
  toolState: ExpenseManagerState;
  setToolState?: (
    newState:
      | Partial<ExpenseManagerState>
      | ((prev: ExpenseManagerState) => Partial<ExpenseManagerState>)
  ) => void;
  onRefresh?: () => void;
}

export const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({
  toolState,
  setToolState,
  onRefresh,
}) => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const [financialStats, setFinancialStats] = useState<{
    income: {
      total: number;
      count: number;
      categories: Array<{ category: string; amount: number; count: number }>;
    };
    expense: {
      total: number;
      count: number;
      categories: Array<{ category: string; amount: number; count: number }>;
    };
    net: { amount: number; savingsRate: number; isPositive: boolean };
    totals: { income: number; expense: number; net: number };
    counts: { income: number; expense: number; total: number };
  }>({
    income: { total: 0, count: 0, categories: [] },
    expense: { total: 0, count: 0, categories: [] },
    net: { amount: 0, savingsRate: 0, isPositive: true },
    totals: { income: 0, expense: 0, net: 0 },
    counts: { income: 0, expense: 0, total: 0 },
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

  const { getFinancialStats, getExpenseCategoryData } = useDashboardStats(toolState);

  // Load financial statistics from new service architecture
  const loadFinancialData = useCallback(async () => {
    try {
      // Get financial stats from the new dashboard service
      const stats = await getFinancialStats(dateRange.start, dateRange.end);
      setFinancialStats(stats);

      // Get enriched category data for chart
      const enrichedData = await getExpenseCategoryData(dateRange.start, dateRange.end);
      setCategoryData(enrichedData);
    } catch (error) {
      console.error("Failed to load financial data:", error);
    }
  }, [dateRange, getFinancialStats, getExpenseCategoryData]);

  // Load financial data on mount and when dependencies change
  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  // Use financial stats from the new service
  const totalExpenses = financialStats.totals.expense;
  const totalIncome = financialStats.totals.income;
  const netAmount = financialStats.net.amount;
  const savingsRate = financialStats.net.savingsRate;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Dashboard Tổng quan</h1>
          <p className="text-muted-foreground">Tổng quan tài chính cá nhân</p>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex justify-center">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">
              +{formatAmount(totalIncome, toolState.settings)}
            </div>
            <p className="text-xs text-muted-foreground">
              {financialStats.counts.income} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              -{formatAmount(totalExpenses, toolState.settings)}
            </div>
            <p className="text-xs text-muted-foreground">
              {financialStats.counts.expense} giao dịch
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư ròng</CardTitle>
            <Wallet className={`h-4 w-4 ${netAmount >= 0 ? "text-chart-5" : "text-chart-3"}`} />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${netAmount >= 0 ? "text-chart-5" : "text-chart-3"}`}
            >
              {netAmount >= 0 ? "+" : ""}
              {formatAmount(netAmount, toolState.settings)}
            </div>
            <p className="text-xs text-muted-foreground">{netAmount >= 0 ? "Dương" : "Âm"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ tiết kiệm</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalIncome > 0 ? (netAmount >= 0 ? "Tiết kiệm" : "Chi vượt") : "Chưa có thu nhập"}
            </p>
          </CardContent>
        </Card>
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
            toolState={toolState}
            dateRange={dateRange}
            setToolState={setToolState}
            onRefresh={() => loadFinancialData()}
          />
        </div>
      </div>
    </div>
  );
};
