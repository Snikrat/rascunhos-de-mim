import Link from "next/link";
import DemoBanner from "@/components/DemoBanner";
import PostView from "@/components/PostView";
import { listPublished } from "@/lib/posts";

export default async function Home({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const { pagina } = await searchParams;
  const page = Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1);
  const { posts, hasMore } = await listPublished(page);

  return (
    <main>
      <DemoBanner />
      {posts.length === 0 ? (
        <p className="empty">{page === 1 ? "ainda não tem nada aqui. mas vai ter." : "não tem mais nada pra trás."}</p>
      ) : (
        <div className="feed">
          {posts.map((p) => (
            <PostView key={p.id} post={p} />
          ))}
        </div>
      )}
      <nav className="older" aria-label="páginas">
        {page > 1 && <Link href={page === 2 ? "/" : `/?pagina=${page - 1}`}>← mais recentes</Link>}
        {page > 1 && hasMore && " · "}
        {hasMore && <Link href={`/?pagina=${page + 1}`}>mais antigos →</Link>}
      </nav>
    </main>
  );
}
