export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Sem Supabase configurado o site roda em "modo demonstração", com posts de exemplo. */
export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function ownerEmail(): string {
  return (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
}

export function isOwner(email: string | null | undefined): boolean {
  const owner = ownerEmail();
  return Boolean(owner && email && email.toLowerCase() === owner);
}

export const SITE_NAME = "Rascunhos de Mim";
export const PHOTO_BUCKET = "photos";
export const PAGE_SIZE = 15;
