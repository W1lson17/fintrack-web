import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * StatCard variants — controls icon and value color
 */
export type StatCardVariant = "success" | "danger" | "primary" | "default";

const variantStyles: Record<StatCardVariant, { text: string; bg: string }> = {
  success: { text: "text-green-500", bg: "bg-green-500/10" },
  danger: { text: "text-red-500", bg: "bg-red-500/10" },
  primary: { text: "text-primary", bg: "bg-primary/10" },
  default: { text: "text-muted-foreground", bg: "bg-muted" },
};

interface StatCardProps {
  title: string;
  value?: string;
  icon: LucideIcon;
  variant?: StatCardVariant;
  index?: number;
  isLoading?: boolean;
}

/**
 * StatCard component
 *
 * Generic reusable card for displaying a stat with title, value and icon.
 * Supports variants for color theming and staggered animations via index.
 * Renders skeleton placeholders while data is loading — avoids re-mounting
 * on data updates which would retrigger entry animations unnecessarily.
 */
export const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
  index = 0,
  isLoading = false,
}: StatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {title}
          </CardTitle>
          <div className={`rounded-lg p-2 ${styles.bg}`}>
            <Icon className={`size-4 ${styles.text}`} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className={`text-2xl font-bold ${styles.text}`}>{value}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
