export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      cafes: {
        Row: {
          id: number;
          created_at: string;
          user_id: string | null;
          slug: string;
          description: string | null;
          is_active: boolean;
          logo_url: string | null;
          name: string | null;
          currency: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id?: string | null;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          logo_url?: string | null;
          name?: string | null;
          currency?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: string | null;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          logo_url?: string | null;
          name?: string | null;
          currency?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cafes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: number;
          created_at: string;
          cafe_id: number;
          name: string;
          description: string;
          sort_order: number | null;
          is_active: boolean;
          user_id: string;
          image_url: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          cafe_id: number;
          name: string;
          description: string;
          sort_order?: number | null;
          is_active?: boolean;
          user_id: string;
          image_url?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          cafe_id?: number;
          name?: string;
          description?: string;
          sort_order?: number | null;
          is_active?: boolean;
          user_id?: string;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "categories_cafe_id_fkey";
            columns: ["cafe_id"];
            isOneToOne: false;
            referencedRelation: "cafes";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: number;
          created_at: string;
          cafe_id: number;
          category_id: number;
          name: string;
          description: string | null;
          price: number | null;
          image_url: string | null;
          is_available: boolean;
          user_id: string;
          calory: number | null;
          preparation_time: number | null;
          tags: string[] | null;
          allergens: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          cafe_id: number;
          category_id: number;
          name: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          is_available?: boolean;
          user_id: string;
          calory?: number | null;
          preparation_time?: number | null;
          tags?: string[] | null;
          allergens?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          cafe_id?: number;
          category_id?: number;
          name?: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          is_available?: boolean;
          user_id?: string;
          calory?: number | null;
          preparation_time?: number | null;
          tags?: string[] | null;
          allergens?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_cafe_id_fkey";
            columns: ["cafe_id"];
            isOneToOne: false;
            referencedRelation: "cafes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
