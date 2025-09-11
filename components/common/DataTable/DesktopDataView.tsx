import { Table, TableBody } from "@/components/ui/table";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column } from "./types";
import { TableHeaderComponent } from "./TableHeaderComponent";
import { TableBodyComponent } from "./TableBodyComponent";
import { SortableRow } from "./SortableRow";

interface DesktopDataViewProps<T extends { id?: number | string }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
}

export function DesktopDataView<T extends { id?: number | string }>({ data, columns, onRowClick, enableSorting }: DesktopDataViewProps<T>) {
  if (enableSorting) {
    return (
      <Table>
        <TableHeaderComponent columns={columns} enableSorting={enableSorting} />
        <TableBody>
          <SortableContext items={data.map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
            {data.map((row) => (
              <SortableRow key={String(row.id)} item={row} columns={columns} onRowClick={onRowClick} enableSorting={enableSorting} />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeaderComponent columns={columns} enableSorting={false} />
      <TableBodyComponent data={data} columns={columns} onRowClick={onRowClick} enableSorting={false} />
    </Table>
  );
}
