import { NextRequest, NextResponse } from "next/server";
import { analyzeContract, type AnalysisContext } from "@/lib/anthropic";
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

    const ctx: AnalysisContext = {
      contractType: (formData.get("contractType") as string) || undefined,
      housingForm: (formData.get("housingForm") as string) || undefined,
      signedDate: (formData.get("signedDate") as string) || undefined,
    };

    if (!file) {
      return NextResponse.json({ error: "Ingen fil bifogad." }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
    const isDocx = name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isDoc = name.endsWith(".doc");

    if (isDoc && !isDocx) {
      return NextResponse.json({ error: "Gamla .doc-filer stöds inte. Spara om som .docx eller PDF och försök igen." }, { status: 400 });
    }
    if (!isPdf && !isDocx) {
      return NextResponse.json({ error: "Endast PDF- och Word-filer (.docx) accepteras." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Filen är för stor. Maxstorlek är 10 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = "";

    if (isPdf) {
      const pdfParse = (await import("pdf-parse")).default;
      try {
        const parsed = await pdfParse(buffer);
        rawText = parsed.text ?? "";
      } catch {
        return NextResponse.json({ error: "Kunde inte läsa PDF:en. Kontrollera att filen inte är skadad." }, { status: 400 });
      }
    } else {
      const mammoth = (await import("mammoth")).default;
      try {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value ?? "";
      } catch {
        return NextResponse.json({ error: "Kunde inte läsa Word-filen. Kontrollera att den inte är skadad." }, { status: 400 });
      }
    }

    const text = rawText.slice(0, 12000);

    if (!text.trim()) {
      return NextResponse.json({ error: "Kunde inte läsa text ur filen. Om det är en skannad PDF eller bild saknas läsbar text." }, { status: 400 });
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

    const analysis = await analyzeContract(text, ctx);

    await supabase
      .from("profiles")
      .update({ credits: credits - 1 })
      .eq("id", user.id);

    // Spara i användarens historik (best-effort — blockerar inte svaret)
    await supabase.from("contract_analyses").insert({
      user_id: user.id,
      file_name: file.name,
      summary: analysis.summary,
      risk_level: analysis.riskLevel ?? null,
      analysis,
    });

    return NextResponse.json(analysis);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[analyze-contract]", msg);
    return NextResponse.json({ error: "Analys misslyckades. Försök igen." }, { status: 500 });
  }
}
