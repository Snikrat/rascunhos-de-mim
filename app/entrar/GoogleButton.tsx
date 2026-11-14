"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/escrever` },
    });
    if (error) {
      setError("não deu pra abrir o login do Google. tenta de novo.");
      setLoading(false);
    }
  }

  return (
    <>
      <button className="btn primary" type="button" onClick={signIn} disabled={loading}>
        <span className="g" aria-hidden="true">G</span>
        {loading ? "abrindo o google…" : "entrar com google"}
      </button>
      {error && <p className="error">{error}</p>}
    </>
  );
}
