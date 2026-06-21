import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(`${origin}/auth/login`, { status: 303 });

  for (const cookie of allCookies) {
    if (cookie.name.includes("supabase") || cookie.name.startsWith("sb-")) {
      response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }

  return response;
}
