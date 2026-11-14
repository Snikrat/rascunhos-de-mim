"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getOwner } from "@/lib/supabase/server";

export type AboutState = { error: string | null };

export async function saveAbout(_prev: AboutState, fd: FormData): Promise<AboutState> {
  const owner = await getOwner();
  if (!owner) return { error: "você precisa entrar de novo." };
  const text = String(fd.get("text") ?? "").replace(/\r\n/g, "\n").trim();
  const signature = String(fd.get("signature") ?? "").trim().slice(0, 60);
  if (!text) return { error: "escreve alguma coisa sobre você antes de salvar." };

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert([
    { key: "about_text", value: text },
    { key: "about_signature", value: signature },
  ]);
  if (error) {
    return {
      error: error.code === "42P01" || error.message.includes("site_settings")
        ? "falta criar a tabela no Supabase (arquivo supabase/migrations/002_sobre.sql)."
        : "não deu pra salvar. tenta de novo.",
    };
  }
  revalidatePath("/sobre");
  redirect("/sobre");
}
