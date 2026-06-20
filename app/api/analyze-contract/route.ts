import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
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
    const parsed = await pdfParse(buffer);
    const text = parsed.text.slice(0, 12000);

    if (!text.trim()) {
      return NextResponse.json({ error: "Kunde inte läsa text från PDF:en. Kontrollera att filen inte är skannad." }, { status: 400 });
    }

    const analysis = await analyzeContract(text);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[analyze-contract]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Analys misslyckades. Försök igen." }, { status: 500 });
  }
}
