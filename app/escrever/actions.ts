"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PHOTO_BUCKET } from "@/lib/config";
import { normalizeTags, slugify } from "@/lib/format";
import { postLabel, type PostType } from "@/lib/post-utils";
import { createClient, getOwner } from "@/lib/supabase/server";

export type SaveState = { error: string | null };

const TYPES: PostType[] = ["text", "photo", "quote"];

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}
function int(fd: FormData, key: string) {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string) {
  const { data } = await supabase.from("posts").select("slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r: { slug: string }) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

export async function savePost(_prev: SaveState, fd: FormData): Promise<SaveState> {
  const owner = await getOwner();
  if (!owner) return { error: "você precisa entrar de novo." };
  const supabase = await createClient();

  const id = str(fd, "id") || null;
  const type = str(fd, "type") as PostType;
  const publish = str(fd, "intent") === "publish";
  if (!TYPES.includes(type)) return { error: "tipo de post inválido." };

  const title = str(fd, "title").trim();
  const body = str(fd, "body").replace(/\r\n/g, "\n").trim();
  const caption = str(fd, "caption").trim();
  const photo_path = str(fd, "photo_path") || null;
  const tags = normalizeTags(str(fd, "tags"));

  if (publish) {
    if (type === "text" && !body) return { error: "escreve alguma coisa antes de publicar." };
    if (type === "quote" && !body) return { error: "escreve a frase antes de publicar." };
    if (type === "photo" && !photo_path) return { error: "escolhe uma foto antes de publicar." };
  } else if (!title && !body && !caption && !photo_path) {
    return { error: "o rascunho está vazio." };
  }

  const fields = {
    type,
    title: type === "text" ? title || null : null,
    body: type === "photo" ? null : body || null,
    caption: type === "photo" ? caption || null : null,
    photo_path: type === "photo" ? photo_path : null,
    photo_width: type === "photo" ? int(fd, "photo_width") : null,
    photo_height: type === "photo" ? int(fd, "photo_height") : null,
    tags,
  };

  let slug: string;
  if (id) {
    const { data: current, error: readErr } = await supabase
      .from("posts").select("slug, status, published_at, photo_path").eq("id", id).maybeSingle();
    if (readErr || !current) return { error: "não achei esse post." };
    const update: Record<string, unknown> = { ...fields };
    if (publish && current.status !== "published") {
      update.status = "published";
      update.published_at = new Date().toISOString();
    } else if (!publish) {
      update.status = "draft";
    }
    const { error } = await supabase.from("posts").update(update).eq("id", id);
    if (error) return { error: "não deu pra salvar. tenta de novo." };
    if (current.photo_path && current.photo_path !== fields.photo_path) {
      await supabase.storage.from(PHOTO_BUCKET).remove([current.photo_path]);
    }
    slug = current.slug;
  } else {
    slug = await uniqueSlug(supabase, slugify(postLabel({ type, title, body, caption })));
    const { error } = await supabase.from("posts").insert({
      ...fields,
      slug,
      status: publish ? "published" : "draft",
      published_at: publish ? new Date().toISOString() : null,
    });
    if (error) return { error: "não deu pra salvar. tenta de novo." };
  }

  revalidatePath("/", "layout");
  redirect(publish ? `/post/${slug}` : "/escrever?salvo=1");
}

export async function deletePost(fd: FormData) {
  const owner = await getOwner();
  if (!owner) redirect("/entrar");
  const id = str(fd, "id");
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("photo_path").eq("id", id).maybeSingle();
  await supabase.from("posts").delete().eq("id", id);
  if (data?.photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([data.photo_path]);
  revalidatePath("/", "layout");
  redirect("/escrever?apagado=1");
}
