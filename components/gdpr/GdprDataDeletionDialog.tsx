"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (confirmed: boolean) => void;
  isLoading: boolean;
}

export function GdprDataDeletionDialog({ open, onOpenChange, onConfirm, isLoading }: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);

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
            Delete All Data
          </AlertDialogTitle>
          <AlertDialogDescription>This action will permanently delete all your data. This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>What will be deleted:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All your cafes and their settings</li>
                <li>All categories and menu organization</li>
                <li>All products and menu items</li>
                <li>Your account and profile data</li>
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
              I understand that this action is permanent and cannot be undone
            </label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!isConfirmed || isLoading}>
            {isLoading ? "Deleting..." : "Delete All Data"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
