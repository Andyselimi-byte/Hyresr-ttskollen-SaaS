import { NextRequest, NextResponse } from "next/server";
import { askQuestion } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json() as { question: string; context?: string };

    if (!question?.trim()) {
      return NextResponse.json({ error: "Frågan får inte vara tom." }, { status: 400 });
    }
    if (question.length > 2000) {
      return NextResponse.json({ error: "Frågan är för lång (max 2000 tecken)." }, { status: 400 });
    }

    const answer = await askQuestion(question, context);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("[ask]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Kunde inte besvara frågan. Försök igen." }, { status: 500 });
  }
}
