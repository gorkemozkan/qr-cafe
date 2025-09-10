"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, useRef, useState } from "react";
import CafeForm, { CafeFormRef } from "@/components/cafe/CafeForm";
import CafeQRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import FormSheet from "@/components/common/FormSheet";
import SubmitButton from "@/components/common/SubmitButton";
import TooltipButton from "@/components/common/TooltipButton";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { CafeSchema } from "@/lib/schema";
import { Tables } from "@/types/db";

interface CreateMutationPayload {
  data: CafeSchema;
  logoFile?: File;
}

const CafeCreateSheet: FC = () => {
  //#region Hooks

  const t = useTranslations("cafe");

  //#endregion

  //#region States

  const [open, setOpen] = useState(false);

  const formRef = useRef<CafeFormRef>(null);

  const [showQRDialog, setShowQRDialog] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [createdCafe, setCreatedCafe] = useState<Tables<"cafes"> | null>(null);

  //#endregion

  const createCafeMutation = useRequest({
    mutationFn: async (payload: CreateMutationPayload) => {
      let cafe = await cafeRepository.create(payload.data);

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
      setCreatedCafe(cafe);
      setShowQRDialog(true);
      setOpen(false);
    },
    successMessage: t("messages.createSuccess"),
    errorMessage: t("messages.createFailed"),
    invalidateQueries: [QueryKeys.cafes, QueryKeys.stats],
  });

  //#endregion

  return (
    <>
      <TooltipButton onClick={() => setOpen(true)} tooltip={t("create.tooltip")}>
        <Button size={"lg"} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipButton>
      {open && (
        <FormSheet
          onOpenChange={setOpen}
          title={t("create.title")}
          description={t("create.description")}
          footer={
            <SubmitButton
              text={t("create.button")}
              loadingText={t("create.loadingButton")}
              isLoading={createCafeMutation.isLoading}
              onClick={() => formRef.current?.submitForm()}
              disabled={createCafeMutation.isLoading || isUploading}
            />
          }
        >
          <CafeForm
            ref={formRef}
            mode="create"
            onCancel={() => setOpen(false)}
            isLoading={createCafeMutation.isLoading}
            onSubmit={async (data, logoFile) => {
              await createCafeMutation.execute({ data, logoFile });
            }}
          />
        </FormSheet>
      )}
      {createdCafe && <CafeQRPreviewDialog slug={createdCafe.slug} open={showQRDialog} onOpenChange={setShowQRDialog} />}
    </>
  );
};

export default CafeCreateSheet;
