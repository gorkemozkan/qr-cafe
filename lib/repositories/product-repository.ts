import { type ProductSchema } from "@/lib/schema";
import { BaseRepository } from "@/lib/repositories/base-repository";
import { Tables } from "@/types/db";

export class ProductRepository extends BaseRepository {
  protected readonly baseUrl = "/api/product";

  async create(cafeId: number, payload: ProductSchema) {
    return await this.post<Tables<"products">>("/create", { cafe_id: cafeId, ...payload });
  }

  async update(id: number, payload: Partial<ProductSchema>) {
    return await this.put<Tables<"products">>("/update", { id, ...payload });
  }

  async getById(id: number) {
    return await this.get<Tables<"products">>(`/${id}`);
  }

  async listByCategory(categoryId: number) {
    return await this.get<Tables<"products">[]>(`/category/${categoryId}`);
  }

  async listByCafe(cafeId: number) {
    return await this.get<Tables<"products">[]>(`/cafe/${cafeId}`);
  }

  async remove(id: number): Promise<boolean> {
    return await this.delete<boolean>(`/${id}`);
  }
}

export const productRepository = new ProductRepository();
