import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SavingGoalCard } from "@/features/saving-goals/components/SavingGoalCard";
import { SavingGoalForm } from "@/features/saving-goals/components/SavingGoalForm";
import {
  useSavingGoals,
  useCreateSavingGoal,
  useUpdateSavingGoalProgress,
  useDeleteSavingGoal,
} from "@/features/saving-goals/hooks/useSavingGoals";
import type {
  CreateSavingGoalRequest,
  UpdateSavingGoalProgressRequest,
} from "@/features/saving-goals/types/saving-goal.types";

/**
 * SavingGoalsPage
 *
 * Displays a grid of saving goal cards with create, update progress
 * and delete actions.
 */
export const SavingGoalsPage = () => {
  const [open, setOpen] = useState(false);

  const { data: savingGoalsData, isLoading } = useSavingGoals();

  const { mutate: createSavingGoal, isPending: isCreating } =
    useCreateSavingGoal();
  const { mutate: updateProgress, isPending: isUpdating } =
    useUpdateSavingGoalProgress();
  const { mutate: deleteSavingGoal, isPending: isDeleting } =
    useDeleteSavingGoal();

  const handleCreate = (data: CreateSavingGoalRequest) => {
    createSavingGoal(data, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleUpdateProgress = (
    id: string,
    data: UpdateSavingGoalProgressRequest,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      updateProgress(
        { id, data },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        },
      );
    });
  };

  const handleDelete = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      deleteSavingGoal(id, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Saving Goal</DialogTitle>
            </DialogHeader>
            <SavingGoalForm isLoading={isCreating} onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && savingGoalsData?.data.length === 0 && (
        <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
          No saving goals yet. Create your first one.
        </div>
      )}

      {/* Goals grid */}
      {!isLoading &&
        savingGoalsData?.data &&
        savingGoalsData.data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savingGoalsData.data.map((goal, index) => (
              <SavingGoalCard
                key={goal.id}
                goal={goal}
                index={index}
                onUpdateProgress={handleUpdateProgress}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
    </div>
  );
};
