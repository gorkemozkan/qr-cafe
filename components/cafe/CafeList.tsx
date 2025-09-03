"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/db";
import { useRequest } from "@/hooks/use-request";
import { cafeRepository } from "@/lib/repositories";
import QueryKeys from "@/constants/query-keys";
import DataTable from "@/components/ui/data-table";
import QuestionDialog from "@/components/ui/question-dialog";
import CafeEditModal from "@/components/cafe/CafeEditModal";
import TableActions from "@/components/ui/table-actions";
import DateView from "@/components/ui/date-view";
import { OptimizedImage } from "@/components/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CafeList: FC = () => {
  const router = useRouter();
  //#region States

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [cafeToDelete, setCafeToDelete] = useState<Tables<"cafes"> | null>(null);

  const [cafeToEdit, setCafeToEdit] = useState<Tables<"cafes"> | null>(null);

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
      cell: (value: any) => <span className="font-mono text-sm bg-muted px-2 py-1 rounded block truncate w-max">{value}</span>,
    },
    {
      key: "description",
      header: "Description",
      cell: (value: any) => (
        <div className="w-max">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded block truncate">{value}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono">{value}</p>
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
      cell: (value: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      cell: (value: any) => <DateView date={value} format="short" />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (_: any, row: Tables<"cafes">) => (
        <TableActions 
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
    </div>
  );
};

export default CafeList;
