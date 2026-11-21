const TZ = "America/Sao_Paulo";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function parts(iso: string) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(new Date(iso));
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  return { y: get("year"), m: get("month") - 1, d: get("day") };
}

/** "14 de novembro de 2026" (no fuso de São Paulo). */
export function formatDate(iso: string): string {
  const { y, d, m } = parts(iso);
  return `${d} de ${MESES[m]} de ${y}`;
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
