"use client";

import { FC, useState } from "react";
import { Plus } from "lucide-react";
import { Tables } from "@/types/db";
import { CafeSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { cafeRepository } from "@/lib/repositories";
import CafeForm from "@/components/cafe/CafeForm";
import QueryKeys from "@/constants/query-keys";
import QRPreviewDialog from "@/components/cafe/QRPreviewDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CafeCreateModalProps {
  onSuccess?: (cafe: Tables<"cafes">) => void;
}

const CafeCreateModal: FC<CafeCreateModalProps> = (props) => {
  //#region States
  const [open, setOpen] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [createdCafe, setCreatedCafe] = useState<Tables<"cafes"> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //#endregion

  //#region Hooks
  const queryClient = useQueryClient();
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
          <DialogHeader>
            <DialogTitle className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-100">Create New Cafe</DialogTitle>
            <DialogDescription className="animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-150">Fill in the details below to create a new cafe.</DialogDescription>
          </DialogHeader>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200 max-h-[calc(90vh-200px)] overflow-y-auto">
            <CafeForm
              mode="create"
              onSubmit={async (data, logoFile) => {
                setIsLoading(true);

                try {
                  // First create the cafe
                  const createdCafe = await cafeRepository.create(data);

                  let finalCafe = createdCafe;

                  // Then upload the logo if provided
                  if (logoFile && createdCafe) {
                    try {
                      console.log("🖼️ Uploading logo for cafe:", createdCafe.slug);
                      const { uploadCafeLogo } = await import("@/lib/supabase/storage");
                      const uploadResult = await uploadCafeLogo(logoFile, createdCafe.slug, true);

                      if (uploadResult.success) {
                        console.log("✅ Logo uploaded successfully:", uploadResult.data.url);
                        // Update the cafe with the logo URL
                        finalCafe = await cafeRepository.update(createdCafe.id, {
                          ...data,
                          logo_url: uploadResult.data.url,
                        });
                        console.log("✅ Cafe updated with logo URL:", finalCafe.logo_url);
                      } else {
                        console.error("❌ Logo upload failed:", uploadResult.error);
                      }
                    } catch (error) {
                      console.error("💥 Logo upload error:", error);
                      // Don't fail the entire operation if logo upload fails
                    }
                  }

                  // Invalidate queries to refresh the cafe list with updated data
                  console.log("🔄 Invalidating cafe queries to refresh list...");
                  await queryClient.invalidateQueries({ queryKey: QueryKeys.cafes });

                  // Small delay to ensure cache invalidation propagates
                  await new Promise((resolve) => setTimeout(resolve, 100));
                  console.log("✅ Cache invalidation completed");

                  // Show success message
                  toast.success("Cafe created successfully!");

                  // Update local state and show success
                  setCreatedCafe(finalCafe);
                  setShowQRDialog(true);
                  setOpen(false);

                  // Call success callback with final cafe data (including logo if uploaded)
                  props.onSuccess?.(finalCafe);
                } catch (error) {
                  console.error("Failed to create cafe:", error);
                  throw error; // Re-throw so CafeForm can handle the error display
                } finally {
                  setIsLoading(false);
                }
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
