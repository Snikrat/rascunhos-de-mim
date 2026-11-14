import type { Metadata } from "next";
import { paragraphs } from "@/lib/format";
import { getAbout } from "@/lib/settings";

export const metadata: Metadata = { title: "sobre mim" };

export default async function Sobre() {
  const about = await getAbout();
  return (
    <main>
      <h1 className="page-title">sobre mim</h1>
      <div className="sobre body">
        {paragraphs(about.text).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {about.signature && <p className="sign">{about.signature}</p>}
      </div>
    </main>
  );
}
