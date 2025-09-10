import { BaseRepository } from "@/lib/repositories/base-repository";

export interface UserExportData {
  user: {
    id: string;
    email: string | undefined;
    created_at: string | undefined;
    last_sign_in_at: string | undefined;
  };
  cafes: any[];
  categories: any[];
  products: any[];
  export_date: string;
  gdpr_compliant: boolean;
}

export class GdprRepository extends BaseRepository {
  protected readonly baseUrl = "/api/gdpr";

  async exportUserData() {
    return await this.get("/export");
  }

  async deleteUserData(confirmDeletion: boolean = false): Promise<{ success: boolean; message: string; deleted_at?: string }> {
    return await this.post("/delete", { confirm_deletion: confirmDeletion });
  }
}

export const gdprRepository = new GdprRepository();
