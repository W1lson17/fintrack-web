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
import { DatePicker } from "@/shared/components/DatePicker";
import {
  createTransactionSchema,
  type CreateTransactionFormValues,
} from "@/features/transactions/schemas/transaction.schemas";
import {
  TRANSACTION_TYPES,
  type TransactionType,
} from "@/shared/constants/transaction.constants";
import type { CreateTransactionRequest } from "@/features/transactions/types/transaction.types";
import { ROUTES } from "@/shared/constants/routes";
import { Link } from "react-router-dom";

interface CategoryOption {
  id: string;
  name: string;
  type: TransactionType;
}

interface TransactionFormProps {
  categories: CategoryOption[];
  isLoading?: boolean;
  onSubmit: (data: CreateTransactionRequest) => void;
}

/**
 * TransactionForm component
 *
 * Form for creating a new transaction.
 * Uses React Hook Form + Zod for validation.
 * Uses Controller for Select and DatePicker — avoids watch() memoization issues.
 * Shows a link to /categories when no categories are available for the selected type.
 */
export const TransactionForm = ({
  categories,
  isLoading = false,
  onSubmit,
}: TransactionFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    mode: "onChange",
  });

  const selectedType = watch("type");

  const filteredCategories = selectedType
    ? categories.filter((c) => c.type === selectedType)
    : [];

  const hasNoCategories = selectedType && filteredCategories.length === 0;

  const handleFormSubmit = (data: CreateTransactionFormValues) => {
    onSubmit({
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      description: data.description,
      date: data.date,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
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

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              disabled={isLoading}
              onValueChange={(value) => {
                field.onChange(value);
                setValue("categoryId", "", { shouldValidate: false });
              }}
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

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              disabled={isLoading || !selectedType || hasNoCategories}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger id="categoryId">
                <SelectValue
                  placeholder={
                    !selectedType ? "Select a type first" : "Select category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {/* Empty state — link to categories page */}
        {hasNoCategories && (
          <p className="text-muted-foreground text-xs">
            No {selectedType.toLowerCase()} categories yet.{" "}
            <Link
              to={ROUTES.CATEGORIES}
              className="text-primary font-medium hover:underline"
            >
              Create one →
            </Link>
          </p>
        )}
        {errors.categoryId && (
          <p className="text-destructive text-xs">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          id="description"
          type="text"
          placeholder="Add a description..."
          disabled={isLoading}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-xs">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label>
          Date <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date"
              disabled={isLoading}
              maxDate={new Date()}
            />
          )}
        />
        {errors.date && (
          <p className="text-destructive text-xs">{errors.date.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !!hasNoCategories || !isValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Transaction"
        )}
      </Button>
    </form>
  );
};
