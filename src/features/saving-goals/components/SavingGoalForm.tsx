import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/shared/components/DatePicker";
import {
  createSavingGoalSchema,
  type CreateSavingGoalFormValues,
} from "@/features/saving-goals/schemas/saving-goal.schemas";
import type { CreateSavingGoalRequest } from "@/features/saving-goals/types/saving-goal.types";
import { addDays } from "date-fns";

interface SavingGoalFormProps {
  isLoading?: boolean;
  onSubmit: (data: CreateSavingGoalRequest) => void;
}

/**
 * SavingGoalForm component
 *
 * Form for creating a new saving goal.
 * Uses React Hook Form + Zod for validation.
 * Deadline DatePicker restricts past dates and today — must be future.
 * Submit button disabled until form is valid.
 */
export const SavingGoalForm = ({
  isLoading = false,
  onSubmit,
}: SavingGoalFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateSavingGoalFormValues>({
    resolver: zodResolver(createSavingGoalSchema),
    mode: "onChange",
  });

  const handleFormSubmit = (data: CreateSavingGoalFormValues) => {
    onSubmit({
      name: data.name,
      targetAmount: data.targetAmount,
      deadline: data.deadline,
    });
  };

  // Minimum date for deadline — tomorrow
  const minDeadline = addDays(new Date(), 1);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g. Vacation Fund"
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Target Amount */}
      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount</Label>
        <Input
          id="targetAmount"
          type="number"
          step="0.01"
          placeholder="0.00"
          disabled={isLoading}
          {...register("targetAmount")}
        />
        {errors.targetAmount && (
          <p className="text-destructive text-xs">
            {errors.targetAmount.message}
          </p>
        )}
      </div>

      {/* Deadline */}
      <div className="space-y-2">
        <Label>
          Deadline{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Controller
          name="deadline"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a deadline"
              disabled={isLoading}
              minDate={minDeadline}
            />
          )}
        />
        {errors.deadline && (
          <p className="text-destructive text-xs">{errors.deadline.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Saving Goal"
        )}
      </Button>
    </form>
  );
};
