import { Column } from "./types";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { MobileDataView } from "./MobileDataView";
import { DesktopDataView } from "./DesktopDataView";

interface DataTableContentProps<T extends { id?: number | string }> {
  data: T[] | undefined;
  columns: Column<T>[];
  isLoading: boolean;
  isRefetching: boolean;
  emptyMessage: string;
  isMobile: boolean;
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
}

export function DataTableContent<T extends { id?: number | string }>({
  data,
  columns,
  isLoading,
  isRefetching,
  emptyMessage,
  isMobile,
  onRowClick,
  enableSorting,
}: DataTableContentProps<T>) {
  const visibleColumns = isMobile ? columns.filter((col) => !col.hideOnMobile) : columns;
  const displayData = enableSorting ? data || [] : data || [];
  const isEmpty = !isLoading && !isRefetching && (!data || data.length === 0);

  if (isEmpty) {
    return <EmptyState message={emptyMessage} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isMobile) {
    return <MobileDataView data={displayData} columns={visibleColumns} onRowClick={onRowClick} enableSorting={enableSorting} />;
  }

  return <DesktopDataView data={displayData} columns={visibleColumns} onRowClick={onRowClick} enableSorting={enableSorting} />;
}
