"use client";

import { FC, useState } from "react";
import { Edit } from "lucide-react";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import CafeForm from "@/components/cafe/CafeForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CafeEditModalProps {
  cafe: Tables<"cafes">;
  onSuccess?: (cafe: Tables<"cafes">) => void;
  trigger?: React.ReactNode;
}

const CafeEditModal: FC<CafeEditModalProps> = (props) => {
  const [open, setOpen] = useState(false);

  const { isLoading, execute } = useRequest({
    mutationFn: async (payload: CafeSchema) => {
      return await cafeRepository.update(props.cafe.id, payload);
    },
    onSuccess: (cafe) => {
      props.onSuccess?.(cafe);
      setOpen(false);
    },
    successMessage: "Cafe updated successfully!",
    invalidateQueries: ["cafes"],
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.trigger || (
          <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">Edit Cafe</DialogTitle>
          <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">Update the cafe information below.</DialogDescription>
        </DialogHeader>
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200">
          <CafeForm
            mode="edit"
            isLoading={isLoading}
            cafe={props.cafe}
            onSubmit={async (data) => {
              await execute(data);
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CafeEditModal;
