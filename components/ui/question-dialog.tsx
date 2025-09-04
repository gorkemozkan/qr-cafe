"use client";

import { FC } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const QuestionDialog: FC<QuestionDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Loading..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDialog;
