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
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import type { Transaction } from "@/features/transactions/types/transaction.types";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

/**
 * TransactionList component
 *
 * Displays a list of transactions in a table with delete action.
 * Shows skeleton rows while loading.
 * Delete action requires confirmation via DeleteConfirmDialog.
 * Badge color reflects transaction type — green for INCOME, red for EXPENSE.
 */
export const TransactionList = ({
  transactions,
  isLoading,
  onDelete,
  isDeleting,
}: TransactionListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
        No transactions found. Create your first one.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="text-muted-foreground text-sm">
              {formatDate(transaction.date)}
            </TableCell>
            <TableCell>
              {transaction.description ?? (
                <span className="text-muted-foreground text-sm italic">
                  No description
                </span>
              )}
            </TableCell>
            <TableCell className="text-sm">
              {transaction.category.name}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  transaction.type === "INCOME"
                    ? "border-green-500 text-green-500"
                    : "border-red-500 text-red-500"
                }
              >
                {transaction.type.charAt(0) +
                  transaction.type.slice(1).toLowerCase()}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              <span
                className={
                  transaction.type === "INCOME"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {formatCurrency(transaction.amount)}
              </span>
            </TableCell>
            <TableCell>
              <DeleteConfirmDialog
                title="Delete Transaction"
                description="Are you sure you want to delete this transaction? This action cannot be undone."
                onConfirm={() => onDelete(transaction.id)}
                disabled={isDeleting}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
