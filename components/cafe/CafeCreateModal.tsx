"use client";

import { Tables } from "@/types/db";
import { Plus } from "lucide-react";
import { FC, useState } from "react";
import { CafeSchema } from "@/lib/schema";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import CafeForm from "@/components/cafe/CafeForm";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import CafeQRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const CafeCreateModal: FC = () => {
  //#region States

  const [open, setOpen] = useState(false);

  const [showQRDialog, setShowQRDialog] = useState(false);

  const [createdCafe, setCreatedCafe] = useState<Tables<"cafes"> | null>(null);

  //#endregion

  //#region Mutations

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
    successMessage: "Cafe created successfully!",
    errorMessage: "Failed to create cafe",
    invalidateQueries: [QueryKeys.cafes, QueryKeys.stats],
  });

  //#endregion

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a new cafe</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">Create New Cafe</DialogTitle>
            <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">Fill in the details below to create a new cafe.</DialogDescription>
          </DialogHeader>
          <CafeForm
            mode="create"
            onSubmit={async (data, logoFile) => {
              await createCafeMutation.execute({ data, logoFile });
            }}
            onCancel={() => setOpen(false)}
            isLoading={createCafeMutation.isLoading}
          />
        </DialogContent>
      </Dialog>
      {createdCafe && <CafeQRPreviewDialog slug={createdCafe.slug} open={showQRDialog} onOpenChange={setShowQRDialog} />}
    </>
  );
};

export default CafeCreateModal;
