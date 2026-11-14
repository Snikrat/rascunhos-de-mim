import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <p className="empty">
        essa página não existe. ou existiu e eu apaguei.
        <br />
        <Link href="/">voltar pro início</Link>
      </p>
    </main>
  );
}
