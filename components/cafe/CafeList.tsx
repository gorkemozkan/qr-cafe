"use client";

import { FC, useState, useMemo, useCallback } from "react";
import { QrCode } from "lucide-react";
import { Tables } from "@/types/db";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import QueryKeys from "@/lib/query";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/useRequest";
import DateView from "@/components/DateView";
import { OptimizedImage } from "@/components/OptimizedImage";
import DataTable from "@/components/DataTable";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import TableActions from "@/components/TableActions";
import CafeEditSheet from "@/components/cafe/CafeEditSheet";
import QuestionDialog from "@/components/QuestionDialog";
import QRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import CafeCreateSheet from "@/components/cafe/CafeCreateSheet";
import ExternalLinkButton from "@/components/ExternalLinkButton";
import { nextPublicBaseUrl } from "@/lib/env";

const CafeList: FC = () => {
  //#region Hooks

  const router = useRouter();

  const t = useTranslations("cafe");

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
    successMessage: t("delete.successMessage"),
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

  const handleCategoriesClick = useCallback(
    (cafe: Tables<"cafes">) => {
      router.push(`/admin/app/cafe/${cafe.id}/categories`);
    },
    [router],
  );

  const handleQRCodeClick = useCallback((cafe: Tables<"cafes">) => {
    setCafeForQR(cafe);
    setQRPreviewOpen(true);
  }, []);

  //#endregion

  const columns = useMemo(
    () => [
      {
        key: "logo",
        header: t("table.headers.logo"),
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
                <span className="text-[8px] text-center text-muted-foreground">{t("table.logo.noLogo")}</span>
              </div>
            )}
          </>
        ),
      },
      {
        key: "name",
        header: t("table.headers.name"),
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
        header: t("table.headers.currency"),
        cell: (value: any) => value || "-",
      },
      {
        key: "is_active",
        header: t("table.headers.status"),
        tooltipText: t("table.status.activeTooltip"),
        cell: (value: any) => <Badge variant={value ? "active" : "inactive"}>{value ? t("table.status.active") : t("table.status.inactive")}</Badge>,
      },
      {
        key: "created_at",
        header: t("table.headers.created"),
        tooltipText: t("table.status.createdTooltip"),
        cell: (value: any) => <DateView date={value} format="detailed" />,
      },
      {
        key: "actions",
        header: t("table.headers.actions"),
        className: "flex justify-end",
        cell: (_: any, row: Tables<"cafes">) => (
          <div className="flex justify-end">
            <TableActions
              onEdit={() => setCafeToEdit(row)}
              onDelete={() => handleDeleteClick(row)}
              onInspect={() => handleCategoriesClick(row)}
              additionalActions={
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleQRCodeClick(row)} className="p-2">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("qr.preview.viewTooltip")}</p>
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
    [t, handleDeleteClick, handleCategoriesClick, handleQRCodeClick],
  );

  return (
    <div>
      <DataTable
        title={t("title")}
        actions={<CafeCreateSheet />}
        columns={columns}
        queryKey={QueryKeys.cafes}
        queryFn={async () => await cafeRepository.list()}
        emptyMessage={t("noCafes")}
      />
      {cafeToEdit && <CafeEditSheet onClose={() => setCafeToEdit(null)} cafe={cafeToEdit} onSuccess={() => setCafeToEdit(null)} />}
      <QuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("delete.title")}
        description={t("delete.confirmMessage", { slug: cafeToDelete?.slug || "" })}
        confirmText={t("deleteCafe")}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
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
