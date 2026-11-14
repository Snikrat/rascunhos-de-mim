import { PHOTO_BUCKET, SUPABASE_URL } from "@/lib/config";

export type PostType = "text" | "photo" | "quote";
export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  type: PostType;
  status: PostStatus;
  title: string | null;
  body: string | null;
  caption: string | null;
  photo_path: string | null;
  photo_width: number | null;
  photo_height: number | null;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PublishedPost = Post & { published_at: string };

/** Nome curto para listas (arquivo, anterior/próximo, rascunhos). */
export function postLabel(p: Pick<Post, "type" | "title" | "body" | "caption">): string {
  if (p.type === "text") return p.title?.trim() || "sem título";
  const t = (p.type === "photo" ? p.caption : p.body)?.trim().split("\n")[0] ?? "";
  return t.length > 70 ? t.slice(0, 68) + "…" : t || (p.type === "photo" ? "foto" : "frase");
}

export function photoUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("demo:")) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}
