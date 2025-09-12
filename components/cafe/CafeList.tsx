"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import CafeCreateSheet from "@/components/cafe/CafeCreateSheet";
import CafeEditSheet from "@/components/cafe/CafeEditSheet";
import QRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import DataTable from "@/components/common/DataTable";
import DateView from "@/components/common/DateView";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import QuestionDialog from "@/components/common/QuestionDialog";
import TableActions from "@/components/common/TableActions";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRequest } from "@/hooks/useRequest";
import QueryKeys from "@/lib/query";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { Tables } from "@/types/db";
import { useRouter } from "next/navigation";
import CafeQRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const CafeList: FC = () => {
  const t = useTranslations();
  const tCafe = useTranslations("cafe");
  const tCommon = useTranslations("common");

  //#region Hooks

  const router = useRouter();

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
    successMessage: tCafe("cafeDeleted"),
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
        header: tCafe("table.logo"),
        cell: (_: any, row: Tables<"cafes">) => (
          <>
            {row.logo_url ? (
              <OptimizedImage
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
                <span className="text-[8px] text-center text-muted-foreground">{tCafe("table.noLogo")}</span>
              </div>
            )}
          </>
        ),
      },
      {
        key: "name",
        header: tCafe("table.name"),
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
        header: tCafe("table.currency"),
        cell: (value: any) => value || "-",
      },
      {
        key: "is_active",
        header: tCafe("table.status"),
        tooltipText: tCafe("table.statusTooltip"),
        cell: (value: any) => <Badge variant={value ? "active" : "inactive"}>{value ? tCommon("active") : tCommon("inactive")}</Badge>,
      },
      {
        key: "created_at",
        header: tCafe("table.created"),
        tooltipText: tCafe("table.createdTooltip"),
        cell: (value: any) => <DateView date={value} format="relative" />,
      },
      {
        key: "actions",
        header: tCafe("table.actions"),
        className: "flex justify-end",
        cell: (_: any, row: Tables<"cafes">) => (
          <TableActions
            onEdit={() => setCafeToEdit(row)}
            onDelete={() => handleDeleteClick(row)}
            to={`/admin/app/cafe/${row.id}/categories`}
            additionalActions={
              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  handleQRCodeClick(row);
                }}
                className="h-8 w-8 p-0"
              >
                <QrCode className="h-4 w-4" />
                <span className="sr-only">{tCafe("table.qrCode")}</span>
              </Button>
            }
          />
        ),
      },
    ],
    [handleDeleteClick, handleQRCodeClick, t, tCafe, tCommon],
  );

  return (
    <div>
      {cafeForQR && <CafeQRPreviewDialog key="qr-preview" open={qrPreviewOpen} slug={cafeForQR?.slug} onOpenChange={setQRPreviewOpen} />}
      <DataTable
        onRowClick={(row) => {
          router.push(`/admin/app/cafe/${row.id}/categories`);
        }}
        title={tCafe("title")}
        actions={<CafeCreateSheet />}
        columns={columns}
        queryKey={QueryKeys.cafes}
        queryFn={async () => await cafeRepository.list()}
        emptyMessage={tCafe("noCafes")}
      />
      {cafeToEdit && <CafeEditSheet onClose={() => setCafeToEdit(null)} cafe={cafeToEdit} onSuccess={() => setCafeToEdit(null)} />}
      <QuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={tCafe("deleteDialog.title")}
        description={tCafe("deleteDialog.description", { slug: cafeToDelete?.slug || "" })}
        confirmText={tCafe("deleteDialog.confirmText")}
        confirmLoadingText={tCafe("deleteDialog.deleting")}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        cancelText={tCommon("cancel")}
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
