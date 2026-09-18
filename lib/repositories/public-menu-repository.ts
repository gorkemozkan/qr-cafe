import { nextPublicBaseUrl } from "@/lib/env";
import { BaseRepository } from "@/lib/repositories/base-repository";

export interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
  calory: number | null;
  preparation_time: number | null;
  tags: string[] | null;
  allergens: string[] | null;
  updated_at: string;
}

export interface PublicCategory {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  image_url: string | null;
  products: PublicProduct[];
}

export interface PublicCafe {
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

export class PublicMenuRepository extends BaseRepository {
  protected readonly baseUrl = `${nextPublicBaseUrl}/api/public/cafe`;

  // Returns null for an unknown slug so callers can render a 404. Any other
  // failure keeps bubbling up - a broken database must not look like an empty
  // menu.
  async getMenuBySlug(slug: string): Promise<PublicMenuData | null> {
    try {
      return await this.get<PublicMenuData>(`/${slug}`);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAllMenuSlugs() {
    return await this.get<string[]>(`/`);
  }
}

export const publicMenuRepository = new PublicMenuRepository();
