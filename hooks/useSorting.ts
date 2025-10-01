import { useState, useRef, useEffect, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortingService } from "@/lib/services/sortingService";
import { SortConfig, BaseEntity } from "@/components/common/DataTable/types";

interface UseSortingOptions<T extends BaseEntity> {
  data: T[] | undefined;
  sortConfig?: SortConfig<T>;
  onSortOrderChange?: (items: T[]) => void;
  enableSorting?: boolean;
}

interface UseSortingReturn<T> {
  sortedData: T[];
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => void;
}

export function useSorting<T extends BaseEntity>({
  data,
  sortConfig,
  onSortOrderChange,
  enableSorting,
}: UseSortingOptions<T>): UseSortingReturn<T> {
  const [sortedData, setSortedData] = useState<T[]>([]);
  const lastDragRef = useRef<string>("");

  useEffect(() => {
    if (data) {
      setSortedData(data);
      lastDragRef.current = "";
    }
  }, [data]);

  useEffect(() => {
    return () => {
      lastDragRef.current = "";
    };
  }, []);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleInternalSort = useCallback(
    async (items: T[]) => {
      if (sortConfig?.apiUrl) {
        try {
          await SortingService.updateSortOrder(items, sortConfig);
        } catch (error) {
          throw error;
        }
      } else {
        onSortOrderChange?.(items);
      }
    },
    [sortConfig],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const dragKey = `${active.id}-${over.id}`;

        if (lastDragRef.current === dragKey) {
          return;
        }

        lastDragRef.current = dragKey;

        setSortedData((items) => {
          const oldIndex = items.findIndex((item) => String(item.id) === active.id);
          const newIndex = items.findIndex((item) => String(item.id) === over.id);

          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
            lastDragRef.current = "";
            return items;
          }

          const newItems = arrayMove(items, oldIndex, newIndex);

          handleInternalSort(newItems).catch((_error) => {});

          setTimeout(() => {
            lastDragRef.current = "";
          }, 100);

          return newItems;
        });
      }
    },
    [sortConfig, handleInternalSort],
  );

  const displayData = enableSorting ? sortedData : data || [];

  return {
    sortedData: displayData,
    sensors,
    handleDragEnd,
  };
}
