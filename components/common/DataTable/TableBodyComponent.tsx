import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Column } from "./types";
import { SortableRow } from "./SortableRow";

interface TableBodyComponentProps<T extends { id?: number | string }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
}

export function TableBodyComponent<T extends { id?: number | string }>({
  data,
  columns,
  onRowClick,
  enableSorting,
}: TableBodyComponentProps<T>) {
  return (
    <TableBody>
      {data.map((row, index) => {
        const handleRowClick = () => onRowClick?.(row);
        const handleRowKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRowClick?.(row);
          }
        };

        if (enableSorting) {
          return (
            <SortableRow
              key={String(row.id)}
              item={row}
              columns={columns}
              onRowClick={onRowClick}
              enableSorting={enableSorting}
            />
          );
        }

        return (
          <TableRow
            key={String(row.id || index)}
            className={onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
            {...(onRowClick && {
              onClick: handleRowClick,
              onKeyDown: handleRowKeyDown,
              tabIndex: 0,
              role: "button",
            })}
          >
            {columns.map((column) => (
              <TableCell key={String(column.key)} className={column.className}>
                {column.cell ? column.cell(row[column.key as keyof T], row) : String(row[column.key as keyof T] ?? "-")}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
