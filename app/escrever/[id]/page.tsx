import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Editor from "../Editor";
import { deletePost } from "../actions";
import DeleteButton from "../DeleteButton";
import { getPostById } from "@/lib/posts";
import { getOwner } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "editar", robots: { index: false } };

export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const owner = await getOwner();
  if (!owner) redirect("/entrar");
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <main>
      <h1 className="page-title">{post.status === "draft" ? "continuar rascunho" : "editar post"}</h1>
      <div className="whoami">
        <Link href="/escrever">← voltar</Link>
        {post.status === "published" && <Link href={`/post/${post.slug}`}>ver no site</Link>}
      </div>
      <Editor post={post} />
      <form action={deletePost} style={{ marginTop: "2rem" }}>
        <input type="hidden" name="id" value={post.id} />
        <DeleteButton />
      </form>
    </main>
  );
}
