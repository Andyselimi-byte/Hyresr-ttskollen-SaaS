import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { LETTER_TEMPLATES } from "@/lib/letter-templates";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });

    const { templateId, fields } = await request.json() as { templateId: string; fields: Record<string, string> };

    const template = LETTER_TEMPLATES.find(t => t.id === templateId);
    if (!template) return NextResponse.json({ error: "Okänd brevmall." }, { status: 400 });

    const baseText = template.template(fields);
    const fieldsSummary = Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      system: `Du är en expert på svensk hyresrätt och juridisk brevskrivning.
Du skriver professionella, juridiskt korrekta brev på svenska för hyresgäster.
Breven ska:
- Vara formella och professionella
- Innehålla korrekta laghänvisningar (12 kap. Jordabalken)
- Vara tydliga och övertygande
- Ha rätt struktur med datum, ärenderubrik och avslutning
- Vara anpassade till användarens specifika situation
Returnera ENDAST brevtexten, ingen förklaring eller kommentar.`,
      messages: [{
        role: "user",
        content: `Skriv ett professionellt juridiskt brev baserat på följande mall och information.

Brevtyp: ${template.name}
Beskrivning: ${template.description}

Användarens information:
${fieldsSummary}

Basmall att förbättra och anpassa:
${baseText}

Skriv ett förbättrat, mer detaljerat och övertygande brev som är anpassat till situationen.
Inkludera relevanta lagparagrafer och gör brevet mer specifikt och professionellt.
Skriv på svenska.`,
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : baseText;
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[generate-letter]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Kunde inte generera brev. Försök igen." }, { status: 500 });
  }
}
