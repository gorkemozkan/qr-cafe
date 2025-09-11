import { GripVertical, HelpCircle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Column } from "./types";

interface SortableMobileCardProps<T> {
  item: T;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
}

export function SortableMobileCard<T extends { id?: number | string }>({ item, columns, onRowClick, enableSorting }: SortableMobileCardProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(item.id || Math.random()),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => onRowClick?.(item);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick?.(item);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-transparent border rounded-lg p-4 space-y-3 shadow-sm ${
        onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""
      } ${isDragging ? "opacity-50" : ""}`}
      {...(onRowClick && {
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "button",
      })}
    >
      <div className="flex items-center gap-3">
        {enableSorting && (
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
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
                <div className="text-sm text-foreground text-right min-w-0">{displayValue}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
