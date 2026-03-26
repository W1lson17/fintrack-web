import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateSavingGoalProgressSchema,
  type UpdateSavingGoalProgressFormValues,
} from "@/features/saving-goals/schemas/saving-goal.schemas";
import type { UpdateSavingGoalProgressRequest } from "@/features/saving-goals/types/saving-goal.types";
import { formatCurrency } from "@/shared/utils/formatters";

interface UpdateProgressFormProps {
  currentAmount: number;
  targetAmount: number;
  isLoading?: boolean;
  onSubmit: (data: UpdateSavingGoalProgressRequest) => void;
}

/**
 * UpdateProgressForm component
 *
 * Form for adding progress to a saving goal.
 * Shows current progress context to help the user decide the amount.
 * Submit button disabled until form is valid.
 */
export const UpdateProgressForm = ({
  currentAmount,
  targetAmount,
  isLoading = false,
  onSubmit,
}: UpdateProgressFormProps) => {
  const remaining = targetAmount - currentAmount;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateSavingGoalProgressFormValues>({
    resolver: zodResolver(updateSavingGoalProgressSchema),
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Progress context */}
      <div className="bg-muted space-y-1 rounded-lg p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current progress</span>
          <span className="font-medium">{formatCurrency(currentAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Target</span>
          <span className="font-medium">{formatCurrency(targetAmount)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t pt-1">
          <span className="text-muted-foreground">Remaining</span>
          <span className="text-primary font-medium">
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount to add</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          disabled={isLoading}
          {...register("amount")}
        />
        {errors.amount && (
          <p className="text-destructive text-xs">{errors.amount.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Add Progress"
        )}
      </Button>
    </form>
  );
};
