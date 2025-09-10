"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (confirmed: boolean) => void;
  isLoading: boolean;
}

export function GdprDataDeletionDialog({ open, onOpenChange, onConfirm, isLoading }: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const tGdpr = useTranslations("gdpr");

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm(true);
      setIsConfirmed(false);
    }
  };

  const handleCancel = () => {
    setIsConfirmed(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 ">
            <AlertTriangle className="h-5 w-5" />
            {tGdpr("delete.dialogTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>{tGdpr("delete.dialogDescription")}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{tGdpr("delete.whatWillBeDeleted")}</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{tGdpr("delete.deletedItems.cafes")}</li>
                <li>{tGdpr("delete.deletedItems.categories")}</li>
                <li>{tGdpr("delete.deletedItems.products")}</li>
                <li>{tGdpr("delete.deletedItems.account")}</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm-deletion"
              checked={isConfirmed}
              onCheckedChange={(checked: boolean) => setIsConfirmed(checked === true)}
              disabled={isLoading}
            />
            <label htmlFor="confirm-deletion" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {tGdpr("delete.confirmationText")}
            </label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {tGdpr("buttons.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!isConfirmed || isLoading}>
            {isLoading ? tGdpr("delete.deletingButton") : tGdpr("delete.deleteButton")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
