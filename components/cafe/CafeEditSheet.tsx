"use client";

import { useTranslations } from "next-intl";
import { FC, useRef, useState } from "react";
import CafeForm, { CafeFormRef } from "@/components/cafe/CafeForm";
import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { CafeSchema } from "@/lib/schema";
import { Tables } from "@/types/db";

interface Props {
  cafe: Tables<"cafes">;
  onSuccess?: (cafe: Tables<"cafes">) => void;
  onClose: (open: boolean) => void;
}

interface UpdateMutationPayload {
  data: CafeSchema;
  logoFile?: File;
}

const CafeEditSheet: FC<Props> = (props) => {
  //#region Hooks

  const t = useTranslations("cafe");

  const [isUploading, setIsUploading] = useState(false);

  //#endregion

  //#region States

  const formRef = useRef<CafeFormRef>(null);

  //#endregion

  const { isLoading, execute } = useRequest({
    mutationFn: async (payload: UpdateMutationPayload) => {
      let cafe = await cafeRepository.update(props.cafe.id, payload.data);

      if (payload.logoFile) {
        setIsUploading(true);

        const { uploadCafeLogo } = await import("@/lib/supabase/storage");

        const uploadResult = await uploadCafeLogo(payload.logoFile, cafe.slug);

        if (uploadResult.success) {
          cafe = await cafeRepository.update(cafe.id, { ...payload.data, logo_url: uploadResult.data.url });
        }

        setIsUploading(false);
      }

      return cafe;
    },
    onSuccess: (cafe) => {
      props.onSuccess?.(cafe);
    },
    successMessage: t("messages.updateSuccess"),
    invalidateQueries: [QueryKeys.stats, QueryKeys.cafes],
  });

  return (
    <FormSheet
      title={t("edit.title")}
      onOpenChange={props.onClose}
      description={t("edit.description")}
      footer={
        <SubmitButton
          isLoading={isLoading}
          text={t("edit.button")}
          disabled={isLoading || isUploading}
          loadingText={t("edit.loadingButton")}
          onClick={() => formRef.current?.submitForm()}
        />
      }
    >
      <CafeForm
        mode="edit"
        ref={formRef}
        cafe={props.cafe}
        isLoading={isLoading}
        onSubmit={async (data, logoFile) => {
          await execute({ data, logoFile });
        }}
        onCancel={() => props.onClose?.(false)}
      />
    </FormSheet>
  );
};

export default CafeEditSheet;
