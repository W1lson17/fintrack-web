import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "@/features/categories/schemas/category.schemas";
import { TRANSACTION_TYPES } from "@/shared/constants/transaction.constants";
import type { CreateCategoryRequest } from "@/features/categories/types/category.types";

interface CategoryFormProps {
  isLoading?: boolean;
  onSubmit: (data: CreateCategoryRequest) => void;
}

/**
 * CategoryForm component
 *
 * Form for creating a new category.
 * Uses React Hook Form + Zod for validation.
 * Uses Controller for Select — avoids watch() memoization issues.
 * Submit button disabled until form is valid.
 */
export const CategoryForm = ({
  isLoading = false,
  onSubmit,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g. Groceries"
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              disabled={isLoading}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-destructive text-xs">{errors.type.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Category"
        )}
      </Button>
    </form>
  );
};
