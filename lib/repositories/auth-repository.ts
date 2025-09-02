import { type LoginSchema, type SignupSchema } from "@/lib/schema";
import { BaseRepository } from "@/lib/repositories/base-repository";

export class AuthRepository extends BaseRepository {
  protected readonly baseUrl = "/api/auth";

  async login(payload: LoginSchema) {
    return await this.post("/login", payload);
  }

  async signup(payload: SignupSchema) {
    return await this.post("/signup", payload);
  }

  async logout() {
    return await this.post("/logout");
  }
}

export const authRepository = new AuthRepository();
