import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog";
import { formatDate } from "@/shared/utils/formatters";
import type { Category } from "@/features/categories/types/category.types";

interface CategoryColumnsProps {
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

/**
 * Category table column definitions
 *
 * Returns typed ColumnDef array for use with DataTable.
 * Delete action is injected via props — keeps columns decoupled from hooks.
 */
export const getCategoryColumns = ({
  onDelete,
  isDeleting,
}: CategoryColumnsProps): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue<string>("type");
      return (
        <Badge
          variant="outline"
          className={
            type === "INCOME"
              ? "border-green-500 text-green-500"
              : "border-red-500 text-red-500"
          }
        >
          {type.charAt(0) + type.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <DeleteConfirmDialog
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and will fail if the category has associated transactions."
        onConfirm={() => onDelete(row.original.id)}
        disabled={isDeleting}
      />
    ),
  },
];
