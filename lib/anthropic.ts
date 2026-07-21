import Anthropic from "@anthropic-ai/sdk";
import type { ContractAnalysis } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface AnalysisContext {
  contractType?: string;   // t.ex. "Hyresrätt (förstahand)"
  housingForm?: string;    // t.ex. "Bostadsrätt"
  signedDate?: string;     // ISO-datum, t.ex. "2026-08-15"
}

// Nya hyreslagen trädde i kraft 1 juli 2026
const NEW_LAW_DATE = "2026-07-01";

function buildContextBlock(ctx?: AnalysisContext): string {
  if (!ctx) return "";
  const parts: string[] = [];
  if (ctx.contractType) parts.push(`Avtalstyp: ${ctx.contractType}`);
  if (ctx.housingForm) parts.push(`Boendeform: ${ctx.housingForm}`);

  if (ctx.signedDate) {
    const isNew = ctx.signedDate >= NEW_LAW_DATE;
    parts.push(`Avtalet ingicks: ${ctx.signedDate}`);
    parts.push(
      isNew
        ? `REGELVERK: Avtalet omfattas av NYA hyreslagen (i kraft från 1 juli 2026). Bedöm klausulerna mot de nya reglerna.`
        : `REGELVERK: Avtalet ingicks FÖRE 1 juli 2026 och bedöms mot de regler som gällde före lagändringen. Om nyare regler kan påverka, notera det men utgå från rättsläget vid avtalets ingående.`
    );
  }

  if (ctx.contractType?.toLowerCase().includes("andrahand")) {
    parts.push(`OBS andrahand: kontrollera särskilt skälig hyra (får ej överstiga förstahandshyran) samt möbleringstillägg (max 15 % påslag). Andrahandshyresgäst saknar normalt besittningsskydd de första två åren.`);
  }

  if (parts.length === 0) return "";
  return `\n\nKONTEXT OM AVTALET (uppgett av användaren — väg in detta i analysen och referera rätt regelverk):\n- ${parts.join("\n- ")}`;
}

export async function analyzeContract(contractText: string, ctx?: AnalysisContext): Promise<ContractAnalysis> {
  const contextBlock = buildContextBlock(ctx);
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 6000,
    system: `Du är ett juridiskt informationsverktyg för svenska hyresgäster specialiserat på 12 kap. Jordabalken (JB).
Granska hyresavtal NOGGRANT och returnera ENDAST giltig JSON utan annan text.

Anpassa analysen efter den kontext användaren uppger (avtalstyp, boendeform, datum). Ett avtal som ingåtts från och med 1 juli 2026 bedöms mot nya hyreslagen; tidigare avtal mot de äldre reglerna. Andrahandsavtal och bostadsrätter har delvis andra regler än förstahandshyresrätter — referera rätt regelverk.

Analysera och hitta:
- Olagliga klausuler som strider mot 12 kap. JB (status: "flag")
- Oskäliga eller tveksamma villkor (status: "warn")
- Normala och godkända klausuler (status: "ok")
- Saknade skydd som borde finnas
- Ovanliga eller ensidiga villkor

Format (max 15 klausuler):
{"clauses":[{"title":"string","status":"ok|warn|flag","finding":"string (max 150 tecken)","information":"string (max 200 tecken)","lawRef":"string"}],"summary":"string (2-3 meningar om avtalet totalt)","riskLevel":"low|medium|high","recommendations":["string","string"]}

Viktiga lagrum att kontrollera:
- Besittningsskydd (46 §)
- Hyreshöjning och bruksvärde (55 §)
- Underhållsansvar (15 §)
- Andrahandsuthyrning (40 §)
- Störningar (25 §)
- Hyresvärdens tillträde (26 §)
- Depositionsregler
- Uppsägningstider (4-5 §)`,
    messages: [{
      role: "user",
      content: `Granska detta hyresavtal grundligt och identifiera alla viktiga klausuler, problem och rättigheter:${contextBlock}\n\nAVTALSTEXT:\n${contractText.slice(0, 14000)}`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Ogiltigt svar från AI-tjänsten");

  let jsonStr = jsonMatch[0];

  // Remove trailing commas before ] or }
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

  // Try to parse, if fails truncate at last complete object
  try {
    return JSON.parse(jsonStr) as ContractAnalysis;
  } catch {
    // Find last complete clause by truncating at last }]
    const lastComplete = jsonStr.lastIndexOf("}]");
    if (lastComplete > 0) {
      const truncated = jsonStr.slice(0, lastComplete + 2) + ',"summary":"Analysen är ofullständig, försök igen."}';
      try {
        return JSON.parse(truncated) as ContractAnalysis;
      } catch {
        throw new Error("Kunde inte tolka AI-svaret");
      }
    }
    throw new Error("Kunde inte tolka AI-svaret");
  }
}

export async function askQuestion(question: string, context?: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    system: `Du är ett juridiskt informationsverktyg för svenska hyresgäster.
Svara på frågor om hyresrätt baserat på 12 kap. Jordabalken (JB).
Formulera alltid svar som information och hänvisa till lagrum.
Ge ALDRIG personliga juridiska råd. Svara på svenska.`,
    messages: [{
      role: "user",
      content: context ? `Kontext: ${context}\n\nFråga: ${question}` : question,
    }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
