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
import { TransactionList } from "@/features/transactions/components/TransactionList";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
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
 * Displays a paginated list of transactions with create and delete actions.
 * Categories are fetched to populate the transaction form select.
 */
export const TransactionsPage = () => {
  const [open, setOpen] = useState(false);

  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions();

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction();

  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();

  const handleCreate = (data: CreateTransactionRequest) => {
    createTransaction(data, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transactions</h1>
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
        <CardHeader>
          <CardTitle className="text-base font-medium">
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={transactionsData?.data ?? []}
            isLoading={transactionsLoading}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
};
