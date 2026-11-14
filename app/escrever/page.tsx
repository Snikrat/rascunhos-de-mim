import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Editor from "./Editor";
import { formatDate } from "@/lib/format";
import { listAllForOwner, postLabel } from "@/lib/posts";
import { getOwner } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "escrever", robots: { index: false } };

export default async function Escrever({ searchParams }: { searchParams: Promise<{ salvo?: string; apagado?: string }> }) {
  const owner = await getOwner();
  if (!owner) redirect("/entrar");
  const { salvo, apagado } = await searchParams;
  const all = await listAllForOwner();
  const drafts = all.filter((p) => p.status === "draft");
  const published = all.filter((p) => p.status === "published").slice(0, 30);

  return (
    <main>
      <h1 className="page-title">escrever</h1>
      <div className="whoami">
        <span>escrevendo como {owner.user_metadata?.name ?? owner.email}</span>
        <span className="whoami-links">
          <Link href="/escrever/sobre">editar sobre mim</Link>
          <form action="/sair" method="post">
            <button type="submit">sair</button>
          </form>
        </span>
      </div>
      {salvo && <p className="note" role="status">rascunho guardado.</p>}
      {apagado && <p className="note" role="status">post apagado.</p>}

      <Editor />

      {drafts.length > 0 && (
        <section className="list">
          <h3>rascunhos guardados</h3>
          <ul>
            {drafts.map((p) => (
              <li key={p.id}>
                <span>{postLabel(p)}</span>
                <Link href={`/escrever/${p.id}`}>continuar</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {published.length > 0 && (
        <section className="list">
          <h3>publicados</h3>
          <ul>
            {published.map((p) => (
              <li key={p.id}>
                <span>
                  {postLabel(p)}
                  {p.published_at && <small>{formatDate(p.published_at)}</small>}
                </span>
                <Link href={`/escrever/${p.id}`}>editar</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
