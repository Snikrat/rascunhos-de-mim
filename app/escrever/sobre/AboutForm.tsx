"use client";

import { useActionState } from "react";
import type { About } from "@/lib/settings";
import { saveAbout, type AboutState } from "./actions";

export default function AboutForm({ about }: { about: About }) {
  const [state, action, pending] = useActionState<AboutState, FormData>(saveAbout, { error: null });
  return (
    <form action={action} className="panel">
      <div className="field">
        <label htmlFor="a-text">texto</label>
        <textarea id="a-text" name="text" defaultValue={about.text} />
        <span className="hint">deixe uma linha em branco pra começar outro parágrafo</span>
      </div>
      <div className="field">
        <label htmlFor="a-sign">assinatura</label>
        <input id="a-sign" name="signature" defaultValue={about.signature} placeholder="F." autoComplete="off" />
        <span className="hint">aparece no fim, escrita à mão. pode deixar vazio</span>
      </div>
      <div className="actions">
        <button className="btn primary" type="submit" disabled={pending}>
          {pending ? "salvando…" : "salvar"}
        </button>
      </div>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
