"use client";

import { FC, useState } from "react";
import { Plus } from "lucide-react";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import { CafeForm } from "@/components/cafe/CafeForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CafeCreateModalProps {
  onSuccess?: (cafe: Tables<"cafes">) => void;
  trigger?: React.ReactNode;
}

const CafeCreateModal: FC<CafeCreateModalProps> = (props) => {
  //#region States

  const [open, setOpen] = useState(false);

  //#endregion

  //#region Requests

  const { isLoading, execute } = useRequest({
    fn: (payload: CafeSchema) => cafeRepository.create(payload),
    onSuccess: (data) => {
      props.onSuccess?.(data);
      setOpen(false);
    },
    successMessage: "Cafe created successfully!",
  });
  //#endregion

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.trigger || (
          <Button variant="secondary" size="sm">
            <Plus className="h-4 w-4" />
            Create New Cafe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Cafe</DialogTitle>
          <DialogDescription>Fill in the details below to create a new cafe.</DialogDescription>
        </DialogHeader>
        <CafeForm
          mode="create"
          onSubmit={async (data) => {
            await execute(data);
          }}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CafeCreateModal;
