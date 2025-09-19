"use client";

import { Tables } from "@/types/db";
import QueryKeys from "@/lib/query";
import { QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/useRequest";
import DateView from "@/components/common/DateView";
import DataTable from "@/components/common/DataTable";
import { FC, useCallback, useMemo, useState } from "react";
import CafeEditSheet from "@/components/cafe/CafeEditSheet";
import TableActions from "@/components/common/TableActions";
import CafeCreateSheet from "@/components/cafe/CafeCreateSheet";
import QuestionDialog from "@/components/common/QuestionDialog";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import QRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import CafeQRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";

const CafeList: FC = () => {
  //#region Hooks

  const router = useRouter();

  const t = useTranslations();

  const tCafe = useTranslations("cafe");

  const tCommon = useTranslations("common");

  //#endregion

  //#region States

  const [qrPreviewOpen, setQRPreviewOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [cafeToDelete, setCafeToDelete] = useState<Tables<"cafes"> | null>(null);

  const [cafeToEdit, setCafeToEdit] = useState<Tables<"cafes"> | null>(null);

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
          <OptimizedImage
            fill
            width={40}
            height={40}
            src={row.logo_url}
            sizes="40px"
            showSkeleton={true}
            alt={`${row.slug} logo`}
            className="rounded border border-border"
          />
        ),
      },
      {
        key: "name",
        header: tCafe("table.name"),
        cell: (value) => <p className="font-mono text-sm">{value}</p>,
      },
      {
        key: "currency",
        header: tCafe("table.currency"),
        cell: (value) => <p className="font-mono text-sm">{value}</p>,
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
        cell: (value: any) => <DateView date={value} format="detailed" />,
      },
      {
        key: "actions",
        header: tCafe("table.actions"),
        className: "flex justify-end",
        cell: (_: any, row: Tables<"cafes">) => (
          <TableActions
            onEdit={() => setCafeToEdit(row)}
            onDelete={() => handleDeleteClick(row)}
            additionalActions={
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(event) => {
                  event.stopPropagation();
                  handleQRCodeClick(row);
                }}
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
    <>
      {cafeForQR && <CafeQRPreviewDialog key="qr-preview" open={qrPreviewOpen} slug={cafeForQR?.slug} onOpenChange={setQRPreviewOpen} />}
      <DataTable
        onRowClick={(row) => {
          router.push(`/admin/app/cafe/${row.id}/categories`);
        }}
        columns={columns}
        title={tCafe("title")}
        queryKey={QueryKeys.cafes}
        actions={<CafeCreateSheet />}
        queryFn={async () => await cafeRepository.list()}
      />
      {cafeToEdit && <CafeEditSheet onClose={() => setCafeToEdit(null)} cafe={cafeToEdit} onSuccess={() => setCafeToEdit(null)} />}
      <QuestionDialog
        isLoading={isDeleting}
        open={deleteDialogOpen}
        cancelText={tCommon("cancel")}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteDialogOpen}
        title={tCafe("deleteDialog.title")}
        confirmText={tCafe("deleteDialog.confirmText")}
        confirmLoadingText={tCafe("deleteDialog.deleting")}
        description={tCafe("deleteDialog.description", { slug: cafeToDelete?.slug || "" })}
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
    </>
  );
};

export default CafeList;
