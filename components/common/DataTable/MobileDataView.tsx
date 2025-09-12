import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column } from "./types";
import { MobileCard } from "./MobileCard";
import { SortableMobileCard } from "./SortableMobileCard";

interface MobileDataViewProps<T extends { id?: number | string }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
}

export function MobileDataView<T extends { id?: number | string }>({ data, columns, onRowClick, enableSorting }: MobileDataViewProps<T>) {
  if (enableSorting) {
    return (
      <SortableContext items={data.map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {data.map((row) => (
            <SortableMobileCard key={String(row.id)} item={row} columns={columns} onRowClick={onRowClick} enableSorting={enableSorting} />
          ))}
        </div>
      </SortableContext>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((row, index) => (
        <MobileCard key={String(row.id || index)} item={row} columns={columns} onRowClick={onRowClick} />
      ))}
    </div>
  );
}
