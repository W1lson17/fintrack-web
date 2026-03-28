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
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { getCategoryColumns } from "@/features/categories/components/columns";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/useCategories";
import type { CreateCategoryRequest } from "@/features/categories/types/category.types";

/**
 * CategoriesPage
 *
 * Displays a server-side paginated table of categories
 * with create and delete actions.
 */
export const CategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: categoriesData, isLoading } = useCategories({ page, limit });
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const handleCreate = async (data: CreateCategoryRequest) => {
    await createCategory(data);
    setOpen(false);
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteCategory(id);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const columns = getCategoryColumns({
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
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <CategoryForm isLoading={isCreating} onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            All Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categoriesData?.data ?? []}
            isLoading={isLoading}
            pagination={{
              page,
              limit,
              total: categoriesData?.meta.total ?? 0,
              totalPages: categoriesData?.meta.totalPages ?? 0,
            }}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            emptyMessage="No categories found. Create your first one."
          />
        </CardContent>
      </Card>
    </div>
  );
};
