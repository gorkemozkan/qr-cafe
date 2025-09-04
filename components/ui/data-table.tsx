"use client";

import { ReactNode, useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQueryRequest } from "@/hooks/use-request";
import { HelpCircle } from "lucide-react";
import RefreshButton from "@/components/RefreshButton";

interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (value: any, row: T) => ReactNode;
  className?: string;
  tooltipText?: string;
  hideOnMobile?: boolean;
  priority?: "high" | "medium" | "low";
}

interface DataTableProps<T extends { id?: number | string }> {
  columns: Column<T>[];
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  emptyMessage?: string;
  staleTime?: number;
  gcTime?: number;
  actions?: ReactNode;
  title?: string;
  mobileBreakpoint?: number;
}

function MobileCard<T>({ item, columns }: { item: T; columns: Column<T>[] }) {
  return (
    <div className="bg-card border rounded-lg p-4 space-y-3 shadow-sm">
      {columns.map((column) => {
        const value = item[column.key as keyof T];
        const displayValue = column.cell ? column.cell(value, item) : String(value ?? "-");

        if (!displayValue || displayValue === "-") return null;

        return (
          <div key={String(column.key)} className="flex justify-between items-start gap-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 min-w-0 flex-1">
              <span className="truncate">{column.header}</span>
              {column.tooltipText && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 cursor-help text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{column.tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-foreground text-right min-w-0 ">{displayValue}</div>
          </div>
        );
      })}
    </div>
  );
}

function DataTable<T extends { id?: number | string }>({
  columns,
  queryKey,
  queryFn,
  emptyMessage = "No data available",
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000,
  actions,
  title,
  mobileBreakpoint = 768,
}: DataTableProps<T>) {
  const { data, isLoading, refetch, isRefetching } = useQueryRequest({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [mobileBreakpoint]);

  const visibleColumns = isMobile ? columns.filter((col) => !col.hideOnMobile) : columns;

  if (!isLoading && !isRefetching && (!data || data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className="flex justify-end gap-2">
          <RefreshButton loading={isRefetching} refetch={refetch} maxAttempt={3} cookieKey={queryKey.join("_")} />
          {actions}
        </div>
      </div>

      {isLoading || isRefetching ? (
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : isMobile ? (
        <div className="grid gap-4">
          {data?.map((row, index) => (
            <MobileCard key={String(row.id || index)} item={row} columns={visibleColumns} />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={String(column.key)} className={column.className}>
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {column.tooltipText && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3 w-3 cursor-help text-muted-foreground hover:text-foreground transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{column.tooltipText}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={String(row.id || index)}>
                {visibleColumns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className}>
                    {column.cell ? column.cell(row[column.key as keyof T], row) : String(row[column.key as keyof T] ?? "-")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default DataTable;
