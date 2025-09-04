"use client";

import { FC, useState } from "react";
import { Plus } from "lucide-react";
import { Tables } from "@/types/db";
import { CategorySchema } from "@/lib/schema";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import CategoryForm from "@/components/category/CategoryForm";
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
    invalidateQueries: [QueryKeys.categoriesByCafe(props.cafeId.toString()), QueryKeys.stats],
  });

  //#endregion

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="transition-all duration-200 hover:scale-105">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>Fill in the details below to create a new category.</DialogDescription>
        </DialogHeader>
        <CategoryForm
          mode="create"
          onSubmit={async (data) => {
            await execute(data);
          }}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCreateModal;
