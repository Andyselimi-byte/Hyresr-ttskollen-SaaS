import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  const response = NextResponse.json({ success: true });
  // Clear all supabase auth cookies
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieNames = cookieHeader.split(";").map(c => c.trim().split("=")[0]);
  for (const name of cookieNames) {
    if (name.includes("supabase") || name.includes("sb-")) {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  }
  return response;
}
