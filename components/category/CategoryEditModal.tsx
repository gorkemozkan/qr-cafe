"use client";

import { FC, useRef } from "react";
import { useTranslations } from "next-intl";
import { Tables } from "@/types/db";
import { CategorySchema } from "@/lib/schema";
import QueryKeys from "@/constants/query-keys";
import FormSheet from "@/components/FormSheet";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import SubmitButton from "@/components/SubmitButton";
import CategoryForm, { CategoryFormRef } from "@/components/category/CategoryForm";

interface Props {
  category: Tables<"categories">;
  onSuccess?: (category: Tables<"categories">) => void;
  onClose: (open: boolean) => void;
}

const CategoryEditSheet: FC<Props> = (props) => {
  //#region Hooks

  const t = useTranslations("category");

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
    successMessage: t("messages.updateSuccess"),
    invalidateQueries: [QueryKeys.stats],
    optimisticUpdate: {
      queryKey: QueryKeys.categoriesByCafe(props.category.cafe_id.toString()),
      updateFn: (oldData: Tables<"categories">[], variables: CategorySchema) =>
        oldData.map((category) => (category.id === props.category.id ? { ...category, ...variables } : category)),
    },
  });

  return (
    <FormSheet
      title={t("edit.title")}
      description={t("edit.description")}
      onOpenChange={props.onClose}
      footer={
        <SubmitButton
          onClick={() => formRef.current?.submitForm()}
          disabled={isLoading}
          isLoading={isLoading}
          text={t("edit.button")}
          loadingText={t("edit.loadingButton")}
        />
      }
    >
      <CategoryForm
        ref={formRef}
        mode="edit"
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
