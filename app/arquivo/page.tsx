import type { Metadata } from "next";
import Link from "next/link";
import { monthOf } from "@/lib/format";
import { listAllPublished, postLabel, type PublishedPost } from "@/lib/posts";

export const metadata: Metadata = { title: "arquivo" };

const KIND = { text: "", photo: "foto", quote: "frase" } as const;

export default async function Arquivo() {
  const posts = await listAllPublished();
  const groups = new Map<string, { label: string; items: { day: number; post: PublishedPost }[] }>();
  for (const post of posts) {
    const m = monthOf(post.published_at);
    if (!groups.has(m.key)) groups.set(m.key, { label: m.label, items: [] });
    groups.get(m.key)!.items.push({ day: m.day, post });
  }

  return (
    <main>
      <h1 className="page-title">arquivo</h1>
      {posts.length === 0 && <p className="empty">o arquivo ainda está vazio.</p>}
      {[...groups.entries()].map(([key, g]) => (
        <section className="month" key={key}>
          <h2 className="month-title">{g.label}</h2>
          <ul>
            {g.items.map(({ day, post }) => (
              <li key={post.id}>
                <span>{String(day).padStart(2, "0")}</span>
                <Link href={`/post/${post.slug}`}>
                  {postLabel(post)}
                  {KIND[post.type] && <span className="kind">{KIND[post.type]}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
