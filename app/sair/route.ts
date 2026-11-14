import { NextResponse, type NextRequest } from "next/server";
import { isConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (isConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
