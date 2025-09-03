"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { CategorySchema } from "@/lib/schema";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import CategoryForm from "@/components/cafe/CategoryForm";
import QueryKeys from "@/constants/query-keys";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryEditModalProps {
  category: Tables<"categories">;
  onClose: () => void;
  onSuccess?: () => void;
}

const CategoryEditModal: FC<CategoryEditModalProps> = ({ category, onClose, onSuccess }) => {
  const [open, setOpen] = useState(true);

  const { isLoading, execute } = useRequest({
    mutationFn: (payload: CategorySchema) => {
      console.log("CategoryEditModal - Sending payload:", payload);
      return categoryRepository.update(category.id, payload);
    },
    onSuccess: () => {
      onSuccess?.();
      setOpen(false);
      onClose();
    },
    successMessage: "Category updated successfully!",
    invalidateQueries: [QueryKeys.categoriesByCafe(category.cafe_id.toString())],
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">Edit Category</DialogTitle>
          <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">Update the category details below.</DialogDescription>
        </DialogHeader>
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200 max-h-[calc(90vh-200px)] overflow-y-auto">
          <CategoryForm
            mode="edit"
            category={category}
            onSubmit={async (data) => {
              await execute(data);
            }}
            onCancel={() => handleOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditModal;
