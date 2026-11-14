import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import Masthead from "@/components/Masthead";
import { SITE_NAME } from "@/lib/config";
import { getOwner } from "@/lib/supabase/server";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "textos, pensamentos e fotos. tudo aqui é provisório.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  openGraph: { siteName: SITE_NAME, locale: "pt_BR", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#111215" },
    { media: "(prefers-color-scheme: light)", color: "#e7dfcf" },
  ],
};

// Fontes carregadas direto do Google Fonts (o next/font quebra o build com Turbopack na Vercel).
const FONTS =
  "https://fonts.googleapis.com/css2?family=La+Belle+Aurore&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Courier+Prime:ital@0;1&display=swap";

// Aplica o tema salvo antes de pintar a página, para não piscar.
const themeScript = `try{var t=localStorage.getItem("rdm-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const owner = await getOwner();
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body suppressHydrationWarning>
        <div className="wrap">
          <Topbar />
          <Masthead />
          {children}
          <footer className="site">
            escrito quase sempre de madrugada ·{" "}
            <Link href={owner ? "/escrever" : "/entrar"}>{owner ? "escrever" : "entrar"}</Link>
          </footer>
        </div>
      </body>
    </html>
  );
}
