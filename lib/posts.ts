import { PAGE_SIZE, isConfigured } from "@/lib/config";
import type { Post, PublishedPost } from "@/lib/post-utils";
export * from "@/lib/post-utils";
import { createClient } from "@/lib/supabase/server";
import { DEMO_POSTS } from "@/lib/demo";

const COLUMNS =
  "id, slug, type, status, title, body, caption, photo_path, photo_width, photo_height, tags, published_at, created_at, updated_at";

const demoPublished = () =>
  (DEMO_POSTS as PublishedPost[]).slice().sort((a, b) => b.published_at.localeCompare(a.published_at));

export async function listPublished(page = 1): Promise<{ posts: PublishedPost[]; hasMore: boolean }> {
  const from = (page - 1) * PAGE_SIZE;
  if (!isConfigured) {
    const all = demoPublished();
    return { posts: all.slice(from, from + PAGE_SIZE), hasMore: all.length > from + PAGE_SIZE };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, from + PAGE_SIZE); // pede um a mais para saber se há próxima página
  if (error) throw error;
  const rows = (data ?? []) as PublishedPost[];
  return { posts: rows.slice(0, PAGE_SIZE), hasMore: rows.length > PAGE_SIZE };
}

/** Lista leve de tudo que está publicado (arquivo). */
export async function listAllPublished(): Promise<PublishedPost[]> {
  if (!isConfigured) return demoPublished();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PublishedPost[];
}

/** Post publicado pelo slug, com o anterior (mais antigo) e o próximo (mais novo). */
export async function getPublishedBySlug(slug: string) {
  if (!isConfigured) {
    const all = demoPublished();
    const i = all.findIndex((p) => p.slug === slug);
    if (i < 0) return null;
    return { post: all[i], older: all[i + 1] ?? null, newer: all[i - 1] ?? null };
  }
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!post) return null;
  const p = post as PublishedPost;
  const [{ data: older }, { data: newer }] = await Promise.all([
    supabase.from("posts").select(COLUMNS).eq("status", "published")
      .lt("published_at", p.published_at).order("published_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("posts").select(COLUMNS).eq("status", "published")
      .gt("published_at", p.published_at).order("published_at", { ascending: true }).limit(1).maybeSingle(),
  ]);
  return { post: p, older: (older as PublishedPost) ?? null, newer: (newer as PublishedPost) ?? null };
}

/** Tudo (rascunhos e publicados), para a área do dono. Depende do RLS para só o dono ver rascunhos. */
export async function listAllForOwner(): Promise<Post[]> {
  if (!isConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(COLUMNS)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(COLUMNS).eq("id", id).maybeSingle();
  return (data as Post) ?? null;
}
