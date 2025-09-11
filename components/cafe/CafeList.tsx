"use client";

import { QrCode } from "lucide-react";
import { FC, useCallback, useMemo, useState } from "react";
import CafeCreateSheet from "@/components/cafe/CafeCreateSheet";
import CafeEditSheet from "@/components/cafe/CafeEditSheet";
import QRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import DataTable from "@/components/common/DataTable";
import DateView from "@/components/common/DateView";
import ExternalLinkButton from "@/components/common/ExternalLinkButton";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import QuestionDialog from "@/components/common/QuestionDialog";
import TableActions from "@/components/common/TableActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRequest } from "@/hooks/useRequest";
import { nextPublicBaseUrl } from "@/lib/env";
import QueryKeys from "@/lib/query";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { Tables } from "@/types/db";

const CafeList: FC = () => {
  //#region Hooks

  //#endregion

  //#region States

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [cafeToDelete, setCafeToDelete] = useState<Tables<"cafes"> | null>(null);

  const [cafeToEdit, setCafeToEdit] = useState<Tables<"cafes"> | null>(null);

  const [qrPreviewOpen, setQRPreviewOpen] = useState(false);

  const [cafeForQR, setCafeForQR] = useState<Tables<"cafes"> | null>(null);

  //#endregion

  //#region Request

  const { isLoading: isDeleting, execute: deleteCafe } = useRequest({
    mutationFn: async (id: number) => {
      return await cafeRepository.remove(id);
    },
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setCafeToDelete(null);
    },
    successMessage: "Cafe deleted successfully!",
    optimisticUpdate: {
      queryKey: QueryKeys.cafes,
      updateFn: (oldData: Tables<"cafes">[], cafeId: number) => oldData.filter((cafe) => cafe.id !== cafeId),
    },
    invalidateQueries: [QueryKeys.stats],
  });

  //#endregion

  //#region Handlers

  const handleDeleteClick = useCallback((cafe: Tables<"cafes">) => {
    setCafeToDelete(cafe);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (cafeToDelete) {
      await deleteCafe(cafeToDelete.id);
    }
  }, [cafeToDelete, deleteCafe]);

  const handleQRCodeClick = useCallback((cafe: Tables<"cafes">) => {
    setCafeForQR(cafe);
    setQRPreviewOpen(true);
  }, []);

  //#endregion

  const columns = useMemo(
    () => [
      {
        key: "logo",
        header: "Logo",
        cell: (_: any, row: Tables<"cafes">) => (
          <>
            {row.logo_url ? (
              <OptimizedImage
                clickable
                src={row.logo_url}
                alt={`${row.slug} logo`}
                width={40}
                height={40}
                className="rounded-md border border-border w-10 h-10 "
                objectFit="cover"
                fallbackSrc="/placeholder-logo.svg"
                showSkeleton={true}
              />
            ) : (
              <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center ">
                <span className="text-[8px] text-center text-muted-foreground">No Logo</span>
              </div>
            )}
          </>
        ),
      },
      {
        key: "name",
        header: "Name",
        cell: (value: any) => (
          <div className="w-24">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate text-sm">{value}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{value}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      },
      {
        key: "currency",
        header: "Currency",
        cell: (value: any) => value || "-",
      },
      {
        key: "is_active",
        header: "Status",
        tooltipText: "Status of the cafe, used for visibility",
        cell: (value: any) => <Badge variant={value ? "active" : "inactive"}>{value ? "Active" : "Inactive"}</Badge>,
      },
      {
        key: "created_at",
        header: "Created",
        tooltipText: "Date and time when the cafe was created",
        cell: (value: any) => <DateView date={value} format="detailed" />,
      },
      {
        key: "actions",
        header: "Actions",
        className: "flex justify-end",
        cell: (_: any, row: Tables<"cafes">) => (
          <div className="flex justify-end">
            <TableActions
              onEdit={() => setCafeToEdit(row)}
              onDelete={() => handleDeleteClick(row)}
              to={`/admin/app/cafe/${row.id}/categories`}
              additionalActions={
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="lg" onClick={() => handleQRCodeClick(row)} className="p-2">
                        <QrCode className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View QR Code</p>
                    </TooltipContent>
                  </Tooltip>
                  <ExternalLinkButton url={`${nextPublicBaseUrl}/${row.slug}`} />
                </div>
              }
            />
          </div>
        ),
      },
    ],
    [handleDeleteClick, handleQRCodeClick],
  );

  return (
    <div>
      <DataTable
        title="Cafes"
        actions={<CafeCreateSheet />}
        columns={columns}
        queryKey={QueryKeys.cafes}
        queryFn={async () => await cafeRepository.list()}
        emptyMessage="No cafes found"
      />
      {cafeToEdit && <CafeEditSheet onClose={() => setCafeToEdit(null)} cafe={cafeToEdit} onSuccess={() => setCafeToEdit(null)} />}
      <QuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Cafe"
        description={`Are you sure you want to delete "${cafeToDelete?.slug || ""}"? This action cannot be undone.`}
        confirmText="Delete Cafe"
        confirmLoadingText="Deleting..."
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        cancelText="Cancel"
      />
      {cafeForQR && (
        <QRPreviewDialog
          open={qrPreviewOpen}
          slug={cafeForQR.slug}
          onOpenChange={(open) => {
            setQRPreviewOpen(open);
            if (!open) {
              setCafeForQR(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default CafeList;
