import { SortConfig, BaseEntity } from "@/components/common/DataTable/types";

export const SortingService = {
  async updateSortOrder<T extends BaseEntity>(items: T[], sortConfig: SortConfig<T>): Promise<void> {
    if (!sortConfig.apiUrl) {
      throw new Error("API URL is required for sorting");
    }

    try {
      const ids = sortConfig.getIdsFromItems ? sortConfig.getIdsFromItems(items) : items.map((item) => item.id).filter(Boolean);

      const payload = {
        ...sortConfig.additionalParams,
        [sortConfig.additionalParams?.idsKey || "ids"]: ids,
      };

      const method = sortConfig.method || "PUT";
      const url = sortConfig.apiUrl;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Sort API call failed: ${response.status}`);
      }

      await response.json();
    } catch (error) {
      throw error;
    }
  },
};
