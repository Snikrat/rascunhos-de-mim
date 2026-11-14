import type { Metadata } from "next";
import Link from "next/link";
import { listAllPublished } from "@/lib/posts";

export const metadata: Metadata = { title: "tags" };

export default async function Tags() {
  const posts = await listAllPublished();
  const count = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
  const tags = [...count.keys()].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return (
    <main>
      <h1 className="page-title">tags</h1>
      {tags.length === 0 && <p className="empty">nenhuma tag ainda.</p>}
      <div className="tagcloud">
        {tags.map((t) => (
          <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
            {t}
            <sup>{count.get(t)}</sup>
          </Link>
        ))}
      </div>
    </main>
  );
}
