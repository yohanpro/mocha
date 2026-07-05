"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/shared/lib/supabase/server";

// 목록의 <form action={deletePost}>에서 호출 — 삭제는 되돌릴 수 없음.
export async function deletePost(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/feed");
  revalidatePath("/feed");
}
