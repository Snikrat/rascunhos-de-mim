import type { Metadata } from "next";

export const metadata: Metadata = { title: "sobre mim" };

// Texto provisório: troque pelo seu.
export default function Sobre() {
  return (
    <main>
      <h1 className="page-title">sobre mim</h1>
      <div className="sobre body">
        <p>
          Meu nome é Felippe. Esse caderno existe porque eu penso demais e falo de menos, e em algum momento as coisas
          precisam sair de algum lugar.
        </p>
        <p>
          Aqui tem texto escrito de madrugada, foto tirada sem querer, frase que apareceu no ônibus e eu anotei no
          celular antes de perder. Nada aqui é definitivo. São rascunhos, como o nome diz.
        </p>
        <p>Se alguma coisa daqui encostou em você, fico feliz. Quer dizer que eu não tava sozinho nisso.</p>
        <p className="sign">F.</p>
      </div>
    </main>
  );
}
