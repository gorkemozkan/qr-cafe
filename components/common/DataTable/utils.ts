import { Column } from "./types";
import { KEYBOARD_KEYS } from "./constants";

/**
 * Filters columns based on mobile visibility
 */
export function getVisibleColumns<T>(columns: Column<T>[], isMobile: boolean): Column<T>[] {
  return isMobile ? columns.filter((col) => !col.hideOnMobile) : columns;
}

/**
 * Generates a unique drag key for preventing duplicate operations
 */
export function generateDragKey(activeId: string, overId: string): string {
  return `${activeId}-${overId}`;
}

/**
 * Checks if a keyboard event is a valid activation key
 */
export function isActivationKey(key: string): boolean {
  return key === KEYBOARD_KEYS.ENTER || key === KEYBOARD_KEYS.SPACE;
}

/**
 * Handles row click with keyboard support
 */
export function handleRowInteraction<T>(event: React.KeyboardEvent | React.MouseEvent, callback: () => void, preventDefault = true): void {
  if ("key" in event) {
    // Keyboard event
    if (isActivationKey(event.key)) {
      if (preventDefault) {
        event.preventDefault();
      }
      callback();
    }
  } else {
    // Mouse event
    callback();
  }
}

/**
 * Gets a safe string representation of an item ID
 */
export function getItemId<T extends { id?: number | string }>(item: T): string {
  return String(item.id || Math.random());
}

/**
 * Safely gets a display value from a column
 */
export function getColumnDisplayValue<T>(item: T, column: Column<T>): string {
  const value = item[column.key as keyof T];
  return column.cell ? column.cell(value, item) : String(value ?? "-");
}

/**
 * Checks if a display value should be rendered
 */
export function shouldRenderDisplayValue(displayValue: string): boolean {
  return Boolean(displayValue && displayValue !== "-");
}
