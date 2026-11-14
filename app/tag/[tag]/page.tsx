import type { Metadata } from "next";
import Link from "next/link";
import PostView from "@/components/PostView";
import { listByTag } from "@/lib/posts";

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent((await params).tag).toLowerCase();
  const posts = await listByTag(tag);
  return (
    <main>
      <h1 className="page-title">#{tag}</h1>
      <p className="note">
        {posts.length} {posts.length === 1 ? "post" : "posts"} · <Link href="/tags">todas as tags</Link>
      </p>
      <div className="feed">
        {posts.map((p) => (
          <PostView key={p.id} post={p} />
        ))}
      </div>
    </main>
  );
}
