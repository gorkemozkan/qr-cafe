"use client";

import { FC, useState } from "react";
import { Edit } from "lucide-react";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import { CafeForm } from "@/components/cafe/CafeForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CafeEditModalProps {
  cafe: Tables<"cafes">;
  onSuccess?: (cafe: Tables<"cafes">) => void;
  trigger?: React.ReactNode;
}

const CafeEditModal: FC<CafeEditModalProps> = (props) => {
  //#region States

  const [open, setOpen] = useState(false);

  //#endregion

  //#region Requests

  const { isLoading, execute } = useRequest({
    fn: (payload: CafeSchema) => cafeRepository.update(props.cafe.id, payload),
    onSuccess: (data) => {
      props.onSuccess?.(data);
      setOpen(false);
    },
    successMessage: "Cafe updated successfully!",
  });

  //#endregion

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.trigger || (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Cafe</DialogTitle>
          <DialogDescription>Update the cafe information below.</DialogDescription>
        </DialogHeader>
        <CafeForm
          mode="edit"
          isLoading={isLoading}
          cafe={props.cafe}
          onSubmit={async (data) => {
            await execute(data);
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CafeEditModal;
