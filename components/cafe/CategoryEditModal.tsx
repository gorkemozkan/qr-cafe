"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { CategorySchema } from "@/lib/schema";
import QueryKeys from "@/constants/query-keys";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import CategoryForm from "@/components/cafe/CategoryForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  category: Tables<"categories">;
  onClose: () => void;
  onSuccess?: () => void;
}

const CategoryEditModal: FC<Props> = (props) => {
  //#region States

  const [open, setOpen] = useState(true);

  //#endregion

  //#region Hooks

  const { isLoading, execute } = useRequest({
    mutationFn: (payload: CategorySchema) => {
      return categoryRepository.update(props.category.id, payload);
    },
    onSuccess: () => {
      props.onSuccess?.();
      setOpen(false);
      props.onClose();
    },
    successMessage: "Category updated successfully!",
    invalidateQueries: [QueryKeys.categoriesByCafe(props.category.cafe_id.toString())],
  });

  //#endregion

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      props.onClose();
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
            category={props.category}
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
