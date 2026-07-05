import Link from "next/link";
import { Plus, ImageIcon, Video, Trash2 } from "lucide-react";
import { getAllPosts } from "@/src/entities/post/api";
import { deletePost } from "@/src/features/manage-post/api/deletePost";
import { Button } from "@/shared/ui/button";
import { formatRelativeTime } from "@/src/shared/utils/format";

export default async function AdminFeedPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">피드 관리</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/feed/new">
            <Plus className="size-4" />새 게시글
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          등록된 게시글이 없습니다.
        </p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                {post.type === "photo" && post.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image_url} alt="" className="size-full object-cover" />
                ) : post.type === "youtube" ? (
                  <Video className="size-6 text-muted-foreground/50" />
                ) : (
                  <ImageIcon className="size-6 text-muted-foreground/30" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">
                  {post.body || <span className="text-muted-foreground">(본문 없음)</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {post.type === "youtube" ? "유튜브" : "사진"} ·{" "}
                  {formatRelativeTime(post.created_at)}
                </p>
              </div>
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="삭제"
                >
                  <Trash2 className="size-4" />
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
