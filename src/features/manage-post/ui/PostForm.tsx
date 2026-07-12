"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import type { PostType } from "@/src/entities/post/types";
import { savePost, type PostFormState } from "../api/savePost";

const initialState: PostFormState = { error: null };

export function PostForm() {
  const [state, formAction, pending] = useActionState(savePost, initialState);
  // 선택한 유형에 맞는 미디어 필드만 노출 (반대쪽은 서버에서 null 처리).
  const [type, setType] = useState<PostType>("photo");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">게시 유형</Label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as PostType)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="photo">사진</option>
          <option value="youtube">유튜브</option>
        </select>
      </div>

      {type === "photo" ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image_url">사진 URL</Label>
          <Input id="image_url" name="image_url" type="url" placeholder="https://…" />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="youtube_url">유튜브 링크</Label>
          <Input
            id="youtube_url"
            name="youtube_url"
            type="url"
            placeholder="https://youtu.be/…"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">본문 (선택)</Label>
        <Textarea id="body" name="body" placeholder="오늘 텃밭 이야기를 남겨보세요." />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "등록 중…" : "게시글 등록"}
        </Button>
        <Button asChild variant="outline" type="button">
          <Link href="/admin/dashboard/feed">취소</Link>
        </Button>
      </div>
    </form>
  );
}
