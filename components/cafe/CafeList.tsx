"use client";

import { FC, useState } from "react";
import { QrCode } from "lucide-react";
import { Tables } from "@/types/db";
import { useRouter } from "next/navigation";
import QueryKeys from "@/constants/query-keys";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/use-request";
import DateView from "@/components/ui/date-view";
import { OptimizedImage } from "@/components/ui";
import DataTable from "@/components/ui/data-table";
import { cafeRepository } from "@/lib/repositories";
import TableActions from "@/components/ui/table-actions";
import CafeEditModal from "@/components/cafe/CafeEditModal";
import QuestionDialog from "@/components/ui/question-dialog";
import QRPreviewDialog from "@/components/cafe/CafeQRPreviewDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui";
import CafeCreateModal from "./CafeCreateModal";

const CafeList: FC = () => {
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
    successMessage: "Cafe deleted successfully!",
    invalidateQueries: [QueryKeys.cafes, QueryKeys.stats],
  });

  //#endregion

  //#region Handlers

  const handleDeleteClick = (cafe: Tables<"cafes">) => {
    setCafeToDelete(cafe);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (cafeToDelete) {
      await deleteCafe(cafeToDelete.id);
    }
  };

  const handleCategoriesClick = (cafe: Tables<"cafes">) => {
    router.push(`/admin/app/cafe/${cafe.id}/categories`);
  };

  const handleQRCodeClick = (cafe: Tables<"cafes">) => {
    setCafeForQR(cafe);
    setQRPreviewOpen(true);
  };

  //#endregion

  const columns = [
    {
      key: "logo",
      header: "Logo",
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
            onInspect={() => handleCategoriesClick(row)}
            additionalActions={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleQRCodeClick(row)} className="p-2">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View QR Code</p>
                </TooltipContent>
              </Tooltip>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="Cafes"
        actions={<CafeCreateModal />}
        columns={columns}
        queryKey={QueryKeys.cafes}
        queryFn={async () => await cafeRepository.list()}
        emptyMessage="No cafes found"
      />
      {cafeToEdit && <CafeEditModal onClose={() => setCafeToEdit(null)} cafe={cafeToEdit} onSuccess={() => setCafeToEdit(null)} />}
      <QuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Cafe"
        description={`Are you sure you want to delete "${cafeToDelete?.slug}"? This action cannot be undone.`}
        confirmText="Delete"
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
