import type { Metadata } from "next";
import { redirect } from "next/navigation";
import GoogleButton from "./GoogleButton";
import { isConfigured, isOwner } from "@/lib/config";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "entrar", robots: { index: false } };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const user = await getUser();
  if (user && isOwner(user.email)) redirect("/escrever");

  return (
    <main>
      <h1 className="page-title">área só minha</h1>
      <div className="panel login">
        <p>essa parte do caderno é só minha.</p>
        {!isConfigured ? (
          <p className="note">o login ainda não foi configurado (falta conectar o Supabase).</p>
        ) : user ? (
          <>
            <p className="note">você entrou como {user.email}, mas essa conta não pode escrever aqui.</p>
            <form action="/sair" method="post">
              <button className="btn" type="submit">sair</button>
            </form>
          </>
        ) : (
          <GoogleButton />
        )}
        {erro === "conta" && <p className="error">essa conta google não pode escrever aqui.</p>}
        {erro === "login" && <p className="error">não deu pra entrar. tenta de novo.</p>}
      </div>
    </main>
  );
}
