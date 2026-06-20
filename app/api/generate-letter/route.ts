import { NextRequest, NextResponse } from "next/server";
import { LETTER_TEMPLATES } from "@/lib/letter-templates";

export async function POST(request: NextRequest) {
  try {
    const { templateId, fields } = await request.json() as { templateId: string; fields: Record<string, string> };

    const template = LETTER_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: "Okänd brevmall." }, { status: 400 });
    }

    const text = template.template(fields);
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Kunde inte generera brev." }, { status: 500 });
  }
}
