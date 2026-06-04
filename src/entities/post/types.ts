export type PostType = "photo" | "youtube";

export interface Post {
  id: string;
  type: PostType;
  image_url: string | null;
  youtube_url: string | null;
  body: string | null;
  created_at: string;
}
