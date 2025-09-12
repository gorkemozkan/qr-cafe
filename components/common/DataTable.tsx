"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { useDataTable } from "@/hooks/useDataTable";
import { useResponsive } from "@/hooks/useResponsive";
import { useSorting } from "@/hooks/useSorting";
import { DataTableHeader } from "./DataTable/DataTableHeader";
import { DataTableContent } from "./DataTable/DataTableContent";
import { DataTableProps } from "./DataTable/types";
import { DEFAULT_EMPTY_MESSAGE, DEFAULT_MOBILE_BREAKPOINT, DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from "./DataTable/constants";
function DataTable<T extends { id?: number | string }>({
  columns,
  queryKey,
  queryFn,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  staleTime = DEFAULT_STALE_TIME,
  gcTime = DEFAULT_GC_TIME,
  actions,
  title,
  mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
  onRowClick,
  enableSorting,
  sortConfig,
  onSortOrderChange,
}: DataTableProps<T>) {
  const t = useTranslations();

  const resolvedEmptyMessage =
    emptyMessage.startsWith("common.") ||
    emptyMessage.startsWith("product.") ||
    emptyMessage.startsWith("category.") ||
    emptyMessage.startsWith("cafe.")
      ? t(emptyMessage)
      : emptyMessage;

  const { data, isLoading, refetch, isRefetching } = useDataTable({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
  });

  const { isMobile } = useResponsive({ breakpoint: mobileBreakpoint });

  const { sortedData, sensors, handleDragEnd } = useSorting({
    data,
    sortConfig,
    onSortOrderChange,
    enableSorting,
  });

  return (
    <div className="space-y-4">
      <DataTableHeader title={title} actions={actions} isRefetching={isRefetching} onRefetch={refetch} />

      {enableSorting ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <DataTableContent
            data={sortedData}
            columns={columns}
            isLoading={isLoading}
            isRefetching={isRefetching}
            emptyMessage={resolvedEmptyMessage}
            isMobile={isMobile}
            onRowClick={onRowClick}
            enableSorting={enableSorting}
          />
        </DndContext>
      ) : (
        <DataTableContent
          data={sortedData}
          columns={columns}
          isLoading={isLoading}
          isRefetching={isRefetching}
          emptyMessage={resolvedEmptyMessage}
          isMobile={isMobile}
          onRowClick={onRowClick}
          enableSorting={false}
        />
      )}
    </div>
  );
}

export default DataTable;
