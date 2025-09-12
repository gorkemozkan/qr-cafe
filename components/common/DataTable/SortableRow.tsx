import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "@/components/ui/table";
import { Column } from "./types";

interface SortableRowProps<T extends { id?: number | string }> {
  item: T;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
}

export function SortableRow<T extends { id?: number | string }>({ item, columns, onRowClick, enableSorting }: SortableRowProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(item.id || Math.random()),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRowClick = () => {
    onRowClick?.(item);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick?.(item);
    }
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""} ${isDragging ? "opacity-50 z-50" : ""}`}
      {...(onRowClick && {
        onClick: handleRowClick,
        onKeyDown: handleRowKeyDown,
        tabIndex: 0,
        role: "button",
      })}
    >
      {enableSorting && (
        <TableCell className="w-8">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
            <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </div>
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell key={String(column.key)} className={column.className}>
          {column.cell ? column.cell(item[column.key as keyof T], item) : String(item[column.key as keyof T] ?? "-")}
        </TableCell>
      ))}
    </TableRow>
  );
}
