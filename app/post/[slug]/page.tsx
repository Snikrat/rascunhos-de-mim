import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostView from "@/components/PostView";
import { getPublishedBySlug, photoUrl, postLabel } from "@/lib/posts";
import { paragraphs } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await getPublishedBySlug(slug);
  if (!found) return {};
  const { post } = found;
  const title = postLabel(post);
  const description = post.type === "text" ? paragraphs(post.body ?? "")[0]?.slice(0, 160) : post.body ?? post.caption ?? undefined;
  const image = photoUrl(post.photo_path);
  return {
    title,
    description,
    openGraph: { title, description, type: "article", publishedTime: post.published_at, images: image ? [image] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const found = await getPublishedBySlug(slug);
  if (!found) notFound();
  const { post, older, newer } = found;

  return (
    <main className="single">
      <PostView post={post} full />
      <nav className="pager" aria-label="posts vizinhos">
        {older ? (
          <Link href={`/post/${older.slug}`}>
            <small>← anterior</small>
            {postLabel(older)}
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link className="next" href={`/post/${newer.slug}`}>
            <small>próximo →</small>
            {postLabel(newer)}
          </Link>
        )}
      </nav>
    </main>
  );
}
