import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/lib/anthropic";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Ingen fil bifogad." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Endast PDF-filer accepteras." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Filen är för stor. Maxstorlek är 10 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParse = (await import("pdf-parse")).default;
    let parsed;
    try {
      parsed = await pdfParse(buffer);
    } catch {
      return NextResponse.json({ error: "Kunde inte läsa PDF:en. Kontrollera att filen inte är skadad." }, { status: 400 });
    }
    const text = (parsed.text ?? "").slice(0, 12000);

    if (!text.trim()) {
      return NextResponse.json({ error: "Kunde inte läsa text från PDF:en. Kontrollera att filen inte är skannad." }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    const credits = profile?.credits ?? 0;
    if (credits < 1) {
      return NextResponse.json({ error: "Du har inga credits kvar. Köp uppladdningar för att fortsätta." }, { status: 402 });
    }

    const analysis = await analyzeContract(text);

    await supabase
      .from("profiles")
      .update({ credits: credits - 1 })
      .eq("id", user.id);

    return NextResponse.json(analysis);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[analyze-contract]", msg);
    return NextResponse.json({ error: "Analys misslyckades. Försök igen." }, { status: 500 });
  }
}
