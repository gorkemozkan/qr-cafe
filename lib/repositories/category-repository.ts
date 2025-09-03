import { type CategorySchema } from "@/lib/schema";
import { BaseRepository } from "@/lib/repositories/base-repository";
import { Tables } from "@/types/db";

export class CategoryRepository extends BaseRepository {
  protected readonly baseUrl = "/api/category";

  async create(cafeId: number, payload: CategorySchema): Promise<Tables<"categories">> {
    return await this.post<Tables<"categories">>("/create", { cafe_id: cafeId, ...payload });
  }

  async update(id: number, payload: Partial<CategorySchema>): Promise<Tables<"categories">> {
    return await this.put<Tables<"categories">>("/update", { id, ...payload });
  }

  async getById(id: number): Promise<Tables<"categories">> {
    return await this.get<Tables<"categories">>(`/${id}`);
  }

  async listByCafe(cafeId: number): Promise<Tables<"categories">[]> {
    return await this.get<Tables<"categories">[]>(`/cafe/${cafeId}`);
  }

  async remove(id: number): Promise<boolean> {
    return await this.delete<boolean>(`/${id}`);
  }

  async updateSortOrder(cafeId: number, categoryIds: number[]): Promise<boolean> {
    return await this.put<boolean>("/sort-order", { cafe_id: cafeId, category_ids: categoryIds });
  }
}

export const categoryRepository = new CategoryRepository();
