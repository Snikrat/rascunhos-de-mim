"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "início" },
  { href: "/arquivo", label: "arquivo" },
  { href: "/sobre", label: "sobre mim" },
];

type Theme = "light" | "dark";

function effectiveTheme(): Theme {
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "light" || t === "dark") return t;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(effectiveTheme());
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => setTheme(effectiveTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggleTheme() {
    const next: Theme = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("rdm-theme", next);
    } catch {}
    setTheme(next);
  }

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className={`topbar${open ? " open" : ""}`} ref={ref}>
      <button
        className="textbtn menubtn"
        type="button"
        aria-expanded={open}
        aria-controls="mainnav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "fechar" : "menu"}
      </button>
      <nav id="mainnav" aria-label="menu">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={isCurrent(l.href) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
      <button className="textbtn themebtn" type="button" onClick={toggleTheme}>
        {theme === "light" ? "apagar a luz" : "acender a luz"}
      </button>
    </div>
  );
}
