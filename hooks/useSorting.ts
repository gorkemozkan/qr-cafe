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

export function useSorting<T extends BaseEntity>({ data, sortConfig, onSortOrderChange, enableSorting }: UseSortingOptions<T>): UseSortingReturn<T> {
  const [sortedData, setSortedData] = useState<T[]>([]);
  const lastDragRef = useRef<string>("");

  // Update sorted data when original data changes
  useEffect(() => {
    if (data) {
      setSortedData(data);
      lastDragRef.current = "";
    }
  }, [data]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      lastDragRef.current = "";
    };
  }, []);

  // Sensors for drag and drop
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  // Internal sorting function
  const handleInternalSort = useCallback(
    async (items: T[]) => {
      if (sortConfig?.apiUrl) {
        try {
          await SortingService.updateSortOrder(items, sortConfig);
        } catch (error) {
          console.error("Sort API call failed:", error);
          throw error;
        }
      } else {
        onSortOrderChange?.(items);
      }
    },
    [sortConfig], // Remove onSortOrderChange from dependencies to prevent unnecessary re-renders
  );

  // Handle drag end - memoized to prevent unnecessary re-renders
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const dragKey = `${active.id}-${over.id}`;

        // Prevent duplicate drag operations within the same session
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

          // Trigger sort callback - handleInternalSort handles both API and non-API cases
          handleInternalSort(newItems).catch((error) => {
            console.error("Failed to update sort order:", error);
          });

          // Reset after a short delay to allow new operations
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
