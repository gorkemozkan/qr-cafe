"use client";

import { FC, useState } from "react";
import { Plus } from "lucide-react";
import { Tables } from "@/types/db";
import { CategorySchema } from "@/lib/schema";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import CategoryForm from "@/components/cafe/CategoryForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  cafeId: number;
  onSuccess?: (category: Tables<"categories">) => void;
}

const CategoryCreateModal: FC<Props> = (props) => {
  //#region States

  const [open, setOpen] = useState(false);

  //#endregion

  //#region Hooks

  const { isLoading, execute } = useRequest({
    mutationFn: (payload: CategorySchema) => categoryRepository.create(props.cafeId, payload),
    onSuccess: (data) => {
      props.onSuccess?.(data);
      setOpen(false);
    },
    successMessage: "Category created successfully!",
    invalidateQueries: [QueryKeys.categoriesByCafe(props.cafeId.toString())],
  });

  //#endregion

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="transition-all duration-200 hover:scale-105">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">Create New Category</DialogTitle>
          <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">Fill in the details below to create a new category.</DialogDescription>
        </DialogHeader>
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200 max-h-[calc(90vh-200px)] overflow-y-auto">
          <CategoryForm
            mode="create"
            onSubmit={async (data) => {
              await execute(data);
            }}
            onCancel={() => setOpen(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCreateModal;
