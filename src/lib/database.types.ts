// Database types for the FuelMate Pro Supabase schema.
// Mirrors supabase/schema.sql — keep in sync if you alter tables.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: { id: string; full_name?: string | null; avatar_url?: string | null };
        Update: Partial<{ full_name: string | null; avatar_url: string | null }>;
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          brand: string | null;
          model: string | null;
          year: number | null;
          fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid" | null;
          plate: string | null;
          odometer: number;
          image_url: string | null;
          color: string | null;
          health_score: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["vehicles"]["Row"],
          "id" | "created_at" | "odometer" | "health_score"
        > & {
          id?: string;
          odometer?: number;
          health_score?: number;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Row"]>;
      };
      fuel_logs: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string;
          date: string;
          liters: number;
          cost: number;
          station: string | null;
          odometer: number | null;
          mileage: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["fuel_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fuel_logs"]["Row"]>;
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string | null;
          category: string;
          amount: number;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["expenses"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Row"]>;
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string | null;
          title: string;
          type: string | null;
          due_date: string;
          priority: "low" | "medium" | "high";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reminders"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Row"]>;
      };
    };
  };
};
