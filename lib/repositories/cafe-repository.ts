import { type CafeSchema } from "@/lib/schema";
import { BaseRepository } from "@/lib/repositories/base-repository";
import { Tables } from "@/types/db";

export class CafeRepository extends BaseRepository {
  protected readonly baseUrl = "/api/cafe";

  async create(payload: CafeSchema): Promise<Tables<"cafes">> {
    return await this.post<Tables<"cafes">>("/create", payload);
  }

  async update(id: number, payload: Partial<CafeSchema>): Promise<Tables<"cafes">> {
    return await this.put<Tables<"cafes">>("/update", { id, ...payload });
  }

  async getById(id: number): Promise<Tables<"cafes">> {
    return await this.get<Tables<"cafes">>(`/${id}`);
  }

  async getBySlug(slug: string): Promise<Tables<"cafes">> {
    return await this.get<Tables<"cafes">>(`/slug/${slug}`);
  }

  async list(): Promise<Tables<"cafes">[]> {
    return await this.get<Tables<"cafes">[]>("/");
  }

  async remove(id: number): Promise<boolean> {
    return await this.delete<boolean>(`/${id}`);
  }
}

export const cafeRepository = new CafeRepository();
