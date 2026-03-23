import { useState } from "react";
import { MonthPicker } from "../components/MonthPicker";
import { SummaryCards } from "../components/SummaryCards";
import { CategorySpendingChart } from "../components/CategorySpendingChart";
import { useMonthlySummary, useCategorySpending } from "../hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebounce } from "@/shared/hooks/useDebounce";

/**
 * DashboardPage
 *
 * Main dashboard view. Displays monthly financial summary and
 * spending breakdown by category. Allows navigation between months.
 *
 * Debounces month/year changes to prevent excessive API calls
 * when the user navigates quickly between months.
 */
export const DashboardPage = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  // Debounce params — waits 400ms after last change before fetching
  const debouncedMonth = useDebounce(month, 400);
  const debouncedYear = useDebounce(year, 400);

  const { data: summary, isLoading: summaryLoading } = useMonthlySummary({
    month: debouncedMonth,
    year: debouncedYear,
  });

  const { data: categorySpending, isLoading: chartLoading } =
    useCategorySpending({
      month: debouncedMonth,
      year: debouncedYear,
    });

  const handlePrevious = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <MonthPicker
          month={month}
          year={year}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>

      <SummaryCards summary={summary} isLoading={summaryLoading} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="text-muted-foreground flex h-75 items-center justify-center text-sm">
              Loading...
            </div>
          ) : (
            <CategorySpendingChart data={categorySpending ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
