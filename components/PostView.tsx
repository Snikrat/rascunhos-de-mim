import Link from "next/link";
import { formatDate, paragraphs } from "@/lib/format";
import { photoUrl, type PublishedPost } from "@/lib/posts";

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="tags">
      {tags.map((t) => (
        <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
          {t}
        </Link>
      ))}
    </div>
  );
}

export default function PostView({ post, full = false }: { post: PublishedPost; full?: boolean }) {
  const href = `/post/${post.slug}`;
  const date = (
    <div className="meta">
      <Link href={href}>
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
      </Link>
    </div>
  );

  if (post.type === "quote") {
    return (
      <article className="post post--quote">
        <p className="solta">{post.body}</p>
        {date}
        <Tags tags={post.tags} />
      </article>
    );
  }

  if (post.type === "photo") {
    const src = photoUrl(post.photo_path);
    return (
      <article className="post post--photo">
        {date}
        {src && (
          <figure className="photo" style={{ marginBottom: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={post.caption || "foto"}
              width={post.photo_width ?? undefined}
              height={post.photo_height ?? undefined}
              loading="lazy"
              decoding="async"
            />
          </figure>
        )}
        {post.caption && <p className="caption">{post.caption}</p>}
        <Tags tags={post.tags} />
      </article>
    );
  }

  const ps = paragraphs(post.body ?? "");
  const cut = !full && ps.length > 3;
  const shown = cut ? ps.slice(0, 2) : ps;
  const Title = full ? "h1" : "h2";
  return (
    <article className="post post--text">
      {date}
      <Title className="post-title">{full ? post.title : <Link href={href}>{post.title}</Link>}</Title>
      <div className="body">
        {shown.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {cut && (
        <Link className="more" href={href}>
          continuar lendo
        </Link>
      )}
      <Tags tags={post.tags} />
    </article>
  );
}
