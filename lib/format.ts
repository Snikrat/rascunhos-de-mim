const TZ = "America/Sao_Paulo";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function parts(iso: string) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  return { y: get("year"), m: get("month") - 1, d: get("day"), h: get("hour"), min: get("minute") };
}

/** "14 de novembro, 3h12" (no fuso de São Paulo). */
export function formatDate(iso: string): string {
  const { d, m, h, min } = parts(iso);
  return `${d} de ${MESES[m]}, ${h}h${String(min).padStart(2, "0")}`;
}

/** "novembro de 2026" e a chave "2026-11" para agrupar o arquivo. */
export function monthOf(iso: string) {
  const { y, m, d } = parts(iso);
  return { key: `${y}-${String(m + 1).padStart(2, "0")}`, label: `${MESES[m]} de ${y}`, day: d };
}

export function paragraphs(text: string): string[] {
  return text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60)
      .replace(/-$/, "") || "post"
  );
}

export function normalizeTags(raw: string): string[] {
  const seen = new Set<string>();
  for (const t of raw.split(",")) {
    const tag = t.trim().replace(/^#/, "").toLowerCase();
    if (tag && tag.length <= 40) seen.add(tag);
  }
  return [...seen].slice(0, 12);
}
