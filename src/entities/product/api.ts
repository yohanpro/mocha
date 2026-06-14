import { createClient } from "@/src/shared/lib/supabase/server";
import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .neq("status", "hidden")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// 관리자용 — hidden 포함 전체 상품 (소비자용 getProducts는 hidden 제외)
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
