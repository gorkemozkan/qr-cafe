"use client";

import { Plus } from "lucide-react";
import QueryKeys from "@/lib/query";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { useTranslations } from "next-intl";
import { FC, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/useRequest";
import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import CafeForm, { CafeFormRef } from "@/components/cafe/CafeForm";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import CafeQRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";

interface CreateMutationPayload {
  data: CafeSchema;
  logoFile?: File;
}

enum UIStatus {
  SET_UPLOADING = "SET_UPLOADING",
  SHOW_QR_DIALOG = "SHOW_QR_DIALOG",
  SHOW_CREATE_DIALOG = "SHOW_CREATE_DIALOG",
}

const CafeCreateSheet: FC = () => {
  //#region Hooks

  const t = useTranslations("cafe");

  //#endregion

  //#region Refs

  const formRef = useRef<CafeFormRef>(null);

  //#endregion

  //#region States

  const [status, setStatus] = useState<UIStatus | null>();

  const [createdCafe, setCreatedCafe] = useState<Tables<"cafes"> | null>();

  //#endregion

  const createCafeMutation = useRequest({
    mutationFn: async (payload: CreateMutationPayload) => {
      let cafe = await cafeRepository.create(payload.data);

      if (payload.logoFile) {
        setStatus(UIStatus.SET_UPLOADING);

        const { uploadCafeLogo } = await import("@/lib/supabase/storage");

        const uploadResult = await uploadCafeLogo(payload.logoFile, cafe.slug);

        if (uploadResult.success) {
          cafe = await cafeRepository.update(cafe.id, { ...payload.data, logo_url: uploadResult.data.url });
        }

        setStatus(null);
      }

      return cafe;
    },
    onSuccess: (cafe) => {
      setCreatedCafe(cafe);
      setStatus(UIStatus.SHOW_QR_DIALOG);
    },
    errorMessage: t("createFailed"),
    successMessage: t("cafeCreated"),
    invalidateQueries: [QueryKeys.cafes, QueryKeys.stats],
  });

  return (
    <>
      <Button size={"lg"} variant="outline" onClick={() => setStatus(UIStatus.SHOW_CREATE_DIALOG)}>
        <Plus className="h-4 w-4" />
      </Button>
      {status === UIStatus.SHOW_CREATE_DIALOG && (
        <FormSheet
          title={t("createSheet.title")}
          onOpenChange={() => setStatus(null)}
          description={t("createSheet.description")}
          footer={
            <SubmitButton
              text={t("createSheet.createButton")}
              loadingText={t("createSheet.creating")}
              isLoading={createCafeMutation.isLoading}
              onClick={() => formRef.current?.submitForm()}
              disabled={createCafeMutation.isLoading}
            />
          }
        >
          <CafeForm
            ref={formRef}
            onCancel={() => setStatus(null)}
            isLoading={createCafeMutation.isLoading}
            onSubmit={async (data, logoFile) => {
              await createCafeMutation.execute({ data, logoFile });
            }}
          />
        </FormSheet>
      )}
      {createdCafe && (
        <CafeQRPreviewDialog
          slug={createdCafe.slug}
          open={status === UIStatus.SHOW_QR_DIALOG}
          onOpenChange={() => setStatus(null)}
        />
      )}
    </>
  );
};

export default CafeCreateSheet;
