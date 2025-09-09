import { BaseRepository } from "@/lib/repositories/base-repository";
import { type LoginSchema } from "@/lib/schema";

export class AuthRepository extends BaseRepository {
  protected readonly baseUrl = "/api/auth";

  async login(payload: LoginSchema): Promise<any> {
    return await this.post("/login", payload);
  }

  async logout(): Promise<any> {
    return await this.post("/logout");
  }
}

export const authRepository = new AuthRepository();
