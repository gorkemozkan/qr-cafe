import { type CafeSchema } from "@/lib/schema";
import { BaseRepository } from "@/lib/repositories/base-repository";
import { Tables } from "@/types/db";

export class CafeRepository extends BaseRepository {
  protected readonly baseUrl = "/api/cafe";

  async create(payload: CafeSchema) {
    return await this.post<Tables<"cafes">>("/create", payload);
  }

  async update(id: number, payload: Partial<CafeSchema>) {
    return await this.put<Tables<"cafes">>("/update", { id, ...payload });
  }

  async getById(id: number) {
    return await this.get<Tables<"cafes">>(`/${id}`);
  }

  async getBySlug(slug: string) {
    return await this.get<Tables<"cafes">>(`/slug/${slug}`);
  }

  async list() {
    return await this.get<Tables<"cafes">[]>("/");
  }

  async remove(id: number) {
    return await this.delete<boolean>(`/${id}`);
  }
}

export const cafeRepository = new CafeRepository();
