import { createClient } from "@/src/shared/lib/supabase/server";
import type { Post } from "./types";

const PAGE_SIZE = 6;

export async function getPosts({
  limit,
  cursor,
}: { limit?: number; cursor?: string } = {}): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit ?? PAGE_SIZE);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// 관리자 목록용 — 페이지네이션 없이 최신순 전체.
export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export { PAGE_SIZE };
