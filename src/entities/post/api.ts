import { createClient } from "@/src/shared/lib/supabase/server";
import type { Post } from "./types";

export async function getPosts({ limit }: { limit?: number } = {}): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
