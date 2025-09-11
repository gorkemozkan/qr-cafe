"use client";

import { FC, useRef } from "react";
import CategoryForm, { CategoryFormRef } from "@/components/category/CategoryForm";
import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import useCafeData from "@/hooks/useCafeData";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { CategorySchema } from "@/lib/schema";
import { Tables } from "@/types/db";

interface Props {
  category: Tables<"categories">;
  onSuccess?: (category: Tables<"categories">) => void;
  onClose: (open: boolean) => void;
}

const CategoryEditSheet: FC<Props> = (props) => {
  //#region Hooks

  const { cafeSlug } = useCafeData(props.category.cafe_id);

  //#endregion

  //#region States

  const formRef = useRef<CategoryFormRef>(null);

  //#endregion

  const { isLoading, execute } = useRequest({
    mutationFn: async (payload: CategorySchema) => {
      return await categoryRepository.update(props.category.id, payload);
    },
    onSuccess: (category) => {
      props.onSuccess?.(category);
    },
    successMessage: "Category updated successfully!",
    invalidateQueries: [QueryKeys.stats],
    optimisticUpdate: {
      queryKey: QueryKeys.categoriesByCafe(props.category.cafe_id.toString()),
      updateFn: (oldData: Tables<"categories">[], variables: CategorySchema) =>
        oldData.map((category) => (category.id === props.category.id ? { ...category, ...variables } : category)),
    },
  });

  return (
    <FormSheet
      title="Edit Category"
      description="Update the category information below."
      onOpenChange={props.onClose}
      footer={
        <SubmitButton
          onClick={() => formRef.current?.submitForm()}
          disabled={isLoading}
          isLoading={isLoading}
          text="Update Category"
          loadingText="Updating..."
        />
      }
    >
      <CategoryForm
        ref={formRef}
        mode="edit"
        cafeSlug={cafeSlug}
        isLoading={isLoading}
        category={props.category}
        onSubmit={async (data) => {
          await execute(data);
        }}
        onCancel={() => props.onClose?.(false)}
      />
    </FormSheet>
  );
};

export default CategoryEditSheet;
