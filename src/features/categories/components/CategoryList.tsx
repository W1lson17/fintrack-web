import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog";
import { formatDate } from "@/shared/utils/formatters";
import type { Category } from "@/features/categories/types/category.types";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

/**
 * CategoryList component
 *
 * Displays a list of categories in a table with delete action.
 * Shows skeleton rows while loading.
 * Delete action requires confirmation via DeleteConfirmDialog.
 * Badge color reflects category type — green for INCOME, red for EXPENSE.
 */
export const CategoryList = ({
  categories,
  isLoading,
  onDelete,
  isDeleting,
}: CategoryListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
        No categories found. Create your first one.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  category.type === "INCOME"
                    ? "border-green-500 text-green-500"
                    : "border-red-500 text-red-500"
                }
              >
                {category.type.charAt(0) + category.type.slice(1).toLowerCase()}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatDate(category.createdAt)}
            </TableCell>
            <TableCell>
              <DeleteConfirmDialog
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone and will fail if the category has associated transactions."
                onConfirm={() => onDelete(category.id)}
                disabled={isDeleting}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
