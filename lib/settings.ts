import { isConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export type About = { text: string; signature: string };

/** Texto usado enquanto você não escreve o seu (ou sem Supabase). */
export const DEFAULT_ABOUT: About = {
  text:
    "Meu nome é Felippe. Esse caderno existe porque eu penso demais e falo de menos, e em algum momento as coisas precisam sair de algum lugar.\n\nAqui tem texto escrito de madrugada, foto tirada sem querer, frase que apareceu no ônibus e eu anotei no celular antes de perder. Nada aqui é definitivo. São rascunhos, como o nome diz.\n\nSe alguma coisa daqui encostou em você, fico feliz. Quer dizer que eu não tava sozinho nisso.",
  signature: "F.",
};

export async function getAbout(): Promise<About> {
  if (!isConfigured) return DEFAULT_ABOUT;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["about_text", "about_signature"]);
  // Se a tabela ainda não existe (migração não rodada), mostra o texto padrão.
  if (error || !data) return DEFAULT_ABOUT;
  const get = (k: string) => data.find((r: { key: string; value: string }) => r.key === k)?.value;
  const text = get("about_text");
  return { text: text ?? DEFAULT_ABOUT.text, signature: get("about_signature") ?? DEFAULT_ABOUT.signature };
}
