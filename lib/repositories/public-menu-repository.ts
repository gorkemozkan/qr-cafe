interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
}

interface PublicCategory {
  id: number;
  name: string;
  description: string;
  sort_order: number | null;
  products: PublicProduct[];
}

interface PublicCafe {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
  currency: string | null;
  slug: string;
}

export interface PublicMenuData {
  cafe: PublicCafe;
  categories: PublicCategory[];
  generated_at: string;
}

export class PublicMenuRepository {
  async getMenuBySlug(slug: string): Promise<PublicMenuData | null> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/public/cafe/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Cafe not found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const menuData: PublicMenuData = await response.json();

      if (!menuData || !menuData.cafe) {
        return null;
      }

      return menuData;
    } catch (error) {
      // If API call fails, return null
      console.error("Failed to fetch menu data:", error);
      return null;
    }
  }
}

export const publicMenuRepository = new PublicMenuRepository();
