import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AboutForm from "./AboutForm";
import { getAbout } from "@/lib/settings";
import { getOwner } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "editar sobre mim", robots: { index: false } };

export default async function EditarSobre() {
  const owner = await getOwner();
  if (!owner) redirect("/entrar");
  const about = await getAbout();
  return (
    <main>
      <h1 className="page-title">sobre mim</h1>
      <div className="whoami">
        <Link href="/escrever">← voltar</Link>
        <Link href="/sobre">ver no site</Link>
      </div>
      <AboutForm about={about} />
    </main>
  );
}
