"use client";

import { FC, useState } from "react";
import { Plus } from "lucide-react";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import CafeForm from "@/components/cafe/CafeForm";
import QueryKeys from "@/constants/query-keys";
import QRPreviewDialog from "@/components/cafe/QRPreviewDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CafeCreateModalProps {
  onSuccess?: (cafe: Tables<"cafes">) => void;
}

const CafeCreateModal: FC<CafeCreateModalProps> = (props) => {
  //#region States
  const [open, setOpen] = useState(false);

  const [showQRDialog, setShowQRDialog] = useState(false);

  const [createdCafe, setCreatedCafe] = useState<Tables<"cafes"> | null>(null);

  //#endregion

  //#region Request

  const { isLoading, execute } = useRequest({
    mutationFn: (payload: CafeSchema) => cafeRepository.create(payload),
    onSuccess: (data) => {
      props.onSuccess?.(data);
      setCreatedCafe(data);
      setShowQRDialog(true);
      setOpen(false);
    },
    successMessage: "Cafe created successfully!",
    invalidateQueries: QueryKeys.cafes,
  });
  //#endregion

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="transition-all duration-200 hover:scale-105">
            <Plus className="h-4 w-4" />
            Create Cafe
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
          <DialogHeader>
            <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">Create New Cafe</DialogTitle>
            <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">Fill in the details below to create a new cafe.</DialogDescription>
          </DialogHeader>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200">
            <CafeForm
              mode="create"
              onSubmit={async (data) => {
                await execute(data);
              }}
              onCancel={() => setOpen(false)}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>
      {createdCafe && <QRPreviewDialog slug={createdCafe.slug} open={showQRDialog} onOpenChange={setShowQRDialog} />}
    </>
  );
};

export default CafeCreateModal;
