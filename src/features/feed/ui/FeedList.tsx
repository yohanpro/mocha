"use client";

import { useEffect, useRef, useOptimistic, useTransition } from "react";
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
  // React 19 — useOptimistic으로 로딩 중 낙관적 상태 관리
  const [optimisticState, addOptimistic] = useOptimistic(
    { posts: initialPosts, hasMore: initialHasMore },
    (state, newPosts: Post[]) => ({
      posts: [...state.posts, ...newPosts],
      hasMore: state.hasMore,
    }),
  );

  const [isPending, startTransition] = useTransition();
  const loaderRef = useRef<HTMLDivElement>(null);
  // hasMore를 ref로 관리해 클로저 stale 방지
  const hasMoreRef = useRef(initialHasMore);
  const postsRef = useRef(initialPosts);

  useEffect(() => {
    postsRef.current = optimisticState.posts;
    hasMoreRef.current = optimisticState.hasMore;
  }, [optimisticState]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || !hasMoreRef.current || isPending) return;

        const cursor = postsRef.current.at(-1)?.created_at;
        if (!cursor) return;

        // React 19 — startTransition에 async 함수 직접 전달
        startTransition(async () => {
          const { posts: next, hasMore } = await fetchMorePosts(cursor);
          addOptimistic(next);
          hasMoreRef.current = hasMore;
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isPending, addOptimistic]);

  // 날짜 그룹 헤더 삽입
  let lastGroup = "";
  const items = optimisticState.posts.flatMap((post) => {
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

      {!optimisticState.hasMore && optimisticState.posts.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          모든 게시물을 다 봤어요 🌱
        </p>
      )}
    </div>
  );
}
