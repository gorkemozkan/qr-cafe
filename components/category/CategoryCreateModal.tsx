"use client";

import { Plus } from "lucide-react";
import { FC, useRef, useState } from "react";
import CategoryForm, { CategoryFormRef } from "@/components/category/CategoryForm";
import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import TooltipButton from "@/components/common/TooltipButton";
import { Button } from "@/components/ui/button";
import useCafeData from "@/hooks/useCafeData";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { CategorySchema } from "@/lib/schema";
import { Tables } from "@/types/db";

interface Props {
  cafeId: number;
  onSuccess?: (category: Tables<"categories">) => void;
}

const CategoryCreateSheet: FC<Props> = (props) => {
  //#region Hooks

  const { cafeSlug } = useCafeData(props.cafeId);

  //#endregion

  //#region States

  const [open, setOpen] = useState(false);

  const formRef = useRef<CategoryFormRef>(null);

  //#endregion

  const { isLoading, execute } = useRequest({
    mutationFn: (payload: CategorySchema) => categoryRepository.create(props.cafeId, payload),
    onSuccess: (data) => {
      props.onSuccess?.(data);
      setOpen(false);
    },
    successMessage: "Category created successfully!",
    errorMessage: "Failed to create category",
    invalidateQueries: [QueryKeys.categoriesByCafe(props.cafeId.toString()), QueryKeys.stats],
  });

  //#endregion

  return (
    <>
      <TooltipButton onClick={() => setOpen(true)} tooltip="Create a new category">
        <Button variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipButton>
      {open && (
        <FormSheet
          footer={
            <SubmitButton
              onClick={() => formRef.current?.submitForm()}
              disabled={isLoading}
              isLoading={isLoading}
              text="Create Category"
              loadingText="Creating..."
            />
          }
          title="Create New Category"
          description="Fill in the details below to create a new category."
          onOpenChange={setOpen}
        >
          <CategoryForm
            ref={formRef}
            mode="create"
            cafeSlug={cafeSlug}
            onSubmit={async (data) => {
              await execute(data);
            }}
            onCancel={() => setOpen(false)}
            isLoading={isLoading}
          />
        </FormSheet>
      )}
    </>
  );
};

export default CategoryCreateSheet;
