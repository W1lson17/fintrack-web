import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { StatCard, type StatCardVariant } from "@/shared/components/StatCard";
import { formatCurrency } from "@/shared/utils/formatters";
import type { MonthlySummary } from "@/features/dashboard/types/dashboard.types";

interface SummaryCardsProps {
  summary: MonthlySummary | undefined;
  isLoading: boolean;
}

/**
 * SummaryCards component
 *
 * Displays monthly income, expenses and balance using StatCard.
 * Passes isLoading to each StatCard — cards stay mounted during loading
 * to prevent re-triggering entry animations on every data update.
 */
export const SummaryCards = ({ summary, isLoading }: SummaryCardsProps) => {
  const balanceVariant: StatCardVariant =
    summary && summary.balance >= 0 ? "success" : "danger";

  const cards = [
    {
      title: "Total Income",
      value: summary ? formatCurrency(summary.totalIncome) : undefined,
      icon: TrendingUp,
      variant: "success" as StatCardVariant,
    },
    {
      title: "Total Expenses",
      value: summary ? formatCurrency(summary.totalExpenses) : undefined,
      icon: TrendingDown,
      variant: "danger" as StatCardVariant,
    },
    {
      title: "Balance",
      value: summary ? formatCurrency(summary.balance) : undefined,
      icon: Wallet,
      variant: balanceVariant,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card, index) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          index={index}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
