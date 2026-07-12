import { PostForm } from "@/src/features/manage-post/ui/PostForm";

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-4 text-lg font-bold">새 게시글 등록</h1>
      <PostForm />
    </main>
  );
}
