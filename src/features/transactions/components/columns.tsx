import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import type { Transaction } from "@/features/transactions/types/transaction.types";

interface TransactionColumnsProps {
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

/**
 * Transaction table column definitions
 *
 * Returns typed ColumnDef array for use with DataTable.
 * Delete action is injected via props — keeps columns decoupled from hooks.
 */
export const getTransactionColumns = ({
  onDelete,
  isDeleting,
}: TransactionColumnsProps): ColumnDef<Transaction>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDate(row.getValue("date"))}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue<string | null>("description");
      return description ? (
        <span>{description}</span>
      ) : (
        <span className="text-muted-foreground text-sm italic">
          No description
        </span>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.category.name}</span>
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
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div
          className={`text-right font-medium ${
            type === "INCOME" ? "text-green-500" : "text-red-500"
          }`}
        >
          {formatCurrency(row.getValue("amount"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <DeleteConfirmDialog
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={() => onDelete(row.original.id)}
        disabled={isDeleting}
      />
    ),
  },
];
