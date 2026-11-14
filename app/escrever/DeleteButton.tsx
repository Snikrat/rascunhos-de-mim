"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

/** Pede uma segunda confirmação na própria página antes de apagar. */
export default function DeleteButton() {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();
  if (!armed) {
    return (
      <button className="btn danger" type="button" onClick={() => setArmed(true)}>
        apagar post
      </button>
    );
  }
  return (
    <div className="actions" style={{ marginTop: 0 }}>
      <button className="btn danger" type="submit" disabled={pending}>
        {pending ? "apagando…" : "sim, apagar pra sempre"}
      </button>
      <button className="btn" type="button" onClick={() => setArmed(false)} disabled={pending}>
        cancelar
      </button>
    </div>
  );
}
