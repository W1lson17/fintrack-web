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
import { CategoryList } from "@/features/categories/components/CategoryList";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/useCategories";
import type { CreateCategoryRequest } from "@/features/categories/types/category.types";

/**
 * CategoriesPage
 *
 * Displays a paginated list of categories with create and delete actions.
 */
export const CategoriesPage = () => {
  const [open, setOpen] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleCreate = (data: CreateCategoryRequest) => {
    createCategory(data, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleDelete = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      deleteCategory(id, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
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
          <CategoryList
            categories={categoriesData?.data ?? []}
            isLoading={categoriesLoading}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
};
