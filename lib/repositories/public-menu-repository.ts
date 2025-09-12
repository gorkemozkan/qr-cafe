import { nextPublicBaseUrl } from "@/lib/env";
import { BaseRepository } from "@/lib/repositories/base-repository";

export interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
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

  async getMenuBySlug(slug: string) {
    console.log("PublicMenuRepository - Base URL:", this.baseUrl);
    const fullUrl = `${this.baseUrl}/${slug}`;
    console.log("PublicMenuRepository - Full request URL:", fullUrl);

    return await this.get<PublicMenuData>(`/${slug}`);
  }
}

export const publicMenuRepository = new PublicMenuRepository();
