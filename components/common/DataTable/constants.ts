// Default configuration values
export const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const DEFAULT_GC_TIME = 10 * 60 * 1000; // 10 minutes
export const DEFAULT_MOBILE_BREAKPOINT = 768; // px
export const DEFAULT_EMPTY_MESSAGE = "No data available";

// Drag and drop constants
export const DRAG_RESET_DELAY = 100; // ms
export const DRAG_KEY_SEPARATOR = "-";

// Sortable context configuration
export const SORTING_STRATEGY = "verticalListSortingStrategy";

// Keyboard navigation keys
export const KEYBOARD_KEYS = {
  ENTER: "Enter",
  SPACE: " ",
} as const;
