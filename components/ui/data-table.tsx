"use client";

import { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryRequest } from "@/hooks/use-request";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import RefreshButton from "@/components/RefreshButton";

interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (value: any, row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id?: number | string }> {
  columns: Column<T>[];
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  emptyMessage?: string;
  staleTime?: number;
  gcTime?: number;
}

function DataTable<T extends { id?: number | string }>({
  columns,
  queryKey,
  queryFn,
  emptyMessage = "No data available",
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000,
}: DataTableProps<T>) {
  const { data, isLoading, refetch, isRefetching } = useQueryRequest({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
  });

  if (!isLoading && !isRefetching && (!data || data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RefreshButton loading={isRefetching} refetch={refetch} maxAttempt={3} />
      </div>

      {isLoading || isRefetching ? (
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={String(row.id || index)}>
                {columns.map((column) => (
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
