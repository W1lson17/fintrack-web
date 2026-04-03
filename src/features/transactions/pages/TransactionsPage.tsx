import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/shared/components/DataTable";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import {
  TransactionFilters,
  type TransactionFiltersState,
} from "@/features/transactions/components/TransactionFilters";
import { getTransactionColumns } from "@/features/transactions/components/columns";
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
} from "@/features/transactions/hooks/useTransactions";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { CreateTransactionRequest } from "@/features/transactions/types/transaction.types";

/**
 * TransactionsPage
 *
 * Displays a server-side paginated table of transactions
 * with create, filter and delete actions.
 * Supports filtering by type and category via collapsible filter panel.
 */
export const TransactionsPage = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<TransactionFiltersState>({});

  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions({
      page,
      limit,
      type: filters.type,
      categoryId: filters.categoryId,
    });

  // Fetch all categories — used by both the filter panel and the create form
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
  });

  const { mutateAsync: createTransaction, isPending: isCreating } =
    useCreateTransaction();

  const { mutateAsync: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();

  const handleCreate = async (data: CreateTransactionRequest) => {
    await createTransaction(data);
    setOpen(false);
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteTransaction(id);
  };

  const handleFiltersChange = (newFilters: TransactionFiltersState) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const columns = getTransactionColumns({
    onDelete: handleDelete,
    isDeleting,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              categories={categoriesData?.data ?? []}
              isLoading={isCreating || categoriesLoading}
              onSubmit={handleCreate}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="text-base font-medium">
            All Transactions
          </CardTitle>
          <TransactionFilters
            filters={filters}
            categories={categoriesData?.data ?? []}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactionsData?.data ?? []}
            isLoading={transactionsLoading}
            pagination={{
              page,
              limit,
              total: transactionsData?.meta.total ?? 0,
              totalPages: transactionsData?.meta.totalPages ?? 0,
            }}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            emptyMessage="No transactions found. Create your first one."
          />
        </CardContent>
      </Card>
    </div>
  );
};
