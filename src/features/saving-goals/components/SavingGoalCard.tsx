import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog";
import { UpdateProgressForm } from "./UpdateProgressForm";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import type { SavingGoal } from "@/features/saving-goals/types/saving-goal.types";
import type { UpdateSavingGoalProgressRequest } from "@/features/saving-goals/types/saving-goal.types";

interface SavingGoalCardProps {
  goal: SavingGoal;
  index: number;
  onUpdateProgress: (
    id: string,
    data: UpdateSavingGoalProgressRequest,
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
  isUpdating: boolean;
}

/**
 * SavingGoalCard component
 *
 * Displays a single saving goal with progress bar, deadline and actions.
 * Animated entry with staggered delay via index prop.
 * Progress bar color changes based on completion percentage.
 */
export const SavingGoalCard = ({
  goal,
  index,
  onUpdateProgress,
  onDelete,
  isDeleting,
  isUpdating,
}: SavingGoalCardProps) => {
  const [open, setOpen] = useState(false);

  const progress =
    goal.targetAmount > 0
      ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
      : 0;

  const progressColor =
    progress >= 100
      ? "bg-green-500"
      : progress >= 50
        ? "bg-primary"
        : "bg-amber-500";

  const handleUpdateProgress = (
    data: UpdateSavingGoalProgressRequest,
  ): Promise<void> => {
    return onUpdateProgress(goal.id, data).then(() => setOpen(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <PiggyBank className="text-primary size-4" />
            </div>
            <CardTitle className="text-base font-medium">{goal.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {/* Update Progress Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Add Progress
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Progress — {goal.name}</DialogTitle>
                </DialogHeader>
                <UpdateProgressForm
                  currentAmount={goal.currentAmount}
                  targetAmount={goal.targetAmount}
                  isLoading={isUpdating}
                  onSubmit={handleUpdateProgress}
                />
              </DialogContent>
            </Dialog>

            {/* Delete */}
            <DeleteConfirmDialog
              title="Delete Saving Goal"
              description="Are you sure you want to delete this saving goal? This action cannot be undone."
              onConfirm={() => onDelete(goal.id)}
              disabled={isDeleting}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Amount info */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {formatCurrency(goal.currentAmount)} /{" "}
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <motion.div
              className={`h-full rounded-full ${progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            />
          </div>

          {/* Percentage and deadline */}
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{progress.toFixed(1)}% completed</span>
            {goal.deadline && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-3" />
                <span>{formatDate(goal.deadline)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
