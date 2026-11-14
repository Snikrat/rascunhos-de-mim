import type { Metadata, Viewport } from "next";
import { Courier_Prime, La_Belle_Aurore, Newsreader } from "next/font/google";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import Masthead from "@/components/Masthead";
import { SITE_NAME } from "@/lib/config";
import { getOwner } from "@/lib/supabase/server";
import "./globals.css";

const hand = La_Belle_Aurore({ weight: "400", subsets: ["latin"], variable: "--font-hand", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], weight: ["300", "400", "500"], variable: "--font-serif", display: "swap" });
const mono = Courier_Prime({ weight: "400", subsets: ["latin"], style: ["normal", "italic"], variable: "--font-mono", display: "swap" });

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

// Aplica o tema salvo antes de pintar a página, para não piscar.
const themeScript = `try{var t=localStorage.getItem("rdm-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const owner = await getOwner();
  return (
    <html lang="pt-BR" className={`${hand.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
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
