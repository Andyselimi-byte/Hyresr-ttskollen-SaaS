import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Missing env vars", url: url ?? "MISSING", key: key ? "SET" : "MISSING" });
  }

  try {
    const supabase = createClient(url, serviceKey!);
    const { data, error } = await supabase.auth.admin.listUsers();
    return NextResponse.json({
      url,
      users: data?.users?.map(u => ({ email: u.email, confirmed: u.email_confirmed_at })) ?? [],
      error: error?.message
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, url });
  }
}
