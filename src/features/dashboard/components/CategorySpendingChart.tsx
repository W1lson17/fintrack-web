import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { CategorySpending } from "../types/dashboard.types";
import { formatCurrency } from "@/shared/utils/formatters";

interface CategorySpendingChartProps {
  data: CategorySpending[];
}

const chartConfig = {
  total: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

/**
 * CategorySpendingChart component
 *
 * Displays a horizontal bar chart of spending by category.
 * Used in the dashboard to give users a visual breakdown of expenses.
 */
export const CategorySpendingChart = ({ data }: CategorySpendingChartProps) => {
  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-75 items-center justify-center text-sm">
        No spending data for this month
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-75 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 32 }}>
        <XAxis
          type="number"
          tickFormatter={(value) => formatCurrency(value)}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="categoryName"
          tick={{ fontSize: 12 }}
          width={100}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(Number(value))}
            />
          }
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
};
