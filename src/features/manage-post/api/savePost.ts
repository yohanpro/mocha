"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/shared/lib/supabase/server";
import { extractYoutubeId } from "@/src/shared/utils/youtube";
import type { PostType } from "@/src/entities/post/types";

export interface PostFormState {
  error: string | null;
}

const TYPES = ["photo", "youtube"] as const;

// 신규 게시글 등록 전용 (피드 글은 수정 없이 삭제 후 재등록).
export async function savePost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const type = String(formData.get("type") ?? "photo");
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const youtubeUrl = String(formData.get("youtube_url") ?? "").trim();

  if (!TYPES.includes(type as (typeof TYPES)[number])) {
    return { error: "잘못된 게시 유형입니다." };
  }

  // type에 맞는 미디어를 필수로 강제 (빈 게시물 방지).
  if (type === "youtube") {
    if (!youtubeUrl) return { error: "유튜브 링크를 입력하세요." };
    if (!extractYoutubeId(youtubeUrl)) {
      return { error: "유튜브 링크 형식이 올바르지 않습니다." };
    }
  } else if (!imageUrl) {
    return { error: "사진 URL을 입력하세요." };
  }

  // 선택한 유형의 미디어만 저장 (반대쪽은 null).
  const row = {
    type: type as PostType,
    image_url: type === "photo" ? imageUrl : null,
    youtube_url: type === "youtube" ? youtubeUrl : null,
    body: body || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/feed");
  revalidatePath("/feed");
  redirect("/admin/dashboard/feed");
}
