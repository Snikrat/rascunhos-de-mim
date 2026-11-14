"use client";

import { useActionState, useEffect, useState } from "react";
import { PHOTO_BUCKET } from "@/lib/config";
import { formatDate } from "@/lib/format";
import { photoUrl, type Post, type PostType } from "@/lib/post-utils";
import { createClient } from "@/lib/supabase/client";
import { savePost, type SaveState } from "./actions";

const TYPES: { value: PostType; label: string }[] = [
  { value: "text", label: "texto" },
  { value: "photo", label: "foto" },
  { value: "quote", label: "frase solta" },
];

const MAX_SIDE = 2000;

/** Reduz a foto no próprio aparelho antes de subir (celulares tiram fotos enormes). */
async function shrink(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/jpeg", 0.86),
  );
  return { blob, width, height };
}

export default function Editor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(savePost, { error: null });
  const [type, setType] = useState<PostType>(post?.type ?? "text");
  const [photo, setPhoto] = useState<{ path: string; width: number | null; height: number | null } | null>(
    post?.photo_path ? { path: post.photo_path, width: post.photo_width, height: post.photo_height } : null,
  );
  const [preview, setPreview] = useState<string | null>(photoUrl(post?.photo_path ?? null));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => setNow(new Date().toISOString()), []);

  const isPublished = post?.status === "published";

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("esse arquivo não é uma imagem.");
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const { blob, width, height } = await shrink(file);
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.jpg`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw error;
      setPhoto({ path, width, height });
      setPreview(URL.createObjectURL(blob));
    } catch {
      setUploadError("não deu pra subir a foto. tenta de novo ou escolhe outra.");
    } finally {
      setUploading(false);
    }
  }

  const busy = pending || uploading;

  return (
    <form action={action} className="panel">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="photo_path" value={photo?.path ?? ""} />
      <input type="hidden" name="photo_width" value={photo?.width ?? ""} />
      <input type="hidden" name="photo_height" value={photo?.height ?? ""} />

      <div className="types" role="group" aria-label="tipo de post">
        {TYPES.map((t) => (
          <button key={t.value} type="button" aria-pressed={type === t.value} onClick={() => setType(t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Os campos ficam montados (só escondidos) para não perder o que foi escrito ao trocar de tipo. */}
      <div hidden={type !== "text"}>
        <div className="field">
          <label htmlFor="f-title">título</label>
          <input id="f-title" name="title" defaultValue={post?.title ?? ""} placeholder="pode ser só uma palavra" autoComplete="off" />
        </div>
      </div>

      <div hidden={type === "photo"}>
        <div className="field">
          <label htmlFor="f-body">{type === "quote" ? "a frase" : "texto"}</label>
          <textarea
            id="f-body"
            name="body"
            className={type === "quote" ? "quote" : undefined}
            defaultValue={post?.body ?? ""}
            placeholder={type === "quote" ? "uma linha só" : "escreve. ninguém tá olhando."}
          />
          {type === "text" && <span className="hint">deixe uma linha em branco pra começar outro parágrafo</span>}
        </div>
      </div>

      <div hidden={type === "quote"}>
        <div className="field">
          <label htmlFor="f-photo">{type === "text" ? "foto (opcional)" : "foto"}</label>
          <label
            className={`drop${over ? " over" : ""}`}
            onDragEnter={() => setOver(true)}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              onFile(e.dataTransfer.files[0]);
            }}
          >
            {uploading ? (
              "subindo a foto…"
            ) : preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="prévia da foto" />
            ) : (
              "arraste uma foto aqui ou toque pra escolher"
            )}
            <input id="f-photo" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          <div className="photo-tools">
            <span className="hint">
              {preview
                ? "toque na foto pra trocar"
                : type === "text"
                  ? "aparece entre o título e o texto"
                  : "a foto ganha grão e fica levemente dessaturada sozinha"}
            </span>
            {preview && !uploading && (
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setPreview(null);
                }}
              >
                tirar foto
              </button>
            )}
          </div>
          {uploadError && <p className="error">{uploadError}</p>}
        </div>
      </div>

      <div hidden={type !== "photo"}>
        <div className="field">
          <label htmlFor="f-caption">texto curto</label>
          <textarea
            id="f-caption"
            name="caption"
            className="short"
            defaultValue={post?.caption ?? ""}
            placeholder="uma legenda, ou umas linhas sobre a foto"
          />
          <span className="hint">opcional. deixe uma linha em branco pra começar outro parágrafo</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-tags">tags</label>
        <input id="f-tags" name="tags" defaultValue={post?.tags.join(", ") ?? ""} placeholder="saudade, madrugada" autoComplete="off" autoCapitalize="none" />
        <span className="hint">separe com vírgula</span>
      </div>

      <div className="actions">
        <button className="btn primary" type="submit" name="intent" value="publish" disabled={busy}>
          {pending ? "salvando…" : isPublished ? "salvar" : "publicar"}
        </button>
        <button className="btn" type="submit" name="intent" value="draft" disabled={busy}>
          {isPublished ? "voltar pra rascunho" : "salvar rascunho"}
        </button>
        <span className="stamp">
          {isPublished && post?.published_at
            ? `publicado em ${formatDate(post.published_at)}`
            : now
              ? `vai sair como: ${formatDate(now)}`
              : ""}
        </span>
      </div>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
