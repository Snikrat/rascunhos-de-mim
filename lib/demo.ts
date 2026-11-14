/**
 * Posts de exemplo, usados só quando o Supabase ainda não está configurado
 * (por exemplo, no primeiro deploy). Assim dá para ver o visual antes de ter conteúdo.
 */
const base = { status: "published", photo_path: null, photo_width: null, photo_height: null } as const;

function at(iso: string) {
  return { published_at: iso, created_at: iso, updated_at: iso };
}

export const DEMO_POSTS = [
  {
    ...base, ...at("2026-11-14T06:12:00Z"), id: "d1", slug: "o-que-sobra-depois-das-tres", type: "text",
    title: "o que sobra depois das três", caption: null, tags: ["madrugada", "insônia"],
    body:
      "Depois das três da manhã a casa muda de idioma. A geladeira fala mais alto, o relógio da sala ganha um sotaque que eu não conhecia, e os pensamentos que passaram o dia inteiro educados resolvem sentar na beira da cama.\n\nHoje foi um desses. Fiquei olhando o teto como quem olha um mapa de um lugar onde já morou. Reconheci umas rachaduras. Inventei outras.\n\nNão é tristeza, exatamente. É mais um cansaço bonito, de quem sentiu demais durante o dia e não teve onde guardar. Então eu guardo aqui.\n\nAmanhã eu finjo que dormi bem.",
  },
  {
    ...base, ...at("2026-11-09T04:05:00Z"), id: "d2", slug: "teu-lado-da-cama", type: "quote",
    title: null, caption: null, tags: ["saudade"],
    body: "eu ainda guardo o teu lado da cama, mesmo sem saber pra quê.",
  },
  {
    ...base, ...at("2026-11-03T01:17:00Z"), id: "d3", slug: "carta-que-nao-vou-mandar", type: "text",
    title: "carta que não vou mandar", caption: null, tags: ["cartas", "saudade"],
    body:
      "Oi. Faz tempo, eu sei. Não precisa responder, até porque isso aqui nunca vai chegar em você.\n\nPassei na frente daquela padaria ontem. Trocaram o letreiro, agora é verde. Fiquei com raiva sem motivo, como se eles tivessem apagado um pedaço da gente sem pedir.\n\nEu tô bem. Às vezes. Aprendi a cozinhar aquele arroz que você fazia, mas o meu fica sempre um pouco mais salgado. Acho que é o jeito que eu encontrei de chorar sem ninguém ver.\n\nSe cuida. De verdade.",
  },
  {
    ...base, ...at("2026-10-21T03:33:00Z"), id: "d4", slug: "existo-de-leve", type: "quote",
    title: null, caption: null, tags: ["dias"],
    body: "tem dias que eu só existo de leve.",
  },
  {
    ...base, ...at("2026-10-12T05:48:00Z"), id: "d5", slug: "inventario", type: "text",
    title: "inventário", caption: null, tags: ["listas", "madrugada"],
    body:
      "Coisas que ainda estão na gaveta: um ingresso de show amassado, duas fotos 3x4 de quando eu tinha cabelo comprido, um bilhete escrito \"volto já\" que ninguém nunca jogou fora.\n\nCoisas que não estão mais: a coragem de ligar primeiro, a mania de dormir de meia, o medo de ficar sozinho num domingo.\n\nCoisas que eu não sei onde coloquei: quase tudo.",
  },
];
