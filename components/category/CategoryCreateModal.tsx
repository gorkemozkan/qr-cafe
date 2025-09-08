"use client";

import { FC, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Tables } from "@/types/db";
import { CategorySchema } from "@/lib/schema";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { categoryRepository } from "@/lib/repositories";
import CategoryForm, { CategoryFormRef } from "@/components/category/CategoryForm";
import FormSheet from "@/components/FormSheet";
import TooltipButton from "@/components/TooltipButton";
import SubmitButton from "@/components/SubmitButton";

interface Props {
  cafeId: number;
  onSuccess?: (category: Tables<"categories">) => void;
}

const CategoryCreateSheet: FC<Props> = (props) => {
  //#region Hooks

  const t = useTranslations("category");

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
    successMessage: t("messages.createSuccess"),
    errorMessage: t("messages.createFailed"),
    invalidateQueries: [QueryKeys.categoriesByCafe(props.cafeId.toString()), QueryKeys.stats],
  });

  //#endregion

  return (
    <>
      <TooltipButton onClick={() => setOpen(true)} tooltip={t("create.tooltip")}>
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
              text={t("create.button")}
              loadingText={t("create.loadingButton")}
            />
          }
          title={t("create.title")}
          description={t("create.description")}
          onOpenChange={setOpen}
        >
          <CategoryForm
            ref={formRef}
            mode="create"
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
