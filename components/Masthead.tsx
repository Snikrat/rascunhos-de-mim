"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FRASES } from "@/lib/frases";
import { SITE_NAME } from "@/lib/config";

export default function Masthead() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [frase, setFrase] = useState("");

  // Sorteada no navegador, para mudar a cada visita.
  useEffect(() => {
    setFrase(FRASES[Math.floor(Math.random() * FRASES.length)]);
  }, []);

  return (
    <header className={`masthead${home ? "" : " small"}`}>
      {home ? (
        <h1>
          <Link href="/">{SITE_NAME}</Link>
        </h1>
      ) : (
        <p className="h1-like">
          <Link href="/">{SITE_NAME}</Link>
        </p>
      )}
      {home && <p className="frase">{frase}</p>}
    </header>
  );
}
