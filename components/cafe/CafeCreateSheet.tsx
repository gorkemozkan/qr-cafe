"use client";

import { Tables } from "@/types/db";
import { Plus } from "lucide-react";
import { FC, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { CafeSchema } from "@/lib/schema";
import QueryKeys from "@/lib/query";
import { Button } from "@/components/ui/button";
import CafeForm, { CafeFormRef } from "@/components/cafe/CafeForm";
import { useRequest } from "@/hooks/useRequest";
import { cafeRepository } from "@/lib/repositories";
import CafeQRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import FormSheet from "@/components/FormSheet";
import TooltipButton from "@/components/TooltipButton";
import SubmitButton from "@/components/SubmitButton";

const CafeCreateSheet: FC = () => {
  //#region Hooks

  const t = useTranslations("cafe");

  //#endregion

  //#region States

  const [open, setOpen] = useState(false);

  const [showQRDialog, setShowQRDialog] = useState(false);

  const [createdCafe, setCreatedCafe] = useState<Tables<"cafes"> | null>(null);

  const formRef = useRef<CafeFormRef>(null);

  //#endregion

  const createCafeMutation = useRequest({
    mutationFn: async ({ data, logoFile }: { data: CafeSchema; logoFile?: File }) => {
      let cafe = await cafeRepository.create(data);

      if (logoFile) {
        const { uploadCafeLogo } = await import("@/lib/supabase/storage");

        const uploadResult = await uploadCafeLogo(logoFile, cafe.slug);

        if (uploadResult.success) {
          cafe = await cafeRepository.update(cafe.id, { ...data, logo_url: uploadResult.data.url });
        }
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
        <Button variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipButton>
      {open && (
        <FormSheet
          footer={
            <SubmitButton
              onClick={() => formRef.current?.submitForm()}
              disabled={createCafeMutation.isLoading}
              isLoading={createCafeMutation.isLoading}
              text={t("create.button")}
              loadingText={t("create.loadingButton")}
            />
          }
          title={t("create.title")}
          description={t("create.description")}
          onOpenChange={setOpen}
        >
          <CafeForm
            ref={formRef}
            mode="create"
            onSubmit={async (data, logoFile) => {
              await createCafeMutation.execute({ data, logoFile });
            }}
            onCancel={() => setOpen(false)}
            isLoading={createCafeMutation.isLoading}
          />
        </FormSheet>
      )}
      {createdCafe && <CafeQRPreviewDialog slug={createdCafe.slug} open={showQRDialog} onOpenChange={setShowQRDialog} />}
    </>
  );
};

export default CafeCreateSheet;
