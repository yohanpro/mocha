"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { PostCard } from "@/src/entities/post/ui/PostCard";
import { getDateGroup } from "@/src/shared/utils/format";
import type { Post } from "@/src/entities/post/types";

interface Props {
  initialPosts: Post[];
  hasMore: boolean;
}

async function fetchMorePosts(cursor: string): Promise<{ posts: Post[]; hasMore: boolean }> {
  const res = await fetch(`/api/posts?cursor=${encodeURIComponent(cursor)}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export function FeedList({ initialPosts, hasMore: initialHasMore }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const loaderRef = useRef<HTMLDivElement>(null);
  // 클로저 stale 방지용 ref
  const stateRef = useRef({ hasMore: initialHasMore, isPending: false });

  useEffect(() => {
    stateRef.current = { hasMore, isPending };
  }, [hasMore, isPending]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (!stateRef.current.hasMore || stateRef.current.isPending) return;

        const cursor = posts.at(-1)?.created_at;
        if (!cursor) return;

        // React 19 — async startTransition
        startTransition(async () => {
          const { posts: next, hasMore: nextHasMore } = await fetchMorePosts(cursor);
          setPosts((prev) => [...prev, ...next]);
          setHasMore(nextHasMore);
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [posts]);

  // 날짜 그룹 헤더 삽입
  let lastGroup = "";
  const items = posts.flatMap((post) => {
    const group = getDateGroup(post.created_at);
    const header =
      group !== lastGroup
        ? ((lastGroup = group),
          [
            <p
              key={`group-${group}-${post.id}`}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-4 mb-1 px-1"
            >
              {group}
            </p>,
          ])
        : [];
    return [...header, <PostCard key={post.id} post={post} />];
  });

  return (
    <div className="space-y-1">
      {items}

      <div ref={loaderRef} className="h-10 flex items-center justify-center">
        {isPending && (
          <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
        )}
      </div>

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          모든 게시물을 다 봤어요 🌱
        </p>
      )}
    </div>
  );
}
