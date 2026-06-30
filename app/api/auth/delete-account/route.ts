import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });
  }

  // Admin-klient krävs för att ta bort användare
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Ta bort profil-raden (CASCADE bör rensa relaterad data)
  await adminClient.from("profiles").delete().eq("id", user.id);

  // Ta bort auth-användaren
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: "Kunde inte ta bort kontot. Försök igen eller kontakta support." }, { status: 500 });
  }

  // Rensa cookies
  const origin = request.nextUrl.origin;
  const response = NextResponse.json({ success: true });
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.includes("supabase") || cookie.name.startsWith("sb-")) {
      response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }

  return response;
}
