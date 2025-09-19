"use client";

import QueryKeys from "@/lib/query";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { useTranslations } from "next-intl";
import { FC, useRef, useState } from "react";
import { useRequest } from "@/hooks/useRequest";
import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import CafeForm, { CafeFormRef } from "@/components/cafe/CafeForm";
import { cafeRepository } from "@/lib/repositories/cafe-repository";

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

  //#region Refs

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
    successMessage: t("editSheet.cafeUpdated"),
    invalidateQueries: [QueryKeys.stats, QueryKeys.cafes],
  });

  return (
    <FormSheet
      title={t("editCafe")}
      onOpenChange={props.onClose}
      description={t("editSheet.description")}
      footer={
        <SubmitButton
          isLoading={isLoading}
          text={t("editSheet.updateButton")}
          disabled={isLoading || isUploading}
          loadingText={t("editSheet.updating")}
          onClick={() => formRef.current?.submitForm()}
        />
      }
    >
      <CafeForm
        ref={formRef}
        cafe={props.cafe}
        isLoading={isLoading}
        onCancel={() => props.onClose?.(false)}
        onSubmit={async (data, logoFile) => {
          await execute({ data, logoFile });
        }}
      />
    </FormSheet>
  );
};

export default CafeEditSheet;
