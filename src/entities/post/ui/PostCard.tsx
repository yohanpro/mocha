import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { formatRelativeTime } from "@/src/shared/utils/format";
import type { Post } from "../types";

export function PostCard({ post }: { post: Post }) {
  const hasMedia = post.image_url || (post.type === "youtube" && post.youtube_url);

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden">
      {/* 미디어 */}
      {post.type === "youtube" && post.youtube_url ? (
        <YoutubeEmbed url={post.youtube_url} />
      ) : post.image_url ? (
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.body ?? "농장 사진"}
            fill
            className="object-cover"
            sizes="(max-width: 680px) 100vw, 680px"
          />
        </div>
      ) : null}

      {/* 텍스트 + CTA */}
      <div className="px-4 py-3">
        {/* 상단: 프로필 + 시간 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
              콜
            </div>
            <span className="text-xs font-semibold text-foreground">콜리네 텃밭</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(post.created_at)}
          </span>
        </div>

        {/* 본문 */}
        {post.body && (
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-3">
            {post.body}
          </p>
        )}

        {/* 구매 CTA — 미디어 있는 게시물에만 */}
        {hasMedia && (
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            지금 구매하기
          </Link>
        )}
      </div>
    </article>
  );
}
