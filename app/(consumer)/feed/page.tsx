import { getPosts, PAGE_SIZE } from "@/src/entities/post/api";
import { FeedList } from "@/src/features/feed/ui/FeedList";
import { Header } from "@/src/shared/ui/Header";
import { BottomNav } from "@/src/shared/ui/BottomNav";

export default async function FeedPage() {
  const posts = await getPosts();
  const hasMore = posts.length === PAGE_SIZE;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header activeNav="feed" />

      <main className="max-w-[560px] mx-auto px-4 py-5">
        <h1 className="text-lg font-bold text-foreground mb-4">농장 일상</h1>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-sm">아직 게시물이 없어요</p>
          </div>
        ) : (
          <FeedList initialPosts={posts} hasMore={hasMore} />
        )}
      </main>

      <BottomNav active="feed" />
    </div>
  );
}
