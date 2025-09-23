import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { UserSettings } from "../../types";
import { formatAmount } from "../../utils/currency-utils";

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  budget: number;
  count: number;
}

interface CategoryChartProps {
  data: CategoryData[];
  settings: UserSettings;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, settings }) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi tiêu theo danh mục</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center text-muted-foreground">
            <PieChartIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Chưa có dữ liệu chi tiêu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: unknown[] }) => {
    if (active && payload && payload.length) {
      const data = (
        payload[0] as { payload: { name: string; amount: number; count: number; budget: number } }
      ).payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-primary">Số tiền: {formatAmount(data.amount, settings)}</p>
          <p className="text-xs text-muted-foreground">{data.count} giao dịch</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: Array<{ color: string; value: string }> }) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload?.map((entry) => (
          <div key={entry.value} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiêu theo danh mục</CardTitle>
        <p className="text-sm text-muted-foreground">Phân bổ chi tiêu tháng này</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="amount"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Category breakdown below chart */}
        <div className="mt-2 space-y-2 divide-y">
          {data
            .sort((a, b) => b.amount - a.amount)
            .map((category) => (
              <div key={category.name} className="py-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: category.color }} />
                  <span>{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatAmount(category.amount, settings)}</div>
                  <div className="text-xs text-muted-foreground">{category.count} giao dịch</div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
