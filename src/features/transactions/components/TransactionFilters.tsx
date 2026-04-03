import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  TRANSACTION_TYPES,
  type TransactionType,
} from "@/shared/constants/transaction.constants";
import type { Category } from "@/features/categories/types/category.types";

export interface TransactionFiltersState {
  type?: TransactionType;
  categoryId?: string;
}

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  categories: Category[];
  onFiltersChange: (filters: TransactionFiltersState) => void;
  onClearFilters: () => void;
}

/**
 * TransactionFilters component
 *
 * Collapsible filter panel for transactions table.
 * Supports filtering by transaction type and category.
 * Shows active filter count as badge on the toggle button.
 * "Clear filters" button appears only when filters are active.
 */
export const TransactionFilters = ({
  filters,
  categories,
  onFiltersChange,
  onClearFilters,
}: TransactionFiltersProps) => {
  const [open, setOpen] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const filteredCategories = filters.type
    ? categories.filter((c) => c.type === filters.type)
    : categories;

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value === "ALL" ? undefined : (value as TransactionType),
      // Reset category when type changes
      categoryId: undefined,
    });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      categoryId: value === "ALL" ? undefined : value,
    });
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 size-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 flex size-5 items-center justify-center rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 size-3" />
            Clear filters
          </Button>
        )}
      </div>

      <CollapsibleContent className="mt-3">
        <div className="flex flex-wrap gap-3 rounded-lg border p-4">
          {/* Type filter */}
          <div className="flex min-w-40 flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              Type
            </span>
            <Select
              value={filters.type ?? "ALL"}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                {TRANSACTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category filter */}
          <div className="flex min-w-48 flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              Category
            </span>
            <Select
              value={filters.categoryId ?? "ALL"}
              onValueChange={handleCategoryChange}
              disabled={filteredCategories.length === 0}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All categories</SelectItem>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
