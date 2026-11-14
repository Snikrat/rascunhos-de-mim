import { NextResponse, type NextRequest } from "next/server";
import { isOwner } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/escrever";
  // Só aceita caminhos internos, para não virar redirecionamento aberto.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/escrever";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (!isOwner(data.user?.email)) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/entrar?erro=conta`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/entrar?erro=login`);
}
