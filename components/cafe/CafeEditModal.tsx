"use client";

import { FC } from "react";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import CafeForm from "@/components/cafe/CafeForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CafeEditModalProps {
  cafe: Tables<"cafes">;
  onSuccess?: (cafe: Tables<"cafes">) => void;
  onClose?: () => void;
}

const CafeEditModal: FC<CafeEditModalProps> = (props) => {
  const { isLoading, execute } = useRequest({
    mutationFn: async (payload: CafeSchema) => {
      return await cafeRepository.update(props.cafe.id, payload);
    },
    onSuccess: (cafe) => {
      props.onSuccess?.(cafe);
    },
    successMessage: "Cafe updated successfully!",
    invalidateQueries: ["cafes"],
  });

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">Edit Cafe</DialogTitle>
          <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">Update the cafe information below.</DialogDescription>
        </DialogHeader>

        <CafeForm
          mode="edit"
          isLoading={isLoading}
          cafe={props.cafe}
          onSubmit={async (data) => {
            await execute(data);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CafeEditModal;
