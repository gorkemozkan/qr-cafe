"use client";

import { FC, useState } from "react";
import { Tables } from "@/types/db";
import { useRouter } from "next/navigation";
import QueryKeys from "@/constants/query-keys";
import { useRequest } from "@/hooks/use-request";
import DateView from "@/components/ui/date-view";
import { OptimizedImage } from "@/components/ui";
import DataTable from "@/components/ui/data-table";
import { cafeRepository } from "@/lib/repositories";
import TableActions from "@/components/ui/table-actions";
import CafeEditModal from "@/components/cafe/CafeEditModal";
import QuestionDialog from "@/components/ui/question-dialog";
import QRPreviewDialog from "@/components/cafe/QRPreviewDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    invalidateQueries: QueryKeys.cafes,
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
        <div>
          {row.logo_url ? (
            <OptimizedImage
              src={row.logo_url}
              alt={`${row.slug} logo`}
              width={30}
              height={30}
              objectFit="contain"
              className="rounded-md border border-border"
              fallbackSrc="/placeholder-logo.svg"
              showSkeleton={true}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No logo</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      cell: (value: any) => <span className="font-mono text-sm block truncate w-max">{value}</span>,
    },
    {
      key: "currency",
      header: "Currency",
      cell: (value: any) => value || "-",
    },
    {
      key: "is_active",
      header: "Status",
      cell: (value: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      cell: (value: any) => <DateView date={value} format="detailed" />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (_: any, row: Tables<"cafes">) => (
        <TableActions
          additionalActions={
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => handleQRCodeClick(row)} className="p-2">
                  <QrCode className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View QR Code for {row.slug}</p>
              </TooltipContent>
            </Tooltip>
          }
          onEdit={() => setCafeToEdit(row)}
          onDelete={() => handleDeleteClick(row)}
          onInspect={() => handleCategoriesClick(row)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Cafes</h2>
      </div>
      <DataTable columns={columns} queryKey={QueryKeys.cafes} queryFn={async () => await cafeRepository.list()} emptyMessage="No cafes found" />
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
