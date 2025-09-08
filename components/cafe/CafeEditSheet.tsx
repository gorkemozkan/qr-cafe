"use client";

import { FC, useRef } from "react";
import { Tables } from "@/types/db";
import { slugify } from "@/lib/utils";
import { CafeSchema } from "@/lib/schema";
import { useTranslations } from "next-intl";
import QueryKeys from "@/constants/query-keys";
import FormSheet from "@/components/FormSheet";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import SubmitButton from "@/components/SubmitButton";
import CafeForm, { CafeFormRef } from "@/components/cafe/CafeForm";

interface Props {
  cafe: Tables<"cafes">;
  onSuccess?: (cafe: Tables<"cafes">) => void;
  onClose: (open: boolean) => void;
}

const CafeEditSheet: FC<Props> = (props) => {
  //#region Hooks

  const t = useTranslations("cafe");

  //#endregion

  //#region States

  const formRef = useRef<CafeFormRef>(null);

  //#endregion

  const { isLoading, execute } = useRequest({
    mutationFn: async (payload: CafeSchema) => {
      return await cafeRepository.update(props.cafe.id, payload);
    },
    onSuccess: (cafe) => {
      props.onSuccess?.(cafe);
    },
    successMessage: t("messages.updateSuccess"),
    invalidateQueries: [QueryKeys.stats],
    optimisticUpdate: {
      queryKey: QueryKeys.cafes,
      updateFn: (oldData: Tables<"cafes">[], variables: CafeSchema) =>
        oldData.map((cafe) => {
          if (cafe.id === props.cafe.id) {
            const optimisticSlug =
              variables.name && variables.name !== cafe.name ? slugify(variables.name, { maxLength: 50 }) : cafe.slug;

            return {
              ...cafe,
              ...variables,
              slug: optimisticSlug,
            };
          }
          return cafe;
        }),
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
      <CafeForm
        ref={formRef}
        mode="edit"
        isLoading={isLoading}
        cafe={props.cafe}
        onSubmit={async (data) => {
          await execute(data);
        }}
        onCancel={() => props.onClose?.(false)}
      />
    </FormSheet>
  );
};

export default CafeEditSheet;
